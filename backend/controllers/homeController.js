/**
 * Home Controller
 * Handles root/home endpoint logic
 */

/**
 * Health check endpoint handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getHome = (req, res) => {
  res.json({
    status: 'ok',
    message: 'Smart Study Assistant API is running',
    endpoints: {
      study: '/study?topic=<topic>&mode=<normal|math>'
    }
  });
};

