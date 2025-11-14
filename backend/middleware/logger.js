/**
 * Request logging middleware
 * Logs incoming requests with timestamp and method
 */

export const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
};

