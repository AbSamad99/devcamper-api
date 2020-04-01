const express = require('express');

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword
} = require('../controllers/auth');

const router = express.Router();

//Importing middlewares
const { protect } = require('../middlewares/auth');

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/me').get(protect, getMe);

router.route('/forgotpassword').post(forgotPassword);

router.route('/resetpassword/:resetToken').put(resetPassword);

router.route('/updatedetails').put(protect, updateDetails);

router.route('/updatepassword').put(protect, updatePassword);

module.exports = router;
