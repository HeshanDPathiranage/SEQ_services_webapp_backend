function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ message: 'Internal server error. Please try again later.' });
}

module.exports = { errorHandler };
