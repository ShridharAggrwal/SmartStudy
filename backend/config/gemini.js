/**
 * Gemini AI initialization configuration
 * Handles Gemini API setup and initialization
 */

import { initializeGemini } from '../services/geminiService.js';

/**
 * Initialize Gemini AI with API key
 * @param {string} apiKey - Gemini API key from environment variables
 */
export const initializeGeminiConfig = (apiKey) => {
  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    initializeGemini(apiKey);
    console.log('✓ Gemini AI initialized successfully');
    return true;
  } catch (error) {
    console.error('✗ Failed to initialize Gemini AI:', error.message);
    console.error('Please set GEMINI_API_KEY in your .env file');
    return false;
  }
};

