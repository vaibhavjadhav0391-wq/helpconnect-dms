import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import '../assets/CSS/MedicalHome.css';

export const MedicalHome = () => {
  const { id } = useParams();
  const [centers, setCenters] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    setStatus('loading');
    fetch('process.env.REACT_APP_API_URL/api/facilities')
      .then((res) => res.json())
      .then((data) => {
        const hospitals = Array.isArray(data?.hospitals) ? data.hospitals : [];
        const shelters = Array.isArray(data?.shelters) ? data.shelters : [];
        const mapped = [
          ...hospitals.map((item) => ({
            ID: item._id,
            Name: item.name,
            Address: item.address,
            Hotline: item.phone,
            Email: item.email,
            Rating: item.rating || 4.0,
            Type: 'Hospital',
            Seats: item.seats
          })),
          ...shelters.map((item) => ({
            ID: item._id,
            Name: item.name,
            Address: item.address,
            Hotline: item.phone,
            Email: item.email,
            Rating: item.rating || 4.0,
            Type: 'Shelter',
            Seats: item.seats
          }))
        ];
        setCenters(mapped);
        setStatus('success');
      })
      .catch(() => {
        setCenters([]);
        setStatus('error');
      });
  }, []);

  const center = useMemo(() => centers.find((item) => String(item.ID) === String(id)), [centers, id]);

  return (
    <div className="medical-home">
      <div className="page-header">
        <h2 className="section-title">Medical Center</h2>
        <p className="section-subtitle">Availability, services, and contact details.</p>
      </div>
      {center ? (
        <section className="panel-card">
          <h3>{center.Name}</h3>
          <p>{center.Type} • {center.Address}</p>
          <div className="detail-grid">
            <div>
              <span>Hotline</span>
              <strong>{center.Hotline}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{center.Email}</strong>
            </div>
            <div>
              <span>Rating</span>
              <strong>{center.Rating}</strong>
            </div>
            <div>
              <span>Seats</span>
              <strong>{center.Seats}</strong>
            </div>
          </div>
          <button className="primary">Request Support</button>
        </section>
      ) : (
        <section className="panel-card">
          <h3>{status === 'loading' ? 'Loading medical center...' : 'Medical center not found'}</h3>
          <p>Please go back and select a center from the list.</p>
        </section>
      )}
    </div>
  )
}
