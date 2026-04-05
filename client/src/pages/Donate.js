import "../assets/CSS/Donate.css";
import { useMemo, useState } from "react";
import donateHero from "../assets/images/bg2.jpeg";

const Donate = () => {
    const [frequency, setFrequency] = useState("monthly");
    const [amount, setAmount] = useState(50);
    const presets = useMemo(() => [19, 50, 100], []);

    return (
        <div className="donate-page">
            <div className="page-header">
                <h2 className="section-title">Donate</h2>
                <p className="section-subtitle">Support verified relief efforts in Maharashtra.</p>
            </div>

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
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Donate;
