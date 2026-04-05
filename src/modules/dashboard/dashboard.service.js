import prisma from '../../config/db.js';

export const getSummary = async () => {
  const [incomeResult, expenseResult, totalRecords] = await Promise.all([
    prisma.financialRecord.aggregate({
      where: { type: 'INCOME', deletedAt: null },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.financialRecord.aggregate({
      where: { type: 'EXPENSE', deletedAt: null },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.financialRecord.count({ where: { deletedAt: null } }),
  ]);

  const totalIncome = Number(incomeResult._sum.amount || 0);
  const totalExpense = Number(expenseResult._sum.amount || 0);

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    totalRecords,
    incomeCount: incomeResult._count,
    expenseCount: expenseResult._count,
  };
};

export const getCategoryBreakdown = async () => {
  const records = await prisma.financialRecord.groupBy({
    by: ['categoryId', 'type'],
    where: { deletedAt: null },
    _sum: { amount: true },
    _count: true,
  });

  const categories = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

  const breakdown = records.map(r => ({
    categoryId: r.categoryId,
    categoryName: categoryMap[r.categoryId] || 'Unknown',
    type: r.type,
    total: Number(r._sum.amount || 0),
    count: r._count,
  }));

  return breakdown;
};

export const getMonthlyTrends = async ({ year } = {}) => {
  const currentYear = year || new Date().getFullYear();

  const records = await prisma.financialRecord.findMany({
    where: {
      deletedAt: null,
      date: {
        gte: new Date(`${currentYear}-01-01`),
        lte: new Date(`${currentYear}-12-31`),
      },
    },
    select: { amount: true, type: true, date: true },
  });

  // Build month-by-month breakdown
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    monthName: new Date(currentYear, i).toLocaleString('default', { month: 'long' }),
    income: 0,
    expense: 0,
    net: 0,
  }));

  records.forEach(r => {
    const month = new Date(r.date).getMonth(); // 0-indexed
    if (r.type === 'INCOME') {
      months[month].income += Number(r.amount);
    } else {
      months[month].expense += Number(r.amount);
    }
  });

  months.forEach(m => { m.net = m.income - m.expense; });

  return { year: currentYear, trends: months };
};

export const getRecentActivity = async (limit = 5) => {
  return prisma.financialRecord.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      category: true,
      user: { select: { id: true, name: true } },
    },
  });
};