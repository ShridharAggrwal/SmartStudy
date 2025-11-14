/**
 * Study Controller
 * Handles study-related request logic
 */

import { fetchTopicData } from '../services/wikipediaService.js';
import { generateStudyContent } from '../services/geminiService.js';

/**
 * Get study content for a topic
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getStudyContent = async (req, res, next) => {
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
    // Pass error to error handling middleware
    next(error);
  }
};

