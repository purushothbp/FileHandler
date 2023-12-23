const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const UserModel = require('./models/users');
const FileModel = require('./models/files');
const AuthTokenModel = require('./models/authtoken')
const strings = require("../strings.json")
const app = express();
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));



mongoose.connect('mongodb://localhost:27017/documents');


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage
})

app.get('/',async(req,res)=>{
   res.send("hello user");
})

app.post('/Register', async (req, res) => {
  console.log(req, "register req");

  const { firstname, lastname, username, email, password } = req.body;

  if (username && password && (username.length > 25 || password.length > 10)) {
    return res.status(400).json({ message: strings.invalidLength });
  }

  try {
      let existingUser;
      
      if (req.body.isGoogleLogin) {
          existingUser = await UserModel.findOne({ email: email });
      } else {
          existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
      }

      if (existingUser) {
          return res.status(400).json({ message: strings.userExists });
      }

      const newUser = new UserModel({
          firstname,
          lastname,
          email,
          username,
          password,
          ...(req.body.isGoogleLogin ? {username, password: await bcrypt.hash(password, 10),email} : { username, firstname,lastname }),
      });

      await newUser.save();
      res.status(201).json({ message: strings.registrationSuccess });
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: strings.internalError });
  }
});



app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log(req, "req.body")
    const userId = req.body.user;
    console.log('Received id', userId);
    if (!userId) {
      console.log({ message: strings['invalid User'] })
    }
    const file = new FileModel({
      filename: req.file.originalname,
      data: req.file.buffer,
      userId: userId,
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
    const result = await AuthTokenModel.deleteOne({ username: username });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: strings.usernotfound });
    }
    res.status(200).send({ message: strings.fileDeletedSuccess });
    // OR, if you want to redirect:
    // res.redirect('/');
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


app.get('/getUsers', (req, res) => {
  UserModel.find()
    .then(users => {
      res.status(200).send(users);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});



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

