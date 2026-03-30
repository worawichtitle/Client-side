// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ display: 'flex', gap: '20px', padding: '1rem', background: '#eee' }}>
      <Link to="/">แผนที่</Link>
      <Link to="/list">รายการ</Link>
      <Link to="/advice">คำแนะนำ</Link>
    </nav>
  );
};

export default Navbar;