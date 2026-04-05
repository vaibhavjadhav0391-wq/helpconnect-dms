const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({})
            .sort({ CreatedAt: -1 })
            .limit(10);
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getNotifications
};
