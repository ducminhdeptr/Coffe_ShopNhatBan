// ===== Landing Page Main Logic =====
import { getProducts, getCategories, createOrder } from './api.js';
import { initScrollAnimations, initParallax, initNavbarScroll, initBackToTop, initCounterAnimation, initSmoothScroll } from './scroll-animations.js';
import { initParticles } from './particles.js';

// ===== Loading Screen =====
function initLoading() {
    const loading = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loading.classList.add('hidden');
        }, 2500);
    });
    // Fallback
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 4000);
}

// ===== Menu Section =====
let allProducts = [];
let categories = [];

async function loadMenu() {
    try {
        const [productsData, categoriesData] = await Promise.all([
            getProducts(),
            getCategories()
        ]);
        allProducts = productsData;
        categories = categoriesData;
        
        renderMenuTabs();
        renderMenuItems(allProducts);
    } catch (error) {
        console.log('API not available, showing fallback menu');
        showFallbackMenu();
    }
}

function renderMenuTabs() {
    const tabsContainer = document.getElementById('menu-tabs');
    if (!tabsContainer) return;
    
    // Keep existing "all" button
    let html = '<button class="menu-tab active" data-category="all">Tất cả</button>';
    
    categories.forEach(cat => {
        html += `<button class="menu-tab" data-category="${cat.categoryID}">${cat.categoryName}</button>`;
    });
    
    tabsContainer.innerHTML = html;
    
    // Add click handlers
    tabsContainer.querySelectorAll('.menu-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            tabsContainer.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const catId = tab.dataset.category;
            if (catId === 'all') {
                renderMenuItems(allProducts);
            } else {
                renderMenuItems(allProducts.filter(p => p.categoryID == catId));
            }
        });
    });
}

function renderMenuItems(products) {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;
    
    const icons = { 1: '☕', 2: '🍵', 3: '🍰' };
    
    grid.innerHTML = products.map(p => `
        <div class="glass-card menu-card reveal">
            <div class="menu-icon">${icons[p.categoryID] || '☕'}</div>
            <div class="menu-card-info">
                <h4>${p.productName}</h4>
                <p>${p.description || ''}</p>
                <span class="menu-price">${formatPrice(p.price)}đ</span>
                <button class="menu-add-to-cart" data-id="${p.productID}">Đặt món</button>
            </div>
        </div>
    `).join('');
    
    // Grid click listener delegation for cart additions
    if (!grid.dataset.cartInitialized) {
        grid.dataset.cartInitialized = 'true';
        grid.addEventListener('click', (e) => {
            const btn = e.target.closest('.menu-add-to-cart');
            if (!btn) return;
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        });
    }

    // Re-init scroll animations for new items
    initScrollAnimations();
}

function showFallbackMenu() {
    const fallbackProducts = [
        { productName: 'Espresso Nhật', description: 'Đậm đà phong cách Tokyo', price: 45000, categoryID: 1 },
        { productName: 'Latte Matcha', description: 'Kết hợp hoàn hảo trà xanh', price: 55000, categoryID: 2 },
        { productName: 'Cappuccino', description: 'Lớp bọt sữa mịn màng', price: 50000, categoryID: 1 },
        { productName: 'Americano', description: 'Vị nguyên bản, tỉnh táo', price: 40000, categoryID: 1 },
        { productName: 'Trà Sencha', description: 'Thanh khiết, tươi mát', price: 60000, categoryID: 2 },
        { productName: 'Hojicha Latte', description: 'Trà rang ấm áp', price: 58000, categoryID: 2 },
        { productName: 'Bánh Mochi', description: 'Dẻo mềm, nhân đậu đỏ', price: 25000, categoryID: 3 },
        { productName: 'Bánh Dorayaki', description: 'Bánh rán huyền thoại', price: 30000, categoryID: 3 },
        { productName: 'Cold Brew', description: 'Ủ lạnh 24h', price: 55000, categoryID: 1 },
    ];
    
    renderMenuItems(fallbackProducts);
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const menuBtn = document.getElementById('nav-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(10,10,10,0.95)';
            navLinks.style.padding = '1rem';
            navLinks.style.backdropFilter = 'blur(20px)';
        });
    }
}

// ===== Booking Form =====
function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    
    // Set min date to today
    const dateInput = document.getElementById('book-date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = '✓ Đã Gửi Thành Công!';
        btn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        
        setTimeout(() => {
            btn.textContent = 'Xác Nhận Đặt Bàn';
            btn.style.background = '';
            form.reset();
        }, 3000);
    });
}

// ===== Initialize Everything =====
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    initLoading();
    initParticles();
    initScrollAnimations();
    initParallax();
    initNavbarScroll();
    initBackToTop();
    initCounterAnimation();
    initSmoothScroll();
    initMobileMenu();
    initBookingForm();
    initCart();
    loadMenu();
});

// ===== CART SYSTEM LOGIC =====
function initCart() {
    const cartTrigger = document.getElementById('cart-trigger');
    const floatingBtn = document.getElementById('floating-cart-btn');
    const drawer = document.getElementById('cart-drawer');
    const closeBtn = document.getElementById('cart-drawer-close');
    const overlay = document.getElementById('cart-overlay');
    const checkoutBtn = document.getElementById('cart-checkout-btn');

    // Load cart from localStorage if exists
    const stored = localStorage.getItem('cafe_cart');
    if (stored) {
        try {
            cart = JSON.parse(stored);
            updateCartUI();
        } catch (e) {
            cart = [];
        }
    }

    // Toggle drawer open
    const openDrawer = () => {
        if (drawer && overlay) {
            drawer.classList.add('open');
            overlay.classList.add('show');
        }
    };

    // Toggle drawer close
    const closeDrawer = () => {
        if (drawer && overlay) {
            drawer.classList.remove('open');
            overlay.classList.remove('show');
        }
    };

    if (cartTrigger) cartTrigger.addEventListener('click', openDrawer);
    if (floatingBtn) floatingBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    // Escape key to close drawer
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDrawer();
    });

    // Quantity button adjustments and deletes (using event delegation)
    const container = document.getElementById('cart-items-container');
    if (container) {
        container.addEventListener('click', (e) => {
            const qtyBtn = e.target.closest('.qty-btn');
            if (qtyBtn) {
                const productId = parseInt(qtyBtn.dataset.id);
                const action = qtyBtn.dataset.action;
                adjustQuantity(productId, action);
                return;
            }

            const deleteBtn = e.target.closest('.cart-item-delete');
            if (deleteBtn) {
                const productId = parseInt(deleteBtn.dataset.id);
                removeFromCart(productId);
                return;
            }
        });
    }

    // Checkout submission
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Listen to window scroll to show/hide floating cart button
    window.addEventListener('scroll', () => {
        if (floatingBtn) {
            if (window.scrollY > 300) {
                floatingBtn.classList.add('visible');
            } else {
                floatingBtn.classList.remove('visible');
            }
        }
    });
}

function addToCart(productId) {
    const product = allProducts.find(p => p.productID === productId);
    if (!product) return;

    const existing = cart.find(item => item.productID === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            productID: product.productID,
            productName: product.productName,
            price: product.price,
            categoryID: product.categoryID,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    
    // Auto-open drawer to show feedback
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
        drawer.classList.add('open');
        overlay.classList.add('show');
    }
}

function adjustQuantity(productId, action) {
    const item = cart.find(item => item.productID === productId);
    if (!item) return;

    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease') {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
    }

    saveCart();
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productID !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('cafe_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const countBadge = document.getElementById('cart-count');
    const floatingBadge = document.getElementById('floating-cart-badge');
    const container = document.getElementById('cart-items-container');
    const totalAmountEl = document.getElementById('cart-total-amount');

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update badges
    if (countBadge) countBadge.textContent = totalCount;
    if (floatingBadge) {
        floatingBadge.textContent = totalCount;
        floatingBadge.style.display = totalCount > 0 ? 'block' : 'none';
    }

    // Update total
    if (totalAmountEl) {
        totalAmountEl.textContent = new Intl.NumberFormat('vi-VN').format(totalAmount) + 'đ';
    }

    // Render Cart List
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty-state">
                <span style="font-size: 3rem;">☕</span>
                <p>Giỏ hàng đang trống.<br>Hãy chọn những món ngon từ thực đơn!</p>
            </div>
        `;
        return;
    }

    const icons = { 1: '☕', 2: '🍵', 3: '🍰' };

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-icon">${icons[item.categoryID] || '☕'}</div>
            <div class="cart-item-details">
                <h4>${item.productName}</h4>
                <span class="cart-item-price">${new Intl.NumberFormat('vi-VN').format(item.price)}đ</span>
                <div class="cart-item-qty">
                    <button class="qty-btn" data-id="${item.productID}" data-action="decrease">-</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="qty-btn" data-id="${item.productID}" data-action="increase">+</button>
                </div>
            </div>
            <button class="cart-item-delete" data-id="${item.productID}" title="Xóa">&times;</button>
        </div>
    `).join('');
}

async function handleCheckout() {
    if (cart.length === 0) return;

    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (!checkoutBtn) return;

    const originalText = checkoutBtn.textContent;
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Đang đặt món...';

    // Format cart data to match CreateOrderDTO
    const items = cart.map(item => ({
        productID: item.productID,
        quantity: item.quantity
    }));

    try {
        await createOrder(items);
        
        // Render success state
        checkoutBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        checkoutBtn.textContent = '✓ Đặt Món Thành Công!';

        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();

        setTimeout(() => {
            checkoutBtn.disabled = false;
            checkoutBtn.style.background = '';
            checkoutBtn.textContent = originalText;
            
            // Close drawer
            const drawer = document.getElementById('cart-drawer');
            const overlay = document.getElementById('cart-overlay');
            if (drawer && overlay) {
                drawer.classList.remove('open');
                overlay.classList.remove('show');
            }
        }, 2500);

    } catch (error) {
        console.error('Checkout failed:', error);
        checkoutBtn.style.background = 'linear-gradient(135deg, #c0392b, #e74c3c)';
        checkoutBtn.textContent = '✗ Lỗi đặt món. Thử lại!';
        
        setTimeout(() => {
            checkoutBtn.disabled = false;
            checkoutBtn.style.background = '';
            checkoutBtn.textContent = originalText;
        }, 3000);
    }
}
