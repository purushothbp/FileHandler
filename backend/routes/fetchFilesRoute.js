const express = require('express');
const services = require('../services');

const router = express.Router();

// delete route which alows users to delete the files that already available 

router.get('/files/:userId', services.updateFile);

module.exports = router;
