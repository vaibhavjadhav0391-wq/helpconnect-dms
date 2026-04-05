
import React, { useEffect, useState } from 'react'
import '../assets/CSS/Header.css';
import Logo from '../assets/images/logo.png';
import notification_icon_on from '../assets/images/notification_on.png';
import notification_icon from '../assets/images/notification.png';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';
export const Header= () => {
  const apiBase = process.env.REACT_APP_API_URL || (
    typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://helpconnect-dms.onrender.com'
  );
  const navigate = useNavigate();
  const loggedIn = useSelector(state => state.roleState.loggedIn);
  const user = useSelector(state => state.userState.user);
  const adminEmails = ['vaibhav.jadhav04@mit.asia', 'vaibhavjadhav0391@gmail.com'];
  const isAdminEmail = adminEmails.includes((user?.Email || '').toLowerCase());
  const [notIcon, setNotIcon] = useState(notification_icon_on);
  const [showNotification, setShowNotification] = useState('none');
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  useEffect(() => {
    const current = `.nav-${location.pathname.split('/')[1]}`;
    const navBars= ['.nav-incidents','.nav-communities','.nav-announcements','.nav-medicals','.nav-donate', '.nav-volunteer' ];
    navBars.forEach((bars) => {
      const element = document.querySelector(bars);
      if (!element) return;
      if (bars === current) {
        element.classList.add('nav-active');
      } else {
        element.classList.remove('nav-active');
      }
    });
  }, [location.pathname]);

  const fetchNotifications = () => {
    fetch(`${apiBase}/notifications`)
      .then(res => res.json())
      .then(data => setNotifications(data?.notifications || []))
      .catch(() => setNotifications([]));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const clickNotification=()=>{
    if(notIcon === notification_icon_on){
      setNotIcon(notification_icon);
      setShowNotification('block');
      fetchNotifications();
    }else{
      setNotIcon(notification_icon_on);
      setShowNotification('none');
    }
  }

  
  return (
    <header className='site-header'>
      <div className="header-inner">
        <Link to='/' className='brand' aria-label="Go to home">
          <img src={Logo} className='header-logo' alt="DMS logo" />
        </Link>

        <nav className="nav-links">
          <ul>
            <li className='nav-incidents'>
              <Link to='/incidents'>Incidents</Link>
            </li>
            <li className='nav-communities'>
              <Link to='/communities'>Community</Link>
            </li>
            <li className='nav-announcements'>
              <Link to='/announcements'>Announcements</Link>
            </li>
            <li className='nav-medicals'>
              <Link to='/medicals'>Medicals</Link>
            </li>
            <li className='nav-donate'>
              <Link to='/donate'>Donate</Link>
            </li>
            <li className='nav-volunteer'>
              <Link to='/volunteer'>Join as Volunteer</Link>
            </li>
            { !loggedIn &&
              <li className='nav-login'>
                <button type="button" className="header-login" 
                  onClick={()=> {
                    navigate('/auth');
                  }}
                >Login/Register</button>
              </li>
            }
            { isAdminEmail && loggedIn &&
              <li className='nav-admin'>
                <Link to='/admin'>Admin</Link>
              </li>
            }
            { loggedIn &&
              <li className='nav-login'>
                <button type="button" className="header-login" 
                  onClick={()=> {
                    navigate('/auth');
                  }}
                >LogOut</button>
              </li>
            }
          </ul>
        </nav>

        <div className="notification-box" onClick={()=>clickNotification()}>
          <img src={notIcon} className='notification' alt="notification" />
        </div>
        <div className="notification-modal" style={{
          display: showNotification
        }}>
          <div className="notification-modal-content">
            <h1>Notifications</h1>
            <ul className='notification-list'>
              {notifications.length === 0 && <li>No notifications yet.</li>}
              {notifications.map((item) => (
                <li key={item.NotificationID}>{item.Message}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}
