

const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    filename: String,
  });
  
  const FileModel = mongoose.model('File', fileSchema);

module.exports = FileModel;


