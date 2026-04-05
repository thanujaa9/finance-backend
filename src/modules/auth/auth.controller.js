import * as authService from './auth.service.js';
import { successResponse } from '../../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    successResponse(res, user, 'User registered successfully', 201);
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    successResponse(res, result, 'Login successful');
  } catch (err) { next(err); }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    successResponse(res, result, 'Token refreshed');
  } catch (err) { next(err); }
};