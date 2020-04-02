const express = require('express');

const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviews');

const Review = require('../models/Reviews');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middlewares/advancedResults');
const {
  protect,
  authorize,
  checkAuthorization
} = require('../middlewares/auth');

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getReviews
  )
  .post(protect, authorize('user'), addReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user'), checkAuthorization(Review), updateReview)
  .delete(protect, authorize('user'), checkAuthorization(Review), deleteReview);

module.exports = router;
