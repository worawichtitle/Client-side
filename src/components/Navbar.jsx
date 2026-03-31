// src/components/Navbar.jsx
import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">PMap 2.5</Link>
        </div>
        <ul className="nav-menu">
          <li><Link to="/map">หน้าแรก</Link></li>
          <li><Link to="/list">รายการ</Link></li>
          <li><Link to="/detail">ข้อมูลคุณภาพอากาศ</Link></li>
        </ul>
        <div className="nav-spacer"></div>
      </div>
    </nav>
  );
};

export default Navbar;