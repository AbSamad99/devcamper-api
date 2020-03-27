const advancedResults = (model, populate) => async (req, res, next) => {
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
  query = model.find(JSON.parse(queryString));

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
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //Excecuting resource
  const results = await query;

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

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
};

module.exports = advancedResults;
