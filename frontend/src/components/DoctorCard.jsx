import React from 'react';
import { Link } from 'react-router-dom';
import { getDoctorImage } from '../utils/doctorImages';

const DoctorCard = ({ doctor }) => {
  const photo = getDoctorImage(doctor.id);

  return (
    <div className="card doctor-card">
      <div className="doctor-card-header">
        {photo ? (
          <img src={photo} alt={doctor.full_name} className="doctor-thumb-photo" />
        ) : (
          <div className="avatar-circle">
            {doctor.full_name ? doctor.full_name.charAt(0).toUpperCase() : 'B'}
          </div>
        )}
        <div className="doctor-card-title-group">
          <h3 className="doctor-name">{doctor.full_name}</h3>
          <span className="badge badge-specialty">{doctor.specialty_name || 'Chuyên khoa'}</span>
        </div>
      </div>

      <div className="doctor-card-body">
        <div className="doctor-info-item">
          <strong>Kinh nghiệm:</strong> {doctor.experience || 0} năm
        </div>
        {doctor.phone && (
          <div className="doctor-info-item">
            <strong>Điện thoại:</strong> {doctor.phone}
          </div>
        )}
        <p className="doctor-desc">
          {doctor.description || 'Bác sĩ chuyên khoa giàu kinh nghiệm và tận tâm với bệnh nhân.'}
        </p>
      </div>

      <div className="doctor-card-actions">
        <Link to={`/doctors/${doctor.id}`} className="btn btn-outline">
          Xem chi tiết
        </Link>
        <Link to={`/book/${doctor.id}`} className="btn btn-primary">
          Đặt lịch khám
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
