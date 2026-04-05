const mongoose = require('mongoose');

const liveIncidentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    latitude: {
        type: Number,
        required: false
    },
    longitude: {
        type: Number,
        required: false
    },
    locationName: {
        type: String,
        default: ''
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    state: {
        type: String,
        default: ''
    },
    district: {
        type: String,
        default: ''
    },
    taluka: {
        type: String,
        default: ''
    },
    village: {
        type: String,
        default: ''
    },
        submittedBy: {
            type: String,
            default: ''
        },
        affectedCount: {
            type: Number,
            default: 0
        },
        imageUrl: {
            type: String,
            default: ''
        },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LiveIncident', liveIncidentSchema);
