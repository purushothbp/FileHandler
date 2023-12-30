require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const loginRoute = require('../routes/loginRoute');
const logoutRoute = require('../routes/logoutRoute');
const uploadRoute = require('../routes/uploadRoute');
const deleteRoute = require('../routes/deleteRoute');
const updateRoute = require('../routes/updateRoute');
const filesFetchRoute = require('../routes/fetchFilesRoute');
const registerRoute = require('../routes/registerRoute');
const downloadRoute = require('../routes/downloadRoute');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/documents");

app.use('/', loginRoute);
app.use('/', logoutRoute);
app.use('/', uploadRoute);
app.use('/', registerRoute);
app.use('/', updateRoute);
app.use('/', deleteRoute);
app.use('/api', filesFetchRoute);
app.use('/', downloadRoute);


app.listen(3001, () => {
  console.log(`Server is running on http://localhost:${3001}`);
});
