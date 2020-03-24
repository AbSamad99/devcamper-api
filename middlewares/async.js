//Custom Async Function Handling Middleware, This function takes the async function to be handled as parameter
//while the async function itself takes req, res and next as parameters

const asyncHandler = func => (req, res, next) =>
  Promise.resolve(func(req, res, next)).catch(next);

module.exports = asyncHandler;
