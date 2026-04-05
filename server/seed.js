require('dotenv').config();
const mongoose = require('mongoose');
const Incident = require('./models/Incident');
const EmergencyContact = require('./models/EmergencyContact');

const incidentsSeed = [
    {
        IncidentType: 'Flood',
        Description: 'Water level rising near main road.',
        IncidentLocation: 'Near Central Market',
        Urgency: 'High',
        Status: 'Running'
    },
    {
        IncidentType: 'Fire',
        Description: 'Small fire reported in residential block.',
        IncidentLocation: 'Sector 5, Block B',
        Urgency: 'Medium',
        Status: 'Running'
    },
    {
        IncidentType: 'Accident',
        Description: 'Two-vehicle collision, road partially blocked.',
        IncidentLocation: 'Highway Junction 12',
        Urgency: 'High',
        Status: 'Running'
    },
    {
        IncidentType: 'Cyclone',
        Description: 'High winds expected, shelters opened.',
        IncidentLocation: 'Coastal Zone 3',
        Urgency: 'High',
        Status: 'Running'
    },
    {
        IncidentType: 'Earthquake',
        Description: 'Minor tremors reported, inspections ongoing.',
        IncidentLocation: 'Downtown District',
        Urgency: 'Low',
        Status: 'Running'
    }
];

const contactsSeed = [
    {
        contactID: 101,
        name: 'Emergency Desk - City Hall',
        designation: 'Control Room',
        locationID: 1,
        phone: '1002003001',
        email: 'controlroom@city.gov'
    },
    {
        contactID: 102,
        name: 'Ambulance Helpline',
        designation: 'Medical Response',
        locationID: 1,
        phone: '1002003002',
        email: 'ambulance@city.gov'
    },
    {
        contactID: 103,
        name: 'Fire Brigade HQ',
        designation: 'Fire Response',
        locationID: 1,
        phone: '1002003003',
        email: 'fire@city.gov'
    },
    {
        contactID: 104,
        name: 'Disaster Relief Desk',
        designation: 'Relief Support',
        locationID: 1,
        phone: '1002003004',
        email: 'relief@city.gov'
    },
    {
        contactID: 105,
        name: 'Police Control',
        designation: 'Law and Order',
        locationID: 1,
        phone: '1002003005',
        email: 'police@city.gov'
    }
];

const run = async () => {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is missing. Check server/.env');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

    const incidentCount = await Incident.countDocuments();
    const contactCount = await EmergencyContact.countDocuments();

    if (incidentCount < 5) {
        let nextIncidentId = incidentCount + 1;
        const incidentsToInsert = incidentsSeed.slice(0, 5 - incidentCount).map((incident) => ({
            IncidentID: nextIncidentId++,
            ...incident
        }));
        await Incident.insertMany(incidentsToInsert);
        console.log(`Inserted ${incidentsToInsert.length} incidents.`);
    } else {
        console.log('Incidents already have 5 or more entries.');
    }

    if (contactCount < 1) {
        await EmergencyContact.insertMany(contactsSeed);
        console.log(`Inserted ${contactsSeed.length} emergency contacts.`);
    } else {
        console.log('Emergency contacts already exist.');
    }

    await mongoose.disconnect();
};

run().catch((error) => {
    console.error('Seeding failed:', error);
    mongoose.disconnect();
});
