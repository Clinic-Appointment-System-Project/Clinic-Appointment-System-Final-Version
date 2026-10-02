================================================================================
                      CLINIC APPOINTMENT SYSTEM - GROUP 9
================================================================================
Hệ thống đặt lịch khám bệnh đa chuyên khoa trực tuyến, kết nối liền mạch giữa 
Bệnh nhân, Bác sĩ và Quản trị viên phòng khám.
--------------------------------------------------------------------------------

1. GIỚI THIỆU DỰ ÁN
-------------------
Dự án được xây dựng theo kiến trúc Decoupled hiện đại giữa Frontend Single-Page 
Application và Backend RESTful API:

- Frontend: React 18, Vite, React Router v6, Context API, CSS tùy biến responsive.
- Backend: Python Flask REST API, mô hình Application Factory & Blueprint chuẩn hóa.
- Database: SQLite đảm bảo toàn vẹn dữ liệu quan hệ (PRAGMA foreign_keys = ON, 
  Check Constraints, Unique Index).
- Bảo mật: Stateless JWT Authentication, phân quyền theo vai trò (RBAC: PATIENT, 
  DOCTOR, ADMIN), mã hóa mật khẩu bằng thuật toán scrypt an toàn.
- Nghiệp vụ nổi bật: Chống trùng lịch khám (Conflict Detection 409), chặn đặt 
  lịch quá khứ (UTC+7), quy trình duyệt ca khám y tế chuẩn mực.

--------------------------------------------------------------------------------
2. DANH SÁCH TÀI KHOẢN DÙNG THỬ (DEMO ACCOUNTS)
--------------------------------------------------------------------------------
Hệ thống đã có sẵn 3 tài khoản đại diện cho 3 vai trò khác nhau trong cơ sở dữ liệu:

[1] BỆNH NHÂN (Patient)
    - Email đăng nhập : patient.hung@gmail.com
    - Mật khẩu        : Patient@123
    - Quyền hạn       : Xem danh sách & chi tiết bác sĩ theo chuyên khoa;
                        Đặt lịch hẹn khám bệnh theo khung giờ;
                        Xem, chỉnh sửa thông tin hoặc hủy lịch hẹn của mình.

[2] BÁC SĨ (Doctor)
    - Email đăng nhập : doctor.an@clinic.com
    - Mật khẩu        : Doctor@123
    - Quyền hạn       : Xem danh sách bệnh nhân đã đặt lịch với mình;
                        Xác nhận lịch khám (CONFIRMED);
                        Đánh dấu hoàn thành buổi khám (COMPLETED).

[3] QUẢN TRỊ VIÊN (Admin)
    - Email đăng nhập : admin@clinic.com
    - Mật khẩu        : Admin@123
    - Quyền hạn       : Bảng điều khiển thống kê tổng quan phòng khám;
                        Thêm mới bác sĩ kèm chuyên khoa hoặc xóa bác sĩ;
                        Theo dõi toàn bộ lịch hẹn và danh sách bệnh nhân.

--------------------------------------------------------------------------------
3. HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY
--------------------------------------------------------------------------------

Bước 1: Khởi tạo Backend & Database
-----------------------------------
1. Mở terminal tại thư mục backend:
   cd backend

2. Cài đặt các thư viện cần thiết:
   pip install -r requirements.txt
   (hoặc: pip install Flask flask-cors PyJWT python-dotenv Werkzeug pytest)

3. Khởi tạo Database và nạp dữ liệu mẫu ban đầu:
   python seed.py

4. Khởi động Flask Server:
   python run.py

   * Server sẽ chạy tại: http://localhost:5000
   * Kiểm tra sức khỏe API: http://localhost:5000/api/health


Bước 2: Khởi tạo & Chạy Frontend
--------------------------------
1. Mở một terminal khác tại thư mục frontend:
   cd frontend

2. Cài đặt dependencies qua npm:
   npm install

3. Khởi động Vite Development Server:
   npm run dev

   * Mở trình duyệt truy cập: http://localhost:3000


Bước 3: Build Production Frontend (Tùy chọn)
-------------------------------------------
Để kiểm tra bản build tối ưu hóa cho môi trường triển khai thực tế:
   cd frontend
   npm run build

Kết quả build được tạo tại thư mục frontend/dist/.
================================================================================