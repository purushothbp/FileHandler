const express = require('express');
const services = require('../services');

const router = express.Router();

// download route which alows users to download the files that already available 

router.get('/download/:_id', services.downloadFile);

module.exports = router;
