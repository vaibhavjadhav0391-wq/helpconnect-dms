import "../assets/CSS/Guidelines.css";

const Guidelines = () => {
  return (
    <div className="guidelines-page">
      <div className="page-header">
        <h2 className="section-title">Safety Guidelines</h2>
        <p className="section-subtitle">Simple steps to stay safe and respond quickly.</p>
      </div>
      <section className="panel-card guidelines-card">
        <h3>Before a Disaster</h3>
        <ul>
          <li>Save emergency contacts and local helpline numbers.</li>
          <li>Prepare a go-bag with water, food, flashlight, and medicines.</li>
          <li>Share your family meeting point and evacuation routes.</li>
        </ul>
      </section>
      <section className="panel-card guidelines-card">
        <h3>During a Disaster</h3>
        <ul>
          <li>Stay calm and follow official alerts.</li>
          <li>Move to higher ground during floods.</li>
          <li>Switch off electricity if water enters your home.</li>
        </ul>
      </section>
      <section className="panel-card guidelines-card">
        <h3>After a Disaster</h3>
        <ul>
          <li>Check on neighbors and report incidents.</li>
          <li>Avoid downed wires and damaged buildings.</li>
          <li>Use the app to request help or offer support.</li>
        </ul>
      </section>
    </div>
  );
};

export default Guidelines;
