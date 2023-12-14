const mongoose = require('mongoose');

const authTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
  username: String,
  token: { type: String, required: true },
});

const AuthTokenModel = mongoose.model('AuthToken', authTokenSchema);

module.exports = AuthTokenModel;
