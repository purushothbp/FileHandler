const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const UserModel = require('./models/users');
const FileModel = require('./models/files');

const app = express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/documents');


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage
})


app.post('/Register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists."Pleast Login to continue"' });
    }

    const newUser = new UserModel({ username, email, password });
    console.log(newUser);
    await newUser.save();

    res.status(201).json({ message: 'Registration successful.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
app.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find({}, 'username email password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Create a new file document
    const {userId} = req.body;
    console.log('Received id', userId);
    if (!userId) {
      console.log("Invalid user")
    }
    const file = new FileModel({
      filename: req.file.originalname,
      data: req.file.buffer,
      userId: userId,
    });

    await file.save();

    res.status(201).send('File uploaded successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/files/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const files = await FileModel.find({ userId });
    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.get('/getUsers', (req, res) => {
  UserModel.find()
    .then(users => {
      res.status(200).send(users);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

app.listen(3001, () => {
  console.log(`http://localhost:${3001}`)
})


