import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import '../assets/CSS/Volunteer.css';

const SKILLS = ['Medical', 'Rescue', 'Food', 'Transport'];
const HELP_TYPES = ['Medical', 'Rescue', 'Food', 'Shelter'];

const Volunteer = () => {
  const user = useSelector((state) => state.userState.user);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    skills: [],
    available: true,
    latitude: '',
    longitude: ''
  });
  const [status, setStatus] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedHelpType, setSelectedHelpType] = useState('Medical');
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [helpSubmitting, setHelpSubmitting] = useState(false);
  const [helpSuccess, setHelpSuccess] = useState(false);
  const [helpMessage, setHelpMessage] = useState('');
  const [helpLocation, setHelpLocation] = useState({ lat: '', lng: '' });
  const [helpLocationStatus, setHelpLocationStatus] = useState('');

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: user?.Name || '',
      phone: user?.Phone || ''
    }));
  }, [user]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation not supported.');
      return;
    }
    setStatus('Detecting location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
        setStatus('Location detected.');
      },
      () => setStatus('Unable to detect location.'),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const submitVolunteer = async () => {
    setStatus('');
    if (!form.name || !form.phone || !form.latitude || !form.longitude) {
      setStatus('Please fill name, phone, and location.');
      return;
    }
    const response = await fetch('http://localhost:5000/api/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        createdBy: user?.Email || ''
      })
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data?.error || 'Failed to join as volunteer.');
      return;
    }
    setStatus('');
    setJoinSuccess(true);
    fetchData();
  };

  const fetchData = async () => {
    const [volunteerRes, requestRes] = await Promise.all([
      fetch('http://localhost:5000/api/volunteers'),
      fetch('http://localhost:5000/api/help-requests')
    ]);
    const volunteerData = await volunteerRes.json();
    const requestData = await requestRes.json();
    setVolunteers(Array.isArray(volunteerData?.volunteers) ? volunteerData.volunteers : []);
    setRequests(Array.isArray(requestData?.requests) ? requestData.requests : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const detectHelpLocation = () => {
    if (!navigator.geolocation) {
      setHelpLocationStatus('Geolocation not supported.');
      return;
    }
    setHelpLocationStatus('Detecting location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHelpLocation({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6)
        });
        setHelpLocationStatus('Location detected.');
      },
      () => setHelpLocationStatus('Unable to detect location.'),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const submitHelpRequest = async () => {
    if (!helpLocation.lat || !helpLocation.lng) {
      setHelpMessage('Please detect location first.');
      return;
    }
    setHelpSubmitting(true);
    setHelpMessage('');
    const response = await fetch('http://localhost:5000/api/help-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: selectedHelpType,
        latitude: helpLocation.lat,
        longitude: helpLocation.lng,
        createdBy: user?.Email || ''
      })
    });
    const data = await response.json();
    setHelpSubmitting(false);
    if (!response.ok) {
      setHelpMessage(data?.error || 'Failed to send help request.');
      return;
    }
    setHelpModalOpen(false);
    setHelpSuccess(true);
    fetchData();
  };

  const toggleSkill = (skill) => {
    setForm((prev) => {
      const hasSkill = prev.skills.includes(skill);
      return {
        ...prev,
        skills: hasSkill ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill]
      };
    });
  };

  const mapCenter = useMemo(() => {
    if (form.latitude && form.longitude) {
      return { lat: Number(form.latitude), lng: Number(form.longitude) };
    }
    return { lat: 20.5937, lng: 78.9629 };
  }, [form.latitude, form.longitude]);


  const volunteerCards = useMemo(() => {
    return volunteers.map((volunteer) => {
      const statusLabel = volunteer.available ? 'Available' : 'Busy';
      return (
        <div className="volunteer-card" key={volunteer._id}>
          <div className="card-header">
            <h4>{volunteer.name}</h4>
            <span className={volunteer.available ? 'badge success' : 'badge warn'}>{statusLabel}</span>
          </div>
          <p className="card-meta">Skills: {volunteer.skills.join(', ') || 'None'}</p>
          <p className="card-meta">Phone: {volunteer.phone}</p>
        </div>
      );
    });
  }, [volunteers]);

  return (
    <div className="volunteer-page">
      <section className="page-header">
        <h2 className="section-title">Volunteer Help System</h2>
        <p className="section-subtitle">Join, support, and coordinate real-time help.</p>
        <button type="button" className="help-float" onClick={() => setHelpModalOpen(true)}>
          🆘 Need Help
        </button>
      </section>

      <section className="panel-card">
        <h3>Join as Volunteer</h3>
        <div className="volunteer-form">
          <div className="form-item">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-item">
            <label>Phone Number</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-item">
            <label>Location</label>
            <div className="inline-row">
              <button type="button" className="secondary" onClick={detectLocation}>Use GPS</button>
              <input value={form.latitude && form.longitude ? `${form.latitude}, ${form.longitude}` : ''} readOnly />
            </div>
          </div>
          <div className="form-item span-2">
            <label>Skills</label>
            <div className="chip-row">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className={form.skills.includes(skill) ? 'chip active' : 'chip'}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
          <div className="form-item">
            <label>Availability</label>
            <select value={form.available ? 'available' : 'busy'} onChange={(e) => setForm({ ...form, available: e.target.value === 'available' })}>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
            </select>
          </div>
          <div className="form-item">
            <button type="button" className="primary" onClick={submitVolunteer}>Join as Volunteer</button>
          </div>
          {status && <p className="form-help">{status}</p>}
        </div>
      </section>

      <section className="panel-card">
        <h3>Nearby Volunteers</h3>
        <div className="volunteer-grid">
          {volunteerCards.length ? volunteerCards : <p className="form-help">No volunteers yet.</p>}
        </div>
      </section>


      <section className="panel-card">
        <h3>Active Help Requests</h3>
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>{request.type}</td>
                  <td>{request.status}</td>
                  <td>{new Date(request.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {joinSuccess && (
        <div className="modal" onClick={() => setJoinSuccess(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="confetti" aria-hidden="true"></div>
            <h3>🎉 You are now a Volunteer!</h3>
            <p>Thank you for joining. You will now receive nearby help requests.</p>
            <button type="button" className="primary" onClick={() => setJoinSuccess(false)}>OK</button>
          </div>
        </div>
      )}

      {helpModalOpen && (
        <div className="modal" onClick={() => setHelpModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Request Help</h3>
            <label>Help Type</label>
            <select value={selectedHelpType} onChange={(e) => setSelectedHelpType(e.target.value)}>
              {HELP_TYPES.map((type) => (
                <option key={type} value={type}>{type} Help</option>
              ))}
            </select>
            <label>Location</label>
            <div className="inline-row">
              <button type="button" className="secondary" onClick={detectHelpLocation}>Use GPS 📍</button>
              <input value={helpLocation.lat ? `${helpLocation.lat}, ${helpLocation.lng}` : ''} readOnly />
            </div>
            {helpLocationStatus && <p className="form-help">{helpLocationStatus}</p>}
            {helpMessage && <p className="form-help error">{helpMessage}</p>}
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
        <div className="modal" onClick={() => setHelpSuccess(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>🚨 Help Request Sent</h3>
            <p>Your request has been sent to nearby volunteers. Help will reach you soon.</p>
            <button type="button" className="primary" onClick={() => setHelpSuccess(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Volunteer;
