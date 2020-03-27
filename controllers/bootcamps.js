const path = require('path');
const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder');

//Desc: Get All Bootcamps,
//Route: GET /api/v1/bootcamps,
//Access: Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//Desc: Get Single Bootcamp,
//Route: GET /api/v1/bootcamps/:id,
//Access: Public
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

//Desc: Update a Bootcamp,
//Route: PUT /api/v1/bootcamps/:id,
//Access: Private
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

//Desc: Create a Bootcamp,
//Route: POST /api/v1/bootcamps,
//Access: Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  //Adding the new course to our Database using the imported Bootcamp Model
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

//Desc: Delete a Bootcamp,
//Route: DELETE /api/v1/bootcamps/:id,
//Access: Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not Found with id ${req.params.id}`, 404)
    );
  }
  await bootcamp.remove();
  res.status(200).json({
    success: true,
    data: {}
  });
});

//Desc: Get Bootcamps within a certain radius depending on Zipcode,
//Route: GET /api/v1/bootcamps/radius/:zipcode/:distance,
//Access:Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //Calculate Radius using radians, do this by dividing distance by radius of the earth
  //Radius of the earth is 3963mi/6378km
  const radius = distance / 3963;

  //Finding bootcamps using the in built find method
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius]
      }
    }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

//Desc: Upload photo for the bootcamp,
//Route: PUT /api/v1/bootcamps/:id/photo,
//Access: Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not Found with id ${req.params.id}`, 404)
    );
  }

  //Check to see if file was uploaded or not
  if (!req.files) {
    return next(new ErrorResponse(`Please Upload a file`, 400));
  }

  const file = req.files.file;

  //Check if file type is image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  //Checking file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `File size should not exceed ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});
