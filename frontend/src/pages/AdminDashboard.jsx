import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Loading from '../components/Loading';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deletingId, setDeletingId] = useState(null);

  // Form states for creating a doctor
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    specialty_id: '',
    phone: '',
    experience: 1,
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [docData, specData] = await Promise.all([
        api.getDoctors(),
        api.getSpecialties().catch(() => [])
      ]);
      setDoctors(docData || []);
      setSpecialties(specData || []);
      if (specData && specData.length > 0 && !formData.specialty_id) {
        setFormData((prev) => ({ ...prev, specialty_id: specData[0].id }));
      }
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu quản trị.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (formError) setFormError('');
  };

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.email.trim() || !formData.password || !formData.specialty_id) {
      setFormError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    setMessage({ type: '', text: '' });

    try {
      const res = await api.createDoctor({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        specialty_id: parseInt(formData.specialty_id, 10),
        phone: formData.phone.trim(),
        experience: parseInt(formData.experience || 0, 10),
        description: formData.description.trim()
      });

      setMessage({
        type: 'success',
        text: `Đã tạo tài khoản và hồ sơ cho ${formData.full_name} thành công!`
      });

      // Reset form
      setFormData({
        full_name: '',
        email: '',
        password: '',
        specialty_id: specialties[0]?.id || '',
        phone: '',
        experience: 1,
        description: ''
      });
      setShowAddForm(false);

      // Refresh list
      loadData();
    } catch (err) {
      if (err.status === 409 || err.code === 'email_exists') {
        setFormError('Email này đã được sử dụng trong hệ thống.');
      } else {
        setFormError(err.message || 'Thêm bác sĩ không thành công.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDoctor = async (doctor) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa bác sĩ "${doctor.full_name}" không? Thao tác này sẽ xóa hồ sơ và tài khoản tương ứng.`);
    if (!confirmed) return;

    setDeletingId(doctor.id);
    setMessage({ type: '', text: '' });

    try {
      await api.deleteDoctor(doctor.id);
      setMessage({
        type: 'success',
        text: `Đã xóa bác sĩ "${doctor.full_name}" thành công (Mã HTTP 204 No Content).`
      });
      setDoctors((prev) => prev.filter((d) => d.id !== doctor.id));
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.message || 'Xóa bác sĩ không thành công.'
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header flex-between">
        <div>
          <h2>🛠️ Quản Trị Hệ Thống - Danh Sách Bác Sĩ</h2>
          <p>Thêm mới bác sĩ, phân chuyên khoa và quản lý nhân sự y tế</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Đóng biểu mẫu' : '+ Thêm Bác sĩ Mới'}
        </button>
      </div>

      {/* KPI Stats */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <div className="stat-card-title">Tổng số Bác sĩ</div>
          <div className="stat-card-val text-primary">{doctors.length}</div>
          <div className="stat-card-sub">Nhân sự y tế trong hệ thống</div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-card-title">Chuyên khoa</div>
          <div className="stat-card-val text-info">{specialties.length}</div>
          <div className="stat-card-sub">Khoa điều trị được hỗ trợ</div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-card-title">Đang tiếp nhận khám</div>
          <div className="stat-card-val text-success">{doctors.filter((d) => d.available).length}</div>
          <div className="stat-card-sub">Bác sĩ sẵn sàng nhận lịch</div>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {showAddForm && (
        <div className="card form-card" style={{ marginBottom: '2rem' }}>
          <h3>Thêm Bác Sĩ Mới Vào Hệ Thống</h3>
          {formError && <div className="alert alert-danger">{formError}</div>}

          <form onSubmit={handleCreateDoctor}>
            <div className="form-row">
              <div className="form-group col">
                <label htmlFor="full_name">Họ và tên bác sĩ (*):</label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  className="form-control"
                  placeholder="BS. CKII Nguyễn Văn B"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group col">
                <label htmlFor="email">Email đăng nhập (*):</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="doctor.b@clinic.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col">
                <label htmlFor="password">Mật khẩu khởi tạo (*):</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Tối thiểu 6 ký tự"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group col">
                <label htmlFor="specialty_id">Chuyên khoa (*):</label>
                <select
                  id="specialty_id"
                  name="specialty_id"
                  className="form-control"
                  value={formData.specialty_id}
                  onChange={handleInputChange}
                  required
                >
                  {specialties.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col">
                <label htmlFor="phone">Số điện thoại liên hệ:</label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className="form-control"
                  placeholder="0901234567"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group col">
                <label htmlFor="experience">Số năm kinh nghiệm:</label>
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  className="form-control"
                  value={formData.experience}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Mô tả tóm tắt năng lực / chuyên môn:</label>
              <textarea
                id="description"
                name="description"
                rows="2"
                className="form-control"
                placeholder="Giới thiệu bằng cấp, lĩnh vực chuyên sâu..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowAddForm(false)}
                disabled={submitting}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Đang lưu thông tin...' : 'Tạo Bác Sĩ'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <Loading message="Đang tải dữ liệu quản trị..." />}

      {error && !loading && (
        <div className="alert alert-danger">
          <p>{error}</p>
          <button className="btn btn-outline btn-sm" onClick={loadData} style={{ marginTop: '0.5rem' }}>
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="card table-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Bác sĩ</th>
                  <th>Chuyên khoa</th>
                  <th>Email</th>
                  <th>Điện thoại</th>
                  <th>Kinh nghiệm</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.id}>
                    <td>#{doc.id}</td>
                    <td><strong>{doc.full_name}</strong></td>
                    <td>
                      <span className="badge badge-specialty">{doc.specialty_name}</span>
                    </td>
                    <td>{doc.email}</td>
                    <td>{doc.phone || '—'}</td>
                    <td>{doc.experience || 0} năm</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger-outline"
                        onClick={() => handleDeleteDoctor(doc)}
                        disabled={deletingId === doc.id}
                      >
                        {deletingId === doc.id ? 'Đang xóa...' : 'Xóa'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
