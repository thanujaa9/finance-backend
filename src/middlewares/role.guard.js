import { errorResponse } from '../utils/response.js';

const roleHierarchy = { VIEWER: 1, ANALYST: 2, ADMIN: 3 };

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return errorResponse(res, 'Unauthorized', 401);

    const userLevel = roleHierarchy[req.user.role] || 0;
    const requiredLevel = Math.min(...roles.map(r => roleHierarchy[r] || 99));

    if (userLevel < requiredLevel) {
      return errorResponse(res, 'Insufficient permissions', 403);
    }

    next();
  };
};