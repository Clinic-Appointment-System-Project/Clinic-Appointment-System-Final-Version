import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import AppointmentCard from '../components/AppointmentCard';
import Loading from '../components/Loading';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getMyAppointments();
      setAppointments(data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách lịch hẹn của bạn.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    const confirmCancel = window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn khám này không?');
    if (!confirmCancel) return;

    setCancellingId(id);
    setActionMessage({ type: '', text: '' });

    try {
      await api.cancelAppointment(id);
      setActionMessage({ type: 'success', text: 'Hủy lịch hẹn thành công (Mã HTTP 204 No Content).' });
      // Remove from list
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.message || 'Hủy lịch hẹn không thành công.'
      });
    } finally {
      setCancellingId(null);
    }
  };

  const counts = {
    ALL: appointments.length,
    PENDING: appointments.filter((a) => a.status === 'PENDING').length,
    CONFIRMED: appointments.filter((a) => a.status === 'CONFIRMED').length,
    COMPLETED: appointments.filter((a) => a.status === 'COMPLETED').length,
    CANCELLED: appointments.filter((a) => a.status === 'CANCELLED').length
  };

  const filteredAppointments = activeTab === 'ALL'
    ? appointments
    : appointments.filter((a) => a.status === activeTab);

  return (
    <div className="page-container">
      <div className="page-header flex-between">
        <div>
          <h2>Lịch Hẹn Của Tôi</h2>
          <p>Theo dõi trạng thái và quản lý các lịch hẹn đã đăng ký</p>
        </div>
        <Link to="/doctors" className="btn btn-primary">
          + Đặt lịch khám mới
        </Link>
      </div>

      {actionMessage.text && (
        <div className={`alert alert-${actionMessage.type}`}>
          {actionMessage.text}
        </div>
      )}

      {loading && <Loading message="Đang tải danh sách lịch hẹn..." />}

      {error && !loading && (
        <div className="alert alert-danger">
          <p>{error}</p>
          <button className="btn btn-outline btn-sm" onClick={loadAppointments} style={{ marginTop: '0.5rem' }}>
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <div className="empty-state card">
          <div className="empty-icon">📅</div>
          <h3>Bạn chưa có lịch hẹn khám nào</h3>
          <p>Hãy chọn bác sĩ và đặt lịch khám phù hợp với thời gian biểu của bạn.</p>
          <Link to="/doctors" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Khám phá danh sách bác sĩ
          </Link>
        </div>
      )}

      {!loading && !error && appointments.length > 0 && (
        <>
          {/* Bộ lọc trạng thái */}
          <div className="appointment-filter-tabs">
            <button
              type="button"
              className={`appointment-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveTab('ALL')}
            >
              Tất cả <span className="appointment-tab-count">{counts.ALL}</span>
            </button>
            <button
              type="button"
              className={`appointment-tab-btn ${activeTab === 'PENDING' ? 'active' : ''}`}
              onClick={() => setActiveTab('PENDING')}
            >
              Chờ xác nhận <span className="appointment-tab-count">{counts.PENDING}</span>
            </button>
            <button
              type="button"
              className={`appointment-tab-btn ${activeTab === 'CONFIRMED' ? 'active' : ''}`}
              onClick={() => setActiveTab('CONFIRMED')}
            >
              Đã xác nhận <span className="appointment-tab-count">{counts.CONFIRMED}</span>
            </button>
            <button
              type="button"
              className={`appointment-tab-btn ${activeTab === 'COMPLETED' ? 'active' : ''}`}
              onClick={() => setActiveTab('COMPLETED')}
            >
              Đã khám <span className="appointment-tab-count">{counts.COMPLETED}</span>
            </button>
            <button
              type="button"
              className={`appointment-tab-btn ${activeTab === 'CANCELLED' ? 'active' : ''}`}
              onClick={() => setActiveTab('CANCELLED')}
            >
              Đã hủy <span className="appointment-tab-count">{counts.CANCELLED}</span>
            </button>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="empty-state card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
              <h4>Không có lịch hẹn nào ở trạng thái này</h4>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Bạn có thể chọn tab khác hoặc nhấn nút dưới đây để xem tất cả lịch hẹn.
              </p>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setActiveTab('ALL')}
                style={{ marginTop: '1rem' }}
              >
                Xem tất cả lịch hẹn ({counts.ALL})
              </button>
            </div>
          ) : (
            <div className="appointments-list">
              {filteredAppointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  onCancel={handleCancelAppointment}
                  isCancelling={cancellingId === appt.id}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyAppointments;
