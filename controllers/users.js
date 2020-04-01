const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/Users');

//Desc: Get all users,
//Route: GET /api/v1/auth/users,
//Access: Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//Desc: Get single users,
//Route: GET /api/v1/auth/users/:id,
//Access: Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user
  });
});

//Desc: Create User,
//Route: POST /api/v1/auth/users,
//Access: Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user
  });
});

//Desc: Update User,
//Route: PUT /api/v1/auth/users/:id,
//Access: Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });
  res.status(200).json({
    success: true,
    data: user
  });
});

//Desc: Delete User,
//Route: DELETE /api/v1/auth/users/:id,
//Access: Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {}
  });
});
