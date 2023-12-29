const express = require('express');
const services = require('../services');

const router = express.Router();

// Register route which alows users to register with all creditionals
router.post('/Register', services.registerUser);

module.exports = router;
