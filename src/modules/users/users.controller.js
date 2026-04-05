import * as usersService from './users.service.js';
import { successResponse } from '../../utils/response.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await usersService.getAllUsers({
      page: parseInt(page),
      limit: parseInt(limit),
    });
    successResponse(res, result, 'Users fetched successfully');
  } catch (err) { next(err); }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    successResponse(res, user, 'User fetched successfully');
  } catch (err) { next(err); }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await usersService.updateUserRole(req.params.id, req.body.role);
    successResponse(res, user, 'User role updated successfully');
  } catch (err) { next(err); }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const user = await usersService.updateUserStatus(req.params.id, req.body.isActive);
    successResponse(res, user, 'User status updated successfully');
  } catch (err) { next(err); }
};

export const deleteUser = async (req, res, next) => {
  try {
    await usersService.deleteUser(req.params.id, req.user.id);
    successResponse(res, null, 'User deleted successfully');
  } catch (err) { next(err); }
};