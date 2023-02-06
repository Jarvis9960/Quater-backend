const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  mobileNo: {
    type: Number,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  cpassword: {
    type: String,
    required: true,
  },
  forgotPassToken: {
    type: String,
    default: ""
  }
});


const user = mongoose.model("user", userSchema);

module.exports = user;