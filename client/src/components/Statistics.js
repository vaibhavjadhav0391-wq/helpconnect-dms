import React from 'react'
import '../assets/CSS/Statistics.css';

const Statistics = () => {
  return (
    <section className="stats">
      <div className="stats-grid">
        <div className="stat-card" id='IR'>
          <h3>5,154</h3>
          <p>Incidents Registered</p>
        </div>
        <div className="stat-card" id='Com'>
          <h3>245</h3>
          <p>Communities</p>
        </div>
        <div className="stat-card" id='TDon'>
          <h3>5,154 INR</h3>
          <p>Total Donations</p>
        </div>
        <div className="stat-card" id='AP'>
          <h3>5,154</h3>
          <p>Affected People</p>
        </div>
        <div className="stat-card" id='PS'>
          <h3>5,154</h3>
          <p>Saved People</p>
        </div>
        <div className="stat-card" id='VC'>
          <h3>5,154</h3>
          <p>Volunteers</p>
        </div>
      </div>
    </section>
  )
}


export {Statistics};
