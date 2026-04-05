import * as dashboardService from './dashboard.service.js';
import { successResponse } from '../../utils/response.js';

export const getSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary();
    successResponse(res, data, 'Dashboard summary fetched successfully');
  } catch (err) { next(err); }
};

export const getCategoryBreakdown = async (req, res, next) => {
  try {
    const data = await dashboardService.getCategoryBreakdown();
    successResponse(res, data, 'Category breakdown fetched successfully');
  } catch (err) { next(err); }
};

export const getMonthlyTrends = async (req, res, next) => {
  try {
    const { year } = req.query;
    const data = await dashboardService.getMonthlyTrends({ year: year ? parseInt(year) : undefined });
    successResponse(res, data, 'Monthly trends fetched successfully');
  } catch (err) { next(err); }
};

export const getRecentActivity = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const data = await dashboardService.getRecentActivity(parseInt(limit));
    successResponse(res, data, 'Recent activity fetched successfully');
  } catch (err) { next(err); }
};