const Review = require('../models/Reviews');
const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

//Desc: Get All Reviews,
//Route: GET /api/v1/reviews,
//Route: GET /api/v1/bootcamps/:bootcampId/reviews
//Access: Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  console.log('re');
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//Desc: Get a single review,
//Route: GET /api/v1/reviews/:id,
//Access: Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });
  if (!review) {
    return next(
      new ErrorResponse(`Review not Found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: review
  });
});

//Desc: Add a Review,
//Route: POST /api/v1/bootcamps/:bootcampId/reviews,
//Access: Private
exports.addReview = asyncHandler(async (req, res, next) => {
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

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

//Desc: Update a Review,
//Route: PUT /api/v1/courses/:id,
//Access: Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  //Update the review
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });

  res.status(200).json({
    success: true,
    data: review
  });
});

//Desc: Delete a Review,
//Route: DELETE /api/v1/reviews/:id,
//Access: Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  //Delete the course
  const review = await Review.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});
