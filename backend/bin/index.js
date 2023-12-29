require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const UserModel = require('../models/users');
const FileModel = require('../models/files');
const AuthTokenModel = require('../models/authtoken')
const strings = require("../strings.json")
const app = express();
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); 

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log('MONGO_URI:', process.env.MONGO_URI);


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage
})

const s3 = new aws.S3({
  accessKeyId : process.env.S3_ACCESS_KEY,
  secretAccessKey:process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION
});



app.post('/Register', async (req, res) => {
  console.log(req.body, "register req");

  const { firstname, lastname, username, email, password, isGoogleLogin } = req.body;

  if (username && password && (username.length > 25 || password.length > 10)) {
    return res.status(400).json({ message: strings.invalidLength });
  }

  try {
    let existingUser = await UserModel.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: strings.userExists });
    }

    if (isGoogleLogin) {
      const newUser = new UserModel({
        firstname,
        lastname,
        email,
        username: email, 
      });

      await newUser.save();
      return res.status(201).json({ message: strings.registrationSuccess });
    } else {
      const newUser = new UserModel({
        firstname,
        lastname,
        email,
        username,
        password: await bcrypt.hash(password, 10),
      });

      await createFolderInS3(email);

      await newUser.save();
      return res.status(201).json({ message: strings.registrationSuccess });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: strings.internalError });
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log(req.body, "req.body");
    const email = req.body.user;
    console.log('Received email', email);

    const params = {
      Bucket: 'your-s3-bucket-name',
      Key: `${email}/${uuidv4()}_${req.file.originalname}`,
      Body: req.file.buffer
    };

    const uploadResult = await s3.upload(params).promise();

    // Save file information in MongoDB
    const file = new FileModel({
      filename: req.file.originalname,
      s3Link: uploadResult.Location, // S3 link
      userId: null, // Assuming you don't have a direct relationship between files and users
      userEmail: email
    });

    await file.save();

    res.status(201).send({ message: strings.fileUploadSuccess });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: strings.internalError });
  }
});

app.put('/updateUser/:fileId', upload.single('file'), async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const existingFile = await FileModel.findById(fileId);

    if (!existingFile) {
      return res.status(404).send({ message: strings.fileNotFOund });
    }

    existingFile.filename = req.file.originalname;
    existingFile.data = req.file.buffer;

    await existingFile.save();

    res.status(200).send({ message: strings.fileUploadSuccess });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: strings.internalError });
  }
});


app.get('/files/:userId', async (req, res) => {
  console.log(req,"getrequest")
  const userId = req.params.userId
  console.log(userId,"userIdinget")

  try {
    const files = await FileModel.find({ userId });
    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: strings.internalError });
  }
});

app.delete('/deleteUser/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const result = await FileModel.deleteOne({ _id: fileId });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: strings.fileNotFOund });
    }

    res.status(200).send({ message: strings.fileDeletedSuccess });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: strings.internalError });
  }
});


app.delete('/logout/:username', async (req, res) => {
  try {
    const username = req.params.username;
    
    // Find the user by username to get the user ID
    const user = await AuthTokenModel.findOne({ username: username });
    
    if (!user) {
      return res.status(404).send({ message: strings.usernotfound });
    }

    // Delete tokens associated with the user ID
    const result = await AuthTokenModel.deleteMany({ userId: user._id });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: strings.tokensNotFound });
    }

    res.status(200).send({ message: strings.logoutSuccess });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: strings.internalError });
  }
});

app.get('/download/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const file = await FileModel.findById(fileId);

    if (!file) {
      return res.status(404).send({ message: strings.fileNotFOund });
    }

    const extension = path.extname(file.filename);
    const contentType = getContentTypeFromExtension(extension);

    if (!contentType) {
      return res.status(500).send({ message: strings.unknownFileType });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.contentType(contentType);
    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: strings.internalError });
  }
});

function getContentTypeFromExtension(extension) {
  switch (extension.toLowerCase()) {
    case '.pdf':
      return 'application/pdf';
    case '.doc':
    case '.docx':
      return 'application/msword';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    default:
      return null;
  }
}




app.post('/login', async (req, res) => {
  const email = req.body.loginusername;
  const username = req.body.loginusername;

  // Check if it's a Google login
  const isGoogleLogin = req.body.isGoogleLogin;

  try {
    let user;

    if (isGoogleLogin) {
      const firstName = req.body.firstname;
      const lastName = req.body.lastname;

      user = await UserModel.findOne({ email: email });

      if (!user) {
        user = new UserModel({
          email: email,
          username: username, 
          firstName: firstName,
          lastName: lastName
        });
        await user.save();
      } else {
        user = new UserModel({
          firstName :firstName,
          lastName :lastName,
        })
        await user.save();
      }
    } else {
      user = await UserModel.findOne({ email: email });

      if (!user) {
        console.log('User not found.');
        return res.status(401).json({ message: strings.loginError });
      }
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, 'your-secret-key');

    res.cookie('access_token', token, { httpOnly: true });

    const authToken = new AuthTokenModel({ userId: user._id, username: user.username, token });
    authToken.save();

    console.log('Login successful.');
    return res.status(200).json({ userId: user._id, message: strings.loginSuccess });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: strings.internalError });
  }
});






app.listen(3001, () => {
  console.log(`http://localhost:${3001}`)
})

