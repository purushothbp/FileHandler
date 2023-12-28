//services has been imported to do the login operation
const express = require('express');
const services = require('../services');

const router = express.Router();

// Login route to do login operation
router.post('/login', services.loginUser);

module.exports = router;
