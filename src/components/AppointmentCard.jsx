import React from 'react';
import { Link } from 'react-router-dom';
import { getDoctorImage } from '../utils/doctorImages';

const statusConfig = {
  PENDING: {
    label: 'Chờ xác nhận',
    className: 'badge-pending',
    icon: '⏳',
    note: 'Lịch hẹn đang được nhân viên và bác sĩ tiếp nhận xử lý.'
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    className: 'badge-confirmed',
    icon: '✅',
    note: 'Lịch hẹn đã được bác sĩ xác nhận. Vui lòng đến trước giờ hẹn 10-15 phút.'
  },
  COMPLETED: {
    label: 'Đã khám',
    className: 'badge-completed',
    icon: '🩺',
    note: 'Buổi khám đã hoàn thành. Chúc bạn luôn mạnh khỏe và bình an!'
  },
  CANCELLED: {
    label: 'Đã hủy',
    className: 'badge-cancelled',
    icon: '✕',
    note: 'Lịch hẹn này đã được hủy thành công.'
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

