const express = require('express');

const { register, login, getMe } = require('../controllers/auth');

const router = express.Router();

//Importing middlewares
const { protect } = require('../middlewares/auth');

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/me').get(protect, getMe);

module.exports = router;
