const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    NotificationID: {
        type: Number,
        required: true
    },
    IncidentID: {
        type: Number,
        required: false
    },
    Message: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        default: 'incident'
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
