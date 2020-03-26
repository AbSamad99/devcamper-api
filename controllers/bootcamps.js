const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder');

//Desc: Get All Bootcamps,
//Route: GET /api/v1/bootcamps,
//Access: Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  //Make a copy of req.query
  const reqQuery = { ...req.query };

  //Fields to exclude, basically saying select is not a valid field of Bootcamp Schema
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //Looping over removeFields and deleting them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  //turning query into a string
  let queryString = JSON.stringify(reqQuery);

  //adding $ before gt/gte/lt/lte
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  );

  //Finding resource
  query = Bootcamp.find(JSON.parse(queryString)).populate('courses');

  //Selcting Field
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const stopIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //Excecuting resource
  const bootcamps = await query;

  //Initialising Pagination object
  const pagination = {};

  if (stopIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps
  });
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
