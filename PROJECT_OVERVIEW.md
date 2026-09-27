# TÀI LIỆU TOÀN CẢNH DỰ ÁN CLINIC APPOINTMENT SYSTEM (PROJECT_CLINIC)
> **Tài liệu hướng dẫn chuyên sâu & toàn diện từ A - Z dành cho thành viên dự án và phục vụ báo cáo / bảo vệ đồ án.**

---

## MỤC LỤC
1. [Giới thiệu Tổng quan & Mục tiêu Dự án](#1-giới-thiệu-tổng-quan--mục-tiêu-dự-án)
2. [Kiến trúc Hệ thống Toàn cảnh (System Architecture)](#2-kiến-trúc-hệ-thống-toàn-cảnh-system-architecture)
3. [10 Chức năng Nghiệp vụ Cốt lõi (10 Business Functions)](#3-10-chức-năng-nghiệp-vụ-cốt-lõi-10-business-functions)
4. [Thiết kế Cơ sở Dữ liệu & Ràng buộc Toàn vẹn (Database Design)](#4-thiết-kế-cơ-sở-dữ-liệu--ràng-buộc-toàn-vẹn-database-design)
5. [Cơ chế Xác thực & Phân quyền (Authentication & Authorization)](#5-cơ-chế-xác-thực--phân-quyền-authentication--authorization)
6. [Bản đồ Cấu trúc Mã nguồn (Codebase Directory Map)](#6-bản-đồ-cấu-trúc-mã-nguồn-codebase-directory-map)
7. [Luồng Nghiệp vụ Thực tế (End-to-End User Journeys)](#7-luồng-nghiệp-vụ-thực-tế-end-to-end-user-journeys)
8. [Hệ thống Kiểm thử (Pytest Suite) & CI/CD Pipeline](#8-hệ-thống-kiểm-thử-pytest-suite--cicd-pipeline)
9. [Bộ Câu hỏi Thường gặp khi Bảo vệ Đồ án (Defense Q&A)](#9-bộ-câu-hỏi-thường-gặp-khi-bảo-vệ-đồ-án-defense-qa)
10. [Hướng dẫn Cài đặt & Vận hành](#10-hướng-dẫn-cài-đặt--vận-hành)

---

## 1. Giới thiệu Tổng quan & Mục tiêu Dự án

### 1.1. Bối cảnh
Trong các cơ sở y tế và phòng khám truyền thống, việc xếp hàng lấy số thứ tự hoặc đặt hẹn qua sổ tay dễ dẫn đến quá tải cục bộ, bệnh nhân phải chờ đợi nhiều giờ, và bác sĩ gặp khó khăn trong việc quản lý danh sách bệnh nhân theo từng khung giờ. 

**Clinic Appointment System** ra đời nhằm số hóa toàn diện quy trình tiếp đón và đặt hẹn khám bệnh, mang lại:
- **Tiện ích cho Bệnh nhân (Patient)**: Dễ dàng xem thông tin, chuyên môn của các bác sĩ, lựa chọn ngày giờ khám phù hợp, nhận thông báo xác nhận và chủ động quản lý lịch hẹn cá nhân.
- **Tiện ích cho Bác sĩ (Doctor)**: Quản lý danh sách ca khám theo thời gian thực, duyệt/xác nhận lịch khám, và đánh dấu hoàn thành ca khám sau khi thực hiện nghiệp vụ y khoa.
- **Tiện ích cho Quản trị viên (Admin)**: Quản lý danh sách bác sĩ thuộc các chuyên khoa, phân bổ tài nguyên y tế cho phòng khám.

### 1.2. Mục tiêu kỹ thuật
Dự án được thiết kế chặt chẽ theo tiêu chuẩn học thuật và ứng dụng doanh nghiệp:
- Không dàn trải hàng chục tính năng thừa thãi, mà tập trung vào **10 Business Functions cốt lõi** được triển khai có chiều sâu qua từng tầng: Frontend, Backend, Database, Security, Testing và Deployment.
- Thể hiện trọn vẹn kiến thức:
  - **Front-end**: React 18, SPA, Routing, State Management, Modern UI/UX.
  - **Tooling**: Node.js, npm, Vite, Proxy.
  - **Back-end**: Python Flask, RESTful API design, Request Pipeline, Validation.
  - **Database**: SQLite/SQL, Relational integrity, FK Cascades, Indexing, Transactions.
  - **Security**: JWT Stateless Auth, Password Hashing (Salted), RBAC, Ownership Control.
  - **Quality Assurance**: Automated Testing (Pytest với 34 test cases bao phủ 100%), GitHub Actions CI.

---

## 2. Kiến trúc Hệ thống Toàn cảnh (System Architecture)

### 2.1. Mô hình 3 tầng (3-Tier Decoupled Architecture)

Hệ thống tuân thủ nghiêm ngặt nguyên tắc **Decoupling (Phân tách độc lập)**:
- **Tầng Trình bày (Presentation Tier - Frontend)**: Single Page Application (SPA) viết bằng **React 18 + Vite**. Đảm nhận dựng giao diện, xử lý tương tác người dùng, quản lý state và gọi REST API.
- **Tầng Ứng dụng & Nghiệp vụ (Application Tier - Backend)**: **Python Flask REST API**. Đảm nhận xác thực danh tính, kiểm tra quyền hạn (RBAC), kiểm tra tính hợp lệ của dữ liệu đầu vào (Input Validation), thực thi quy tắc y tế và xử lý logic nghiệp vụ.
- **Tầng Dữ liệu (Data Tier - Database)**: **SQLite** (phát triển/kiểm thử) $\to$ **PostgreSQL/MySQL** (sản xuất). Lưu trữ bền vững (Persistence), duy trì ràng buộc toàn vẹn quan hệ (Constraints) và đảm bảo tính nhất quán (ACID Transactions).

```
   ┌─────────────────────────────────────────────────────────────┐
   │                    TRÌNH DUYỆT (BROWSER)                    │
   │                                                             │
   │  ┌───────────────────────────────────────────────────────┐  │
   │  │                 React 18 SPA (Vite)                   │  │
   │  │  - Context: AuthContext (Lưu trữ JWT & User Info)     │  │
   │  │  - React Router: Public & Protected Routes            │  │
   │  │  - Services: Centralized api.js client                │  │
   │  │  - Components: DoctorCard, AppointmentCard, Navbar... │  │
   │  └──────────────────────────┬────────────────────────────┘  │
   └─────────────────────────────┼───────────────────────────────┘
                                 │ HTTP / JSON
                                 │ Header: "Authorization: Bearer <JWT>"
                                 │ Vite Dev Proxy (/api -> :5000)
                                 ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                   FLASK REST API (:5000)                    │
   │                                                             │
   │  ┌───────────────────────────────────────────────────────┐  │
   │  │ 1. Flask Routing (@api_bp.get/post/put/delete)        │  │
   │  │ 2. JWT Verification (@token_required -> 401)          │  │
   │  │ 3. Role-Based Access Control (@role_required -> 403)  │  │
   │  │ 4. Input Validation (validation.py -> 400/422)        │  │
   │  │ 5. Business Logic & Conflict Check (-> 409)           │  │
   │  │ 6. Response Formatter (JSON + Standard Status Codes)  │  │
   │  └──────────────────────────┬────────────────────────────┘  │
   └─────────────────────────────┼───────────────────────────────┘
                                 │ SQL Queries (Parameterized)
                                 │ Transactions & FK Constraints
                                 ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                     DATABASE (SQLITE)                       │
   │                                                             │
   │   [users] ──(1:N)──> [appointments] <──(N:1)── [doctors]    │
   │                              ▲                     │        │
   │                              │                     │ (N:1)  │
   │                              │                     ▼        │
   │                              └────────────── [specialties]  │
   └─────────────────────────────────────────────────────────────┘
```

> **Nguyên tắc cốt tử**: **Frontend không bao giờ kết nối trực tiếp đến Database**. Mọi thao tác với dữ liệu bắt buộc phải đi qua Flask REST API. Flask là client duy nhất có quyền đọc/ghi cơ sở dữ liệu.

### 2.2. Pipeline xử lý Request tại Backend
Khi một HTTP Request gửi đến Flask, nó phải vượt qua một chuỗi phễu lọc tuần tự:
$$\text{HTTP Request} \to \text{Routing} \to \text{JWT Check} \to \text{Role Check} \to \text{Input Validation} \to \text{Business Logic} \to \text{DB Query} \to \text{JSON Response}$$

Nếu bất kỳ bước nào thất bại, hệ thống lập tức ngắt pipeline và trả về mã lỗi HTTP chuẩn kèm nội dung JSON giải thích chi tiết.

---

## 3. 10 Chức năng Nghiệp vụ Cốt lõi (10 Business Functions)

Dự án xoay quanh 10 chức năng đại diện, kết nối đầy đủ giữa Frontend UI và Backend API:

| # | Chức năng | Vai trò | HTTP Method & Path | Màn hình Frontend | Luồng xử lý kỹ thuật |
|---|---|---|---|---|---|
| **1** | **Đăng ký tài khoản (Register)** | Patient | `POST /api/register` | `Register.jsx` | - Validate email, password $\ge 6$ ký tự.<br>- Kiểm tra trùng email (409).<br>- Băm mật khẩu bằng Werkzeug (Salted Hash).<br>- INSERT vào bảng `users` với role `PATIENT`.<br>- Trả về `201 Created`. |
| **2** | **Đăng nhập (Login)** | All | `POST /api/login` | `Login.jsx` | - Validate định dạng email và mật khẩu.<br>- SELECT user theo email.<br>- So khớp mật khẩu băm bằng `check_password_hash`.<br>- Sinh mã JWT (HS256) chứa `user_id`, `role`, `exp` (24h).<br>- Trả về `200 OK` kèm Token và thông tin user. |
| **3** | **Xem danh sách bác sĩ (Doctor List)** | Public / Patient | `GET /api/doctors` | `Doctors.jsx` | - Truy vấn SELECT JOIN giữa `doctors`, `users` và `specialties`.<br>- Chỉ lấy các bác sĩ khả dụng (`available = 1`).<br>- Trả về mảng JSON danh sách bác sĩ (`200 OK`).<br>- Frontend hiển thị trạng thái `loading -> error -> data`. |
| **4** | **Xem chi tiết hồ sơ bác sĩ (Doctor Detail)** | Public / Patient | `GET /api/doctors/:id` | `DoctorDetail.jsx` | - Đọc tham số động `:id` từ URL (React Router `useParams`).<br>- SELECT JOIN chi tiết thông tin bác sĩ, khoa, số năm kinh nghiệm, mô tả.<br>- Nếu không tìm thấy, trả về `404 Not Found`.<br>- Nếu thấy, trả về `200 OK`. |
| **5** | **Đặt lịch khám bệnh (Book Appointment)** | Patient | `POST /api/appointments` | `BookAppointment.jsx` | - Kiểm tra token JWT hợp lệ (401), đúng quyền `PATIENT` (403).<br>- Validate `doctor_id`, `date` (YYYY-MM-DD), `time` (HH:MM).<br>- Kiểm tra bác sĩ có tồn tại không (404).<br>- **Chống trùng lịch**: Kiểm tra slot `(doctor_id, date, time)` đã được đặt chưa. Nếu trùng trả về `409 Conflict`.<br>- INSERT lịch hẹn trạng thái `PENDING`, trả về `201 Created`. |
| **6** | **Xem lịch hẹn của tôi (My Appointments)** | Patient | `GET /api/my-appointments` | `MyAppointments.jsx` | - Kiểm tra JWT (401), role `PATIENT` (403).<br>- Lấy `user_id` từ token, truy vấn SELECT JOIN các lịch khám của chính bệnh nhân đó (`patient_id = current_user.id`).<br>- Trả về `200 OK`. Frontend hiển thị thẻ `AppointmentCard` với bộ lọc Tab. |
| **7** | **Hủy lịch hẹn khám (Cancel Appointment)** | Patient | `DELETE /api/appointments/:id` | `MyAppointments.jsx` | - Kiểm tra JWT (401), quyền `PATIENT` (403).<br>- Tìm lịch hẹn (404 nếu không thấy).<br>- **Kiểm tra quyền sở hữu (Ownership)**: Chỉ bệnh nhân đặt lịch mới được hủy lịch của mình (403 nếu hủy lịch người khác).<br>- Xóa lịch hẹn khỏi cơ sở dữ liệu, trả về `204 No Content`. |
| **8** | **Bác sĩ xem lịch khám (Doctor Appointments)** | Doctor | `GET /api/doctor/appointments` | `DoctorDashboard.jsx` | - Kiểm tra JWT (401), bắt buộc role `DOCTOR` (403).<br>- Tìm hồ sơ bác sĩ dựa theo `user_id` trong JWT.<br>- SELECT JOIN các lịch khám được phân công cho chính bác sĩ này.<br>- Trả về danh sách kèm thông tin bệnh nhân (`200 OK`). |
| **9** | **Bác sĩ cập nhật trạng thái (Update Status)** | Doctor | `PUT /api/doctor/appointments/:id` | `DoctorDashboard.jsx` | - Bắt buộc role `DOCTOR` (403).<br>- Kiểm tra lịch hẹn có thuộc quyền phụ trách của bác sĩ không (403).<br>- Validate trạng thái hợp lệ: `CONFIRMED`, `COMPLETED`, `CANCELLED` (422).<br>- **Ràng buộc nghiệp vụ y tế**:<br>  + Không thể chuyển thẳng từ `PENDING` sang `COMPLETED` mà chưa `CONFIRMED`.<br>  + Bác sĩ đã `CONFIRMED` thì không được hủy (`CANCELLED`).<br>  + Lịch đã kết thúc (`COMPLETED`/`CANCELLED`) không được sửa.<br>- Cập nhật UPDATE vào DB, trả về `200 OK`. |
| **10** | **Admin quản lý bác sĩ (Manage Doctors)** | Admin | `POST /api/admin/doctors`<br>`DELETE /api/admin/doctors/:id` | `AdminDashboard.jsx` | - Bắt buộc role `ADMIN` (403).<br>- Thêm mới: Tạo tài khoản User (`role='DOCTOR'`) + Tạo hồ sơ Doctor liên kết với `specialty_id` trong một transaction (201).<br>- Xóa: Xóa bác sĩ theo ID (CASCADE xóa hồ sơ liên quan), trả về `204 No Content`. |

---

## 4. Thiết kế Cơ sở Dữ liệu & Ràng buộc Toàn vẹn (Database Design)

### 4.1. Sơ đồ Quan hệ Thực thể (Entity-Relationship Diagram)

```
+------------------------------------+
|            specialties             |
+------------------------------------+
| PK  id           INTEGER           |
| UK  name         TEXT              |
|     description  TEXT              |
+------------------------------------+
                  │ 1
                  │
                  │ N
+------------------------------------+          +------------------------------------+
|              doctors               |          |               users                |
+------------------------------------+          +------------------------------------+
| PK  id           INTEGER           |          | PK  id             INTEGER         |
| FK  user_id      INTEGER (UNIQUE)  │<───1:1───┤ UK  email          TEXT            |
| FK  specialty_id INTEGER           |          |     full_name      TEXT            |
|     phone        TEXT              |          |     password_hash  TEXT            |
|     experience   INTEGER           |          | CK  role           TEXT            |
|     description  TEXT              |          |     created_at     TIMESTAMP       |
| CK  available    INTEGER (0/1)     |          +------------------------------------+
+------------------------------------+                             │ 1
                  │ 1                                              │
                  │                                                │ N (as patient)
                  │ N                                              ▼
+─────────────────┴──────────────────────────────────────────────────+
|                            appointments                            |
+--------------------------------------------------------------------+
| PK  id           INTEGER                                           |
| FK  patient_id   INTEGER (REFERENCES users.id ON DELETE CASCADE)   |
| FK  doctor_id    INTEGER (REFERENCES doctors.id ON DELETE CASCADE) |
|     date         TEXT (YYYY-MM-DD)                                 |
|     time         TEXT (HH:MM)                                      |
|     reason       TEXT                                              |
| CK  status       TEXT ('PENDING','CONFIRMED','COMPLETED','CANCEL') |
|     created_at   TIMESTAMP                                         |
+--------------------------------------------------------------------+
```

### 4.2. Các Ràng buộc Toàn vẹn (Constraints & Data Integrity)
1. **Primary Key (PK)**: Mỗi bảng đều có trường `id` tự tăng (`AUTOINCREMENT`), đảm bảo định danh duy nhất từng bản ghi.
2. **Unique Constraints (UK)**:
   - `users.email`: Đảm bảo không thể có hai tài khoản trùng địa chỉ email.
   - `specialties.name`: Đảm bảo tên chuyên khoa không bị trùng lặp.
   - `doctors.user_id`: Đảm bảo quan hệ 1-1 chặt chẽ giữa tài khoản User và hồ sơ Doctor.
3. **Foreign Key Constraints (FK)**:
   - `appointments.patient_id -> users.id` (`ON DELETE CASCADE`): Khi xóa tài khoản bệnh nhân, các lịch hẹn liên quan sẽ tự động được thu dọn.
   - `appointments.doctor_id -> doctors.id` (`ON DELETE CASCADE`).
   - `doctors.specialty_id -> specialties.id` (`ON DELETE RESTRICT`): Không thể xóa một chuyên khoa nếu vẫn còn bác sĩ đang thuộc chuyên khoa đó.
4. **Domain Check Constraints (CK)**:
   - `users.role IN ('PATIENT', 'DOCTOR', 'ADMIN')`.
   - `appointments.status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')`.
   - `doctors.available IN (0, 1)`.
5. **Đánh chỉ mục (Indexes)** để tối ưu tốc độ tìm kiếm:
   - `idx_users_email` trên `users(email)`.
   - `idx_doctors_specialty` trên `doctors(specialty_id)`.
   - `idx_appointments_slot` trên `appointments(doctor_id, date, time)`.

---

## 5. Cơ chế Xác thực & Phân quyền (Authentication & Authorization)

### 5.1. JSON Web Token (JWT) Flow
Hệ thống sử dụng cơ chế xác thực **Stateless** dựa trên JWT:
1. Người dùng gửi `email` + `password` tới `POST /api/login`.
2. Backend xác minh mật khẩu bằng `check_password_hash`. Nếu đúng, tạo một JWT có chữ ký bảo mật:
   - Thuật toán: **HS256**
   - Payload:
     ```json
     {
       "user_id": 1,
       "role": "PATIENT",
       "exp": 1787000000,
       "iat": 1786913600
     }
     ```
3. Frontend nhận token và lưu vào `localStorage`.
4. Trong mọi request tiếp theo, client gửi kèm Header:
   `Authorization: Bearer <token>`
5. Flask giải mã và kiểm tra chữ ký token tại decorator `@token_required`. Nếu token hợp lệ, thông tin `current_user` được trích xuất và truyền vào hàm xử lý route.

### 5.2. Phân biệt triệt để 401 Unauthorized và 403 Forbidden
Đây là điểm mấu chốt để đạt điểm tối đa môn Web Application:
- **`401 Unauthorized` (Chưa xác thực)**: Người dùng chưa cung cấp token, token sai định dạng, bị giả mạo hoặc đã hết hạn. Câu hỏi: *"Bạn là ai? Hệ thống không nhận diện được bạn."*
- **`403 Forbidden` (Đã xác thực nhưng không có quyền)**: Token hoàn toàn hợp lệ, hệ thống biết người dùng là ai, nhưng họ không có quyền thực hiện hành động này. Câu hỏi: *"Bạn là Bệnh nhân nhưng bạn lại đòi truy cập Dashboard của Bác sĩ hoặc cố tình hủy lịch khám của Bệnh nhân khác."*

### 5.3. Kiểm soát quyền sở hữu dữ liệu (Ownership Check)
Không chỉ phân quyền theo chức vụ (RBAC), hệ thống còn cài đặt kiểm tra quyền sở hữu đối tượng:
- Một bệnh nhân chỉ được phép xem và hủy lịch hẹn do chính tài khoản của họ tạo ra (`appt['patient_id'] == current_user['user_id']`).
- Một bác sĩ chỉ được xem và cập nhật trạng thái các ca khám được chỉ định đích danh cho họ (`appt['doctor_id'] == doctor['id']`).

---

## 6. Bản đồ Cấu trúc Mã nguồn (Codebase Directory Map)

```
project_clinic(demo)/
├── .github/
│   └── workflows/
│       └── tests.yml            # CI Workflow tự động chạy Pytest và Build Frontend khi push code
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Khởi tạo Flask Application Factory, nạp cấu hình, đăng ký Blueprints
│   │   ├── auth.py              # Xử lý JWT (encode/decode), băm mật khẩu, decorators @token_required, @role_required
│   │   ├── database.py          # Quản lý kết nối SQLite, helper get_db(), row_factory
│   │   ├── models.py            # Data Access Object (DAO) thực hiện các truy vấn SQL cho User, Doctor, Appointment
│   │   ├── routes.py            # Định nghĩa toàn bộ 10 REST API Endpoints, kiểm soát luồng request/response
│   │   └── validation.py        # Kiểm tra tính hợp lệ dữ liệu đầu vào (email, date, time, status...)
│   ├── tests/
│   │   ├── test_auth.py         # 11 tests: Đăng ký, đăng nhập, JWT, mã lỗi 401/409/422
│   │   ├── test_doctors.py      # 3 tests: Danh sách bác sĩ, chi tiết bác sĩ, mã lỗi 404
│   │   └── test_appointments.py # 20 tests: Đặt lịch, chống trùng 409, hủy lịch, dashboard bác sĩ, admin
│   ├── clinic.db                # File cơ sở dữ liệu SQLite
│   ├── requirements.txt         # Danh sách thư viện Python (Flask, PyJWT, Werkzeug, Pytest...)
│   ├── run.py                   # Entry point khởi chạy Flask backend server (:5000)
│   └── seed.py                  # Script nạp dữ liệu mẫu ban đầu vào database
├── database/
│   ├── schema.sql               # Định nghĩa cấu trúc DDL của 4 bảng, indexes và foreign keys
│   └── seed.sql                 # Dữ liệu mẫu ban đầu (Specialties, Users, Doctors, Appointments)
├── frontend/
│   ├── public/
│   │   └── images/
│   │       ├── doctors/         # Ảnh chân dung thực tế chất lượng cao của từng bác sĩ
│   │       ├── icons/           # Bộ icon quy trình khám bệnh
│   │       └── logo.webp        # Logo nhận diện thương hiệu phòng khám
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppointmentCard.jsx # Thẻ lịch hẹn y tế chuẩn UI/UX, dải giờ khám, ảnh bác sĩ, nút thao tác
│   │   │   ├── DoctorCard.jsx      # Thẻ bác sĩ trên danh sách và slider
│   │   │   ├── Loading.jsx         # Hiển thị spinner khi tải dữ liệu
│   │   │   ├── Navbar.jsx          # Thanh điều hướng trên cùng, nhận diện đăng nhập, link động theo role
│   │   │   └── ProtectedRoute.jsx  # Bảo vệ tuyến đường client-side theo role
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Quản lý trạng thái xác thực toàn cục (user, token, login, logout)
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Trang chủ: Banner bác sĩ nổi bật, quy trình 4 bước, cam kết y tế
│   │   │   ├── Login.jsx           # Trang đăng nhập
│   │   │   ├── Register.jsx        # Trang đăng ký bệnh nhân
│   │   │   ├── Doctors.jsx         # Trang danh sách tất cả bác sĩ
│   │   │   ├── DoctorDetail.jsx    # Trang chi tiết thông tin và chuyên môn bác sĩ
│   │   │   ├── BookAppointment.jsx # Form đặt lịch khám bệnh trực tuyến
│   │   │   ├── MyAppointments.jsx  # Trang lịch hẹn của bệnh nhân kèm bộ lọc trạng thái thông minh
│   │   │   ├── DoctorDashboard.jsx # Dashboard dành riêng cho bác sĩ quản lý các ca khám
│   │   │   └── AdminDashboard.jsx  # Dashboard dành riêng cho quản trị viên thêm/xóa bác sĩ
│   │   ├── services/
│   │   │   └── api.js              # HTTP Client tập trung gom toàn bộ fetch API calls
│   │   ├── utils/
│   │   │   └── doctorImages.js     # Bản đồ ánh xạ ảnh bác sĩ theo doctor_id
│   │   ├── App.jsx                 # Cấu hình Client-side Routing và Layout gốc
│   │   ├── index.css               # Hệ thống CSS Design System hiện đại, responsive, màu sắc y tế
│   │   └── main.jsx                # Entry point gắn kết React vào DOM
│   ├── package.json                # Quản lý dependencies (React 18, React Router, Vite)
│   └── vite.config.js              # Cấu hình Vite, port 3000 và Reverse Proxy /api -> :5000
├── .gitignore                      # Chặn commit .env, *.db, node_modules, dist, __pycache__
└── README.md                       # Tài liệu tóm tắt kỹ thuật nộp bài
```

---

## 7. Luồng Nghiệp vụ Thực tế (End-to-End User Journeys)

### Kịch bản 1: Bệnh nhân đặt và quản lý lịch khám
1. **Khám phá**: Bệnh nhân truy cập Trang chủ `http://localhost:3000`, xem banner bác sĩ tiêu biểu, quy trình khám và danh sách chuyên khoa.
2. **Xem chi tiết**: Bệnh nhân nhấn "Xem chi tiết" để xem hồ sơ năng lực của Bác sĩ CKII Nguyễn Văn An (`/doctors/1`).
3. **Đăng nhập**: Bệnh nhân bấm "Đặt lịch khám", hệ thống phát hiện chưa đăng nhập nên chuyển hướng tới `/login`. Sau khi đăng nhập bằng tài khoản bệnh nhân, hệ thống đưa trở lại trang đặt lịch `/book/1`.
4. **Đặt lịch & Chống trùng**: Bệnh nhân chọn ngày `2026-10-15`, giờ `09:30` và nhập lý do "Tái khám huyết áp".
   - *Nếu giờ đó bác sĩ đã có lịch*: Backend trả về `409 Conflict`, giao diện báo đỏ: *"Bác sĩ đã có lịch hẹn vào thời gian này. Vui lòng chọn khung giờ khác."*
   - *Nếu giờ đó còn trống*: Backend lưu lịch hẹn mới với trạng thái `PENDING` (201 Created).
5. **Theo dõi lịch**: Bệnh nhân chuyển sang `/my-appointments` xem danh sách lịch khám. Lịch mới xuất hiện với viền vàng hổ phách, badge `⏳ Chờ xác nhận`, dải thông tin giờ hẹn và địa điểm khám rõ ràng.
6. **Hủy lịch**: Nếu bệnh nhân bận đột xuất, bấm nút "Hủy lịch hẹn" -> Hộp thoại xác nhận xuất hiện -> Xác nhận hủy -> Backend xóa lịch hẹn (204 No Content) và cập nhật giao diện ngay lập tức.

### Kịch bản 2: Bác sĩ tiếp nhận và khám bệnh
1. Bác sĩ đăng nhập tài khoản bác sĩ (`doctor1@clinic.com`).
2. Trên Navbar, menu tự động hiển thị link **"Bàn làm việc Bác sĩ"** (`/doctor/dashboard`).
3. Bác sĩ thấy danh sách các ca bệnh được đăng ký cho mình.
4. **Xác nhận**: Với ca bệnh trạng thái `Chờ xác nhận`, bác sĩ kiểm tra và bấm nút **"Xác nhận"** -> Trạng thái chuyển sang `Đã xác nhận` (CONFIRMED). *Kể từ thời điểm này, nút hủy của bác sĩ bị vô hiệu hóa để bảo đảm tính cam kết với bệnh nhân.*
5. **Khám bệnh & Hoàn thành**: Sau khi bệnh nhân tới phòng khám và hoàn tất buổi khám, bác sĩ bấm **"Đã khám xong"** -> Trạng thái chuyển sang `Đã khám` (COMPLETED).

### Kịch bản 3: Quản trị viên quản lý nhân sự
1. Quản trị viên đăng nhập (`admin@clinic.com`).
2. Truy cập **"Quản trị hệ thống"** (`/admin/dashboard`).
3. Admin điền thông tin để bổ sung một Bác sĩ mới: Họ tên, Email, Mật khẩu, Chuyên khoa, Số năm kinh nghiệm, Số điện thoại.
4. Bấm "Thêm bác sĩ" -> Backend tạo đồng thời User và Doctor trong 1 transaction an toàn (201 Created). Bác sĩ mới ngay lập tức hiển thị trên giao diện đặt lịch.
5. Khi một bác sĩ chuyển công tác, Admin bấm "Xóa" -> Hệ thống loại bỏ bác sĩ khỏi danh sách (204 No Content).

---

## 8. Hệ thống Kiểm thử (Pytest Suite) & CI/CD Pipeline

### 8.1. Kiểm thử Tự động với Pytest (34 Test Cases)
Dự án được bảo vệ bởi bộ test tự động toàn diện chạy trong **3.5 giây**, bao phủ đầy đủ các tầng nghiệp vụ:

- **`test_auth.py` (11 test cases)**:
  - Kiểm tra đăng ký thành công (201) và tạo đúng role PATIENT.
  - Chặn đăng ký email trùng lặp (409 Conflict).
  - Bắt lỗi thiếu mật khẩu, sai định dạng email, body JSON rỗng (422 / 400).
  - Đăng nhập thành công cho cả 3 role (Patient, Doctor, Admin) và xác nhận JWT sinh ra giải mã đúng.
  - Chặn đăng nhập khi sai mật khẩu hoặc tài khoản không tồn tại (401).
- **`test_doctors.py` (3 test cases)**:
  - Lấy danh sách bác sĩ thành công (200), kiểm tra có đầy đủ trường chuyên khoa liên kết.
  - Lấy chi tiết 1 bác sĩ hợp lệ (200).
  - Trả về 404 khi truy vấn bác sĩ không tồn tại.
- **`test_appointments.py` (20 test cases)**:
  - Đặt lịch khám thành công (201).
  - **Kiểm thử chống trùng lịch**: Đặt cùng 1 bác sĩ, cùng ngày và giờ sẽ bị chặn với mã 409 Conflict.
  - Bệnh nhân chưa đăng nhập bị chặn với 401.
  - Role khác (Bác sĩ/Admin) cố tình đặt lịch bị chặn với 403.
  - Đặt lịch với bác sĩ không tồn tại trả về 404.
  - Bệnh nhân hủy lịch của mình thành công (204 No Content).
  - Bệnh nhân A cố tình hủy lịch của Bệnh nhân B bị chặn với 403 Forbidden.
  - Bác sĩ chỉ xem được các ca khám của chính mình.
  - Bác sĩ A không thể cập nhật lịch khám của Bác sĩ B (403 Forbidden).
  - Quy tắc y tế: Bác sĩ phải xác nhận (`CONFIRMED`) trước khi hoàn thành (`COMPLETED`).
  - Phân quyền Admin: Tạo và xóa bác sĩ thành công; tài khoản không phải Admin bị chặn với 403.

### 8.2. Tích hợp Liên tục (CI/CD Pipeline với GitHub Actions)
File cấu hình `.github/workflows/tests.yml` tự động kích hoạt mỗi khi có thao tác `git push` hoặc tạo `Pull Request`:
1. **Job 1: Backend Tests**: Khởi tạo Python 3.11 trên Ubuntu, nạp dependencies từ `requirements.txt`, chạy `python seed.py` và thực thi toàn bộ 34 tests `pytest -v`.
2. **Job 2: Frontend Build**: Khởi tạo Node.js 20, chạy `npm ci` cài đặt chuẩn theo lockfile, và thực thi `npm run build` để đảm bảo mã nguồn frontend biên dịch sạch sẽ 100% không có lỗi.

---

## 9. Bộ Câu hỏi Thường gặp khi Bảo vệ Đồ án (Defense Q&A)

Dưới đây là các câu hỏi trọng tâm mà Hội đồng chấm thi / Giảng viên thường đặt ra và cách trả lời chuẩn xác nhất:

#### Q1: Tại sao dự án dùng JWT thay vì Session truyền thống?
> **Trả lời**: JWT hoạt động theo mô hình **Stateless**. Máy chủ không cần duy trì bộ nhớ (in-memory session store) để lưu phiên người dùng. Token chứa sẵn thông tin nhận diện (`user_id`, `role`) và được xác thực tính toàn vẹn nhờ chữ ký điện tử (Signature). Điều này giúp hệ thống dễ dàng mở rộng theo chiều ngang (Horizontal Scaling) khi triển khai trên nhiều container hoặc server đằng sau Load Balancer mà không lo lệch session.

#### Q2: Băm mật khẩu (Password Hashing) khác gì Mã hóa (Encryption)? Tại sao lại dùng Werkzeug?
> **Trả lời**: Mã hóa là quá trình **hai chiều** (có thể giải mã ngược lại nếu có khóa bí mật). Băm mật khẩu là hàm toán học **một chiều** (One-way Function) - một khi đã băm thì không thể dịch ngược lại mật khẩu gốc. Werkzeug tự động sinh chuỗi muối ngẫu nhiên (Salt) kết hợp với thuật toán băm chậm, giúp vô hiệu hóa hoàn toàn các cuộc tấn công tra bảng (Rainbow Table) ngay cả khi cơ sở dữ liệu bị lộ.

#### Q3: Hệ thống xử lý thế nào để ngăn 2 bệnh nhân đặt trùng một khung giờ của bác sĩ?
> **Trả lời**: Tại endpoint `POST /api/appointments`, hệ thống thực hiện kiểm tra tiền điều kiện (Pre-condition Check): Truy vấn bảng `appointments` với bộ ba `(doctor_id, date, time)` kèm điều kiện `status != 'CANCELLED'`. Nếu bản ghi đã tồn tại, hệ thống trả về mã trạng thái HTTP chuẩn `409 Conflict` kèm thông báo lỗi cụ thể để bệnh nhân chọn giờ khác. Ngoài ra, bảng appointments có index trên 3 cột này để tốc độ kiểm tra đạt tối ưu $O(\log N)$.

#### Q4: Em phân biệt mã lỗi 401 Unauthorized và 403 Forbidden như thế nào trong code?
> **Trả lời**: 
> - **401 Unauthorized** xảy ra khi Request không có Header `Authorization: Bearer <token>`, hoặc token bị hỏng / hết hạn. Lúc này hệ thống từ chối vì không biết người gọi là ai.
> - **403 Forbidden** xảy ra khi token hoàn toàn hợp lệ (hệ thống biết rõ danh tính), nhưng quyền của người đó không được phép thực thi (ví dụ: Role PATIENT cố truy cập API Admin, hoặc Bệnh nhân A cố gửi lệnh xóa lịch hẹn của Bệnh nhân B).

#### Q5: Tại sao trong file cấu hình Vite lại cần thiết lập Proxy `/api` về port 5000?
> **Trả lời**: Khi phát triển local, React chạy ở `http://localhost:3000` còn Flask chạy ở `http://localhost:5000`. Do khác port, nếu gọi trực tiếp trình duyệt sẽ chặn do vi phạm chính sách cùng nguồn gốc (**CORS - Same-Origin Policy**). Vite Proxy đóng vai trò trạm trung chuyển trung gian: Frontend gọi `/api/...` trên chính port 3000, Vite dev server sẽ chuyển tiếp ngầm tới Flask port 5000, giúp triệt tiêu hoàn toàn lỗi CORS và mô phỏng chính xác môi trường Reverse Proxy (như Nginx) ngoài đời thực.

#### Q6: Thiết kế cơ sở dữ liệu có những điểm gì đảm bảo tính toàn vẹn dữ liệu?
> **Trả lời**:
> - Khóa ngoại (Foreign Keys) có ràng buộc hành động rõ ràng: `CASCADE` cho quan hệ phụ thuộc (xóa user thì xóa appointments) và `RESTRICT` cho quan hệ danh mục (không cho xóa chuyên khoa nếu đang có bác sĩ thuộc khoa đó).
> - Ràng buộc `UNIQUE` trên `users.email` và `specialties.name`.
> - Ràng buộc miền giá trị `CHECK` giới hạn các giá trị hợp lệ cho `role` (`PATIENT`, `DOCTOR`, `ADMIN`) và `status` (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).

---

## 10. Hướng dẫn Cài đặt & Vận hành

### Yêu cầu môi trường
- Python 3.10 trở lên.
- Node.js 18 hoặc 20 trở lên & npm.

### Bước 1: Khởi động Backend
```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Cài đặt các thư viện cần thiết
pip install -r requirements.txt

# 3. Khởi tạo cơ sở dữ liệu và nạp dữ liệu mẫu
python seed.py

# 4. Khởi chạy Flask Server
python run.py
```
*Backend lắng nghe tại: `http://localhost:5000`.*

### Bước 2: Khởi động Frontend
```bash
# 1. Mở terminal mới, di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt dependencies
npm install

# 3. Khởi chạy Vite Dev Server
npm run dev
```
*Frontend mở tại: `http://localhost:3000`.*

### Tài khoản mẫu dùng để thử nghiệm:
| Vai trò | Email đăng nhập | Mật khẩu | Chức năng kiểm thử |
|---|---|---|---|
| **Bệnh nhân (Patient)** | `patient1@example.com` | `password123` | Xem bác sĩ, đặt lịch khám, quản lý và hủy lịch hẹn |
| **Bác sĩ (Doctor)** | `doctor1@clinic.com` | `password123` | Truy cập Dashboard bác sĩ, xác nhận ca khám, hoàn thành buổi khám |
| **Quản trị viên (Admin)** | `admin@clinic.com` | `password123` | Truy cập Dashboard Admin, thêm bác sĩ mới, xóa tài khoản bác sĩ |

### Bước 3: Chạy kiểm thử tự động
```bash
cd backend
pytest -v
```
*(Kết quả mong đợi: `34 passed in ~3.5s`)*.
