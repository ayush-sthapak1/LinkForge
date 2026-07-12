// TODO: Implement central Express error handler
const errorHandler = (err, req, res, next) => {
  // TODO: Format response payload depending on env (development vs production)
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = { errorHandler };
