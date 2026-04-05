const mongoose = require('mongoose');

const facilityRequestSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['hospital', 'shelter'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    submittedBy: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FacilityRequest', facilityRequestSchema);
