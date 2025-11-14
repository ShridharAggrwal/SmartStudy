/**
 * Error handling middleware
 * Catches errors and sends appropriate error responses
 */

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // If response already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: {
      root: '/',
      study: '/study?topic=<topic>&mode=<normal|math>'
    }
  });
};

