const express = require('express');

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword
} = require('../controllers/auth');

const router = express.Router();

//Importing middlewares
const { protect } = require('../middlewares/auth');

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/me').get(protect, getMe);

router.route('/forgotpassword').post(forgotPassword);

router.route('/resetpassword/:resetToken').put(resetPassword);

module.exports = router;
