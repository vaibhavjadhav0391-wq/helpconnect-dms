const HelpRequest = require('../models/HelpRequest');
const Volunteer = require('../models/Volunteer');
const { notifyVolunteers } = require('../services/NotificationService');

const haversineKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const listHelpRequests = async (req, res) => {
    try {
        const requests = await HelpRequest.find({}).sort({ createdAt: -1 });
        res.status(200).json({ requests });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createHelpRequest = async (req, res) => {
    try {
        const { type, latitude, longitude, createdBy, userPhone } = req.body;
        if (!type || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ error: 'Missing required help request fields.' });
        }

        const request = await HelpRequest.create({
            type,
            location: {
                latitude: Number(latitude),
                longitude: Number(longitude)
            },
            userPhone: userPhone || '',
            createdBy: createdBy || ''
        });

        const volunteers = await Volunteer.find({ available: true });

        // ✅ FIX: use `matched` everywhere instead of `allVolunteers`
        const matched = volunteers.filter((volunteer) => {
            const skillMatch = volunteer.skills.includes(type);
            if (!skillMatch) return false;
            const distance = haversineKm(
                Number(latitude),
                Number(longitude),
                volunteer.location.latitude,
                volunteer.location.longitude
            );
            return distance <= 10;
        });

        // ✅ Save only matched volunteers to DB
        request.matchedVolunteers = matched.map((item) => item._id);
        await request.save();

        const message = `Emergency Alert!\nSomeone nearby needs your help.\n\nType: ${type}\nLocation: ${latitude}, ${longitude}\n\nYou are selected as a volunteer based on your skills.\nContact: ${userPhone || 'N/A'}\nPlease respond immediately.`;

        // ✅ Notify only matched volunteers
        try {
            await notifyVolunteers(matched, message);
        } catch (error) {
            console.log('Volunteer notification failed:', error.message);
        }

        const io = req.app.get('io');
        if (io) {
            io.emit('newHelpRequest', request);
        }

        res.status(201).json({ request, matchedVolunteers: matched });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateHelpStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const request = await HelpRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!request) {
            return res.status(404).json({ error: 'Help request not found.' });
        }
        res.status(200).json({ request });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    listHelpRequests,
    createHelpRequest,
    updateHelpStatus
};
