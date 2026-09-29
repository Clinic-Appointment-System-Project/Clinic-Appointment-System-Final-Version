import React from 'react';
import { Link } from 'react-router-dom';
import { getDoctorImage } from '../utils/doctorImages';

const statusConfig = {
  PENDING: {
    label: 'Chá» xÃ¡c nháº­n',
    className: 'badge-pending',
    icon: 'â³',
    note: 'Lá»‹ch háº¹n Ä‘ang Ä‘Æ°á»£c nhÃ¢n viÃªn vÃ  bÃ¡c sÄ© tiáº¿p nháº­n xá»­ lÃ½.'
  },
  CONFIRMED: {
    label: 'ÄÃ£ xÃ¡c nháº­n',
    className: 'badge-confirmed',
    icon: 'âœ…',
    note: 'Lá»‹ch háº¹n Ä‘Ã£ Ä‘Æ°á»£c bÃ¡c sÄ© xÃ¡c nháº­n. Vui lÃ²ng Ä‘áº¿n trÆ°á»›c giá» háº¹n 10-15 phÃºt.'
  },
  COMPLETED: {
    label: 'ÄÃ£ khÃ¡m',
    className: 'badge-completed',
    icon: 'ðŸ©º',
    note: 'Buá»•i khÃ¡m Ä‘Ã£ hoÃ n thÃ nh. ChÃºc báº¡n luÃ´n máº¡nh khá»e vÃ  bÃ¬nh an!'
  },
  CANCELLED: {
    label: 'ÄÃ£ há»§y',
    className: 'badge-cancelled',
    icon: 'âœ•',
    note: 'Lá»‹ch háº¹n nÃ y Ä‘Ã£ Ä‘Æ°á»£c há»§y thÃ nh cÃ´ng.'
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  } catch (e) {
    // fallback
  }
  return dateStr;
};

const AppointmentCard = ({ appointment, onCancel, isCancelling = false }) => {
  const statusInfo = statusConfig[appointment.status] || {
    label: appointment.status,
    className: 'badge-pending',
    icon: 'â„¹ï¸',
    note: ''
  };

  const doctorPhoto = getDoctorImage(appointment.doctor_id);

  return (
    <div className={`card appointment-card status-${appointment.status.toLowerCase()}`}>
      <div className="appointment-card-inner">
        {/* Top: Doctor Profile + Status Badge */}
        <div className="appointment-header">
          <div className="appointment-doctor-info">
            {doctorPhoto ? (
              <img
                src={doctorPhoto}
                alt={appointment.doctor_name || 'BÃ¡c sÄ©'}
                className="appointment-doctor-avatar"
              />
            ) : (
              <div className="appointment-doctor-avatar-fallback">
                {appointment.doctor_name ? appointment.doctor_name.charAt(0).toUpperCase() : 'ðŸ‘¨â€âš•ï¸'}
              </div>
            )}
            <div className="appointment-doctor-meta">
              <div className="appointment-name-row">
                <h4 className="appointment-doctor-name">
                  {appointment.doctor_name || `BÃ¡c sÄ© #${appointment.doctor_id}`}
                </h4>
                <span className="badge badge-specialty">
                  {appointment.specialty_name || 'ChuyÃªn khoa'}
                </span>
              </div>
              <span className="appointment-code-label">
                MÃ£ lá»‹ch háº¹n: <strong>#{appointment.id}</strong>
              </span>
            </div>
          </div>

          <div className="appointment-status-badge-wrap">
            <span className={`badge ${statusInfo.className}`}>
              <span className="status-badge-icon">{statusInfo.icon}</span> {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Middle: Schedule Strip & Reason */}
        <div className="appointment-body">
          <div className="appointment-schedule-strip">
            <div className="schedule-item">
              <span className="schedule-icon">ðŸ“…</span>
              <div>
                <div className="schedule-label">NgÃ y khÃ¡m</div>
                <div className="schedule-val">{formatDate(appointment.date)}</div>
              </div>
            </div>
            <div className="schedule-divider" />
            <div className="schedule-item">
              <span className="schedule-icon">â°</span>
              <div>
                <div className="schedule-label">Giá» háº¹n</div>
                <div className="schedule-val">{appointment.time}</div>
              </div>
            </div>
            <div className="schedule-divider" />
            <div className="schedule-item">
              <img
                src="/images/logo.webp"
                alt="Logo PhÃ²ng khÃ¡m"
                className="schedule-logo-icon"
              />
              <div>
                <div className="schedule-label">Äá»‹a Ä‘iá»ƒm</div>
                <div className="schedule-val">PhÃ²ng khÃ¡m Äa khoa</div>
              </div>
            </div>
          </div>

          {appointment.reason && (
            <div className="appointment-reason-box">
              <span className="reason-label-tag">LÃ½ do khÃ¡m:</span>
              <p className="reason-text">{appointment.reason}</p>
            </div>
          )}
        </div>

        {/* Bottom: Note + Actions */}
        <div className="appointment-footer">
          <p className="appointment-note-text">
            {statusInfo.note}
          </p>

          <div className="appointment-btn-actions">
            {appointment.doctor_id && (
              <Link
                to={`/doctors/${appointment.doctor_id}`}
                className="btn btn-outline btn-sm"
              >
                Xem chi tiáº¿t bÃ¡c sÄ©
              </Link>
            )}

            {onCancel && (appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => onCancel(appointment.id)}
                disabled={isCancelling}
              >
                {isCancelling ? 'Äang há»§y...' : 'Há»§y lá»‹ch háº¹n'}
              </button>
            )}

            {(appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') && (
              <Link
                to={appointment.doctor_id ? `/book/${appointment.doctor_id}` : '/doctors'}
                className="btn btn-outline-primary btn-sm"
              >
                Äáº·t láº¡i lá»‹ch khÃ¡m
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
