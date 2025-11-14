/**
 * Study Routes
 * Defines routes for study-related endpoints
 */

import express from 'express';
import { getStudyContent } from '../controllers/studyController.js';

const router = express.Router();

/**
 * @route   GET /study
 * @desc    Get study content for a topic
 * @access  Public
 */
router.get('/', getStudyContent);

export default router;

