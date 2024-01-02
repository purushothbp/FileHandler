const mongoose = require('mongoose');
//This schema will be storing the user details for registration and login.
const userSchema = new mongoose.Schema({
  firstname: { type: String, required:false },
  lastname: { type: String, required:false },
  username: String,
  email: { type: String, required: true },
  password: { type: String, required: false },
});

//compares the password for the user who're trying to login.
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return candidatePassword === this.password;
  } catch (error) {
    throw error;
  }
};

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
