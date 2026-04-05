import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import '../assets/CSS/Map.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';


// Fix the default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl
  });
  


const Map = ({ locations, longitude, latitude, defaultZoom }) => {
  const safeLocations = Array.isArray(locations) ? locations : [];
  const hasCoords = Number.isFinite(latitude) && Number.isFinite(longitude);
  const defaultPosition = hasCoords ? [latitude, longitude] : [0, 0];
  const zoomLevel = Number.isFinite(defaultZoom) ? defaultZoom : 5;

  return (
    <div className='map-container'>
      <MapContainer center={defaultPosition} zoom={zoomLevel} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {safeLocations.map((location, idx) => (
          <Marker key={idx} position={location.position}>
            <Popup>
              {location.popupText}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}


export {Map};
