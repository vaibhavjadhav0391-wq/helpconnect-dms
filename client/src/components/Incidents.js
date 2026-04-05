import React, { useCallback, useEffect, useMemo, useState } from 'react'
import '../assets/CSS/Incidents.css';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
});

const LOCATION_DATA = {
  Maharashtra: {
    Aurangabad: {
      Gangapur: ['Village1', 'Village2'],
      Vaijapur: ['Village3']
    }
  },
  Gujarat: {
    Ahmedabad: {
      Dholka: ['VillageA', 'VillageB'],
      Daskroi: ['VillageC']
    }
  },
  Karnataka: {
    Bengaluru: {
      Anekal: ['VillageD', 'VillageE'],
      Yelahanka: ['VillageF']
    }
  },
  Telangana: {
    Hyderabad: {
      Serilingampally: ['VillageG'],
      Charminar: ['VillageH']
    }
  },
  Delhi: {
    Delhi: {
      Central: ['VillageI'],
      South: ['VillageJ']
    }
  }
};


export const Incidents = () => {
    const apiBase = process.env.REACT_APP_API_URL || (
      typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:5000'
        : 'https://helpconnect-dms.onrender.com'
    );
    const navigate = useNavigate();
    const user = useSelector((state) => state.userState.user);
    const loggedIn = useSelector((state) => state.roleState.loggedIn);
    const [ incidents, setIncidents] = useState(null);
    const [longitude] = useState(78.9629);
    const [latitude] = useState(20.5937);
  const [imageFile, setImageFile] = useState(null);
  const [gps, setGps] = useState({ lat: '', lng: '' });
  const [gpsStatus, setGpsStatus] = useState('');
    const [locationMode, setLocationMode] = useState('gps');
    const [manualLocation, setManualLocation] = useState({
      state: '',
      district: '',
      taluka: '',
      village: ''
    });
    const [submittedBy, setSubmittedBy] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');
    const [downloadLink, setDownloadLink] = useState('');
    const [manualCoords, setManualCoords] = useState({ lat: '', lng: '' });
    const [geoStatus, setGeoStatus] = useState('');
    const [geoLoading, setGeoLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [helpModal, setHelpModal] = useState({ open: false, incident: null });
    const [helpType, setHelpType] = useState('Medical');
    const [helpStatus, setHelpStatus] = useState('');
    const [helpPhone, setHelpPhone] = useState('');

    useEffect(() => {
      if (loggedIn) {
        setSubmittedBy(user?.Name || user?.Email || '');
      }
    }, [loggedIn, user]);

    const districtOptions = useMemo(() => {
      return manualLocation.state ? Object.keys(LOCATION_DATA[manualLocation.state] || {}) : [];
    }, [manualLocation.state]);

    const talukaOptions = useMemo(() => {
      if (!manualLocation.state || !manualLocation.district) return [];
      return Object.keys(LOCATION_DATA[manualLocation.state]?.[manualLocation.district] || {});
    }, [manualLocation.state, manualLocation.district]);

    const villageOptions = useMemo(() => {
      if (!manualLocation.state || !manualLocation.district || !manualLocation.taluka) return [];
      return LOCATION_DATA[manualLocation.state]?.[manualLocation.district]?.[manualLocation.taluka] || [];
    }, [manualLocation.state, manualLocation.district, manualLocation.taluka]);

    const detectLocation = () => {
        if (!navigator.geolocation) {
          setGpsStatus('Geolocation not supported in this browser.');
          return;
        }
        setGpsStatus('Detecting location...');
        setGeoStatus('');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setGps({
              lat: position.coords.latitude.toFixed(6),
              lng: position.coords.longitude.toFixed(6)
            });
            setGpsStatus('Location detected.');
            setLocationMode('gps');
          },
          () => {
            setGpsStatus('Unable to detect location.');
            setLocationMode('manual');
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    useEffect(() => {
      if (locationMode !== 'manual') return;
      const { state, district, taluka, village } = manualLocation;
      const query = [village, taluka, district, state].filter(Boolean).join(', ');
      if (!query) {
        setManualCoords({ lat: '', lng: '' });
        setGeoStatus('');
        return;
      }

      const timeout = setTimeout(async () => {
        setGeoLoading(true);
        setGeoStatus('Searching location...');
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
          const results = await response.json();
          if (Array.isArray(results) && results.length > 0) {
            setManualCoords({
              lat: Number(results[0].lat).toFixed(6),
              lng: Number(results[0].lon).toFixed(6)
            });
            setGeoStatus('Location found.');
          } else {
            setManualCoords({ lat: '', lng: '' });
            setGeoStatus('Location not found.');
          }
        } catch (error) {
          setGeoStatus('Unable to fetch location.');
        } finally {
          setGeoLoading(false);
        }
      }, 600);

      return () => clearTimeout(timeout);
    }, [locationMode, manualLocation]);

    const mapCenter = useMemo(() => {
      if (locationMode === 'gps' && gps.lat && gps.lng) {
        return [Number(gps.lat), Number(gps.lng)];
      }
      if (locationMode === 'manual' && manualCoords.lat && manualCoords.lng) {
        return [Number(manualCoords.lat), Number(manualCoords.lng)];
      }
      return [latitude, longitude];
    }, [gps, manualCoords, locationMode, latitude, longitude]);

    const validateForm = () => {
      const nextErrors = {};
      const incidentTitle = document.getElementById('IncidentTitle').value.trim();
      const incidentType = document.getElementById('IncidentType').value;
      const incidentDate = document.getElementById('IncidentDate').value;
      const urgency = document.getElementById('Urgency').value;
      const incidentDescription = document.getElementById('IncidentDescription').value.trim();

      if (!incidentTitle) nextErrors.IncidentTitle = 'Title is required.';
      if (!incidentType) nextErrors.IncidentType = 'Please select incident type.';
      if (!incidentDate) nextErrors.IncidentDate = 'Incident date is required.';
      if (!urgency) nextErrors.Urgency = 'Please select urgency.';
      if (!incidentDescription) nextErrors.IncidentDescription = 'Description cannot be empty.';

      if (locationMode === 'gps') {
        if (!gps.lat || !gps.lng) {
          nextErrors.LocationMode = 'Please provide GPS location.';
        }
      } else {
        if (!manualLocation.state || !manualLocation.district || !manualLocation.taluka || !manualLocation.village) {
          nextErrors.LocationMode = 'Please complete manual location details.';
        }
      }

      setErrors(nextErrors);

      const firstErrorKey = Object.keys(nextErrors)[0];
      if (firstErrorKey) {
        const firstField = document.getElementById(firstErrorKey) || document.querySelector(`[data-error="${firstErrorKey}"]`);
        if (firstField) {
          firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
      }
      return true;
    };

    const submitIncident = async () => {
        setSubmitMessage('');
        setDownloadLink('');
        if (!validateForm()) return;
        const incidentType = document.getElementById('IncidentType').value;
        const incidentDate = document.getElementById('IncidentDate').value;
        const incidentLocation = document.getElementById('LocationID').value;
        const incidentLocationText = document.getElementById('IncidentLocation').value;
        const incidentDescription = document.getElementById('IncidentDescription').value;
        const affected = document.getElementById('Affected').value;
        const incidentStatus = document.getElementById('IncidentStatus').value;
        const urgency = document.getElementById('Urgency').value;
        const incidentTitle = document.getElementById('IncidentTitle').value;
        if (!loggedIn && !submittedBy.trim()) {
          setErrors((prev) => ({ ...prev, SubmittedBy: 'Please add your name in Submitted By.' }));
          return;
        }
        const formData = new FormData();
        formData.append('title', incidentTitle);
        formData.append('description', incidentDescription);
        formData.append('severity', urgency.toLowerCase());
        formData.append('submittedBy', submittedBy);
        formData.append('affectedCount', affected || '0');
        if (locationMode === 'gps') {
          formData.append('latitude', gps.lat);
          formData.append('longitude', gps.lng);
          formData.append('locationName', incidentLocationText);
        } else {
          formData.append('state', manualLocation.state);
          formData.append('district', manualLocation.district);
          formData.append('taluka', manualLocation.taluka);
          formData.append('village', manualLocation.village);
        }
        if (incidentLocation) formData.append('LocationID', incidentLocation);
        formData.append('IncidentLocation', incidentLocationText);
        formData.append('IncidentType', incidentType);
        formData.append('Description', incidentDescription);
        formData.append('AffectedCount', affected || '0');
        formData.append('ReportedBy', user?.UserID || '');
        if (incidentDate) formData.append('DateReported', incidentDate);
        formData.append('Urgency', urgency);
        formData.append('Status', incidentStatus);
        if (imageFile) {
          formData.append('image', imageFile);
        }
        try {
          const response = await fetch(`${apiBase}/api/incidents`, {
            method: 'POST',
            body: formData
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data?.error || 'Failed to submit incident.');
          }
          if (data?.incident?._id) {
            setDownloadLink(`${apiBase}/api/incidents/${data.incident._id}/pdf`);
          }
          setSubmitMessage('Incident submitted successfully.');
          setErrors({});
          await fetchHome();
          setImageFile(null);
          setGps({ lat: '', lng: '' });
          setGpsStatus('');
        } catch (error) {
          alert(error.message);
        }
      }

    const openHelpModal = (incident) => {
      setHelpStatus('');
      setHelpType('Medical');
      setHelpPhone(user?.Phone || user?.phone || '');
      setHelpModal({ open: true, incident });
    };

    const closeHelpModal = () => {
      setHelpModal({ open: false, incident: null });
    };

    const submitHelpRequest = async () => {
      if (!helpModal.incident) return;
      const lat = helpModal.incident.Latitude || helpModal.incident.latitude;
      const lng = helpModal.incident.Longitude || helpModal.incident.longitude;
      if (!lat || !lng) {
        setHelpStatus('Incident location is missing.');
        return;
      }
      if (!helpPhone) {
        setHelpStatus('Please add a contact phone number.');
        return;
      }
      const response = await fetch(`${apiBase}/api/help-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: helpType,
          latitude: lat,
          longitude: lng,
          userPhone: helpPhone,
          createdBy: user?.Email || ''
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setHelpStatus(data?.error || 'Failed to request help.');
        return;
      }
      setHelpStatus('Help request submitted. Volunteers notified.');
    };


      const fetchHome = useCallback(async () => {
        const response = await fetch(`${apiBase}/home`);
        const data = await response.json();
        setIncidents(data);
      }, []);

      useEffect(() => {
        fetchHome();
      }, [fetchHome]);

      
     


  return (
    <div className='incidents-page'>
      <section className="page-header">
        <h2 className="section-title">Incidents</h2>
        <p className="section-subtitle">Report quickly. Stay aware locally.</p>
      </section>

      <section className="panel-card">
        <h3>Report an incident</h3>
        {loggedIn ? (
          <>
          <form className='location-form report-form'>
            <div className="form-item">
              <label htmlFor="IncidentTitle">Incident Title</label>
              <input type="text" id="IncidentTitle" name="IncidentTitle" placeholder="Short title" className={errors.IncidentTitle ? 'field-error' : ''} />
              {errors.IncidentTitle && <small className="form-error">{errors.IncidentTitle}</small>}
            </div>
            <div className="form-item">
              <label htmlFor="IncidentType">Incident Type</label>
              <select id="IncidentType" name="IncidentType" className={errors.IncidentType ? 'field-error' : ''}>
                  <option value="Flood">Flood</option>
                  <option value="Earthquake">Earthquake</option>
                  <option value="Fire">Fire</option>
                  <option value="Cyclone">Cyclone</option>
                  <option value="Accident">Accident</option>
                  <option value="Others">Others</option>
              </select>
              {errors.IncidentType && <small className="form-error">{errors.IncidentType}</small>}
            </div>
            <div className="form-item">
              <label htmlFor="IncidentDate" >Incident Date</label>
              <input type="datetime-local" id="IncidentDate" name="IncidentDate" className={errors.IncidentDate ? 'field-error' : ''} />
              {errors.IncidentDate && <small className="form-error">{errors.IncidentDate}</small>}
            </div>
            <div className="form-item">
              <label htmlFor="LocationID">Location ID (optional)</label>
              <input type="number" id="LocationID" name="LocationID" placeholder="If provided by admin" />
            </div>
            <div className="form-item">
              <label htmlFor="IncidentImage">Upload Image</label>
              <input
                type="file"
                id="IncidentImage"
                name="IncidentImage"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] || null)}
              />
              <small className="form-help">Optional, max 5MB.</small>
            </div>
            <div className="form-item">
              <label>Auto Location (GPS)</label>
              <button
                type="button"
                className="submit-btn secondary"
                onClick={detectLocation}
                disabled={locationMode !== 'gps'}
                data-error="LocationMode"
              >
                Use my location
              </button>
              <input
                type="text"
                value={gps.lat ? `${gps.lat}, ${gps.lng}` : ''}
                readOnly
                placeholder="Latitude, Longitude"
                disabled={locationMode !== 'gps'}
                className={errors.LocationMode && locationMode === 'gps' ? 'field-error' : ''}
              />
              {gpsStatus && <small className="form-help">{gpsStatus}</small>}
              {errors.LocationMode && locationMode === 'gps' && <small className="form-error">{errors.LocationMode}</small>}
            </div>
            <div className="form-item">
              <label htmlFor="Affected">Affected Individuals</label>
              <input type="number" id="Affected" name="Affected" placeholder="Estimated count" />
              <small className="form-help">Leave blank if unknown.</small>
            </div>
            <div className="form-item">
              <label htmlFor="IncidentStatus">Incident Status</label>
              <select id="IncidentStatus" name="IncidentStatus">
                <option value="Running">Running</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
            <div className="form-item location-toggle span-4">
              <label>Location Mode</label>
              <div className="toggle-buttons">
                <button
                  type="button"
                  className={locationMode === 'gps' ? 'toggle active' : 'toggle'}
                  onClick={() => setLocationMode('gps')}
                >
                  Use GPS
                </button>
                <button
                  type="button"
                  className={locationMode === 'manual' ? 'toggle active' : 'toggle'}
                  onClick={() => setLocationMode('manual')}
                >
                  Enter Manually
                </button>
              </div>
            </div>
            <div className="form-item span-2">
              <label htmlFor="Urgency">Urgency</label>  
              <select id="Urgency" name="Urgency" className={errors.Urgency ? 'field-error' : ''}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
              </select>
              {errors.Urgency && <small className="form-error">{errors.Urgency}</small>}
            </div>
            <div className="form-item">
              <label htmlFor="ManualState">State</label>
              <select
                id="ManualState"
                value={manualLocation.state}
                onChange={(event) =>
                  setManualLocation({ state: event.target.value, district: '', taluka: '', village: '' })
                }
                disabled={locationMode !== 'manual'}
                className={errors.LocationMode && locationMode === 'manual' ? 'field-error' : ''}
              >
                <option value="">Select state</option>
                {Object.keys(LOCATION_DATA).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="form-item">
              <label htmlFor="ManualDistrict">District</label>
              <select
                id="ManualDistrict"
                value={manualLocation.district}
                onChange={(event) =>
                  setManualLocation((prev) => ({ ...prev, district: event.target.value, taluka: '', village: '' }))
                }
                disabled={locationMode !== 'manual' || !manualLocation.state}
                className={errors.LocationMode && locationMode === 'manual' ? 'field-error' : ''}
              >
                <option value="">Select district</option>
                {districtOptions.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            <div className="form-item">
              <label htmlFor="ManualTaluka">Taluka</label>
              <select
                id="ManualTaluka"
                value={manualLocation.taluka}
                onChange={(event) =>
                  setManualLocation((prev) => ({ ...prev, taluka: event.target.value, village: '' }))
                }
                disabled={locationMode !== 'manual' || !manualLocation.district}
                className={errors.LocationMode && locationMode === 'manual' ? 'field-error' : ''}
              >
                <option value="">Select taluka</option>
                {talukaOptions.map((taluka) => (
                  <option key={taluka} value={taluka}>{taluka}</option>
                ))}
              </select>
            </div>
            <div className="form-item">
              <label htmlFor="ManualVillage">Village / Area</label>
              <select
                id="ManualVillage"
                value={manualLocation.village}
                onChange={(event) => setManualLocation((prev) => ({ ...prev, village: event.target.value }))}
                disabled={locationMode !== 'manual' || !manualLocation.taluka}
                className={errors.LocationMode && locationMode === 'manual' ? 'field-error' : ''}
              >
                <option value="">Select village</option>
                {villageOptions.map((village) => (
                  <option key={village} value={village}>{village}</option>
                ))}
              </select>
            </div>
            <div className="form-item span-4">
              {geoLoading && <small className="form-help">Looking up location...</small>}
              {geoStatus && <small className="form-help">{geoStatus}</small>}
              {errors.LocationMode && locationMode === 'manual' && <small className="form-error">{errors.LocationMode}</small>}
            </div>
            <div className="form-item span-4">
              <label htmlFor="IncidentLocation">Incident Location</label>
              <input type="text" id="IncidentLocation" name="IncidentLocation" placeholder="Area, landmark, or street" />
            </div>
            <div className="form-item span-2">
              <label htmlFor="SubmittedBy">Submitted By</label>
              <input
                type="text"
                id="SubmittedBy"
                name="SubmittedBy"
                value={submittedBy}
                onChange={(event) => setSubmittedBy(event.target.value)}
                placeholder="Your name"
                className={errors.SubmittedBy ? 'field-error' : ''}
              />
              {errors.SubmittedBy && <small className="form-error">{errors.SubmittedBy}</small>}
            </div>
            <div className="form-item span-2 spacer" aria-hidden="true"></div>
            <div className="form-item span-4">
              <label htmlFor="IncidentDescription">Incident Description</label>
              <textarea id="IncidentDescription" name="IncidentDescription" rows="3" placeholder="Share key details that responders should know" className={errors.IncidentDescription ? 'field-error' : ''} />
              {errors.IncidentDescription && <small className="form-error">{errors.IncidentDescription}</small>}
            </div>
            <div className="form-item submit-field span-2">
              <label className="sr-only">Submit</label>
              <button type='button' className='submit-btn' onClick={()=>{
                submitIncident();
              }}>Submit</button>
              {submitMessage && <small className="form-help">{submitMessage}</small>}
            </div>
          </form>
          <div className="report-actions">
            <div className="report-status">
              {downloadLink ? 'Report ready:' : 'Submit to generate PDF report.'}
            </div>
            <a
              className={`download-link ${downloadLink ? '' : 'disabled'}`}
              href={downloadLink || '#'}
              target={downloadLink ? '_blank' : undefined}
              rel={downloadLink ? 'noreferrer' : undefined}
              aria-disabled={!downloadLink}
              onClick={(event) => {
                if (!downloadLink) event.preventDefault();
              }}
            >
              Download Report (PDF)
            </a>
          </div>
          </>
        ) : (
          <div className="report-locked">
            <p>You must be logged in to report an incident.</p>
            <button type="button" className="submit-btn" onClick={() => navigate('/auth')}>
              Login/Register
            </button>
          </div>
        )}
      </section>

      <section className="panel-card">
        <h3>Scan your area</h3>
        <div className="map-shell">
          <MapContainer center={mapCenter} zoom={10} scrollWheelZoom={true} style={{ height: '320px', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {(locationMode === 'gps' && gps.lat && gps.lng) && (
              <Marker position={[Number(gps.lat), Number(gps.lng)]}>
                <Popup>GPS Location</Popup>
              </Marker>
            )}
            {(locationMode === 'manual' && manualCoords.lat && manualCoords.lng) && (
              <Marker position={[Number(manualCoords.lat), Number(manualCoords.lng)]}>
                <Popup>Manual Location</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </section>

      <section className="panel-card">
        <h3>Recent incidents</h3>
        <div className="table-card">
          <table className='data-table'>
            <thead>
              <tr>
                <th>Incident ID</th>
                <th>Incident Type</th>
                <th>Incident Date</th>
                <th>Incident Location</th>
                <th>Incident Description</th>
                <th>Incident Status</th>
                <th>Urgency</th>
                <th>Help</th>
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
                  <td>
                    <button type="button" className="secondary" onClick={() => openHelpModal(incident)}>
                      Need Help
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {helpModal.open && (
        <div className="help-modal" onClick={closeHelpModal}>
          <div className="help-modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>Request Help</h3>
            <p>{helpModal.incident?.IncidentType} • {helpModal.incident?.Location}</p>
            <label>Help Type</label>
            <select value={helpType} onChange={(event) => setHelpType(event.target.value)}>
              <option value="Medical">Medical Help</option>
              <option value="Rescue">Rescue Help</option>
              <option value="Food">Food</option>
              <option value="Shelter">Shelter</option>
            </select>
            <label>Phone Number</label>
            <input
              value={helpPhone}
              onChange={(event) => setHelpPhone(event.target.value)}
              placeholder="Your phone number"
            />
            {helpStatus && <p className="form-help">{helpStatus}</p>}
            <div className="button-row">
              <button type="button" className="secondary" onClick={closeHelpModal}>Close</button>
              <button type="button" className="primary" onClick={submitHelpRequest}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
