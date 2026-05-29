# ☕ 夜カフェ Yoru Cafe - Full-Stack Japanese Night Coffee Experience

Chào mừng bạn đến với dự án **夜カフェ Yoru Cafe** – Một ứng dụng full-stack hoàn chỉnh phục vụ trải nghiệm thưởng thức cà phê Nhật Bản về đêm. Dự án được đầu tư tỉ mỉ về mặt mỹ thuật với giao diện **Dark Luxury (Đen bóng bẩy, nâu gỗ trầm, vàng gold ấm)** lấy cảm hứng từ Apple kết hợp phong cách tối giản hiện đại của Nhật Bản.

Dự án sở hữu đầy đủ luồng nghiệp vụ từ trang chủ quảng bá giới thiệu, hệ thống đặt món trực tuyến có giỏ hàng, cho đến bảng quản trị Admin cập nhật biểu đồ thống kê thực tế.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### 1. Backend (API Layer)
* **Framework**: ASP.NET Core Web API (Net 10.0)
* **Database Mapping**: Entity Framework Core (EF Core) + SQL Server
* **Kiến trúc**: Repository Pattern (đảm bảo code sạch, tách biệt nghiệp vụ)
* **Bảo mật**: JWT (JSON Web Token) Authentication & Guard System
* **Tài liệu hóa**: Swagger UI (OpenAPI)
* **Khác**: CORS Policy cho phép kết nối Frontend Vite

### 2. Frontend (Client Layer)
* **Build Tool**: Vite (cho thời gian khởi động máy chủ cực nhanh)
* **Core**: Vanilla JavaScript (ES Modules) + HTML5 Semantic
* **Styling**: Vanilla CSS (tập trung tối đa tính tùy biến, bo tròn mềm mại, chuyển động micro-animations mượt mà)
* **API Service**: Axios (tích hợp JWT Interceptor tự động đính kèm token)
* **Thư viện Biểu đồ**: Chart.js (cấu hình chuyên biệt theo tone màu tối sang trọng)
* **Hiệu ứng**: IntersectionObserver (scroll reveal), Fog & Particle Dust System (hiệu ứng sương mờ hạt bụi lơ lửng phong cách điện ảnh)

---

## ✨ Các Tính Năng Nổi Bật

### 🌐 1. Landing Page Điện Ảnh (Cinematic Experience)
* **Hiệu ứng Khói & Sương Mờ realistic**: Hiệu ứng khói ấm bốc lên từ ly cafe, sương nhẹ lững lờ cùng các hạt bụi hạt ánh sáng lơ lửng tạo chiều sâu nghệ thuật.
* **Scroll & Parallax Animations**: Các thành phần tự động cuộn hiển thị mượt mà khi người dùng di chuyển xuống.
* **Bộ lọc Thực đơn động**: Lọc nhanh các danh mục trà, matcha, cafe trực tiếp từ cơ sở dữ liệu.

### 🛒 2. Hệ Thống Giỏ Hàng Trực Tuyến (Online Cart System)
* **Nút "Đặt món" trực tiếp**: Tích hợp trên từng thẻ sản phẩm trong thực đơn.
* **Sleek Cart Drawer (Bảng trượt)**: Bảng giỏ hàng trượt ra cực kỳ hiện đại với chất liệu kính mờ (glassmorphism), cho phép điều chỉnh số lượng (`+` / `-`) hoặc xóa nhanh món ăn.
* **Đặt hàng thời gian thực**: Khi nhấn xác nhận thanh toán, hệ thống sẽ tự động gọi API `/api/orders` để lưu đơn hàng thực tế vào SQL Server và cập nhật lập tức bên trang Admin.

### 📊 3. Trang Quản Trị Độc Đáo (Redesigned Admin Dashboard)
* **JWT Auth Guard**: Bảo mật tuyệt đối, chỉ cho phép quản trị viên đăng nhập thành công mới được truy cập.
* **Tabbed Navigation**: Phân chia 3 phân khu nghiệp vụ mượt mà (Dashboard, Sản phẩm, Đơn hàng) bằng hiệu ứng chuyển cảnh `fadeInUp`.
* **Biểu đồ trực quan**: Biểu đồ doanh thu dạng cột (Bar Chart) và biểu đồ tròn phân bổ danh mục sản phẩm (Doughnut Chart) tự động làm sạch (destroy instance cũ) để vẽ mới không bị lỗi chồng chéo.
* **Thẻ KPI sinh động**: Chỉ số tổng sản phẩm, đơn hàng, doanh thu và dự báo xu hướng tương lai được đếm số tăng dần sinh động khi tải trang.
* **Quản lý đơn hàng (Orders Modal)**: Popup hiển thị chi tiết hóa đơn (tên món, số lượng, thành tiền, thời gian đặt cụ thể).
* **Hệ thống Toast phản hồi cao cấp**: Thay thế toàn bộ `alert()` mặc định bằng thông báo Toast kính mờ đẹp mắt, tự ẩn sau 3 giây.
* **Phím tắt tiện lợi**: Đóng modal nhanh bằng phím **`Esc`** hoặc click ra ngoài vùng phủ.

---

## 📁 Cấu Trúc Dự Án (Project Structure)

```
Coffe_shopNhatBan/
├── Backend/                 → ASP.NET Core Web API
│   └── CafeAPI/
│       ├── Controllers/     → Auth, Products, Categories, Orders, Forecast
│       ├── Data/            → CafeDbContext (Database Connection & Seeds)
│       ├── DTOs/            → ProductDTO, OrderDTO, ForecastDTO, CreateOrderDTO
│       ├── Models/          → Product, Category, Order, OrderDetail, User
│       ├── Repositories/    → CRUD & Database Access Methods (Repository Pattern)
│       ├── Services/        → AuthService (JWT generation), ForecastService (AVG)
│       └── appsettings.json → Cấu hình chuỗi kết nối Database & JWT Secret Key
│
├── Frontend/                → Vite Static Frontend Project
│   ├── assets/              → Hình ảnh AI-generated chất lượng cao
│   ├── css/                 → main.css (Design system), admin.css, landing.css
│   ├── js/                  → api.js (Axios), auth.js, admin.js, landing.js, charts.js
│   ├── index.html           → Trang chủ quảng bá & Đặt món trực tuyến
│   ├── login.html           → Đăng nhập quản trị viên
│   ├── admin.html           → Bảng điều khiển admin
│   └── vite.config.js       → Cấu hình Vite & Proxy kết nối API (cổng 5000)
└── README.md                → Tài liệu hướng dẫn sử dụng
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy Dự Án

### 📋 Yêu cầu hệ thống
* Cài đặt [.NET SDK 10.0](https://dotnet.microsoft.com/download) hoặc mới hơn.
* Cài đặt [Node.js](https://nodejs.org/) (phiên bản LTS).
* Máy tính đã cài đặt [Microsoft SQL Server](https://www.microsoft.com/sql-server) đang hoạt động.

---

### Bước 1: Thiết lập Cơ sở dữ liệu (Database Setup)
1. Hãy tạo mới một Database mang tên: `CafeManagementDB` trong SQL Server của bạn.
2. Chạy tệp tin script SQL được cung cấp trong đồ án để khởi tạo bảng dữ liệu hoặc sử dụng tính năng tự động tạo bảng của EF Core khi khởi chạy Backend.
3. *Lưu ý cấu hình chuỗi kết nối*: Mở file [appsettings.json](file:///e:/Cac_Mon_Hoc/CongNghePhanMem/Coffe_Shop/Coffe_shopNhatBan/Backend/CafeAPI/appsettings.json) trong thư mục `Backend/CafeAPI/` và điều chỉnh `ConnectionString` cho đúng thông số SQL Server của máy bạn:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=TÊN_MÁY_CỦA_BẠN;Database=CafeManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```

---

### Bước 2: Khởi chạy Backend API
1. Mở Terminal và di chuyển vào thư mục dự án Backend:
   ```bash
   cd Backend/CafeAPI
   ```
2. Thực hiện khôi phục package và chạy dự án:
   ```bash
   dotnet run
   ```
   * API sẽ hoạt động tại địa chỉ: `http://localhost:5000`
   * Bạn có thể mở giao diện quản trị API Swagger tại: `http://localhost:5000/swagger` để kiểm tra các Endpoints.

---

### Bước 3: Khởi chạy Frontend
1. Mở một cửa sổ Terminal mới và di chuyển vào thư mục Frontend:
   ```bash
   cd Frontend
   ```
2. Cài đặt các thư viện phụ thuộc (chỉ cần làm trong lần đầu chạy):
   ```bash
   npm install
   ```
3. Chạy máy chủ phát triển Vite:
   ```bash
   npm run dev
   ```
   * Trình duyệt sẽ tự động mở trang chủ tại địa chỉ: [http://localhost:5173](http://localhost:5173).
   * Tại đây bạn có thể đặt thử các món để tạo đơn hàng.

---

### 🔑 Thông tin Đăng nhập Admin
* Để truy cập trang Quản trị Admin, hãy nhấp vào nút **Admin** trên thanh menu trang chủ hoặc vào thẳng liên kết: [http://localhost:5173/login.html](http://localhost:5173/login.html).
* **Tài khoản đăng nhập**:
  * **Tên đăng nhập (Username)**: `admin`
  * **Mật khẩu (Password)**: `admin123`

---

## 🔗 Danh Sách Các Endpoint API Tiêu Biểu

| Phương thức | Đường dẫn API | Xác thực (Auth) | Mô tả công việc |
| :--- | :--- | :---: | :--- |
| **POST** | `/api/auth/login` | ❌ | Đăng nhập tài khoản & Nhận mã JWT Token |
| **GET** | `/api/products` | ❌ | Lấy toàn bộ danh sách món ăn đang bán |
| **POST** | `/api/products` | ✅ | Thêm sản phẩm mới (chỉ Admin) |
| **PUT** | `/api/products/{id}` | ✅ | Cập nhật thông tin món ăn (chỉ Admin) |
| **DELETE**| `/api/products/{id}` | ✅ | Xóa sản phẩm (soft delete - chỉ Admin) |
| **GET** | `/api/categories` | ❌ | Lấy danh mục trà, matcha, cafe |
| **GET** | `/api/orders` | ✅ | Xem danh sách đơn hàng đã đặt (chỉ Admin) |
| **POST** | `/api/orders` | ❌ | Đặt món trực tuyến (dành cho Khách hàng) |
| **GET** | `/api/orders/revenue` | ✅ | Thống kê doanh thu theo từng tháng (chỉ Admin) |
| **GET** | `/api/forecast` | ✅ | Dự báo doanh thu tháng tới bằng thuật toán (chỉ Admin) |

---

## 📝 Bản Quyền & Phát Triển
Dự án được xây dựng phục vụ cho môn học **Công nghệ Phần mềm**. Toàn bộ mã nguồn, thiết kế đồ họa giao diện và trải nghiệm chuyển động đều được thực hiện theo tiêu chuẩn cao cấp nhất của các website ứng dụng hiện đại.

Chúc bạn có một trải nghiệm thú vị cùng **夜カフェ Yoru Cafe**! ☕✨
