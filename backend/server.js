/**
 * Smart Study Assistant Backend Server
 * Express API with /study endpoint
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchTopicData } from './services/wikipediaService.js';
import { initializeGemini, generateStudyContent } from './services/geminiService.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
try {
  initializeGemini(process.env.GEMINI_API_KEY);
  console.log('✓ Gemini AI initialized successfully');
} catch (error) {
  console.error('✗ Failed to initialize Gemini AI:', error.message);
  console.error('Please set GEMINI_API_KEY in your .env file');
}

// Middleware
app.use(cors({
  origin: [
    "https://smartstudying.netlify.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Smart Study Assistant API is running',
    endpoints: {
      study: '/study?topic=<topic>&mode=<normal|math>'
    }
  });
});

// Main study endpoint
app.get('/study', async (req, res) => {
  try {
    // Validate query parameters
    const { topic, mode = 'normal' } = req.query;

    if (!topic) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Topic parameter is required',
        example: '/study?topic=Photosynthesis&mode=normal'
      });
    }

    if (topic.trim().length < 2) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Topic must be at least 2 characters long'
      });
    }

    if (mode && !['normal', 'math'].includes(mode)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Mode must be either "normal" or "math"'
      });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Server Configuration Error',
        message: 'AI service is not configured. Please contact the administrator.'
      });
    }

    console.log(`Processing study request - Topic: "${topic}", Mode: ${mode}`);

    // Fetch topic data from Wikipedia
    let topicData;
    try {
      topicData = await fetchTopicData(topic);
      console.log(`✓ Fetched Wikipedia data for "${topicData.title}"`);
    } catch (error) {
      console.error('Wikipedia fetch error:', error.message);
      return res.status(404).json({
        error: 'Topic Not Found',
        message: error.message,
        suggestion: 'Try a different topic or check your spelling'
      });
    }

    // Generate AI-powered study content
    let studyContent;
    try {
      studyContent = await generateStudyContent(topicData, mode);
      console.log(`✓ Generated AI content for "${topicData.title}"`);
    } catch (error) {
      console.error('AI generation error:', error.message);
      return res.status(500).json({
        error: 'AI Generation Failed',
        message: 'Failed to generate study content. Please try again.',
        details: error.message
      });
    }

    // Build response
    const response = {
      topic: topicData.title,
      mode: mode,
      summary: studyContent.summary,
      quiz: studyContent.quiz,
      studyTip: studyContent.studyTip,
      mathQuestion: studyContent.mathQuestion,
      source: {
        title: topicData.title,
        url: topicData.url
      }
    };

    console.log(`✓ Request completed successfully for "${topicData.title}"`);
    res.json(response);

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: {
      root: '/',
      study: '/study?topic=<topic>&mode=<normal|math>'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Smart Study Assistant API running on port ${PORT}`);
  console.log(`📚 Ready to help students learn smarter!\n`);
  console.log(`Test endpoint: http://localhost:${PORT}/study?topic=Photosynthesis\n`);
});

