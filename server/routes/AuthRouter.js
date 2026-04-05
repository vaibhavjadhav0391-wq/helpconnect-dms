const express = require('express');
const router = express.Router();
const {register , login, firebaseSync} = require('../controllers/Authentication');

router.post('/login', login) 


router.post('/register', register)

router.post('/firebase-sync', firebaseSync)

module.exports = router;