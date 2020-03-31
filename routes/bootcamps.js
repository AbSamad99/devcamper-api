const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamps');

//Importing middlewares
const advancedResults = require('../middlewares/advancedResults');
const {
  protect,
  authorize,
  checkAuthorization
} = require('../middlewares/auth');

//Include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(
    protect,
    authorize('publisher', 'admin'),
    checkAuthorization(Bootcamp),
    updateBootcamp
  )
  .delete(
    protect,
    authorize('publisher', 'admin'),
    checkAuthorization(Bootcamp),
    deleteBootcamp
  );

router
  .route('/:id/photo')
  .put(
    protect,
    authorize('publisher', 'admin'),
    checkAuthorization(Bootcamp),
    bootcampPhotoUpload
  );

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

module.exports = router;
