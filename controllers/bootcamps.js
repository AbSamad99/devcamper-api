const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

//Desc: Get All Bootcamps, Route: GET /api/v1/bootcamps, Access: Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

//Desc: Get Single Bootcamp, Route: GET /api/v1/bootcamps/:id, Access: Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not Found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

//Desc: Update a Bootcamp, Route: PUT /api/v1/bootcamps/:id, Access: Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not Found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

//Desc: Create a Bootcamp, Route: POST /api/v1/bootcamps, Access: Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  //Adding the new course to our Database using the imported Bootcamp Model
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

//Desc: Delete a Bootcamp, Route: DELETE /api/v1/bootcamps/:id, Access: Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not Found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: {}
  });
});
