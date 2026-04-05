import React from 'react'
import "../../assets/CSS/Communities.css"
import { Link,useNavigate } from 'react-router-dom'

export const Communities = () => {
    const navigate = useNavigate();
  return (
    <div className="communities-page">
        <div className="page-header">
          <h2 className="section-title">Communities</h2>
          <p className="section-subtitle">Join local groups coordinating relief and mutual aid.</p>
        </div>
        <div className="community-cards">
          <article className="community-card">
            <div className="card-header">
              <div>
                <h3>Monsoon Relief 2024</h3>
                <p className="card-meta">Maharashtra, India • Flood • 2024-07-15</p>
              </div>
              <span className="card-pill">ComID 1</span>
            </div>
            <p className="card-body">
              Coordinating rescue, supplies, and shelter updates for flood-affected areas across Maharashtra.
            </p>
            <div className="card-footer">
              <span className="card-members">Members: Maharashtra</span>
              <div className="card-actions">
                <button className='action-btn' onClick={()=>{
                    navigate(`/community/${1}`);
                }}>See Insights</button>
                <button className='action-btn secondary'>Leave</button>
              </div>
            </div>
          </article>

          <article className="community-card">
            <div className="card-header">
              <div>
                <h3>Heatwave Support</h3>
                <p className="card-meta">Delhi NCR, India • Heatwave • 2024-07-25</p>
              </div>
              <span className="card-pill">ComID 2</span>
            </div>
            <p className="card-body">Water, cooling shelters, and volunteer rotations during peak heat alerts.</p>
            <div className="card-footer">
              <span className="card-members">Members: Delhi NCR</span>
              <div className="card-actions">
                <button className='action-btn'>Join</button>
              </div>
            </div>
          </article>
        </div>
    </div>
  )
}
