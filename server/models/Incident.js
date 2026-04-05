const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    IncidentID: {
        type: Number,
        required: true
    },
    Volunteers: {
        type: [Number]
    },

    AffectedIndividual : {
        type: [Number]
    },

    ApproximateaffectedCount : {
        type: Number,
        default: 0
    },

    LocationID: {
        type: Number,
        required: false
    },
    IncidentLocation: {
        type: String,
        default: ''
    },
    Latitude: {
        type: Number,
        required: false
    },
    Longitude: {
        type: Number,
        required: false
    },
    ImageUrl: {
        type: String,
        default: ''
    },
    IncidentType: {
        type: String,
        enum: ['Fire', 'Flood', 'Cyclone', 'Earthquake', 'Accident', 'Others'],
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    AffectedCount: {
        type: Number,
        default: 0
    },
    CommunityID: {
        type: Number,
    },
    ReportedBy: {
        type: String,
        default: ''
    },
    DateReported: {
        type: Date,
        default: Date.now
    },
    Urgency: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        required: true
    },
    Status: {
        type: String,
        enum: ['Running', 'Expired'],
        default: 'Running',
        required: true
    }
});

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;