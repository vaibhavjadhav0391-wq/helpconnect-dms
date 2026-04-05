import React from 'react'
import Logo from '../assets/images/logo.png';
import '../assets/CSS/Footer.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Footer = () => {
  const loggedIn = useSelector(state => state.roleState.loggedIn);
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo-text">
            <img src={Logo} alt="Logo" />
          </Link>
          <p className="footer-tagline">Prepared communities save lives. Stay informed, stay connected.</p>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/incidents">Incidents</Link>
            <Link to="/communities">Communities</Link>
            <Link to="/medicals">Hospitals & Shelters</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <Link to="/announcements">Announcements</Link>
            <Link to="/guidelines">Guidelines</Link>
            <span>FAQ</span>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href='mailto:vaibhavjadhav0391@gmail.com'>Mail us</a>
            {loggedIn && <Link to="/auth/login">Logout</Link>}
          </div>
        </div>
      </div>

      <div className="footer-copy">
        <p>&copy; DMS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export { Footer};
