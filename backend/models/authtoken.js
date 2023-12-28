const mongoose = require('mongoose');

const authTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
  token: { type: String, required: true },
});

const AuthTokenModel = mongoose.model('AuthToken', authTokenSchema);

module.exports = AuthTokenModel;
