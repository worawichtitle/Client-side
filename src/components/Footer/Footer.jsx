import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          
          <div className="footer-brand">
            <h3>
              <i className="fa-solid fa-wind logo-icon"></i> PMap <span className="logo-highlight">2.5</span>
            </h3>
            <p>
              แอปพลิเคชันรายงานสถานการณ์คุณภาพอากาศและฝุ่น PM2.5 แบบเรียลไทม์ 
              เพื่อเฝ้าระวังสุขภาพของคุณ
            </p>
          </div>

          <div className="footer-links">
            <h4>เมนูหลัก</h4>
            <ul>
              <li><Link to="/map">หน้าแรก (แผนที่)</Link></li>
              <li><Link to="/list">รายชื่อสถานีทั้งหมด</Link></li>
              <li><Link to="/detail">รายละเอียดสถานี</Link></li>
            </ul>
          </div>

          <div className="footer-info">
            <h4>ข้อมูลอ้างอิง</h4>
            <ul>
              <li><a href="https://aqicn.org/" target="_blank" rel="noreferrer">World Air Quality Index (WAQI)</a></li>
              <li><a href="https://aqicn.org/scale/th/" target="_blank" rel="noreferrer">เกณฑ์คุณภาพอากาศมาตรฐาน US-EPA 2016</a></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} PMap 2.5 Project. All rights reserved.</p>
          <div className="footer-social">
            <a href="https://github.com/worawichtitle/Client-side" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;