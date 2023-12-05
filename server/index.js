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
      // User exists, check password
      const passwordMatch = await existingUser.comparePassword(password);
      if (passwordMatch) {
        return res.status(200).json({ message: 'Login successful.' });
      } else {
        return res.status(401).json({ message: 'Invalid username or password.' });
      }
    }

    const newUser = new UserModel({ username, email, password });
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
    // Create a new file documen
    console.log(req,"req.body")
    const userId = req.body.user;
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

app.put('/updateUser/:fileId', upload.single('file'), async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const userId = req.body.user;

    const existingFile = await FileModel.findById(fileId);

    if (!existingFile) {
      return res.status(404).send('File not found.');
    }

    existingFile.filename = req.file.originalname;
    existingFile.data = req.file.buffer;

    await existingFile.save();

    res.status(200).send('File updated successfully!');
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

app.delete('/deleteUser/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const result = await FileModel.deleteOne({ _id: fileId });

    if (result.deletedCount === 0) {
      return res.status(404).send('File not found.');
    }

    res.status(200).send('File deleted successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/download/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const file = await FileModel.findById(fileId);

    if (!file) {
      return res.status(404).send('File not found.');
    }

    const extension = path.extname(file.filename);
    const contentType = getContentTypeFromExtension(extension);

    if (!contentType) {
      return res.status(500).send('Unknown file type.');
    }

    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.contentType(contentType);
    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
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

app.listen(3001, () => {
  console.log(`http://localhost:${3001}`)
})

