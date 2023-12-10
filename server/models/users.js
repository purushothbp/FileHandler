const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // const passwordMatch = await bcrypt.compare(candidatePassword, this.password);
     return (candidatePassword === this.password) ? true : false
  } catch (error) {
    throw error;
  }
};

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
