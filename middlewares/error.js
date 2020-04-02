const ErrorResponse = require('../utils/errorResponse');

//Custom error handling method
const errorHandler = (err, req, res, next) => {
  console.log(err.errors);
  //Setting initial condition
  let error = { ...err };
  error.message = err.message;
  //logging error stack in the console
  // console.log(err.stack);

  //Mongoose bad ObjectID error
  if (err.name === 'CastError') {
    //Creating a new message
    const message = `Resource not Found`;
    //Replacing error object when there is cast error using the ErrorResponse Class
    error = new ErrorResponse(message, 404);
  }

  //Mongoose duplicate key error
  if (err.code === 11000) {
    //Creating message
    const message = 'Duplicate field entered';
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  if (error.name === 'ValidationError') {
    const message = Object.values(err.errors).map(value => value.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
