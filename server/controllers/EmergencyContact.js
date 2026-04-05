const EmergencyContact = require('../models/EmergencyContact');

const listContacts = async (req, res) => {
    try {
        const contacts = await EmergencyContact.find({}).sort({ contactID: 1 });
        res.status(200).json({ contacts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createContact = async (req, res) => {
    try {
        const { contactID, name, designation, locationID, phone, email } = req.body;
        if (!contactID || !name || !designation || !locationID || !phone || !email) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const existing = await EmergencyContact.findOne({ contactID: Number(contactID) });
        if (existing) {
            return res.status(409).json({ error: 'Contact ID already exists.' });
        }
        const contact = await EmergencyContact.create({
            contactID: Number(contactID),
            name,
            designation,
            locationID: Number(locationID),
            phone,
            email
        });
        res.status(201).json({ contact });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { contactID, name, designation, locationID, phone, email } = req.body;
        const updated = await EmergencyContact.findByIdAndUpdate(
            id,
            {
                contactID: Number(contactID),
                name,
                designation,
                locationID: Number(locationID),
                phone,
                email
            },
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ error: 'Contact not found.' });
        }
        res.status(200).json({ contact: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const removed = await EmergencyContact.findByIdAndDelete(id);
        if (!removed) {
            return res.status(404).json({ error: 'Contact not found.' });
        }
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    listContacts,
    createContact,
    updateContact,
    deleteContact
};
