const Volunteer = require('../models/Volunteer');

const listVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find({});
        res.status(200).json({ volunteers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createVolunteer = async (req, res) => {
    try {
        const { name, phone, latitude, longitude, skills, available, createdBy } = req.body;
        if (!name || !phone || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ error: 'Missing required volunteer fields.' });
        }
        const normalizedPhone = phone && phone.trim().startsWith('+') ? phone.trim() : `+91${String(phone || '').trim()}`;
        const volunteer = await Volunteer.create({
            name,
            phone: normalizedPhone,
            location: {
                latitude: Number(latitude),
                longitude: Number(longitude)
            },
            skills: Array.isArray(skills) ? skills : [],
            available: Boolean(available),
            createdBy: createdBy || ''
        });
        res.status(201).json({ volunteer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { available } = req.body;
        const volunteer = await Volunteer.findByIdAndUpdate(
            id,
            { available: Boolean(available) },
            { new: true }
        );
        if (!volunteer) {
            return res.status(404).json({ error: 'Volunteer not found.' });
        }
        res.status(200).json({ volunteer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    listVolunteers,
    createVolunteer,
    updateAvailability
};
