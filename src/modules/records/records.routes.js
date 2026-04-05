import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.guard.js';
import { validate } from '../../middlewares/validate.js';
import { createRecordSchema, updateRecordSchema, createCategorySchema } from './records.schema.js';
import {
  createCategory, getAllCategories, createRecord,
  getAllRecords, getRecordById, updateRecord, deleteRecord,
} from './records.controller.js';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /api/records/categories:
 *   post:
 *     tags: [Records]
 *     summary: Create a category (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Salary
 *               description:
 *                 type: string
 *                 example: Monthly salary income
 *     responses:
 *       201:
 *         description: Category created
 *   get:
 *     tags: [Records]
 *     summary: Get all categories (All roles)
 *     responses:
 *       200:
 *         description: List of categories
 */
router.post('/categories', requireRole('ADMIN'), validate(createCategorySchema), createCategory);
router.get('/categories', getAllCategories);

/**
 * @swagger
 * /api/records:
 *   get:
 *     tags: [Records]
 *     summary: Get all records with filters (All roles)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           example: 2026-01-01
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           example: 2026-04-30
 *     responses:
 *       200:
 *         description: Paginated list of records
 *   post:
 *     tags: [Records]
 *     summary: Create a financial record (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, categoryId, date]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50000
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               categoryId:
 *                 type: string
 *               date:
 *                 type: string
 *                 example: 2026-04-01
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Record created
 */
router.get('/', getAllRecords);
router.post('/', requireRole('ADMIN'), validate(createRecordSchema), createRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     tags: [Records]
 *     summary: Get record by ID (All roles)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record details
 *       404:
 *         description: Record not found
 *   patch:
 *     tags: [Records]
 *     summary: Update a record (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               categoryId:
 *                 type: string
 *               date:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated
 *   delete:
 *     tags: [Records]
 *     summary: Soft delete a record (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted
 */
router.get('/:id', getRecordById);
router.patch('/:id', requireRole('ADMIN'), validate(updateRecordSchema), updateRecord);
router.delete('/:id', requireRole('ADMIN'), deleteRecord);

export default router;