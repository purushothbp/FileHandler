const express = require('express');
const services = require('../services');

const router = express.Router();

// Logout route does operation like it will dletes the user's authtoken from the database.
router.delete('/logout/:username', services.logoutUser);

module.exports = router;
