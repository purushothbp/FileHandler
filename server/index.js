const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const UserModel = require('./models/users')

const app = express();
app.use(cors());
app.use(express.json())


mongoose.connect('mongodb://localhost:27017/filehandler');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})
app.post('/upload', upload.single('file'), (req, res) => {
    console.log(JSON.stringify(req.file))
    const user = new UserModel({file: JSON.stringify(req.file)})
    user.save()
        .then(result => {
            res.status(200).send(result)
            console.log('hello',result)
        })
        .catch(error => {
            res.send(error)
        })
})


app.listen(3001, () => {
    console.log(`http://localhost:${3001}`)
})