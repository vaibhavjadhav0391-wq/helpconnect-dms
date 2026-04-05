import "../assets/CSS/Donate.css";
import { useMemo, useState } from "react";
import donateHero from "../assets/images/bg1.jpg";

const Donate = () => {
    const [frequency, setFrequency] = useState("monthly");
    const [amount, setAmount] = useState(50);
    const [showDonate, setShowDonate] = useState(false);
    const presets = useMemo(() => [19, 50, 100], []);

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
                        <button type="button" className="primary" onClick={() => setShowDonate(true)}>
                            Donate Now
                        </button>
                    </div>
                </section>
                <section className="donate-card">
                    <h3>Volunteer Logistics</h3>
                    <p>Transport, fuel, and equipment support for field teams.</p>
                    <div className="donate-actions">
                        <button type="button" className="primary" onClick={() => setShowDonate(true)}>
                            Sponsor a Trip
                        </button>
                    </div>
                </section>
                <section className="donate-card">
                    <h3>Medical Supplies</h3>
                    <p>Basic medicines, first-aid kits, and hygiene supplies.</p>
                    <div className="donate-actions">
                        <button type="button" className="primary" onClick={() => setShowDonate(true)}>
                            Donate Supplies
                        </button>
                    </div>
                </section>
            </div>

            {showDonate && (
                <div className="donate-modal" onClick={() => setShowDonate(false)}>
                    <div className="donate-modal-card" onClick={(event) => event.stopPropagation()}>
                        <section className="donate-hero" style={{ backgroundImage: `url(${donateHero})` }}>
                            <div className="donate-overlay" />
                            <div className="donate-panel">
                                <div className="donate-card-large">
                                    <h3>GIVE NOW</h3>
                                    <p>
                                        Wherever disaster and poverty strike, you can be there to make a difference for someone in need.
                                        Your generosity brings hope to people in their darkest moments.
                                    </p>

                                    <div className="donate-tabs">
                                        <button
                                            type="button"
                                            className={frequency === "monthly" ? "tab active" : "tab"}
                                            onClick={() => setFrequency("monthly")}
                                        >
                                            Monthly
                                        </button>
                                        <button
                                            type="button"
                                            className={frequency === "one-time" ? "tab active" : "tab"}
                                            onClick={() => setFrequency("one-time")}
                                        >
                                            One-Time
                                        </button>
                                    </div>

                                    <div className="donate-presets">
                                        {presets.map((value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                className={amount === value ? "preset active" : "preset"}
                                                onClick={() => setAmount(value)}
                                            >
                                                ${value}
                                            </button>
                                        ))}
                                    </div>

                                    <p className="donate-note">
                                        {frequency === "monthly"
                                            ? "Monthly help can sustain life-saving programs worldwide."
                                            : "One-time gifts create immediate relief for families."
                                        }
                                    </p>

                                    <div className="donate-amount">
                                        <span>$</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(event) => setAmount(Number(event.target.value || 0))}
                                        />
                                    </div>

                                    <button type="button" className="donate-submit" disabled>
                                        Give Now
                                    </button>

                                    <div className="donate-trust">
                                        <span>Secure payments • Credit Card • UPI • PayPal</span>
                                    </div>
                                    <button type="button" className="donate-close" onClick={() => setShowDonate(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Donate;
