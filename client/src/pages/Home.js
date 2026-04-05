import React, { useEffect, useState } from 'react'
import '../assets/CSS/Home.css';

import { ImgSlider, LiveMap, Statistics } from '../components';
import Arrow from '../assets/images/arrows.png';
import { useSelector } from 'react-redux';
import Chatbot from '../components/Chatbot';

const Home = () => {
  const user = useSelector((state) => state.userState.user);

  const [ incidents, setIncidents] = useState(null);
  const [contacts, setContacts] = useState(null);
  useEffect(() => {
    fetch('process.env.REACT_APP_API_URL/home')
    .then(res => res.json())
    .then(data => {
      setIncidents(data);
      setContacts(Array.isArray(data?.contacts) ? data.contacts : []);
      console.log(data);
      
    })
  }, []);


  const [Itable, setItable] = useState('table');
  const [Etable, setEtable] = useState('table');
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [helpType, setHelpType] = useState('Medical');
  const [helpLocation, setHelpLocation] = useState({ lat: '', lng: '' });
  const [helpPhone, setHelpPhone] = useState('');
  const [helpStatus, setHelpStatus] = useState('');
  const [helpSubmitting, setHelpSubmitting] = useState(false);
  const [helpSuccess, setHelpSuccess] = useState(false);
  
  const changeDisplay =(d)=> {
    if(d === 'table'){
      return 'none';
    }else{
      return 'table';
    }
  }

  useEffect(() => {
    setHelpPhone(user?.Phone || user?.phone || '');
  }, [user]);

  const detectHelpLocation = () => {
    if (!navigator.geolocation) {
      setHelpStatus('Geolocation not supported.');
      return;
    }
    setHelpStatus('Detecting location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHelpLocation({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6)
        });
        setHelpStatus('Location detected.');
      },
      () => setHelpStatus('Unable to detect location.'),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const submitHelpRequest = async () => {
    if (!helpLocation.lat || !helpLocation.lng) {
      setHelpStatus('Please detect location first.');
      return;
    }
    if (!helpPhone) {
      setHelpStatus('Please enter a phone number.');
      return;
    }
    setHelpSubmitting(true);
    setHelpStatus('');
    const response = await fetch('process.env.REACT_APP_API_URL/api/help-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: helpType,
        latitude: helpLocation.lat,
        longitude: helpLocation.lng,
        userPhone: helpPhone,
        createdBy: user?.Email || ''
      })
    });
    const data = await response.json();
    setHelpSubmitting(false);
    if (!response.ok) {
      setHelpStatus(data?.error || 'Failed to send help request.');
      return;
    }
    setHelpModalOpen(false);
    setHelpSuccess(true);
  };
  return (
    <div className="home-page">
      <Chatbot />
      <button type="button" className="help-float" onClick={() => setHelpModalOpen(true)}>
        🆘 Need Help
      </button>
      <section className="hero-section">
        <ImgSlider />
      </section>

      <section className="home-section">
        <h2 className='section-title'>Statistics</h2>
        <Statistics />
      </section>

      <section className="home-section">
        <h2 className='section-title'>Live Incident Map</h2>
        <LiveMap />
      </section>

      <section className="home-section">
        <button className='section-toggle' onClick={()=> setItable(changeDisplay(Itable))}>
          Recent List of Incidents <img src={Arrow} className="icon" alt="arrow" />
        </button>
        <div className="table-card" style={{ display: Itable }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Incident ID</th>
                <th>Incident Type</th>
                <th>Incident Date</th>
                <th>Incident Location</th>
                <th>Incident Description</th>
                <th>Incident Status</th>
                <th>Urgency</th>
              </tr>
            </thead>
            <tbody>
              {incidents && incidents.incidentList && incidents.incidentList.map(incident => (
                <tr key={incident.IncidentID}>
                  <td>{incident.IncidentID}</td>
                  <td>{incident.IncidentType}</td>
                  <td>{incident.DateReported}</td>
                  <td>{incident.Location}</td>
                  <td>{incident.Description}</td>
                  <td>{incident.Status}</td>
                  <td>{incident.Urgency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="home-section">
        <button className='section-toggle' onClick={()=>setEtable(changeDisplay(Etable))}>
          Emergency Contacts <img src={Arrow} className="icon" alt="arrow" />
        </button>
        <div className="table-card" style={{ display: Etable }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Contact ID</th>
                <th>Contact Name</th>
                <th>Designation</th>
                <th>Contact Phone</th>
                <th>Contact Email</th>
              </tr>
            </thead>
            <tbody>
              {contacts && contacts.map(contact => (
                <tr key={contact.contactID}>
                  <td>{contact.contactID}</td>
                  <td>{contact.name}</td>
                  <td>{contact.designation}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {helpModalOpen && (
        <div className="help-modal" onClick={() => setHelpModalOpen(false)}>
          <div className="help-modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>Request Help</h3>
            <label>Help Type</label>
            <select value={helpType} onChange={(event) => setHelpType(event.target.value)}>
              <option value="Medical">Medical Help</option>
              <option value="Rescue">Rescue Help</option>
              <option value="Food">Food</option>
              <option value="Shelter">Shelter</option>
            </select>
            <label>Location</label>
            <div className="inline-row">
              <button type="button" className="secondary" onClick={detectHelpLocation}>Use GPS 📍</button>
              <input value={helpLocation.lat ? `${helpLocation.lat}, ${helpLocation.lng}` : ''} readOnly />
            </div>
            <label>Phone Number</label>
            <input value={helpPhone} onChange={(event) => setHelpPhone(event.target.value)} placeholder="Your phone number" />
            {helpStatus && <p className="form-help">{helpStatus}</p>}
            <div className="button-row">
              <button type="button" className="secondary" onClick={() => setHelpModalOpen(false)}>Cancel</button>
              <button type="button" className="primary" disabled={helpSubmitting} onClick={submitHelpRequest}>
                {helpSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
      {helpSuccess && (
        <div className="help-modal" onClick={() => setHelpSuccess(false)}>
          <div className="help-modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>🚨 Help Request Sent</h3>
            <p>Your request has been sent to nearby volunteers. Our smart system is finding the best helpers near you. Help will reach you soon.</p>
            <button type="button" className="primary" onClick={() => setHelpSuccess(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  )
}



export default Home;
