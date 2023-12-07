const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

// Define the comparePassword method
userSchema.methods.comparePassword = async function(loginpassword) {
  try {
    const passwordMatch = await bcrypt.compare(loginpassword, this.loginpassword);
    return passwordMatch;
  } catch (error) {
    throw error; // Handle the error appropriately, log it, or return false
  }
};


const UserModel = mongoose.model("users", userSchema)
module.exports = UserModel