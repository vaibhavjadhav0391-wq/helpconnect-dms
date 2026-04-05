const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Medical', 'Rescue', 'Food', 'Shelter'],
        required: true
    },
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    userPhone: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved'],
        default: 'pending'
    },
    matchedVolunteers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Volunteer',
        default: []
    },
    createdBy: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
