const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  image: {
    type: String,
    required: true,
  },
  
  places: {
    type: String,
    required: true,
  },
});

userSchema.plugin(uniqueValidator, "This {USER} is already exist")

module.exports = mongoose.model('User', userSchema)