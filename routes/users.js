const express = require('express');

const {
  getAllUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser
} = require('../controllers/users');

const User = require('../models/Users');

//Importing middlewares
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(User), getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
