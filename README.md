# Clinic Appointment System - Project Design

Dự án Hệ thống Đặt lịch Khám Bệnh (**Clinic Appointment System**) được xây dựng và thiết kế xoay quanh **10 Business Functions** cốt lõi, bao trọn và chứng minh năng lực toàn diện trong phát triển Web Application: **Node.js, React 18, Vite, Python Flask, Database (SQL/Constraints/Transactions), REST API Contract, JWT Authentication & RBAC Security, Testing (pytest) và CI/CD**.

---

## 1. Tầm nhìn & Kiến trúc Hệ thống

Hệ thống phục vụ 3 vai trò người dùng: **Patient (Bệnh nhân)**, **Doctor (Bác sĩ)** và **Admin (Quản trị viên)**.

- **Frontend**: Single-Page Application (SPA) xây dựng bằng **React 18 + Vite**, quản lý state tập trung, định tuyến client-side với React Router, giao diện responsive và xử lý trọn vẹn 3 trạng thái: `loading -> error -> data`.
- **Backend**: **Python Flask REST API** xử lý nghiệp vụ theo pipeline chuẩn:
  $$\text{HTTP Request} \to \text{Flask Route} \to \text{JWT / Role Check} \to \text{Input Validation} \to \text{Business Logic} \to \text{Database Query} \to \text{JSON Response + Status Code}$$
- **Database**: **SQLite** (môi trường dev/test) $\to$ **PostgreSQL/MySQL** (khi triển khai production). Đảm bảo tính toàn vẹn dữ liệu thông qua Primary Key, Unique Constraints, Foreign Keys (CASCADE/RESTRICT), Domain Check Constraints và Database Transactions.
- **Nguyên tắc kiến trúc**: Frontend **không** truy cập database trực tiếp. Frontend chỉ trao đổi dữ liệu thông qua REST API; Flask là client duy nhất làm việc với Database.

```
Browser (Chrome)
     │
     ▼
React 18 + Vite (:3000)
     │  HTTP / JSON (Vite Proxy: /api -> :5000)
     ▼
Flask REST API (:5000)
     │  SQL (Parameterized queries, transactions, FKs)
     ▼
Database (SQLite / PostgreSQL)
```

---

## 2. Danh mục 10 Business Functions

| # | Chức năng | Vai trò | Endpoint | Frontend | Kiến thức / Minh chứng |
|---|---|---|---|---|---|
| **1** | Register | Patient | `POST /api/register` | `Register.jsx` | Form, client/server validation, salted password hashing, INSERT |
| **2** | Login | Patient / Doctor / Admin | `POST /api/login` | `Login.jsx` | Password hash verify, JWT payload generation, AuthContext state |
| **3** | View Doctor List | Patient / All | `GET /api/doctors` | `Doctors.jsx` | `useEffect`, loading/error/data states, SELECT JOIN specialty |
| **4** | View Doctor Detail | Patient / All | `GET /api/doctors/:id` | `DoctorDetail.jsx` | Dynamic route params, 404 Not Found handling, JOIN doctor + specialty + user |
| **5** | Book Appointment | Patient | `POST /api/appointments` | `BookAppointment.jsx` | JWT authentication, role guard, conflict detection (409), transaction safe |
| **6** | View My Appointments | Patient | `GET /api/my-appointments` | `MyAppointments.jsx` | Ownership check, JWT verification, JOIN appointments + doctor + specialty |
| **7** | Cancel Appointment | Patient / Owner | `DELETE /api/appointments/:id` | `MyAppointments.jsx` | DELETE method, strict ownership check, 204 No Content / 401 / 403 / 404 |
| **8** | View Appointments | Doctor | `GET /api/doctor/appointments` | `DoctorDashboard.jsx` | RBAC authorization (Doctor role), JOIN appointments + patient |
| **9** | Update Appointment Status | Doctor / Owner | `PUT /api/doctor/appointments/:id` | `DoctorDashboard.jsx` | PUT method, status validation (422), doctor ownership check, UPDATE |
| **10** | Manage Doctors | Admin | `POST /api/admin/doctors`<br>`DELETE /api/admin/doctors/:id` | `AdminDashboard.jsx` | CRUD bác sĩ, Admin RBAC, FK constraints, 201 Created / 204 No Content |

---

## 3. Thiết kế Cơ sở Dữ liệu (Relational Model)

### Sơ đồ quan hệ thực thể (ERD)

```
+--------------------+       1 - N       +--------------------+
|    specialties     | ----------------- |      doctors       |
+--------------------+                   +--------------------+
| id (PK)            |                   | id (PK)            |
| name (UNIQUE)      |                   | user_id (FK,UK)    | ----+
| description        |                   | specialty_id (FK)  |     |
+--------------------+                   | phone              |     |
                                         | experience         |     |
                                         | description        |     |
                                         | available          |     |
                                         +--------------------+     |
                                                   │ 1              | 1 - 1
                                                   │                |
                                                   │ N              |
+--------------------+                   +--------------------+     |
|       users        | ----------------- |    appointments    |     |
+--------------------+       1 - N       +--------------------+     |
| id (PK)            | (patient)         | id (PK)            |     |
| full_name          |                   | patient_id (FK)    |     |
| email (UNIQUE)     |                   | doctor_id (FK)     |     |
| password_hash      |                   | date               |     |
| role (CHECK)       |                   | time               |     |
| created_at         |                   | reason             |     |
+--------------------+                   | status (CHECK)     |     |
          │                              | created_at         |     |
          +---------------------------------------------------------+
```

### Các ràng buộc quan trọng (Constraints & Integrity)
- **PRIMARY KEY**: `users.id`, `specialties.id`, `doctors.id`, `appointments.id`.
- **UNIQUE**: `users.email`, `specialties.name`, `doctors.user_id`.
- **FOREIGN KEY**:
  - `doctors.user_id -> users.id` (`ON DELETE CASCADE`)
  - `doctors.specialty_id -> specialties.id` (`ON DELETE RESTRICT`)
  - `appointments.patient_id -> users.id` (`ON DELETE CASCADE`)
  - `appointments.doctor_id -> doctors.id` (`ON DELETE CASCADE`)
- **CHECK Constraints**:
  - `users.role IN ('PATIENT', 'DOCTOR', 'ADMIN')`
  - `appointments.status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')`
- **Chống trùng lịch (Booking Conflict Check)**:
  - Khi bệnh nhân đặt lịch hẹn tại `POST /api/appointments`, hệ thống kiểm tra trùng slot `(doctor_id, date, time)` với các lịch chưa bị hủy (`status != 'CANCELLED'`). Nếu đã có lịch, trả về `409 Conflict`.

---

## 4. REST API Contract & Quy ước Mã Trạng Thái

### Danh sách API Endpoints

| Method | Endpoint | Success Code | Typical Error Codes | Quyền truy cập |
|---|---|---|---|---|
| `POST` | `/api/register` | `201 Created` | `400`, `409`, `422` | Public |
| `POST` | `/api/login` | `200 OK` | `400`, `401`, `422` | Public |
| `GET` | `/api/doctors` | `200 OK` | `500` | Public / Patient |
| `GET` | `/api/doctors/:id` | `200 OK` | `404` | Public / Patient |
| `POST` | `/api/appointments` | `201 Created` | `400`, `401`, `403`, `404`, `409`, `422` | Patient |
| `GET` | `/api/my-appointments` | `200 OK` | `401`, `403` | Patient |
| `DELETE` | `/api/appointments/:id` | `204 No Content` | `401`, `403`, `404` | Patient (Chủ sở hữu) |
| `GET` | `/api/doctor/appointments` | `200 OK` | `401`, `403` | Doctor |
| `PUT` | `/api/doctor/appointments/:id` | `200 OK` | `401`, `403`, `404`, `422` | Doctor (Bác sĩ phụ trách) |
| `POST` | `/api/admin/doctors` | `201 Created` | `401`, `403`, `404`, `409`, `422` | Admin |
| `DELETE` | `/api/admin/doctors/:id` | `204 No Content` | `401`, `403`, `404` | Admin |

### Quy ước định dạng lỗi thống nhất (Error Contract)

Tất cả các lỗi nghiệp vụ và xác thực đều trả về cấu trúc JSON đồng nhất:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "The request body is invalid.",
    "details": {
      "email": "Invalid email format."
    }
  }
}
```

Phản hồi khi trùng lịch hẹn (Conflict - 409):
```json
{
  "error": {
    "code": "appointment_conflict",
    "message": "This doctor is already booked at this time.",
    "details": {}
  }
}
```

---

## 5. Xác thực & Phân quyền (Authentication & Authorization)

- **Password Hashing**: Mật khẩu được mã hóa an toàn bằng thuật toán Scrypt/PBKDF2 thông qua `werkzeug.security` (`generate_password_hash`, `check_password_hash`). Tuyệt đối không lưu plaintext password.
- **JWT (JSON Web Token)**: Sau khi đăng nhập thành công, máy chủ cấp JWT token với payload:
  ```json
  {
    "user_id": 1,
    "role": "PATIENT",
    "iat": 1727445600,
    "exp": 1727532000
  }
  ```
- **Phân biệt rõ ràng 401 và 403**:
  - `401 Unauthorized`: Chưa xác thực (thiếu token, token sai hoặc token hết hạn).
  - `403 Forbidden`: Đã xác thực nhưng không đủ quyền thực hiện hành động (sai vai trò hoặc không phải chủ sở hữu tài nguyên).

---

## 6. Cấu trúc Dự án Thực tế

Cấu trúc thư mục tuân thủ tuyệt đối đặc tả thiết kế (Page 5, 6, 14):

```
clinic-appointment-system/
├── .github/
│   └── workflows/
│       └── tests.yml             # GitHub Actions CI workflow
├── backend/
│   ├── app/
│   │   ├── __init__.py           # Flask app factory, CORS, error handlers
│   │   ├── auth.py               # JWT & Password hashing, auth/role decorators
│   │   ├── database.py           # Quản lý SQLite connection, transactions, FK
│   │   ├── models.py             # Relational query models (User, Doctor, Appointment, Specialty)
│   │   ├── routes.py             # Định nghĩa 10 REST endpoints
│   │   └── validation.py         # Kiểm tra tính hợp lệ dữ liệu đầu vào
│   ├── tests/
│   │   ├── conftest.py           # Fixtures cho pytest (client, database cô lập, tokens)
│   │   ├── test_appointments.py  # Tests booking, cancel, doctor dashboard, admin CRUD
│   │   ├── test_auth.py          # Tests register, login, jwt, error validation
│   │   └── test_doctors.py       # Tests doctor list, detail, 404
│   ├── .env                      # File cấu hình môi trường backend (ignored by git)
│   ├── pytest.ini                # Cấu hình runner cho pytest
│   ├── requirements.txt          # Danh sách thư viện Python
│   ├── run.py                    # File khởi động Flask dev server
│   └── seed.py                   # Script khởi tạo và nạp dữ liệu mẫu
├── database/
│   ├── schema.sql                # DDL khởi tạo 4 bảng chuẩn và indexes
│   └── seed.sql                  # Dữ liệu mẫu (Admin, Doctors, Patients, Appointments)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppointmentCard.jsx
│   │   │   ├── DoctorCard.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Quản lý trạng thái đăng nhập toàn cục
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── DoctorDetail.jsx
│   │   │   ├── Doctors.jsx
│   │   │   ├── Home.jsx              # Trang chủ hiện đại (Hero slider, Chuyên khoa, Bác sĩ tiêu biểu)
│   │   │   ├── Login.jsx
│   │   │   ├── MyAppointments.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js            # Tập trung toàn bộ fetch requests
│   │   ├── App.jsx               # Client-side routing & protected routes
│   │   ├── index.css             # Giao diện hiện đại, responsive
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js            # Proxy /api sang Flask backend :5000
├── .gitignore                    # Không commit .env, node_modules, cache, db
└── README.md                     # Tài liệu hướng dẫn chi tiết
```

---

## 7. Tài khoản Dùng thử (Demo Accounts)

Hệ thống đã có sẵn 3 tài khoản với 3 vai trò khác nhau (có thể đăng nhập nhanh trên giao diện):

| Vai trò | Email | Mật khẩu | Chức năng có thể thao tác |
|---|---|---|---|
| **Patient** | `patient.hung@gmail.com` | `Patient@123` | Xem bác sĩ, đặt lịch khám, xem lịch hẹn của mình, hủy lịch hẹn |
| **Doctor** | `doctor.an@clinic.com` | `Doctor@123` | Xem danh sách bệnh nhân đặt lịch với mình, cập nhật trạng thái (Xác nhận, Hoàn thành, Hủy) |
| **Admin** | `admin@clinic.com` | `Admin@123` | Xem danh sách bác sĩ, tạo bác sĩ mới kèm chuyên khoa, xóa bác sĩ |

---

## 8. Hướng dẫn Cài đặt & Khởi chạy

### Bước 1: Khởi tạo Backend & Database

1. Mở terminal tại thư mục `backend`:
   ```bash
   cd backend
   ```
2. Cài đặt các thư viện cần thiết:
   ```bash
   pip install -r requirements.txt
   ```
3. Khởi tạo Database và nạp dữ liệu mẫu ban đầu:
   ```bash
   python seed.py
   ```
4. Khởi động Flask Server:
   ```bash
   python run.py
   ```
   *Server sẽ chạy tại `http://localhost:5000` (Kiểm tra sức khỏe API: `http://localhost:5000/api/health`)*.

### Bước 2: Khởi tạo & Chạy Frontend

1. Mở một terminal khác tại thư mục `frontend`:
   ```bash
   cd frontend
   ```
2. Cài đặt dependencies qua npm:
   ```bash
   npm install
   ```
3. Khởi động Vite Development Server:
   ```bash
   npm run dev
   ```
   *Mở trình duyệt truy cập: `http://localhost:3000`*.

### Bước 3: Build Production Frontend

Để kiểm tra bản build tối ưu hóa cho môi trường triển khai thực tế:
```bash
cd frontend
npm run build
```
Kết quả build được tạo tại thư mục `frontend/dist/`.

---

## 8. Các Điểm Cải Tiến UI/UX & Nghiệp Vụ Y Tế Thực Tế

Bên cạnh 10 chức năng nền tảng của bản thiết kế, dự án đã được tối ưu hóa sâu về mặt trải nghiệm người dùng (Medical UI/UX) và quy chuẩn vận hành phòng khám:

1. **Bộ nhận diện thương hiệu & Hình ảnh bác sĩ chuyên nghiệp**:
   - Tích hợp kho ảnh chân dung bác sĩ chất lượng cao tại `frontend/public/images/doctors/`, quản lý tập trung qua tiện ích `frontend/src/utils/doctorImages.js`.
   - Logo thương hiệu phòng khám chuẩn sắc nét xuất hiện tại Navbar, Banner, Quy trình 4 bước và Thẻ lịch hẹn khám.
2. **Trang Lịch Hẹn Của Tôi (`MyAppointments.jsx` & `AppointmentCard.jsx`)**:
   - **Thanh lọc trạng thái (Smart Tabs)**: Lọc tức thì giữa *Tất cả*, *Chờ xác nhận*, *Đã xác nhận*, *Đã khám*, *Đã hủy* kèm số lượng đếm trực quan.
   - **Thẻ lịch khám y tế (`AppointmentCard`)**: Bổ sung ảnh đại diện bác sĩ, mã lịch hẹn tra cứu, dải thông tin giờ khám (`📅 Ngày khám`, `⏰ Giờ hẹn`, `Logo Địa điểm`), khung lý do khám có màu sắc biểu trưng theo từng trạng thái.
   - **Cụm thao tác hợp lý**: Nhóm nút *Xem chi tiết bác sĩ*, *Hủy lịch hẹn* (kèm hộp thoại xác nhận) và *Đặt lại lịch khám* được phân bổ công thái học, kèm ghi chú nhắc nhở bệnh nhân.
3. **Quy tắc nghiệp vụ y tế chặt chẽ**:
   - **Không tùy tiện hủy lịch**: Khi bác sĩ đã xác nhận ca khám (`CONFIRMED`), bác sĩ không thể tự ý hủy lịch để đảm bảo quyền lợi và lịch trình của người bệnh (Backend chặn HTTP 422).
   - **Quy trình khám đúng chuẩn**: Lịch hẹn bắt buộc phải qua bước Bác sĩ duyệt/xác nhận (`CONFIRMED`) trước khi có thể kết thúc và đánh dấu đã khám (`COMPLETED`).

---

## 9. Hướng dẫn Khởi chạy Dự án (Getting Started)

### Bước 1: Khởi tạo & Chạy Backend Flask

1. Di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```
2. Cài đặt các thư viện Python:
   ```bash
   pip install -r requirements.txt
   ```
3. Khởi tạo Database và nạp dữ liệu mẫu ban đầu:
   ```bash
   python seed.py
   ```
4. Khởi động Flask Server:
   ```bash
   python run.py
   ```
   *Server sẽ chạy tại `http://localhost:5000` (Kiểm tra sức khỏe API: `http://localhost:5000/api/health`)*.

### Bước 2: Khởi tạo & Chạy Frontend

1. Mở một terminal khác tại thư mục `frontend`:
   ```bash
   cd frontend
   ```
2. Cài đặt dependencies qua npm:
   ```bash
   npm install
   ```
3. Khởi động Vite Development Server:
   ```bash
   npm run dev
   ```
   *Mở trình duyệt truy cập: `http://localhost:3000`*.

### Bước 3: Build Production Frontend

Để kiểm tra bản build tối ưu hóa cho môi trường triển khai thực tế:
```bash
cd frontend
npm run build
```
Kết quả build được tạo tại thư mục `frontend/dist/`.

---

## 10. Kiểm thử Tự động với Pytest (Automated Testing)

Bộ kiểm thử bao gồm **34 test cases** tự động bao phủ trọn vẹn 10 Business Functions, các trường hợp thành công (happy path), các trường hợp dữ liệu sai (422), xung đột trạng thái (409), xác thực (401), phân quyền (403) và quy tắc nghiệp vụ y tế:

Để chạy toàn bộ test suite:
```bash
cd backend
pytest -v
```

### Các nhóm kiểm thử đại diện:
- **`test_auth.py` (11 tests)**:
  - `test_register_success`: Đăng ký thành công trả về 201 và role PATIENT.
  - `test_register_duplicate_email`: Đăng ký trùng email trả về 409 (`email_exists`).
  - `test_register_missing_password` & `test_register_invalid_email`: Trả về 422 (`validation_failed`).
  - `test_login_success_patient`, `doctor`, `admin`: Đăng nhập đúng cấp JWT token tương ứng.
  - `test_login_wrong_password` & `test_login_unknown_user`: Trả về 401 (`invalid_credentials`).
- **`test_doctors.py` (3 tests)**:
  - `test_get_doctors_list_success`: Lấy danh sách bác sĩ kèm chuyên khoa liên kết (JOIN).
  - `test_get_doctor_detail_success`: Lấy chi tiết bác sĩ theo ID (200).
  - `test_get_doctor_detail_not_found`: ID không tồn tại trả về 404 (`not_found`).
- **`test_appointments.py` (20 tests)**:
  - `test_book_appointment_success`: Bệnh nhân đặt lịch thành công (201).
  - `test_book_appointment_duplicate_slot_conflict`: Chặn đặt trùng ngày/giờ cùng bác sĩ, trả về 409 (`appointment_conflict`).
  - `test_book_appointment_unauthenticated` & `non_patient_blocked`: Phân biệt rõ 401 và 403.
  - `test_cancel_appointment_owner_success`: Bệnh nhân hủy lịch của mình trả về 204 No Content.
  - `test_cancel_foreign_appointment_forbidden`: Bệnh nhân khác cố hủy lịch người khác bị chặn với 403.
  - `test_doctor_view_appointments`: Bác sĩ chỉ xem danh sách lịch khám của chính mình (200).
  - `test_doctor_update_status_success`: Bác sĩ cập nhật trạng thái lịch hẹn của mình (200).
  - `test_doctor_confirm_then_complete_workflow`: Kiểm thử quy trình chuẩn từ xác nhận đến hoàn thành buổi khám.
  - `test_doctor_update_other_doctor_appointment_forbidden`: Bác sĩ không thể can thiệp lịch hẹn của bác sĩ khác (403).
  - `test_admin_add_and_delete_doctor`: Admin tạo tài khoản bác sĩ mới (201) và xóa bác sĩ (204).
  - `test_non_admin_blocked_from_admin_api`: Người dùng không phải Admin bị chặn với 403.

---

## 11. Bảng Kiểm Tra Hoàn Thiện (Checklist Trước Khi Nộp)

| Hạng mục | Yêu cầu thiết kế | Trạng thái |
|:---|:---|:---:|
| **10 business functions chạy end-to-end** | Hoạt động trơn tru qua UI React và Flask API | ✅ **Hoàn thành** |
| **REST API có method/path/status/body rõ ràng** | Chuẩn RESTful (GET/POST/PUT/DELETE, URL danh từ) | ✅ **Hoàn thành** |
| **Frontend có loading/error/data states** | Đầy đủ 3 trạng thái tại tất cả các trang | ✅ **Hoàn thành** |
| **Database có PK/FK/UNIQUE và seed data** | 4 bảng chuẩn, đầy đủ quan hệ, constraints và seed | ✅ **Hoàn thành** |
| **Book Appointment chống trùng lịch** | Kiểm tra slot tồn tại và phản hồi mã 409 Conflict | ✅ **Hoàn thành** |
| **JWT + password hashing + role authorization** | Werkzeug hash + PyJWT + RBAC Decorators | ✅ **Hoàn thành** |
| **401 và 403 được phân biệt** | 401 (chưa đăng nhập), 403 (sai quyền hoặc không phải chủ) | ✅ **Hoàn thành** |
| **pytest có success + error cases** | 34 tests bao quát 100% happy path và edge cases | ✅ **Hoàn thành** |
| **.env không commit lên Git** | Cấu hình `.gitignore` chặn triệt để `.env`, `*.db`, cache | ✅ **Hoàn thành** |
| **npm run build thành công** | Vite compile sạch không cảnh báo, tạo thư mục `dist/` | ✅ **Hoàn thành** |
| **CI chạy tests sau git push** | Thiết lập `.github/workflows/tests.yml` tự động chạy CI | ✅ **Hoàn thành** |
| **README mô tả kiến trúc + cách chạy** | Tài liệu đầy đủ, minh bạch, chi tiết và chuyên nghiệp | ✅ **Hoàn thành** |

