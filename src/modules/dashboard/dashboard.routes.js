import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.guard.js';
import { getSummary, getCategoryBreakdown, getMonthlyTrends, getRecentActivity } from './dashboard.controller.js';

const router = Router();
router.use(authenticate);
router.use(requireRole('ANALYST'));

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get total income, expense and net balance (Analyst+)
 *     responses:
 *       200:
 *         description: Financial summary
 */
router.get('/summary', getSummary);

/**
 * @swagger
 * /api/dashboard/categories:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get spending breakdown by category (Analyst+)
 *     responses:
 *       200:
 *         description: Category wise totals
 */
router.get('/categories', getCategoryBreakdown);

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get monthly income and expense trends (Analyst+)
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2026
 *     responses:
 *       200:
 *         description: Month by month breakdown
 */
router.get('/trends', getMonthlyTrends);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get recent financial activity (Analyst+)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: Recent records
 */
router.get('/recent', getRecentActivity);

export default router;