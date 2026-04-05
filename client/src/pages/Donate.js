import "../assets/CSS/Donate.css";
import { useState } from "react";

const Donate = () => {
    const [showBank, setShowBank] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [showSupplies, setShowSupplies] = useState(false);
    return (
        <div className="donate-page">
            <div className="page-header">
                <h2 className="section-title">Donate</h2>
                <p className="section-subtitle">Support verified relief efforts in Maharashtra.</p>
            </div>
            <div className="donate-grid">
                <section className="donate-card">
                    <h3>Emergency Relief Fund</h3>
                    <p>Funds for food, water, and temporary shelter supplies.</p>
                    <div className="donate-actions">
                        <button className="primary" disabled>Donate Now</button>
                        <button className="secondary" onClick={() => setShowBank(true)}>Bank Details</button>
                    </div>
                </section>
                <section className="donate-card">
                    <h3>Volunteer Logistics</h3>
                    <p>Transport, fuel, and equipment support for field teams.</p>
                    <div className="donate-actions">
                        <button className="primary" disabled>Sponsor a Trip</button>
                        <button className="secondary" onClick={() => setShowContact(true)}>Contact Team</button>
                    </div>
                </section>
                <section className="donate-card">
                    <h3>Medical Supplies</h3>
                    <p>Basic medicines, first-aid kits, and hygiene supplies.</p>
                    <div className="donate-actions">
                        <button className="primary" disabled>Donate Supplies</button>
                        <button className="secondary" onClick={() => setShowSupplies(true)}>View List</button>
                    </div>
                </section>
            </div>
            {showBank && (
                <div className="bank-modal" onClick={() => setShowBank(false)}>
                    <div className="bank-card" onClick={(e) => e.stopPropagation()}>
                        <h3>Bank Details (Demo)</h3>
                        <div className="bank-grid">
                            <div>
                                <span>Account Name</span>
                                <strong>DMS Relief Fund</strong>
                            </div>
                            <div>
                                <span>Account Number</span>
                                <strong>1234 5678 9012 3456</strong>
                            </div>
                            <div>
                                <span>IFSC</span>
                                <strong>DMSB0000123</strong>
                            </div>
                            <div>
                                <span>Bank</span>
                                <strong>State Bank of India</strong>
                            </div>
                            <div>
                                <span>UPI</span>
                                <strong>dmsrelief@upi</strong>
                            </div>
                        </div>
                        <button className="primary" onClick={() => setShowBank(false)}>Close</button>
                    </div>
                </div>
            )}
            {showContact && (
                <div className="bank-modal" onClick={() => setShowContact(false)}>
                    <div className="bank-card" onClick={(e) => e.stopPropagation()}>
                        <h3>Contact Team (Demo)</h3>
                        <div className="bank-grid">
                            <div>
                                <span>Email</span>
                                <strong>logistics@dms-relief.in</strong>
                            </div>
                            <div>
                                <span>Phone</span>
                                <strong>+91 8767008142</strong>
                            </div>
                            <div>
                                <span>Hours</span>
                                <strong>Mon-Sun, 9:00-18:00</strong>
                            </div>
                        </div>
                        <button className="primary" onClick={() => setShowContact(false)}>Close</button>
                    </div>
                </div>
            )}
            {showSupplies && (
                <div className="bank-modal" onClick={() => setShowSupplies(false)}>
                    <div className="bank-card" onClick={(e) => e.stopPropagation()}>
                        <h3>Supplies List (Demo)</h3>
                        <ul className="supplies-list">
                            <li>First-aid kits</li>
                            <li>Water bottles</li>
                            <li>Dry food packets</li>
                            <li>Blankets</li>
                            <li>Sanitary kits</li>
                        </ul>
                        <button className="primary" onClick={() => setShowSupplies(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Donate;
