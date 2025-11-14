/**
 * Gemini AI Service
 * Handles AI-powered summarization, quiz generation, and study tips
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables (in case this is imported directly)
dotenv.config();

let genAI;

export function initializeGemini(apiKey) {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function generateStudyContent(topicData, mode = 'normal') {
  try {
    if (!genAI) {
      throw new Error('Gemini AI not initialized');
    }

    // Use model from environment variable or default to gemini-pro
    // Available models: gemini-pro, gemini-1.5-pro, gemini-1.5-flash
    // Note: Some models may not be available in all regions or API versions
    const modelName = process.env.GEMINI_MODEL || 'gemini-pro';
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const { title, extract } = topicData;
    
    // Generate summary
    const summaryPrompt = `Based on this information about "${title}":
${extract}

Generate exactly 3 concise bullet points summarizing the key concepts. Format as a JSON array of strings.
Return only the JSON array, no other text.`;

    const summaryResult = await model.generateContent(summaryPrompt);
    const summaryText = summaryResult.response.text();
    const summary = parseJSONResponse(summaryText);

    // Generate quiz
    const quizPrompt = `Based on this information about "${title}":
${extract}

Generate exactly 3 multiple-choice questions to test understanding. Each question should have 4 options (A, B, C, D) with only one correct answer.
Return as JSON array with format: [{"question": "...", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "correctAnswer": 0}]
The correctAnswer is the index (0-3) of the correct option.
Return only the JSON array, no other text.`;

    const quizResult = await model.generateContent(quizPrompt);
    const quizText = quizResult.response.text();
    const quiz = parseJSONResponse(quizText);

    // Generate study tip
    const tipPrompt = `Based on this information about "${title}":
${extract}

Generate one practical study tip (1-2 sentences) to help remember or understand this topic better.
Return only the tip text, no JSON or other formatting.`;

    const tipResult = await model.generateContent(tipPrompt);
    const studyTip = tipResult.response.text().trim();

    // Generate math question if in math mode
    let mathQuestion = null;
    if (mode === 'math') {
      const mathPrompt = `Based on the topic "${title}":
${extract}

Generate one quantitative or logical problem related to this topic. Include:
1. The problem statement
2. The correct numerical/logical answer
3. A brief explanation of how to solve it

Return as JSON with format: {"problem": "...", "answer": "...", "explanation": "..."}
Return only the JSON object, no other text.`;

      const mathResult = await model.generateContent(mathPrompt);
      const mathText = mathResult.response.text();
      mathQuestion = parseJSONResponse(mathText);
    }

    return {
      summary,
      quiz,
      studyTip,
      mathQuestion
    };
  } catch (error) {
    throw new Error(`AI generation failed: ${error.message}`);
  }
}

function parseJSONResponse(text) {
  try {
    // Remove markdown code blocks if present
    let cleaned = text.trim();
    cleaned = cleaned.replace(/```json\n?/g, '');
    cleaned = cleaned.replace(/```\n?/g, '');
    cleaned = cleaned.trim();
    
    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}

