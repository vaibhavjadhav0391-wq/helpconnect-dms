const FacilityRequest = require('../models/FacilityRequest');
const Hospital = require('../models/Hospital');
const Shelter = require('../models/Shelter');

const createFacilityRequest = async (req, res) => {
    try {
        const { type, name, address, district, phone, email, seats, description, submittedBy } = req.body;
        if (!type || !name || !address || !district || !phone || !email || !seats) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        const request = await FacilityRequest.create({
            type,
            name,
            address,
            district,
            phone,
            email,
            seats: Number(seats),
            description: description || '',
            submittedBy: submittedBy || ''
        });
        res.status(201).json({ request });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const listFacilityRequests = async (req, res) => {
    try {
        const { submittedBy, status } = req.query;
        const filter = {};
        if (submittedBy) filter.submittedBy = submittedBy;
        if (status) filter.status = status;
        const requests = await FacilityRequest.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ requests });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const approveFacilityRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await FacilityRequest.findById(id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found.' });
        }
        if (request.status === 'approved') {
            return res.status(200).json({ request });
        }

        const payload = {
            name: request.name,
            address: request.address,
            district: request.district,
            phone: request.phone,
            email: request.email,
            seats: request.seats,
            description: request.description
        };

        if (request.type === 'hospital') {
            await Hospital.create(payload);
        } else {
            await Shelter.create(payload);
        }

        request.status = 'approved';
        await request.save();

        res.status(200).json({ request });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const listFacilities = async (req, res) => {
    try {
        const hospitals = await Hospital.find({}).sort({ createdAt: -1 });
        const shelters = await Shelter.find({}).sort({ createdAt: -1 });
        res.status(200).json({ hospitals, shelters });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const rejectFacilityRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await FacilityRequest.findById(id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found.' });
        }
        request.status = 'rejected';
        await request.save();
        res.status(200).json({ request });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createFacilityRequest,
    listFacilityRequests,
    approveFacilityRequest,
    rejectFacilityRequest,
    listFacilities
};
