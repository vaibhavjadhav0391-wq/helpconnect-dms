import "../assets/CSS/Announcements.css";

const demoAnnouncements = [
    {
        id: 1,
        title: "Monsoon alert: Mumbai",
        body: "Heavy rainfall expected in the next 48 hours. Avoid low-lying areas and keep emergency kits ready.",
        date: "2024-07-28 10:30"
    },
    {
        id: 2,
        title: "Shelter update: Pune",
        body: "Two new temporary shelters opened near Kothrud. Volunteers needed for evening shifts.",
        date: "2024-07-27 18:15"
    },
    {
        id: 3,
        title: "Helpline status",
        body: "State helpline is active 24/7. Dial 1070 for immediate assistance.",
        date: "2024-07-26 09:00"
    }
];

const Announcements = () => {
    return (
        <div className="announcements-page">
            <div className="page-header">
                <h2 className="section-title">Announcements</h2>
                <p className="section-subtitle">Verified updates for the community.</p>
            </div>
            <div className="announcement-list">
                {demoAnnouncements.map((item) => (
                    <article key={item.id} className="announcement-card">
                        <div className="announcement-head">
                            <h3>{item.title}</h3>
                            <span className="announcement-date">{new Date(item.date).toLocaleString()}</span>
                        </div>
                        <p>{item.body}</p>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Announcements;
