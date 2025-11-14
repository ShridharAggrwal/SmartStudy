/**
 * CORS configuration middleware
 * Configures Cross-Origin Resource Sharing settings
 */

import cors from 'cors';

export const corsConfig = cors({
  origin: [
    "https://smartstudying.netlify.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
});

