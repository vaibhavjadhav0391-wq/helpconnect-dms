import { useEffect, useMemo, useState } from 'react';
import '../assets/CSS/Admin.css';
import { useSelector } from 'react-redux';

const ADMIN_EMAILS = ['vaibhav.jadhav04@mit.asia', 'vaibhavjadhav0391@gmail.com'];

const Admin = () => {
    const user = useSelector((state) => state.userState.user);
    const [contacts, setContacts] = useState([]);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const [incidents, setIncidents] = useState([]);
    const [incidentStatus, setIncidentStatus] = useState('idle');
    const [incidentError, setIncidentError] = useState('');
    const [facilityRequests, setFacilityRequests] = useState([]);
    const [facilityStatus, setFacilityStatus] = useState('idle');
    const [facilityError, setFacilityError] = useState('');
    const [volunteers, setVolunteers] = useState([]);
    const [volunteerStatus, setVolunteerStatus] = useState('idle');
    const [volunteerError, setVolunteerError] = useState('');
    const [helpRequests, setHelpRequests] = useState([]);
    const [helpStatus, setHelpStatus] = useState('idle');
    const [helpError, setHelpError] = useState('');
    const [form, setForm] = useState({
        contactID: '',
        name: '',
        designation: '',
        locationID: '',
        phone: '',
        email: ''
    });
    const [editingId, setEditingId] = useState('');
    const [incidentForm, setIncidentForm] = useState({
        IncidentID: '',
        IncidentType: 'Flood',
        Description: '',
        IncidentLocation: '',
        LocationID: '',
        AffectedCount: '',
        Urgency: 'High',
        Status: 'Running'
    });
    const [incidentEditingId, setIncidentEditingId] = useState('');

    const isAdmin = useMemo(() => {
        const email = user?.Email || '';
        return ADMIN_EMAILS.includes(email.toLowerCase());
    }, [user]);

    const fetchContacts = async () => {
        setStatus('loading');
        setError('');
        try {
            const response = await fetch('process.env.REACT_APP_API_URL/contacts');
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || 'Failed to load contacts.');
            }
            setContacts(Array.isArray(data?.contacts) ? data.contacts : []);
            setStatus('success');
        } catch (err) {
            setStatus('error');
            setError(err.message);
        }
    };

    const fetchIncidents = async () => {
        setIncidentStatus('loading');
        setIncidentError('');
        try {
            const response = await fetch('process.env.REACT_APP_API_URL/incident');
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || 'Failed to load incidents.');
            }
            setIncidents(Array.isArray(data?.incidents) ? data.incidents : []);
            setIncidentStatus('success');
        } catch (err) {
            setIncidentStatus('error');
            setIncidentError(err.message);
        }
    };

    const fetchFacilityRequests = async () => {
        setFacilityStatus('loading');
        setFacilityError('');
        try {
            const response = await fetch('process.env.REACT_APP_API_URL/api/facility-requests');
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || 'Failed to load facility requests.');
            }
            setFacilityRequests(Array.isArray(data?.requests) ? data.requests : []);
            setFacilityStatus('success');
        } catch (err) {
            setFacilityStatus('error');
            setFacilityError(err.message);
        }
    };

    const fetchVolunteers = async () => {
        setVolunteerStatus('loading');
        setVolunteerError('');
        try {
            const response = await fetch('process.env.REACT_APP_API_URL/api/volunteers');
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || 'Failed to load volunteers.');
            }
            setVolunteers(Array.isArray(data?.volunteers) ? data.volunteers : []);
            setVolunteerStatus('success');
        } catch (err) {
            setVolunteerStatus('error');
            setVolunteerError(err.message);
        }
    };

    const fetchHelpRequests = async () => {
        setHelpStatus('loading');
        setHelpError('');
        try {
            const response = await fetch('process.env.REACT_APP_API_URL/api/help-requests');
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || 'Failed to load help requests.');
            }
            setHelpRequests(Array.isArray(data?.requests) ? data.requests : []);
            setHelpStatus('success');
        } catch (err) {
            setHelpStatus('error');
            setHelpError(err.message);
        }
    };

    const updateHelpStatus = async (id, status) => {
        try {
            const response = await fetch(`process.env.REACT_APP_API_URL/api/help-requests/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || 'Failed to update help status.');
            }
            await fetchHelpRequests();
        } catch (err) {
            setHelpError(err.message);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchContacts();
            fetchIncidents();
            fetchFacilityRequests();
            fetchVolunteers();
            fetchHelpRequests();
        }
    }, [isAdmin]);

    const updateForm = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const resetForm = () => {
        setForm({
            contactID: '',
            name: '',
            designation: '',
            locationID: '',
            phone: '',
            email: ''
        });
        setEditingId('');
    };

    const updateIncidentForm = (key, value) => {
        setIncidentForm((prev) => ({ ...prev, [key]: value }));
    };

    const resetIncidentForm = () => {
        setIncidentForm({
            IncidentID: '',
            IncidentType: 'Flood',
            Description: '',
            IncidentLocation: '',
            LocationID: '',
            AffectedCount: '',
            Urgency: 'High',
            Status: 'Running'
        });
        setIncidentEditingId('');
    };

    const submitContact = async (event) => {
        event.preventDefault();
        setError('');
        const payload = {
            contactID: Number(form.contactID),
            name: form.name.trim(),
            designation: form.designation.trim(),
            locationID: Number(form.locationID),
            phone: form.phone.trim(),
            email: form.email.trim()
        };
        try {
            const response = await fetch(
                editingId ? `process.env.REACT_APP_API_URL/contacts/${editingId}` : 'process.env.REACT_APP_API_URL/contacts',
                {
                    method: editingId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || 'Failed to save contact.');
            }
            await fetchContacts();
            resetForm();
        } catch (err) {
            setError(err.message);
        }
    };

    const startEdit = (contact) => {
        setEditingId(contact._id);
        setForm({
            contactID: contact.contactID ?? '',
            name: contact.name || '',
            designation: contact.designation || '',
            locationID: contact.locationID ?? '',
            phone: contact.phone || '',
            email: contact.email || ''
        });
    };

    const deleteContact = async (contactId) => {
        if (!window.confirm('Delete this contact?')) return;
        setError('');
        try {
            const response = await fetch(`process.env.REACT_APP_API_URL/contacts/${contactId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || 'Failed to delete contact.');
            }
            await fetchContacts();
        } catch (err) {
            setError(err.message);
        }
    };

    const startIncidentEdit = (incident) => {
        setIncidentEditingId(incident.IncidentID);
        setIncidentForm({
            IncidentID: incident.IncidentID ?? '',
            IncidentType: incident.IncidentType || 'Flood',
            Description: incident.Description || '',
            IncidentLocation: incident.IncidentLocation || '',
            LocationID: incident.LocationID ?? '',
            AffectedCount: incident.AffectedCount ?? '',
            Urgency: incident.Urgency || 'High',
            Status: incident.Status || 'Running'
        });
    };

    const submitIncidentUpdate = async (event) => {
        event.preventDefault();
        if (!incidentEditingId) {
            setIncidentError('Select an incident to edit.');
            return;
        }
        setIncidentError('');
        const payload = {
            IncidentType: incidentForm.IncidentType,
            Description: incidentForm.Description.trim(),
            IncidentLocation: incidentForm.IncidentLocation.trim(),
            LocationID: incidentForm.LocationID ? Number(incidentForm.LocationID) : undefined,
            AffectedCount: incidentForm.AffectedCount ? Number(incidentForm.AffectedCount) : 0,
            Urgency: incidentForm.Urgency,
            Status: incidentForm.Status
        };
        try {
            const response = await fetch(`process.env.REACT_APP_API_URL/incident/${incidentEditingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || 'Failed to update incident.');
            }
            await fetchIncidents();
            resetIncidentForm();
        } catch (err) {
            setIncidentError(err.message);
        }
    };

    const deleteIncident = async (incidentId) => {
        if (!window.confirm('Delete this incident?')) return;
        setIncidentError('');
        try {
            const response = await fetch(`process.env.REACT_APP_API_URL/incident/${incidentId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || 'Failed to delete incident.');
            }
            await fetchIncidents();
        } catch (err) {
            setIncidentError(err.message);
        }
    };

    const approveFacility = async (id) => {
        try {
            const response = await fetch(`process.env.REACT_APP_API_URL/api/facility-request/${id}/approve`, {
                method: 'PUT'
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || 'Failed to approve request.');
            }
            await fetchFacilityRequests();
        } catch (err) {
            setFacilityError(err.message);
        }
    };

    const rejectFacility = async (id) => {
        try {
            const response = await fetch(`process.env.REACT_APP_API_URL/api/facility-request/${id}/reject`, {
                method: 'PUT'
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || 'Failed to reject request.');
            }
            await fetchFacilityRequests();
        } catch (err) {
            setFacilityError(err.message);
        }
    };

    if (!isAdmin) {
        return (
            <div className="admin-page">
                <div className="admin-locked">
                    <h2>Admin access required</h2>
                    <p>This page is restricted to the developer account.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <section className="admin-header">
                <h2>Admin Console</h2>
                <p>Manage emergency contacts shown across the site.</p>
            </section>

            <section className="admin-panel">
                <h3>{editingId ? 'Update contact' : 'Add new contact'}</h3>
                <form className="admin-form" onSubmit={submitContact}>
                    <div className="form-row">
                        <label>Contact ID</label>
                        <input
                            type="number"
                            value={form.contactID}
                            onChange={(event) => updateForm('contactID', event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <label>Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(event) => updateForm('name', event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <label>Designation</label>
                        <input
                            type="text"
                            value={form.designation}
                            onChange={(event) => updateForm('designation', event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <label>Location ID</label>
                        <input
                            type="number"
                            value={form.locationID}
                            onChange={(event) => updateForm('locationID', event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <label>Phone</label>
                        <input
                            type="text"
                            value={form.phone}
                            onChange={(event) => updateForm('phone', event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <label>Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(event) => updateForm('email', event.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="form-error">{error}</div>}
                    <div className="form-actions">
                        <button type="submit" className="primary">
                            {editingId ? 'Save changes' : 'Create contact'}
                        </button>
                        {editingId && (
                            <button type="button" className="secondary" onClick={resetForm}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="admin-panel">
                <h3>All contacts</h3>
                {status === 'loading' && <p className="status">Loading contacts...</p>}
                {status === 'error' && <p className="status error">{error}</p>}
                {status !== 'loading' && (
                    <div className="table-card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Contact ID</th>
                                    <th>Name</th>
                                    <th>Designation</th>
                                    <th>Location ID</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map((contact) => (
                                    <tr key={contact._id}>
                                        <td>{contact.contactID}</td>
                                        <td>{contact.name}</td>
                                        <td>{contact.designation}</td>
                                        <td>{contact.locationID}</td>
                                        <td>{contact.phone}</td>
                                        <td>{contact.email}</td>
                                        <td className="row-actions">
                                            <button type="button" className="link" onClick={() => startEdit(contact)}>
                                                Edit
                                            </button>
                                            <button type="button" className="link danger" onClick={() => deleteContact(contact._id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {contacts.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="empty-state">No contacts found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="admin-panel">
                <h3>{incidentEditingId ? 'Update incident' : 'Select incident to edit'}</h3>
                <form className="admin-form" onSubmit={submitIncidentUpdate}>
                    <div className="form-row">
                        <label>Incident ID</label>
                        <input type="text" value={incidentForm.IncidentID} readOnly />
                    </div>
                    <div className="form-row">
                        <label>Type</label>
                        <select
                            value={incidentForm.IncidentType}
                            onChange={(event) => updateIncidentForm('IncidentType', event.target.value)}
                        >
                            <option value="Flood">Flood</option>
                            <option value="Fire">Fire</option>
                            <option value="Cyclone">Cyclone</option>
                            <option value="Earthquake">Earthquake</option>
                            <option value="Accident">Accident</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <label>Description</label>
                        <input
                            type="text"
                            value={incidentForm.Description}
                            onChange={(event) => updateIncidentForm('Description', event.target.value)}
                        />
                    </div>
                    <div className="form-row">
                        <label>Incident Location</label>
                        <input
                            type="text"
                            value={incidentForm.IncidentLocation}
                            onChange={(event) => updateIncidentForm('IncidentLocation', event.target.value)}
                        />
                    </div>
                    <div className="form-row">
                        <label>Location ID</label>
                        <input
                            type="number"
                            value={incidentForm.LocationID}
                            onChange={(event) => updateIncidentForm('LocationID', event.target.value)}
                        />
                    </div>
                    <div className="form-row">
                        <label>Affected Count</label>
                        <input
                            type="number"
                            value={incidentForm.AffectedCount}
                            onChange={(event) => updateIncidentForm('AffectedCount', event.target.value)}
                        />
                    </div>
                    <div className="form-row">
                        <label>Urgency</label>
                        <select
                            value={incidentForm.Urgency}
                            onChange={(event) => updateIncidentForm('Urgency', event.target.value)}
                        >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <label>Status</label>
                        <select
                            value={incidentForm.Status}
                            onChange={(event) => updateIncidentForm('Status', event.target.value)}
                        >
                            <option value="Running">Running</option>
                            <option value="Expired">Expired</option>
                        </select>
                    </div>
                    {incidentError && <div className="form-error">{incidentError}</div>}
                    <div className="form-actions">
                        <button type="submit" className="primary">Save incident</button>
                        {incidentEditingId && (
                            <button type="button" className="secondary" onClick={resetIncidentForm}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="admin-panel">
                <h3>All incidents</h3>
                {incidentStatus === 'loading' && <p className="status">Loading incidents...</p>}
                {incidentStatus === 'error' && <p className="status error">{incidentError}</p>}
                {incidentStatus !== 'loading' && (
                    <div className="table-card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                    <th>Location</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Urgency</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incidents.map((incident) => (
                                    <tr key={incident.IncidentID}>
                                        <td>{incident.IncidentID}</td>
                                        <td>{incident.IncidentType}</td>
                                        <td>{incident.DateReported ? String(incident.DateReported).split('T')[0] : ''}</td>
                                        <td>{incident.Location?.Address || incident.IncidentLocation || ''}</td>
                                        <td>{incident.Description}</td>
                                        <td>{incident.Status}</td>
                                        <td>{incident.Urgency}</td>
                                        <td className="row-actions">
                                            <button type="button" className="link" onClick={() => startIncidentEdit(incident)}>
                                                Edit
                                            </button>
                                            <button type="button" className="link danger" onClick={() => deleteIncident(incident.IncidentID)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {incidents.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="empty-state">No incidents found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="admin-panel">
                <h3>Help requests</h3>
                {helpStatus === 'loading' && <p className="status">Loading help requests...</p>}
                {helpStatus === 'error' && <p className="status error">{helpError}</p>}
                {helpStatus !== 'loading' && (
                    <div className="table-card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Phone</th>
                                    <th>Location</th>
                                    <th>Created By</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {helpRequests.map((request) => (
                                    <tr key={request._id}>
                                        <td>{request.type}</td>
                                        <td>{request.status}</td>
                                        <td>{request.userPhone || '-'}</td>
                                        <td>{request.location ? `${request.location.latitude}, ${request.location.longitude}` : '-'}</td>
                                        <td>{request.createdBy || '-'}</td>
                                        <td>{request.createdAt ? new Date(request.createdAt).toLocaleString() : '-'}</td>
                                        <td className="row-actions">
                                            <button type="button" className="link" onClick={() => updateHelpStatus(request._id, 'pending')}>
                                                Pending
                                            </button>
                                            <button type="button" className="link" onClick={() => updateHelpStatus(request._id, 'in-progress')}>
                                                In progress
                                            </button>
                                            <button type="button" className="link" onClick={() => updateHelpStatus(request._id, 'resolved')}>
                                                Resolved
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {helpRequests.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="empty-state">No help requests found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="admin-panel">
                <h3>Facility Requests</h3>
                {facilityStatus === 'loading' && <p className="status">Loading requests...</p>}
                {facilityStatus === 'error' && <p className="status error">{facilityError}</p>}
                {facilityStatus !== 'loading' && (
                    <div className="table-card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Location</th>
                                    <th>Submitted By</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facilityRequests.map((req) => (
                                    <tr key={req._id}>
                                        <td>{req.name}</td>
                                        <td>{req.type}</td>
                                        <td>{req.district}</td>
                                        <td>{req.submittedBy || 'Guest'}</td>
                                        <td>{req.status}</td>
                                        <td className="row-actions">
                                            <button type="button" className="link" onClick={() => approveFacility(req._id)}>
                                                Approve
                                            </button>
                                            <button type="button" className="link danger" onClick={() => rejectFacility(req._id)}>
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {facilityRequests.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="empty-state">No requests found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="admin-panel">
                <h3>Volunteers</h3>
                {volunteerStatus === 'loading' && <p className="status">Loading volunteers...</p>}
                {volunteerStatus === 'error' && <p className="status error">{volunteerError}</p>}
                {volunteerStatus !== 'loading' && (
                    <div className="table-card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Skills</th>
                                    <th>Status</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {volunteers.map((volunteer) => (
                                    <tr key={volunteer._id}>
                                        <td>{volunteer.name}</td>
                                        <td>{volunteer.phone}</td>
                                        <td>{volunteer.skills?.join(', ') || '-'}</td>
                                        <td>{volunteer.available ? 'Available' : 'Busy'}</td>
                                        <td>
                                            {volunteer.location?.latitude && volunteer.location?.longitude
                                                ? `${volunteer.location.latitude}, ${volunteer.location.longitude}`
                                                : '-'}
                                        </td>
                                    </tr>
                                ))}
                                {volunteers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="empty-state">No volunteers found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Admin;
