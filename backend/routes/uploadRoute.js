const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const services = require('../services');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const router = express.Router();

//storage field describes where the file needs to be stored

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), services.uploadFile);
module.exports = router;
