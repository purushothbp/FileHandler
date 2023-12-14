const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
  firstname:{type:String, required: true},
  lastname:{ type:String, required: true},
  username: String,
  email: { type: String, required: true },
  password: { type: String, required: true },

});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
     return (candidatePassword === this.password) ? true : false
  } catch (error) {
    throw error;
  }
};

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
