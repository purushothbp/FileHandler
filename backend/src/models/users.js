const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required:false },
  lastname: { type: String, required:false },
  username: String,
  email: { type: String, required: true },
  password: { type: String, required: false },
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return candidatePassword === this.password;
  } catch (error) {
    throw error;
  }
};

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
