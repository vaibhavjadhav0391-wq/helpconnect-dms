require('dotenv').config();
const mongoose = require('mongoose');
const Incident = require('../models/Incident');
const LiveIncident = require('../models/LiveIncident');

const legacyIncidents = [
  {
    IncidentType: 'Flood',
    Description: 'Flooding reported near central market.',
    IncidentLocation: 'Central Market',
    AffectedCount: 12,
    Urgency: 'High',
    Status: 'Running'
  },
  {
    IncidentType: 'Fire',
    Description: 'Small fire contained at warehouse.',
    IncidentLocation: 'Industrial Zone',
    AffectedCount: 0,
    Urgency: 'Medium',
    Status: 'Running'
  },
  {
    IncidentType: 'Accident',
    Description: 'Two-vehicle collision, minor injuries.',
    IncidentLocation: 'Ring Road 8',
    AffectedCount: 3,
    Urgency: 'High',
    Status: 'Running'
  },
  {
    IncidentType: 'Cyclone',
    Description: 'Cyclone watch issued for coastal area.',
    IncidentLocation: 'Coastal Sector 2',
    AffectedCount: 0,
    Urgency: 'High',
    Status: 'Running'
  },
  {
    IncidentType: 'Earthquake',
    Description: 'Light tremors felt, no damage reported.',
    IncidentLocation: 'Old City',
    AffectedCount: 0,
    Urgency: 'Low',
    Status: 'Running'
  }
];

const liveIncidents = [
  {
    title: 'Flooding Alert',
    description: 'Water level rising near river bank.',
    latitude: 19.0760,
    longitude: 72.8777,
    severity: 'high',
    locationName: 'Mumbai',
    submittedBy: 'Demo Control',
    affectedCount: 25
  },
  {
    title: 'Warehouse Fire',
    description: 'Smoke seen in industrial zone.',
    latitude: 18.5204,
    longitude: 73.8567,
    severity: 'medium',
    locationName: 'Pune',
    submittedBy: 'Demo Control',
    affectedCount: 2
  },
  {
    title: 'Road Accident',
    description: 'Multi-vehicle collision reported.',
    latitude: 23.0225,
    longitude: 72.5714,
    severity: 'high',
    locationName: 'Ahmedabad',
    submittedBy: 'Demo Control',
    affectedCount: 6
  },
  {
    title: 'Cyclone Watch',
    description: 'High winds expected within 12 hours.',
    latitude: 15.4909,
    longitude: 73.8278,
    severity: 'high',
    locationName: 'Goa',
    submittedBy: 'Demo Control',
    affectedCount: 0
  },
  {
    title: 'Minor Tremors',
    description: 'Light tremors felt, inspections ongoing.',
    latitude: 28.6139,
    longitude: 77.2090,
    severity: 'low',
    locationName: 'Delhi',
    submittedBy: 'Demo Control',
    affectedCount: 0
  }
];

const run = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing. Check server/.env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

  await Incident.deleteMany({});
  await LiveIncident.deleteMany({});

  const legacyDocs = legacyIncidents.map((incident, index) => ({
    IncidentID: index + 1,
    ...incident
  }));

  await Incident.insertMany(legacyDocs);
  await LiveIncident.insertMany(liveIncidents);

  await mongoose.disconnect();
  console.log('Reset complete: 5 legacy incidents and 5 live incidents seeded.');
};

run().catch((error) => {
  console.error('Reset failed:', error);
  mongoose.disconnect();
});
