/**
 * CORS configuration middleware
 * Configures Cross-Origin Resource Sharing settings
 */

import cors from 'cors';

// Allowed origins
const allowedOrigins = [
  "https://smartstudying.netlify.app",
  "http://localhost:5173"
];

// CORS configuration with origin validation
export const corsConfig = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (health checks, curl, mobile apps, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For development, allow localhost variations
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // For production, log rejected origins but don't block the request
    // This prevents health checks and other valid requests from failing
    console.warn(`CORS: Origin not in whitelist: ${origin}`);
    callback(null, false); // Return false instead of error to not block the request
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
});

/**
 * Manual CORS headers middleware (fallback)
 * Ensures CORS headers are always set, even on error responses
 * Also ensures health checks and non-browser requests work properly
 */
export const corsHeaders = (req, res, next) => {
  const origin = req.headers.origin;
  
  // Always allow requests without origin (health checks, server-to-server, curl, etc.)
  if (!origin) {
    // No origin means it's likely a health check or direct request
    // Don't set CORS headers as they're not needed
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    return next();
  }
  
  // Set CORS headers for browser requests with origin
  // Note: When credentials: true, we must use specific origin, not '*'
  if (allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1')) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  } else {
    // Origin not allowed but don't block the request
    console.warn(`CORS: Origin not allowed: ${origin}`);
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
};

