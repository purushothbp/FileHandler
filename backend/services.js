//bcrypt used to create the 256 digit authToken.
//jwtwebtoken will be used to decode the file and checks for user verification

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthTokenModel = require('../backend/models/authtoken');
const UserModel = require('../backend/models/users');
const FileModel = require('../backend/models/files');
const strings = require('../backend/strings.json');
const path = require('path')
const AWS = require('aws-sdk');
const fs = require('fs');
const multer = require('multer');
const { promisify } = require('util');


//creates the bucket in s3 to store the files and data

AWS.config.update({
    accessKeyId: 'AKIAWGGD2XTNEEFXJGG2',
    secretAccessKey: 'ck3ILswxtCgksWYSYBnJ70qyryS8klsDFMHvyu7s',
    region: 'ap-south-1', // e.g., 'us-east-1'
});

const s3 = new AWS.S3();

async function createFolderInS3(userId) {
    const params = {
        Bucket: 'filehandlers3' ,
        Key: `${userId}/`,
        Body: ''
    };

    await s3.upload(params).promise();
}
//creates the user registration form and validates the details and stores those in DB.
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
        res.status(500).json({ message: strings.internalError });
    }
}
//login user checks with the login details and creates the authToken in DB foe specific user.
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
            //where the schema for user details will be stored 
            if (!user) {
                
                user = new UserModel({
                    email: email,
                    username: username,
                    firstName: firstName,
                    lastName: lastName
                });
                await user.save();
                console.log(user)
            } else {
                user = new UserModel({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                })
                await user.save();
            }
        } else {
            //checks with wether the user is present or not
            user = await UserModel.findOne({ email: email });

            if (!user) {
                return res.status(401).json({ message: strings.usernotfound });
            }
        }
        const token = jwt.sign({ userId: user._id, username: user.username }, 'your-secret-key');
        res.cookie('access_token', token, { httpOnly: true });

        const authToken = new AuthTokenModel({ userId: user._id, username: user.email, token });
        authToken.save();
        return res.status(200).json({ userId: user._id, message: strings.loginSuccess });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: strings.internalError });
    }
}
//This function uploads the file to DB (Mongo and s3) along with the User's identity.
async function uploadFile(req, res) {
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded' });
        }
        const userId = req.body.user;
        const MAX_FILE_SIZE_MB = 50; // Set the maximum file size limit in megabytes

        // Check if the file size exceeds the limit
        const fileSizeInBytes = req.file.size;
        const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // Convert bytes to megabytes

        if (fileSizeInMB > MAX_FILE_SIZE_MB) {
            return res.status(400).send({ message: `File size exceeds the limit of ${MAX_FILE_SIZE_MB} MB` });
        }

        // Save to MongoDB
        const file = new FileModel({
            filename: req.file.originalname,
            data: req.file.buffer,
            userId: userId,
        });

        await file.save();

        // Save to S3
        await createFolderInS3(userId); // Create user folder in S3 if not exists

        const s3Params = {
            Bucket: 'filehandlers3',
            Key: `${userId}/${req.file.originalname}`,
            Body: req.file.buffer,
        };

        await s3.upload(s3Params).promise();

        res.status(201).send({ message: strings.fileUploadSuccess });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: strings.internalError });
    }
}

//This function re-uploads the file to DB.
async function updateFile(req, res) {
    try {
        const fileId = req.params.fileId;
        const existingFile = await FileModel.findById(fileId);

        if (!existingFile) {
            return res.status(404).send({ message: strings.fileNotFound });
        }

        const userId = existingFile.userId;
        const originalFilename = existingFile.filename;

        // Delete the original file in S3
        await deleteFileInS3(userId, originalFilename);

        // Update file details in MongoDB
        existingFile.filename = req.file.originalname;
        existingFile.data = req.file.buffer;
        await existingFile.save();

        // Check if the user folder exists in S3, and create it if not
        await createFolderInS3(userId);

        // Upload the updated file to S3 within the user folder
        const s3Params = {
            Bucket: 'filehandlers3',
            Key: `${userId}/${req.file.originalname}`,
            Body: req.file.buffer,
        };

        await s3.upload(s3Params).promise();

        res.status(200).send({ message: strings.fileUploadSuccess });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: strings.internalError });
    }
}

async function deleteFileInS3(userId, filename) {
    const s3Params = {
        Bucket: 'filehandlers3',
        Key: `${userId}/${filename}`,
    };

    await s3.deleteObject(s3Params).promise();
}

async function createFolderInS3(userId) {
    const params = {
        Bucket: 'filehandlers3',
        Key: `${userId}/`,
        Body: '', // Empty content for creating a folder
    };

    await s3.upload(params).promise();
}


//This function fetches the files that are available with the UserId;
async function fetchFiles(req, res) {
    const userId = req.params.userId;
    try {
        // Fetch file details from MongoDB
        const files = await FileModel.find({ userId });

        if (files.length === 0) {
            return res.status(404).json({ message: strings.filesNotFound });
        }

        res.status(200).json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: strings.internalError });
    }
}

//Deletes the file based on the user's request.
const s3DeleteObject = promisify(s3.deleteObject.bind(s3));
async function deleteFile(req, res) {
    try {
        const fileId = req.params.fileId;

        // Fetch file details from MongoDB
        const file = await FileModel.findById(fileId);

        if (!file) {
            return res.status(404).send({ message: strings.fileNotFOund });
        }

        // Delete file from MongoDB
        const deletionResult = await FileModel.deleteOne({ _id: fileId });

        if (deletionResult.deletedCount === 0) {
            return res.status(404).send({ message: strings.fileNotFOund });
        }

        // Delete file from S3
        const userId = file.userId; // Assuming userId is stored in the FileModel
        const s3Key = `${userId}/${file.filename}`;
        await s3DeleteObject({ Bucket: 'filehandlers3', Key: s3Key });

        res.status(200).send({ message: strings.fileDeletedSuccess });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: strings.internalError });
    }
}

//This defines the file formats allowed to upload.
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
            return 'application/octet-stream';
    }
}
//logout function will delete's the existing or logged user.
async function logoutUser(req, res) {
  try {
    const username = req.params.username;
    
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
//This function will allows the user to download th file based on user request.
async function downloadFile(req, res) {
    try {
        const fileId = req.params._id;
        console.log(req.params);
        const file = await FileModel.findById(fileId);

        if (!file) {
            return res.status(404).send({ message: strings.fileNotFound });
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
//The simple function will get's the users who are available in the DB.
async function getUsers(req, res) {
    UserModel.find()
        .then(users => {
            res.status(200).send({message: strings.loginSuccess});
        })
        .catch(error => {
            res.status(500).send({message: string.usernotfound});
        });
}
//exporting the functions that are available to use.
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