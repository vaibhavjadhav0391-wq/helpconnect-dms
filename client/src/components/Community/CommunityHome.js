import {Map} from '..';
import '../../assets/CSS/CommunityHome.css';
export const CommunityHome = () => {
  return (
    <>
                <section id="details" className="panel-card">
                    <h2>Community Details</h2>
                    <ul className="detail-list">
                        <li><span>Incident Type:</span> Flood</li>
                        <li><span>Incident Details:</span> Monsoon Relief 2024</li>
                        <li><span>Number of Members:</span> Maharashtra</li>
                        <li><span>Community Leader:</span> Vaibhav</li>
                        <li><span>Community Location:</span> Maharashtra, India</li>
                        <li><span>Date Created:</span> 16/07/2024</li>
                    </ul>
                </section>

                <section id="volunteer" className="panel-card">
                    <h2>Volunteer and Donation Opportunities</h2>
                    <div className="button-row">
                        <button className='volunteer-donate-btn'>Join as Volunteer</button>
                        <button className='volunteer-donate-btn secondary'>Donate Us</button>
                    </div>
                </section>

                <section id="maps" className="panel-card">
                    <h2>Interactive Maps</h2>
                    <div className="map-notes">
                        <span>Incident Location: Mumbai, Maharashtra, India</span>
                        <span>Location Coordinates: 19.0760° N, 72.8777° E</span>
                    </div>
                    <Map locations={[{ position: [19.0760, 72.8777], popupText: 'Mumbai Center' }]} 
                        longitude={19.0760} latitude={72.8777} defaultZoom={11} />
                </section>
    </>
  )
}
