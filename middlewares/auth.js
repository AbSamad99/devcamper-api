const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const asynchandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');

//Protect routes
exports.protect = asynchandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  //Check if token exists
  if (!token) {
    return next(new ErrorResponse(`Not authorized to access this route`, 401));
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    next(new ErrorResponse(`Not authorized to access this route`, 401));
  }
});

//Grant Access tospecific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is unauthorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

//Check if the user is authorized
exports.checkAuthorization = model =>
  asynchandler(async (req, res, next) => {
    if (req.params.bootcampId) {
      req.params.id = req.params.bootcampId;
    }
    let resource = await model.findById(req.params.id);
    if (!resource) {
      return next(
        new ErrorResponse(
          `${model.modelName} not Found with id ${req.params.id}`,
          404
        )
      );
    }

    //Check if the User is authorized
    if (resource.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User with id ${req.user.id} is not permitted to modify this ${model.modelName}`,
          401
        )
      );
    }
    next();
  });
