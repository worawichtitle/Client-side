import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        
        <div className="nav-logo">
          <Link to="/">
            <i className="fa-solid fa-wind logo-icon"></i> 
            PMap <span className="logo-highlight">2.5</span>
          </Link>
        </div>

        <ul className="nav-menu">
          <li>
            <NavLink to="/map" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              หน้าแรก
            </NavLink>
          </li>
          <li>
            <NavLink to="/list" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              รายการ
            </NavLink>
          </li>
          <li>
            <NavLink to="/detail" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              ข้อมูลคุณภาพอากาศ
            </NavLink>
          </li>
        </ul>

        <div className="nav-spacer"></div>
      </div>
    </nav>
  );
};

export default Navbar;