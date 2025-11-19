/**
 * Global Error Handler Middleware
 * Catches all errors and sends consistent error responses
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    // Include stack trace only in development mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
