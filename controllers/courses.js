const Course = require('../models/Courses');
const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

//Desc: Get All Courses,
//Route: GET /api/v1/courses,
//Route: GET /api/v1/bootcamps/:bootcampId/courses
//Access: Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//Desc: Get Single Course,
//Route: GET /api/v1/courses/:id,
//Access: Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });
  if (!course) {
    return next(
      new ErrorResponse(`Course not Found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: course
  });
});

//Desc: Add a Course,
//Route: POST /api/v1/bootcamps/:bootcampId/courses,
//Access: Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  //Adding the new Course to our Database using the imported Bootcamp Model
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not Found with id ${req.params.bootcampId}`,
        404
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course
  });
});

//Desc: Update a Course,
//Route: PUT /api/v1/courses/:id,
//Access: Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  //Update the course
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

//Desc: Delete a Course,
//Route: DELETE /api/v1/courses/:id,
//Access: Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  //Delete the course
  const course = await Course.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});
