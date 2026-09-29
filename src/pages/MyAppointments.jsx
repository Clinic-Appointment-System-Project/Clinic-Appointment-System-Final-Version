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
      setError(err.message || 'KhÃ´ng thá»ƒ táº£i danh sÃ¡ch lá»‹ch háº¹n cá»§a báº¡n.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    const confirmCancel = window.confirm('Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n há»§y lá»‹ch háº¹n khÃ¡m nÃ y khÃ´ng?');
    if (!confirmCancel) return;

    setCancellingId(id);
    setActionMessage({ type: '', text: '' });

    try {
      await api.cancelAppointment(id);
      setActionMessage({ type: 'success', text: 'Há»§y lá»‹ch háº¹n thÃ nh cÃ´ng (MÃ£ HTTP 204 No Content).' });
      // Remove from list
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.message || 'Há»§y lá»‹ch háº¹n khÃ´ng thÃ nh cÃ´ng.'
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
          <h2>Lá»‹ch Háº¹n Cá»§a TÃ´i</h2>
          <p>Theo dÃµi tráº¡ng thÃ¡i vÃ  quáº£n lÃ½ cÃ¡c lá»‹ch háº¹n Ä‘Ã£ Ä‘Äƒng kÃ½</p>
        </div>
        <Link to="/doctors" className="btn btn-primary">
          + Äáº·t lá»‹ch khÃ¡m má»›i
        </Link>
      </div>

      {actionMessage.text && (
        <div className={`alert alert-${actionMessage.type}`}>
          {actionMessage.text}
        </div>
      )}

      {loading && <Loading message="Äang táº£i danh sÃ¡ch lá»‹ch háº¹n..." />}

      {error && !loading && (
        <div className="alert alert-danger">
          <p>{error}</p>
          <button className="btn btn-outline btn-sm" onClick={loadAppointments} style={{ marginTop: '0.5rem' }}>
            Thá»­ láº¡i
          </button>
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <div className="empty-state card">
          <div className="empty-icon">ðŸ“…</div>
          <h3>Báº¡n chÆ°a cÃ³ lá»‹ch háº¹n khÃ¡m nÃ o</h3>
          <p>HÃ£y chá»n bÃ¡c sÄ© vÃ  Ä‘áº·t lá»‹ch khÃ¡m phÃ¹ há»£p vá»›i thá»i gian biá»ƒu cá»§a báº¡n.</p>
          <Link to="/doctors" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            KhÃ¡m phÃ¡ danh sÃ¡ch bÃ¡c sÄ©
          </Link>
        </div>
      )}

      {!loading && !error && appointments.length > 0 && (
        <>
          {/* Bá»™ lá»c tráº¡ng thÃ¡i */}
          <div className="appointment-filter-tabs">
            <button
              type="button"
              className={`appointment-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveTab('ALL')}
            >
              Táº¥t cáº£ <span className="appointment-tab-count">{counts.ALL}</span>
            </button>
            <button
              type="button"
              className={`appointment-tab-btn ${activeTab === 'PENDING' ? 'active' : ''}`}
              onClick={() => setActiveTab('PENDING')}
            >
              Chá» xÃ¡c nháº­n <span className="appointment-tab-count">{counts.PENDING}</span>
            </button>
            <button
              type="button"
              className={`appointment-tab-btn ${activeTab === 'CONFIRMED' ? 'active' : ''}`}
              onClick={() => setActiveTab('CONFIRMED')}
            >
              ÄÃ£ xÃ¡c nháº­n <span className="appointment-tab-count">{counts.CONFIRMED}</span>
            </button>
            <button
              type="button"
              className={`appointment-tab-btn ${activeTab === 'COMPLETED' ? 'active' : ''}`}
              onClick={() => setActiveTab('COMPLETED')}
            >
              ÄÃ£ khÃ¡m <span className="appointment-tab-count">{counts.COMPLETED}</span>
            </button>
            <button
              type="button"
              className={`appointment-tab-btn ${activeTab === 'CANCELLED' ? 'active' : ''}`}
              onClick={() => setActiveTab('CANCELLED')}
            >
              ÄÃ£ há»§y <span className="appointment-tab-count">{counts.CANCELLED}</span>
            </button>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="empty-state card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>ðŸ”</div>
              <h4>KhÃ´ng cÃ³ lá»‹ch háº¹n nÃ o á»Ÿ tráº¡ng thÃ¡i nÃ y</h4>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Báº¡n cÃ³ thá»ƒ chá»n tab khÃ¡c hoáº·c nháº¥n nÃºt dÆ°á»›i Ä‘Ã¢y Ä‘á»ƒ xem táº¥t cáº£ lá»‹ch háº¹n.
              </p>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setActiveTab('ALL')}
                style={{ marginTop: '1rem' }}
              >
                Xem táº¥t cáº£ lá»‹ch háº¹n ({counts.ALL})
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
