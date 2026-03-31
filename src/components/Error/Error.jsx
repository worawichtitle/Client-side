import React from 'react';
import { Link } from 'react-router-dom';
import './Error.css';

function Error({ message = "เกิดข้อผิดพลาดในการดึงข้อมูล", backLink = "/", backText = "กลับไปหน้าหลัก" }) {
  return (
    <div className="error-container">
      <div className="error-icon-wrapper">
        <i className="fa-solid fa-triangle-exclamation"></i>
      </div>
      <h2 className="error-title">ขออภัย! เกิดข้อผิดพลาด</h2>
      <p className="error-message">{message}</p>
      
      <Link to={backLink} className="error-back-btn">
        <i className="fa-solid fa-arrow-left-long"></i> {backText}
      </Link>
    </div>
  );
}

export default Error;