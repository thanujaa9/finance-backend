import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.isOperational) {
    return errorResponse(res, err.message, err.statusCode);
  }

  // Prisma unique constraint
  if (err.code === 'P2002') {
    return errorResponse(res, `${err.meta?.target?.[0] || 'Field'} already exists`, 409);
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return errorResponse(res, 'Record not found', 404);
  }

  return errorResponse(res, 'Internal server error', 500);
};