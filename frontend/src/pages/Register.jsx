import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.email.trim() || !formData.password) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      setSuccess('Đăng ký tài khoản thành công! Đang tự động đăng nhập...');
      
      // Auto login after registration
      setTimeout(async () => {
        try {
          await login(formData.email.trim(), formData.password);
          navigate('/doctors');
        } catch {
          navigate('/login');
        }
      }, 1200);
    } catch (err) {
      setError(err.message || 'Đăng ký không thành công. Email có thể đã được đăng ký.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="auth-header">
          <div className="auth-icon">📝</div>
          <h2>Đăng ký Bệnh nhân</h2>
          <p>Tạo tài khoản để đặt lịch khám nhanh chóng và tiện lợi</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="full_name">Họ và tên</label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              className="form-control"
              placeholder="Nguyễn Văn A"
              value={formData.full_name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="ten@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu (tối thiểu 6 ký tự)</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">Xác nhận mật khẩu</label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.confirm_password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
          </button>
        </form>

        <div className="auth-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
