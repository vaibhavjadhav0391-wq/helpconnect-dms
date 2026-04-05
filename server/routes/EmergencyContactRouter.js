const express = require('express');
const router = express.Router();

const {
    listContacts,
    createContact,
    updateContact,
    deleteContact
} = require('../controllers/EmergencyContact');

router.get('/', listContacts);
router.post('/', createContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;
