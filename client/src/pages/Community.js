import React, { useEffect } from 'react'
import '../assets/CSS/Community.css';
import { useParams,
    useNavigate,
    Outlet,
    Link
 } from 'react-router-dom';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Community = () => {
    const { id } = useParams();
    const location = useLocation();
    useEffect(()=>{
      console.log(".community-"+ location.pathname.split("/")[3]);
      if (location.pathname.split("/").length>3) SetActive(".community-"+ location.pathname.split("/")[3]);
      else SetActive(".community-home")
    }, location.pathname.split("/"));
    const LeaderNum = '+91 8767008142';
    const [Num, setNum] = useState('+91 xxxxxxxx (click to reveal)');

    const SetActive= (command)=>{
      // const navBars= ['.community-home','.community-chat','.community-volunteers','.community-announcement' ];
      const navBars= ['.community-home','.community-volunteers','.community-announcement' ];
      console.log(command);
      navBars.forEach((bars)=>{
        if (bars===command){
          document.querySelector(command).classList.add('com-nav-active');
        }
        else{
          document.querySelector(bars).classList.remove('com-nav-active');
        }
      })
  }
    
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