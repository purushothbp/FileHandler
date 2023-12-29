const express = require('express');
const multer = require('multer');
const services = require('../services');

const router = express.Router();

//storage field describes where the file needs to be stored

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), services.uploadFile);

module.exports = router;
