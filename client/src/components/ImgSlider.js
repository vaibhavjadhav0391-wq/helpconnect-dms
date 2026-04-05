import React from 'react'
import '../assets/CSS/ImgSlider.css';
import bg1 from '../assets/images/bg1.jpg'; 
import bg2 from '../assets/images/bg2.jpeg';
import bg3 from '../assets/images/bg3.jpg';
import bg4 from '../assets/images/bg4.jpg';
import bg5 from '../assets/images/bg5.jpg';
import { Link } from 'react-router-dom';

export const ImgSlider = () => {
  return (
    <section className="hero">
      <div id="slider">
        <figure>
          <img src={bg1} alt="community response"/>
          <img src={bg2} alt="relief operations"/>
          <img src={bg3} alt="emergency volunteers"/>
          <img src={bg4} alt="shelter support"/>
          <img src={bg5} alt="local coordination"/>
        </figure>
      </div>
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Protect your community with real-time response.</h1>
          <p>Track incidents, connect with local volunteers, and find safe shelters when it matters most.</p>
          <div className="hero-actions">
            <Link to="/incidents" className="hero-button">Report an Incident</Link>
            <Link to="/communities" className="hero-button ghost">Join a Community</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
