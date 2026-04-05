import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import io from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../assets/CSS/LiveMap.css';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl
});

const severityColors = {
    high: '#e74c3c',
    medium: '#f1c40f',
    low: '#2ecc71'
};

const createMarkerIcon = (color) =>
    L.divIcon({
        className: 'incident-marker',
        html: `<span class="marker-dot" style="background:${color}"></span>`,
        iconSize: [18, 18]
    });

const socket = io('http://localhost:5000', { transports: ['websocket'] });

const normalizeSeverity = (value) => {
    const severity = String(value || '').toLowerCase();
    if (severity === 'high') return 'high';
    if (severity === 'medium') return 'medium';
    return 'low';
};

const normalizeLiveIncident = (incident) => ({
    id: incident._id,
    title: incident.title || 'Incident',
    description: incident.description || '',
    latitude: Number(incident.latitude),
    longitude: Number(incident.longitude),
    locationName: incident.locationName || '',
    manualLocation: [incident.village, incident.taluka, incident.district, incident.state]
        .filter(Boolean)
        .join(', '),
    severity: normalizeSeverity(incident.severity),
    createdAt: incident.createdAt,
    submittedBy: incident.submittedBy || ''
});

const normalizeExistingIncident = (incident) => {
    const lat = incident.Location?.Latitude;
    const lng = incident.Location?.Longitude;
    return {
        id: `legacy-${incident.IncidentID}`,
        title: incident.IncidentType || 'Incident',
        description: incident.Description || '',
        latitude: Number(lat),
        longitude: Number(lng),
        locationName: incident.Location?.Address || incident.IncidentLocation || '',
        manualLocation: '',
        severity: normalizeSeverity(incident.Urgency),
        createdAt: incident.DateReported,
        submittedBy: incident.ReportedBy || ''
    };
};

const LiveMap = () => {
    const [incidents, setIncidents] = useState([]);
    const [userPosition, setUserPosition] = useState(null);
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = [position.coords.latitude, position.coords.longitude];
                setUserPosition(coords);
                setMapCenter(coords);
            },
            () => {
                setUserPosition(null);
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    }, []);

    useEffect(() => {
        const fetchIncidents = async () => {
            const [liveResponse, legacyResponse] = await Promise.all([
                fetch('http://localhost:5000/api/incidents'),
                fetch('http://localhost:5000/incident')
            ]);

            const liveData = await liveResponse.json();
            const legacyData = await legacyResponse.json();

            const liveItems = Array.isArray(liveData?.incidents)
                ? liveData.incidents.map(normalizeLiveIncident)
                : [];

            const legacyItems = Array.isArray(legacyData?.incidents)
                ? legacyData.incidents.map(normalizeExistingIncident)
                : [];

            const combined = [...liveItems, ...legacyItems].filter(
                (item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude)
            );

            if (liveResponse.ok || legacyResponse.ok) {
                setIncidents(combined);
            }
        };
        fetchIncidents();
    }, []);

    useEffect(() => {
        socket.on('newIncident', (incident) => {
            const normalized = normalizeLiveIncident(incident);
            if (!Number.isFinite(normalized.latitude) || !Number.isFinite(normalized.longitude)) {
                return;
            }
            setIncidents((prev) => [normalized, ...prev]);
        });

        return () => {
            socket.off('newIncident');
        };
    }, []);

    const markers = useMemo(() => {
        return incidents.map((incident) => {
            const color = severityColors[incident.severity] || severityColors.low;
            const icon = createMarkerIcon(color);
            return (
                <Marker
                    key={incident.id}
                    position={[incident.latitude, incident.longitude]}
                    icon={icon}
                >
                    <Popup>
                        <div className="popup-card">
                            <h4>{incident.title}</h4>
                            <p>{incident.description}</p>
                            <div className="popup-meta">
                                <span>{incident.manualLocation || incident.locationName || 'Unknown location'}</span>
                                <span className={`severity ${incident.severity}`}>{incident.severity}</span>
                            </div>
                            {incident.submittedBy && (
                                <div className="popup-date">Submitted by: {incident.submittedBy}</div>
                            )}
                            <div className="popup-date">
                                {incident.createdAt ? new Date(incident.createdAt).toLocaleString() : ''}
                            </div>
                        </div>
                    </Popup>
                </Marker>
            );
        });
    }, [incidents]);

    return (
        <div className="live-map">
            <MapContainer center={mapCenter} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {userPosition && (
                    <CircleMarker
                        center={userPosition}
                        radius={8}
                        pathOptions={{ color: '#2d9cdb', fillColor: '#2d9cdb', fillOpacity: 0.8 }}
                    >
                        <Popup>Your location</Popup>
                    </CircleMarker>
                )}
                <MarkerClusterGroup chunkedLoading>{markers}</MarkerClusterGroup>
            </MapContainer>
        </div>
    );
};

export default LiveMap;
