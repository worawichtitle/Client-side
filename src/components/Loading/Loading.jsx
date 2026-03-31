import React from 'react';
import './Loading.css';

function Loading({ message = "กำลังโหลดข้อมูล..." }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
}

export default Loading;