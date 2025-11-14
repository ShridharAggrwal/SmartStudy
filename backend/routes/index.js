/**
 * Main Routes
 * Combines all route definitions
 */

import express from 'express';
import { getHome } from '../controllers/homeController.js';
import studyRoutes from './studyRoutes.js';

const router = express.Router();

/**
 * @route   GET /
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', getHome);

// Mount study routes
router.use('/study', studyRoutes);

export default router;

