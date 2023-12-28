const express = require('express');
const multer = require('multer');
const services = require('../services');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
  })

// update route which alows users to update the files that already available 

router.put('/updateUser/:fileId', upload.single('file'), services.updateFile);

module.exports = router;
