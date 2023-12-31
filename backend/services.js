const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthTokenModel = require('../backend/models/authtoken');
const UserModel = require('../backend/models/users');
const FileModel = require('../backend/models/files');
const strings = require('../backend/strings.json');

async function createFolderInS3(email) {
    const params = {
        Bucket: 'your-s3-bucket-name',
        Key: `${email}/`,
        Body: ''
    };

    await s3.upload(params).promise();
}

async function registerUser(req, res) {
    const { firstname, lastname, username, email, password, isGoogleLogin } = req.body;

    if (username && password && (username.length > 25 || password.length > 10)) {
        return res.status(400).json({ message: strings.invalidLength });
    }

    try {

        // Checking wether the user with the given email or username already exists
        let existingUser = await UserModel.findOne({
            $or: [{ email: email }, { username: username }]
        });

        //if exists goes with login 
        if (existingUser) {
            return res.status(400).json({ message: strings.userExists, user: existingUser });
        }
        else{
            if (isGoogleLogin) {
                // If it's a Google login, store only firstname, lastname, and email
                const newUser = new UserModel({
                  firstname,
                  lastname,
                  email,
                  username: email, // You can set username to email or any other value
                });
          
                await newUser.save();
                return res.status(201).json({ message: strings.registrationSuccess });
              } else {
                // If not a Google login, register the user with all input values
                const newUser = new UserModel({
                  firstname,
                  lastname,
                  email,
                  username,
                  password: await bcrypt.hash(password, 10),});
                  await newUser.save();
                  return res.status(201).json({message:strings.registrationSuccess});
                }
        }

        
    } catch (error) {
        console.error('Error registering user:', error);
        console.log (error.stack);
        res.status(500).json({ message: strings.internalError });
    }
}

async function loginUser(req, res) {
    const email = req.body.loginusername;
    const username = req.body.loginusername;

    // Check if it's a Google login
    const isGoogleLogin = req.body.isGoogleLogin;

    try {
        let user;

        if (isGoogleLogin) {
            const firstName = req.body.firstname;
            const lastName = req.body.lastname;
            const email = req.body.loginusername;

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
                    firstName: firstName,
                    lastName: lastName,
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
}

async function uploadFile(req, res) {
    try {
        const userId = req.body.user;
        const MAX_FILE_SIZE_MB = 50; // Set the maximum file size limit in megabytes
                
        // Check if the file size exceeds the limit
        const fileSizeInBytes = req.file.size;
        const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // Convert bytes to megabytes

        if (fileSizeInMB > MAX_FILE_SIZE_MB) {
            return res.status(400).send({ message: `File size exceeds the limit of ${MAX_FILE_SIZE_MB} MB` });
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
}

async function updateFile(req, res) {
    console.log(req,"fetch files")
    try {
        const fileId = req.params.userId;
        console.log(fileId,"userid")

        const existingFile = await FileModel.findById(fileId);

        console.log(existingFile,"files of user")

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
}
async function fetchFiles(req, res) {
    const userId = req.params.userId
    console.log(userId, "userIdinget")

    try {
        const files = await FileModel.find({ userId });
        res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: strings.internalError });
    }
}
async function deleteFile(req, res) {
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
}
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
async function logoutUser(req, res) {
  try {
    const username = req.params.username;
    console.log(req.params);
    
    // Find the user by username or email to get the user ID
    const user = await UserModel.findOne({
      $or: [{ username: username }, { email: username }]
    });

    if (!user) {
      return res.status(404).send({ message: strings.usernotfound });
    }

    // Deletes tokens associated with the user ID
    const result = await AuthTokenModel.deleteMany({ userId: user._id });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: strings.tokensNotFound });
    }

    res.status(200).send({ message: strings.logoutSuccess });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: strings.internalError });
  }
}

async function downloadFile(req, res) {
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
}
async function getUsers(req, res) {
    UserModel.find()
        .then(users => {
            res.status(200).send(users);
        })
        .catch(error => {
            res.status(500).send(error);
        });
}

module.exports = {
    createFolderInS3,
    updateFile,
    registerUser,
    loginUser,
    logoutUser,
    uploadFile,
    fetchFiles,
    getUsers,
    downloadFile,
    deleteFile
};