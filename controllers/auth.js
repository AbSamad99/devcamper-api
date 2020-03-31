const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/Users');

//Desc: Register User,
//Route: POST /api/v1/auth/register,
//Access: Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //Creating user
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  sendTokenResponse(user, 200, res);
});

//Desc: Login User,
//Route: POST /api/v1/auth/login,
//Access: Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and password were entered
  if (!email || !password) {
    return next(new ErrorResponse(`Please enter email and password`, 400));
  }

  //Checking if user exists
  const user = await User.findOne({
    email
  }).select('+password'); //add the password field into users as it wont get returned in user object by default

  //Check if user is present
  if (!user) {
    return next(new ErrorResponse(`Invalid Credentials`, 400));
  }

  //Check if passwor matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid Credentials`, 400));
  }

  sendTokenResponse(user, 200, res);
});

//Desc: Get Current Logged in User,
//Route: GET /api/v1/auth/me,
//Access: Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
});

//Desc: Get Forgot Password,
//Route: POST /api/v1/auth/forgotpassword,
//Access: Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  //Check if user exists
  if (!user) {
    return next(new ErrorResponse(`There is no user with that email`, 404));
  }

  //Get reset token
  const resetToken = user.getResetPasswordToken();
  console.log(resetToken);

  await user.save({ validateBeforeSave: false });

  //create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are recieving this message because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Password reset token`,
      message
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse(`Email could not be sent`, 500));
  }
});

//Desc: Get Current Logged in User,
//Route: PUT /api/v1/auth/resetpassword/:resetToken,
//Access: Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpired: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse(`Invalid token`, 400));
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpired = undefined;

  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};
