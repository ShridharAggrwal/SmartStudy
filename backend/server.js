/**
 * Smart Study Assistant Backend Server
 * Express API server with modular architecture
 */

import express from 'express';
import dotenv from 'dotenv';
import { corsConfig } from './middleware/cors.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { initializeGeminiConfig } from './config/gemini.js';
import routes from './routes/index.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
initializeGeminiConfig(process.env.GEMINI_API_KEY);

// Middleware
app.use(corsConfig);
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/', routes);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Smart Study Assistant API running on port ${PORT}`);
  console.log(`📚 Ready to help students learn smarter!\n`);
  console.log(`Test endpoint: http://localhost:${PORT}/study?topic=Photosynthesis\n`);
});
