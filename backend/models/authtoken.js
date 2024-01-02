const mongoose = require('mongoose');

//This schema will be storing the user's authtoken for login.
const authTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
  token: { type: String, required: true },
});

const AuthTokenModel = mongoose.model('AuthToken', authTokenSchema);

module.exports = AuthTokenModel;
