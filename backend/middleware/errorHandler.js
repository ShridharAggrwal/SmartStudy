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

  // Set CORS headers on error responses only if origin is present
  const origin = req.headers.origin;
  if (origin) {
    const allowedOrigins = [
      "https://smartstudying.netlify.app",
      "http://localhost:5173"
    ];
    
    if (allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
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
  // Set CORS headers on 404 responses only if origin is present
  const origin = req.headers.origin;
  if (origin) {
    const allowedOrigins = [
      "https://smartstudying.netlify.app",
      "http://localhost:5173"
    ];
    
    if (allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
  }

  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: {
      root: '/',
      study: '/study?topic=<topic>&mode=<normal|math>'
    }
  });
};

