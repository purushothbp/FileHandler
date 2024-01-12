const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const env = process.env.NODE_ENV || "development";
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

if (env === "development" || env === "test") {
  const config = require("../config/config.json");
  const envConfig = config[env];
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
const PORT = process.env.PORT;


//mongo url to save the files and data.

mongoose.connect(process.env.MONGO_URI);

app.use('/', loginRoute);
app.use('/', logoutRoute);
app.use('/', uploadRoute);
app.use('/', registerRoute);
app.use('/', updateRoute);
app.use('/', deleteRoute);
app.use('/', filesFetchRoute);
app.use('/', downloadRoute);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
