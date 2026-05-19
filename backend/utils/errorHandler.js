const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error('ERROR:', err);

  // Default error response
  const errorResponse = {
    message: err.message || 'An error occurred',
    status: err.status || 500,
  };

  // If in development mode, include stack trace
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(errorResponse.status).json(errorResponse);
};

module.exports = errorHandler;

// ================= USAGE =================
// In your routes, use: 
// return next(new Error('Task not found', 404));
// or return next({ message: 'Validation failed', status: 400 });