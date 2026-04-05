import prisma from '../../config/db.js';
import { AppError } from '../../utils/errors.js';

export const createCategory = async (data) => {
  return prisma.category.create({ data });
};

export const getAllCategories = async () => {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
};

export const createRecord = async (data, userId) => {
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) throw new AppError('Category not found', 404);

  return prisma.financialRecord.create({
    data: {
      ...data,
      amount: data.amount,
      date: new Date(data.date),
      createdBy: userId,
    },
    include: { category: true, user: { select: { id: true, name: true } } },
  });
};

export const getAllRecords = async ({ page = 1, limit = 10, type, categoryId, startDate, endDate }) => {
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(type && { type }),
    ...(categoryId && { categoryId }),
    ...(startDate || endDate) && {
      date: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
    },
  };

  const [records, total] = await Promise.all([
    prisma.financialRecord.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: true,
        user: { select: { id: true, name: true } },
      },
      orderBy: { date: 'desc' },
    }),
    prisma.financialRecord.count({ where }),
  ]);

  return {
    records,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const getRecordById = async (id) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, deletedAt: null },
    include: {
      category: true,
      user: { select: { id: true, name: true } },
    },
  });
  if (!record) throw new AppError('Record not found', 404);
  return record;
};

export const updateRecord = async (id, data) => {
  const record = await prisma.financialRecord.findFirst({ where: { id, deletedAt: null } });
  if (!record) throw new AppError('Record not found', 404);

  if (data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) throw new AppError('Category not found', 404);
  }

  return prisma.financialRecord.update({
    where: { id },
    data: {
      ...data,
      ...(data.date && { date: new Date(data.date) }),
    },
    include: { category: true, user: { select: { id: true, name: true } } },
  });
};

export const deleteRecord = async (id) => {
  const record = await prisma.financialRecord.findFirst({ where: { id, deletedAt: null } });
  if (!record) throw new AppError('Record not found', 404);

  
  return prisma.financialRecord.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};