// ===== Admin Dashboard Logic =====
import { getProducts, getCategories, getOrders, getRevenue, getForecast, createProduct, updateProduct, deleteProduct } from './api.js';
import { requireAuth, getUser, logout } from './auth.js';
import { createRevenueChart, createCategoryChart } from './charts.js';

// ===== Auth Guard =====
if (!requireAuth()) {
    throw new Error('Not authenticated');
}

// ===== State =====
let products = [];
let categories = [];
let orders = [];
let editingId = null;
let revenueChartInstance = null;
let categoryChartInstance = null;

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initUI();
    loadDashboard();
    initEventListeners();
});

function initUI() {
    // User info
    const username = getUser();
    document.getElementById('user-name').textContent = username;
    document.getElementById('user-avatar').textContent = username.charAt(0).toUpperCase();
    
    // Current date
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString('vi-VN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Sidebar navigation section switching
    const navLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
    const views = document.querySelectorAll('.admin-view');
    const pageTitle = document.getElementById('page-title');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!link.dataset.section) return;
            e.preventDefault();
            
            const section = link.dataset.section;
            
            // Toggle active sidebar navigation link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Toggle view visibility
            views.forEach(v => {
                v.style.display = 'none';
            });
            
            const targetView = document.getElementById(`${section}-view`);
            if (targetView) {
                targetView.style.display = 'block';
            }
            
            // Update page title in main-header
            if (section === 'dashboard') {
                pageTitle.textContent = 'Dashboard';
            } else if (section === 'products') {
                pageTitle.textContent = 'Quản lý sản phẩm';
            } else if (section === 'orders') {
                pageTitle.textContent = 'Quản lý đơn hàng';
            }
        });
    });
}

async function loadDashboard() {
    try {
        const [productsData, categoriesData] = await Promise.all([
            getProducts(),
            getCategories()
        ]);
        
        products = productsData;
        categories = categoriesData;
        
        renderProductsTable(products);
        populateCategorySelect();
        updateKPIProducts(products);
        renderCategoryChart(products, categories);
        
        // Load protected revenue & orders data
        try {
            const [ordersData, revenueData, forecastData] = await Promise.all([
                getOrders(),
                getRevenue(),
                getForecast()
            ]);
            
            orders = ordersData;
            
            renderOrdersTable(orders);
            updateKPIOrders(orders);
            updateKPIRevenue(revenueData);
            updateKPIForecast(forecastData);
            renderRevenueChart(revenueData);
        } catch (err) {
            console.log('Revenue/forecast/orders protected endpoints error:', err.message);
            // Default placeholder/fallback charts
            renderRevenueChart([]);
            renderOrdersTable([]);
        }
    } catch (error) {
        console.error('Failed to load dashboard:', error);
        showToast('Không thể tải dữ liệu Dashboard!', 'error');
    }
}

// ===== Toast Notification Helper =====
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Add dynamic icon based on toast type
    const icon = type === 'success' ? '✓' : '✗';
    toast.innerHTML = `<span style="font-weight:bold;margin-right:8px;">${icon}</span> ${message}`;
    
    container.appendChild(toast);
    
    // Micro-animation triggers
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Auto-remove toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
}

// ===== KPI Updates =====
function updateKPIProducts(products) {
    animateCounter('kpi-products', products.length);
    const badge = document.getElementById('product-count-badge');
    if (badge) badge.textContent = `${products.length} sản phẩm`;
}

function updateKPIOrders(orders) {
    animateCounter('kpi-orders', orders.length);
    const badge = document.getElementById('order-count-badge');
    if (badge) badge.textContent = `${orders.length} đơn hàng`;
}

function updateKPIRevenue(revenueData) {
    if (revenueData.length > 0) {
        const current = revenueData[0];
        animateCounter('kpi-revenue', current.totalRevenue, true);
        
        if (revenueData.length > 1) {
            const prev = revenueData[1];
            const change = prev.totalRevenue > 0 
                ? ((current.totalRevenue - prev.totalRevenue) / prev.totalRevenue * 100).toFixed(1)
                : 0;
            const changeEl = document.getElementById('kpi-revenue-change');
            if (changeEl) {
                changeEl.textContent = `${change > 0 ? '↑' : '↓'} ${Math.abs(change)}% so với tháng trước`;
                changeEl.className = `kpi-change ${change > 0 ? 'up' : 'down'}`;
            }
        }
    }
}

function updateKPIForecast(forecast) {
    animateCounter('kpi-forecast', forecast.forecastedRevenue, true);
    
    const changeEl = document.getElementById('kpi-forecast-change');
    if (changeEl) {
        const icon = forecast.trend === 'up' ? '↑' : forecast.trend === 'down' ? '↓' : '→';
        changeEl.textContent = `${icon} ${Math.abs(forecast.changePercentage)}% dự báo`;
        changeEl.className = `kpi-change ${forecast.trend}`;
    }
}

function animateCounter(elementId, target, isCurrency = false) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    const duration = 1200;
    const start = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // cubic out ease
        
        const current = Math.floor(eased * target);
        el.textContent = isCurrency 
            ? new Intl.NumberFormat('vi-VN').format(current) + 'đ'
            : current;
        
        if (progress < 1) requestAnimationFrame(update);
    }
    
    requestAnimationFrame(update);
}

// ===== Charts =====
function renderRevenueChart(revenueData) {
    const ctx = document.getElementById('revenue-chart');
    if (!ctx) return;
    
    // Destroy existing instance to prevent Chart.js reuse errors
    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }
    
    const monthNames = ['', 'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
    
    const sorted = [...revenueData].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
    });
    
    const labels = sorted.map(r => `${monthNames[r.month]}/${r.year}`);
    const data = sorted.map(r => r.totalRevenue);
    
    if (labels.length === 0) {
        // Fallback placeholder chart values
        const last6 = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last6.push(monthNames[d.getMonth() + 1] + '/' + d.getFullYear());
        }
        revenueChartInstance = createRevenueChart(ctx, last6, [12500000, 14200000, 18600000, 15400000, 21000000, 24500000]);
    } else {
        revenueChartInstance = createRevenueChart(ctx, labels, data);
    }
}

function renderCategoryChart(products, categories) {
    const ctx = document.getElementById('category-chart');
    if (!ctx) return;
    
    // Destroy existing instance to prevent Chart.js reuse errors
    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }
    
    const catCounts = categories.map(cat => ({
        name: cat.categoryName,
        count: products.filter(p => p.categoryID === cat.categoryID).length
    }));
    
    categoryChartInstance = createCategoryChart(ctx, catCounts.map(c => c.name), catCounts.map(c => c.count));
}

// ===== Products Table =====
function renderProductsTable(items) {
    const tbody = document.getElementById('products-tbody');
    if (!tbody) return;
    
    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="table-empty">
                    <div class="empty-icon">☕</div>
                    <p>Không tìm thấy sản phẩm nào</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = items.map(p => {
        // Map category ID to CSS badge styling
        const catClass = p.categoryID === 1 ? 'cat-1' : p.categoryID === 2 ? 'cat-2' : 'cat-3';
        
        return `
            <tr data-id="${p.productID}">
                <td class="cell-id">${p.productID}</td>
                <td class="cell-name">${p.productName}</td>
                <td class="cell-desc" title="${p.description || ''}">${p.description || '-'}</td>
                <td><span class="category-badge ${catClass}">${p.categoryName || '-'}</span></td>
                <td class="cell-price">${new Intl.NumberFormat('vi-VN').format(p.price)}đ</td>
                <td class="cell-actions">
                    <button class="action-btn edit" onclick="window.editProduct(${p.productID})">Sửa</button>
                    <button class="action-btn delete" onclick="window.deleteProductAction(${p.productID})">Xóa</button>
                </td>
            </tr>
        `;
    }).join('');
}

function populateCategorySelect() {
    const select = document.getElementById('prod-category');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Chọn danh mục --</option>';
    categories.forEach(cat => {
        select.innerHTML += `<option value="${cat.categoryID}">${cat.categoryName}</option>`;
    });
}

// ===== Orders Table =====
function renderOrdersTable(items) {
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;
    
    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="table-empty">
                    <div class="empty-icon">📋</div>
                    <p>Không có đơn hàng nào được ghi nhận</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = items.map(o => {
        const orderDate = new Date(o.orderDate);
        const dateStr = orderDate.toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }) + ' ' + orderDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit', minute: '2-digit'
        });

        // Summary items
        const itemsSummary = o.orderDetails.map(od => `${od.quantity}x ${od.productName}`).join(', ');
        
        return `
            <tr data-id="${o.orderID}">
                <td class="cell-id">#${o.orderID}</td>
                <td>${dateStr}</td>
                <td style="max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${itemsSummary}">
                    ${itemsSummary || '-'}
                </td>
                <td class="cell-price" style="color: var(--color-gold); font-weight:700;">
                    ${new Intl.NumberFormat('vi-VN').format(o.totalAmount)}đ
                </td>
                <td class="cell-actions">
                    <button class="action-btn edit" onclick="window.viewOrderDetails(${o.orderID})">Chi tiết</button>
                </td>
            </tr>
        `;
    }).join('');
}

// ===== View Order Details Action =====
window.viewOrderDetails = function(orderId) {
    const order = orders.find(o => o.orderID === orderId);
    if (!order) return;
    
    document.getElementById('detail-order-id').textContent = order.orderID;
    
    const orderDate = new Date(order.orderDate);
    document.getElementById('detail-order-date').textContent = orderDate.toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    }) + ' ' + orderDate.toLocaleTimeString('vi-VN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    
    document.getElementById('detail-order-total').textContent = new Intl.NumberFormat('vi-VN').format(order.totalAmount) + 'đ';
    
    const itemsTbody = document.getElementById('detail-order-items-tbody');
    itemsTbody.innerHTML = order.orderDetails.map(od => `
        <tr>
            <td>${od.productName}</td>
            <td style="text-align: center; font-weight: 600;">${od.quantity}</td>
            <td style="text-align: right; color: var(--color-gold); font-weight: 600;">
                ${new Intl.NumberFormat('vi-VN').format(od.subTotal)}đ
            </td>
        </tr>
    `).join('');
    
    document.getElementById('order-detail-modal').classList.add('active');
};

// ===== CRUD Operations =====
window.editProduct = function(id) {
    const product = products.find(p => p.productID === id);
    if (!product) return;
    
    editingId = id;
    document.getElementById('modal-title').textContent = 'Chỉnh sửa sản phẩm';
    document.getElementById('edit-product-id').value = id;
    document.getElementById('prod-name').value = product.productName;
    document.getElementById('prod-desc').value = product.description || '';
    document.getElementById('prod-category').value = product.categoryID || '';
    document.getElementById('prod-price').value = product.price;
    
    document.getElementById('product-modal').classList.add('active');
};

window.deleteProductAction = async function(id) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    
    try {
        await deleteProduct(id);
        products = products.filter(p => p.productID !== id);
        renderProductsTable(products);
        updateKPIProducts(products);
        renderCategoryChart(products, categories);
        showToast('Đã xóa sản phẩm thành công!');
    } catch (error) {
        showToast('Lỗi khi xóa sản phẩm: ' + (error.response?.data?.message || error.message), 'error');
    }
};

// ===== Event Listeners =====
function initEventListeners() {
    // Add product button
    document.getElementById('add-product-btn').addEventListener('click', () => {
        editingId = null;
        document.getElementById('modal-title').textContent = 'Thêm sản phẩm mới';
        document.getElementById('product-form').reset();
        document.getElementById('edit-product-id').value = '';
        document.getElementById('product-modal').classList.add('active');
    });
    
    // Product modal close button (X)
    document.getElementById('modal-close-btn').addEventListener('click', () => {
        document.getElementById('product-modal').classList.remove('active');
    });

    // Product modal cancel button
    document.getElementById('modal-cancel').addEventListener('click', () => {
        document.getElementById('product-modal').classList.remove('active');
    });
    
    // Order modal close buttons
    document.getElementById('order-modal-close-btn').addEventListener('click', () => {
        document.getElementById('order-detail-modal').classList.remove('active');
    });
    document.getElementById('order-detail-close').addEventListener('click', () => {
        document.getElementById('order-detail-modal').classList.remove('active');
    });
    
    // Click outside modal to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                e.currentTarget.classList.remove('active');
            }
        });
    });

    // Keydown Esc to close active modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
    
    // Product form submit
    document.getElementById('product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const productData = {
            productName: document.getElementById('prod-name').value,
            description: document.getElementById('prod-desc').value,
            categoryID: parseInt(document.getElementById('prod-category').value),
            price: parseFloat(document.getElementById('prod-price').value)
        };
        
        try {
            if (editingId) {
                await updateProduct(editingId, productData);
                showToast('Đã cập nhật sản phẩm thành công!');
            } else {
                await createProduct(productData);
                showToast('Đã thêm sản phẩm mới thành công!');
            }
            
            // Refresh data
            products = await getProducts();
            renderProductsTable(products);
            updateKPIProducts(products);
            renderCategoryChart(products, categories);
            
            document.getElementById('product-modal').classList.remove('active');
        } catch (error) {
            showToast('Thao tác thất bại: ' + (error.response?.data?.message || error.message), 'error');
        }
    });
    
    // Products search filter
    document.getElementById('search-input').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = products.filter(p => 
            p.productName.toLowerCase().includes(query) ||
            (p.description && p.description.toLowerCase().includes(query)) ||
            (p.categoryName && p.categoryName.toLowerCase().includes(query))
        );
        renderProductsTable(filtered);
    });

    // Orders search filter
    const orderSearch = document.getElementById('order-search-input');
    if (orderSearch) {
        orderSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().replace('#', '');
            const filtered = orders.filter(o => 
                o.orderID.toString().includes(query) ||
                o.orderDetails.some(od => od.productName.toLowerCase().includes(query)) ||
                o.totalAmount.toString().includes(query)
            );
            renderOrdersTable(filtered);
        });
    }
}
