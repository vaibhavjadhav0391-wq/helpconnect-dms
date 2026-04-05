import React, { useCallback, useEffect } from 'react'
import '../assets/CSS/Community.css';
import { useParams, Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Community = () => {
    const { id } = useParams();
    const location = useLocation();
    const LeaderNum = '+91 8767008142';
    const [Num, setNum] = useState('+91 xxxxxxxx (click to reveal)');

    const SetActive = useCallback((command) => {
      const navBars = ['.community-home', '.community-volunteers', '.community-announcement'];
      navBars.forEach((bars) => {
        const element = document.querySelector(bars);
        if (!element) return;
        if (bars === command) {
          element.classList.add('com-nav-active');
        } else {
          element.classList.remove('com-nav-active');
        }
      });
    }, []);

    useEffect(() => {
      if (location.pathname.split("/").length > 3) {
        SetActive(".community-" + location.pathname.split("/")[3]);
      } else {
        SetActive(".community-home");
      }
    }, [location.pathname, SetActive]);
    
  return (
    <div className="community-page">
      <header className='com-header'>
        <div className="com-header-inner">
          <div>
            <h1>Monsoon Relief 2024</h1>
            <p className="com-subtitle">Maharashtra response updates, volunteers, and local alerts.</p>
          </div>
          <nav className='community-nav'>
            <ul>
              <li className='community-home' onClick={()=> { SetActive('.community-home')}}>
                <Link to={`/community/${id}`}>Community</Link></li>
              <li className='community-volunteers' onClick={()=> { SetActive('.community-volunteers')}}>
                <Link to={`/community/${id}/volunteers`}>Volunteer</Link></li>
              <li className='community-announcement' onClick={()=> { SetActive('.community-announcement')}}>
                <Link to={`/community/${id}/announcement`}>Announcements</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <Outlet />

      <section id="contact" className="support-panel">
        <h2>Contact and Support</h2>
        <ul>
          <li><span>Community Leader:</span> Vaibhav</li>
          <li><span>Phone:</span><span onClick={()=>{
            setNum(LeaderNum);
          }}> {Num}</span></li>
          <li><span>Email:</span>
            <a href="mailto:monsoon.relief@community.in" target='_blank' rel="noreferrer">Mail Leader</a>
          </li>
        </ul>
      </section>
    </div>

  )
}

export default Community