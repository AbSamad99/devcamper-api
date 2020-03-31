const express = require('express');

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses');

//Importing middlewares
const advancedResults = require('../middlewares/advancedResults');
const {
  protect,
  authorize,
  checkAuthorization
} = require('../middlewares/auth');

const Course = require('../models/Courses');

const Bootcamp = require('../models/Bootcamps');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getCourses
  )
  .post(
    protect,
    authorize('publisher', 'admin'),
    checkAuthorization(Bootcamp),
    addCourse
  );

router
  .route('/:id')
  .get(getCourse)
  .put(
    protect,
    authorize('publisher', 'admin'),
    checkAuthorization(Course),
    updateCourse
  )
  .delete(
    protect,
    authorize('publisher', 'admin'),
    checkAuthorization(Course),
    deleteCourse
  );

module.exports = router;
