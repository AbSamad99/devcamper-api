const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email address'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please add a Password'],
    minlength: 6,
    select: false //wont show the password
  },
  resetPasswordToken: String,
  resetPasswordExpired: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//Encrypt password using bcryptjs
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10); //Higher the vale given, greater is security but more processing power needed
  this.password = await bcrypt.hash(this.password, salt);
});

//Sign Json Web Token and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  }); //First object within sign in the payload
};

//Match user and password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  //Generate token
  const resetToken = crypto.randomBytes(20).toString('hex'); //20 is the number of bytes

  //Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256') //sha256 is algorithm used
    .update(resetToken) //data to hash
    .digest('hex');

  //Set Expire
  this.resetPasswordExpired = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
