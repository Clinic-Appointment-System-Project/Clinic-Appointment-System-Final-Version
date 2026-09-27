-- Clinic Appointment System - Seed Data
-- 1. Chuyên khoa (Specialties) - Đầy đủ 6 chuyên khoa
INSERT INTO specialties (id, name, description) VALUES
(1, 'Nội khoa', 'Khám và điều trị các bệnh lý nội khoa tổng quát, tim mạch, tiêu hóa, hô hấp và bệnh mãn tính.'),
(2, 'Nhi khoa', 'Chăm sóc sức khỏe toàn diện, khám và tiêm chủng cho trẻ sơ sinh, trẻ nhỏ và trẻ vị thành niên.'),
(3, 'Da liễu', 'Khám, chẩn đoán và điều trị bệnh lý về da, tóc, móng và chăm sóc thẩm mỹ da chuyên sâu.'),
(4, 'Tim mạch', 'Chẩn đoán và điều trị các bệnh tim mạch chuyên sâu, tăng huyết áp, suy tim, mạch vành.'),
(5, 'Tai Mũi Họng', 'Nội soi chẩn đoán và điều trị các bệnh lý tai mũi họng cho người lớn và trẻ nhỏ.'),
(6, 'Mắt', 'Đo khúc xạ, khám và điều trị tật khúc xạ, viêm nhiễm và các bệnh lý về mắt.');

-- 2. Tài khoản người dùng (Users)
-- Mật khẩu mặc định:
-- Admin: Admin@123
-- Doctor: Doctor@123
-- Patient: Patient@123
INSERT INTO users (id, full_name, email, password_hash, role) VALUES
(1, 'Quản Trị Viên Hệ Thống', 'admin@clinic.com', 'scrypt:32768:8:1$rhqvpBR6MSmi9Qnk$e7bab0e4a43a5c96d7aade309ca8441b8dee5fac3254032b85053c7bc9040d24da4b09330c3629ef86fe8708386decf0c28964c5b9074a209296b061e636f383', 'ADMIN'),
(2, 'BS. CKII Nguyễn Văn An', 'doctor.an@clinic.com', 'scrypt:32768:8:1$O9mGmNRDAm5h38JR$15040a08309d245d63e1fdeb238b665501929351d742e11e21bebdc58289e90bc51c6a9006b768dffd3e41930eca712ec936d2d5ad223af0edd4e3ff4418c677', 'DOCTOR'),
(3, 'ThS.BS Đặng Thị Mai', 'doctor.mai@clinic.com', 'scrypt:32768:8:1$O9mGmNRDAm5h38JR$15040a08309d245d63e1fdeb238b665501929351d742e11e21bebdc58289e90bc51c6a9006b768dffd3e41930eca712ec936d2d5ad223af0edd4e3ff4418c677', 'DOCTOR'),
(4, 'ThS.BS Lê Minh Cường', 'doctor.cuong@clinic.com', 'scrypt:32768:8:1$O9mGmNRDAm5h38JR$15040a08309d245d63e1fdeb238b665501929351d742e11e21bebdc58289e90bc51c6a9006b768dffd3e41930eca712ec936d2d5ad223af0edd4e3ff4418c677', 'DOCTOR'),
(5, 'PGS.TS Phạm Thu Hà', 'doctor.ha@clinic.com', 'scrypt:32768:8:1$O9mGmNRDAm5h38JR$15040a08309d245d63e1fdeb238b665501929351d742e11e21bebdc58289e90bc51c6a9006b768dffd3e41930eca712ec936d2d5ad223af0edd4e3ff4418c677', 'DOCTOR'),
(6, 'BS. CKI Hoàng Văn Đức', 'doctor.duc@clinic.com', 'scrypt:32768:8:1$O9mGmNRDAm5h38JR$15040a08309d245d63e1fdeb238b665501929351d742e11e21bebdc58289e90bc51c6a9006b768dffd3e41930eca712ec936d2d5ad223af0edd4e3ff4418c677', 'DOCTOR'),
(7, 'BS. CKI Vũ Thị Lan', 'doctor.lan@clinic.com', 'scrypt:32768:8:1$O9mGmNRDAm5h38JR$15040a08309d245d63e1fdeb238b665501929351d742e11e21bebdc58289e90bc51c6a9006b768dffd3e41930eca712ec936d2d5ad223af0edd4e3ff4418c677', 'DOCTOR'),
(8, 'Nguyễn Văn Hùng', 'patient.hung@gmail.com', 'scrypt:32768:8:1$0DCdd5v8TXysAGGu$d2f90179d6f4517d3f57e917219d6308e3a583ca42a57ae691e060af6e885a0363731911697f0d06bc3d71e57f78255220f1c8286921ce323a2c10351eab833d', 'PATIENT'),
(9, 'Trần Thị Lan', 'patient.lan@gmail.com', 'scrypt:32768:8:1$0DCdd5v8TXysAGGu$d2f90179d6f4517d3f57e917219d6308e3a583ca42a57ae691e060af6e885a0363731911697f0d06bc3d71e57f78255220f1c8286921ce323a2c10351eab833d', 'PATIENT');

-- 3. Hồ sơ Bác sĩ (Doctors) - Mỗi chuyên khoa 1 bác sĩ
INSERT INTO doctors (id, user_id, specialty_id, phone, experience, description, available) VALUES
(1, 2, 1, '0901234567', 12, 'Chuyên gia đầu ngành về điều trị các bệnh mãn tính, tầm soát sức khỏe toàn diện và tư vấn phác đồ điều trị cá nhân hóa.', 1),
(2, 3, 2, '0907654321', 7, 'Tận tâm, thấu hiểu tâm lý trẻ nhỏ, chuyên sâu về chăm sóc sơ sinh, dinh dưỡng và đồng hành cùng sự phát triển của bé.', 1),
(3, 4, 3, '0912345678', 10, 'Chuyên sâu điều trị mụn trứng cá chuẩn y khoa, phục hồi màng bảo vệ da và ứng dụng công nghệ thẩm mỹ da hiện đại.', 1),
(4, 5, 4, '0934567890', 15, 'Chuyên gia Tim mạch đầu ngành về tầm soát cao huyết áp, bệnh mạch vành, suy tim và can thiệp điều trị tiên tiến.', 1),
(5, 6, 5, '0945678901', 9, 'Nội soi kỹ thuật cao không đau, điều trị dứt điểm viêm xoang, viêm họng mãn tính, viêm amidan và các bệnh lý thanh quản.', 1),
(6, 7, 6, '0956789012', 11, 'Khám đo khúc xạ chuyên sâu, kiểm soát cận thị học đường, điều trị nhược thị và các bệnh lý giác mạc bảo vệ thị lực.', 1);

-- 4. Lịch hẹn khám (Appointments)
INSERT INTO appointments (id, patient_id, doctor_id, date, time, reason, status) VALUES
(1, 8, 1, '2026-10-01', '09:00', 'Khám sức khỏe tổng quát và đau dạ dày nhẹ', 'CONFIRMED'),
(2, 9, 2, '2026-10-02', '10:00', 'Tư vấn tiêm chủng và theo dõi thể trạng cho bé', 'PENDING'),
(3, 8, 4, '2026-10-05', '14:30', 'Tầm soát huyết áp và đo điện tim định kỳ', 'PENDING');
