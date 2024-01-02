const express = require('express');
const services = require('../services');

const router = express.Router();

// fetchfiles route which fetch the files that already available based on the userId. 

router.get('/files/:userId', services.fetchFiles);

module.exports = router;

