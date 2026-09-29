import React from 'react';

const Loading = ({ message = 'Đang tải dữ liệu...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default Loading;
