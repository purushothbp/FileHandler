const mongoose = require('mongoose');
//This schema will be storing the user's files based on requiremant(filename, data, userId).
const fileSchema = new mongoose.Schema({
    filename: String,
    data: Buffer,
    userId:String,
    contentType: String,
  });
  
  const FileModel = mongoose.model('File', fileSchema);

module.exports = FileModel;

