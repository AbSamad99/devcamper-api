//Desc: Get All Bootcamps, Route: GET /api/v1/bootcamps, Access: Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Show All Bootcamps'
  });
};

//Desc: Get Single Bootcamp, Route: GET /api/v1/bootcamps/:id, Access: Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Get bootcamp ${req.params.id}`
  });
};

//Desc: Update a Bootcamp, Route: PUT /api/v1/bootcamps/:id, Access: Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Update bootcamp ${req.params.id}`
  });
};

//Desc: Create a Bootcamp, Route: POST /api/v1/bootcamps, Access: Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Create New Bootcamp'
  });
};

//Desc: Delete a Bootcamp, Route: DELETE /api/v1/bootcamps/:id, Access: Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Delete bootcamp ${req.params.id}`
  });
};
