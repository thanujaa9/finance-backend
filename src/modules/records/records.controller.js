import * as recordsService from './records.service.js';
import { successResponse } from '../../utils/response.js';

export const createCategory = async (req, res, next) => {
  try {
    const category = await recordsService.createCategory(req.body);
    successResponse(res, category, 'Category created successfully', 201);
  } catch (err) { next(err); }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await recordsService.getAllCategories();
    successResponse(res, categories, 'Categories fetched successfully');
  } catch (err) { next(err); }
};

export const createRecord = async (req, res, next) => {
  try {
    const record = await recordsService.createRecord(req.body, req.user.id);
    successResponse(res, record, 'Record created successfully', 201);
  } catch (err) { next(err); }
};

export const getAllRecords = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, categoryId, startDate, endDate } = req.query;
    const result = await recordsService.getAllRecords({
      page: parseInt(page),
      limit: parseInt(limit),
      type,
      categoryId,
      startDate,
      endDate,
    });
    successResponse(res, result, 'Records fetched successfully');
  } catch (err) { next(err); }
};

export const getRecordById = async (req, res, next) => {
  try {
    const record = await recordsService.getRecordById(req.params.id);
    successResponse(res, record, 'Record fetched successfully');
  } catch (err) { next(err); }
};

export const updateRecord = async (req, res, next) => {
  try {
    const record = await recordsService.updateRecord(req.params.id, req.body);
    successResponse(res, record, 'Record updated successfully');
  } catch (err) { next(err); }
};

export const deleteRecord = async (req, res, next) => {
  try {
    await recordsService.deleteRecord(req.params.id);
    successResponse(res, null, 'Record deleted successfully');
  } catch (err) { next(err); }
};