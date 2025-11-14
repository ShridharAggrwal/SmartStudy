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
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // For development, allow localhost variations
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
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
 */
export const corsHeaders = (req, res, next) => {
  const origin = req.headers.origin;
  
  // Set CORS headers if origin is allowed
  // Note: When credentials: true, we must use specific origin, not '*'
  if (!origin || allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1')) {
    // Use the specific origin if present, otherwise allow all (for non-credential requests)
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
};

