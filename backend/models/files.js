const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
    filename: String,
    data: Buffer,
    userId:String,
    contentType: String,
  });
  
  const FileModel = mongoose.model('File', fileSchema);

module.exports = FileModel;

