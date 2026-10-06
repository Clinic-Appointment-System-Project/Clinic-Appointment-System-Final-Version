Clinic Appointment System - Group 9
Hệ thống đặt lịch khám bệnh đa chuyên khoa trực tuyến, kết nối liền mạch giữa **Bệnh nhân**, **Bác sĩ** và **Quản trị viên phòng khám**.
---
## 1. Giới thiệu Dự án
Dự án được xây dựng theo kiến trúc Decoupled hiện đại giữa Frontend Single-Page Application và Backend RESTful API:
* **Frontend:** React 18, Vite, React Router v6, Context API, CSS tùy biến responsive.
* **Backend:** Python Flask REST API, mô hình Application Factory & Blueprint chuẩn hóa.
* **Database:** SQLite đảm bảo toàn vẹn dữ liệu quan hệ (`PRAGMA foreign_keys = ON`, Check Constraints, Unique Index).
* **Bảo mật:** Stateless JWT Authentication, phân quyền theo vai trò (RBAC: `PATIENT`, `DOCTOR`, `ADMIN`), mã hóa mật khẩu bằng thuật toán `scrypt` an toàn.
* **Nghiệp vụ nổi bật:** Chống trùng lịch khám (Conflict Detection 409), chặn đặt lịch quá khứ (UTC+7), quy trình duyệt ca khám y tế chuẩn mực.
---
## 2. Danh Sách Tài Khoản Dùng Thử (Demo Accounts)
Hệ thống đã có sẵn 3 tài khoản đại diện cho 3 vai trò khác nhau trong cơ sở dữ liệu:
| Vai trò | Email đăng nhập | Mật khẩu | Quyền hạn & Chức năng thao tác |
|---|---|---|---|
| **Bệnh nhân**<br>*(Patient)* | `patient.hung@gmail.com` | `Patient@123` | • Xem danh sách & chi tiết bác sĩ theo chuyên khoa.<br>• Đặt lịch hẹn khám bệnh theo khung giờ.<br>• Xem, chỉnh sửa thông tin hoặc hủy lịch hẹn của mình. |
| **Bác sĩ**<br>*(Doctor)* | `doctor.an@clinic.com` | `Doctor@123` | • Xem danh sách bệnh nhân đã đặt lịch với mình.<br>• Xác nhận lịch khám (`CONFIRMED`).<br>• Đánh dấu hoàn thành buổi khám (`COMPLETED`). |
| **Quản trị viên**<br>*(Admin)* | `admin@clinic.com` | `Admin@12` | • Bảng điều khiển thống kê tổng quan phòng khám.<br>• Thêm mới bác sĩ kèm chuyên khoa hoặc xóa bác sĩ.<br>• Theo dõi toàn bộ lịch hẹn và danh sách bệnh nhân. |



