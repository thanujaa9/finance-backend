import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  // Users
  const adminHash = await bcrypt.hash('admin1234', 12);
  const analystHash = await bcrypt.hash('analyst1234', 12);
  const viewerHash = await bcrypt.hash('viewer1234', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: { role: 'ADMIN' },
    create: { name: 'Admin User', email: 'admin@test.com', passwordHash: adminHash, role: 'ADMIN' },
  });

  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@test.com' },
    update: {},
    create: { name: 'Analyst User', email: 'analyst@test.com', passwordHash: analystHash, role: 'ANALYST' },
  });

  await prisma.user.upsert({
    where: { email: 'viewer@test.com' },
    update: {},
    create: { name: 'Viewer User', email: 'viewer@test.com', passwordHash: viewerHash, role: 'VIEWER' },
  });

  console.log('Users seeded');

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: 'Salary' }, update: {}, create: { name: 'Salary', description: 'Monthly salary income' } }),
    prisma.category.upsert({ where: { name: 'Freelance' }, update: {}, create: { name: 'Freelance', description: 'Freelance income' } }),
    prisma.category.upsert({ where: { name: 'Food' }, update: {}, create: { name: 'Food', description: 'Food and groceries' } }),
    prisma.category.upsert({ where: { name: 'Rent' }, update: {}, create: { name: 'Rent', description: 'Monthly rent expense' } }),
    prisma.category.upsert({ where: { name: 'Transport' }, update: {}, create: { name: 'Transport', description: 'Travel and transport' } }),
    prisma.category.upsert({ where: { name: 'Utilities' }, update: {}, create: { name: 'Utilities', description: 'Electricity, water, internet' } }),
  ]);

  const [salary, freelance, food, rent, transport, utilities] = categories;
  console.log('Categories seeded');

  // Financial records — last 4 months
  const records = [
    // January
    { amount: 50000, type: 'INCOME', categoryId: salary.id, date: new Date('2026-01-01'), notes: 'January salary', createdBy: admin.id },
    { amount: 12000, type: 'EXPENSE', categoryId: rent.id, date: new Date('2026-01-05'), notes: 'January rent', createdBy: admin.id },
    { amount: 3500, type: 'EXPENSE', categoryId: food.id, date: new Date('2026-01-10'), notes: 'Groceries', createdBy: admin.id },
    { amount: 8000, type: 'INCOME', categoryId: freelance.id, date: new Date('2026-01-15'), notes: 'Freelance project', createdBy: analyst.id },
    { amount: 1500, type: 'EXPENSE', categoryId: transport.id, date: new Date('2026-01-20'), notes: 'Cab rides', createdBy: admin.id },

    // February
    { amount: 50000, type: 'INCOME', categoryId: salary.id, date: new Date('2026-02-01'), notes: 'February salary', createdBy: admin.id },
    { amount: 12000, type: 'EXPENSE', categoryId: rent.id, date: new Date('2026-02-05'), notes: 'February rent', createdBy: admin.id },
    { amount: 4200, type: 'EXPENSE', categoryId: food.id, date: new Date('2026-02-12'), notes: 'Groceries + eating out', createdBy: admin.id },
    { amount: 2200, type: 'EXPENSE', categoryId: utilities.id, date: new Date('2026-02-15'), notes: 'Electricity bill', createdBy: analyst.id },
    { amount: 15000, type: 'INCOME', categoryId: freelance.id, date: new Date('2026-02-20'), notes: 'Big freelance project', createdBy: analyst.id },

    // March
    { amount: 50000, type: 'INCOME', categoryId: salary.id, date: new Date('2026-03-01'), notes: 'March salary', createdBy: admin.id },
    { amount: 12000, type: 'EXPENSE', categoryId: rent.id, date: new Date('2026-03-05'), notes: 'March rent', createdBy: admin.id },
    { amount: 3800, type: 'EXPENSE', categoryId: food.id, date: new Date('2026-03-10'), notes: 'Groceries', createdBy: admin.id },
    { amount: 1800, type: 'EXPENSE', categoryId: transport.id, date: new Date('2026-03-18'), notes: 'Fuel', createdBy: admin.id },
    { amount: 2500, type: 'EXPENSE', categoryId: utilities.id, date: new Date('2026-03-22'), notes: 'Internet + electricity', createdBy: analyst.id },

    // April
    { amount: 50000, type: 'INCOME', categoryId: salary.id, date: new Date('2026-04-01'), notes: 'April salary', createdBy: admin.id },
    { amount: 12000, type: 'EXPENSE', categoryId: rent.id, date: new Date('2026-04-02'), notes: 'April rent', createdBy: admin.id },
    { amount: 5000, type: 'EXPENSE', categoryId: food.id, date: new Date('2026-04-03'), notes: 'Groceries', createdBy: admin.id },
    { amount: 10000, type: 'INCOME', categoryId: freelance.id, date: new Date('2026-04-03'), notes: 'Freelance April', createdBy: analyst.id },
  ];

  for (const record of records) {
    await prisma.financialRecord.create({ data: record });
  }

  console.log('Records seeded');
  console.log('Done! Test accounts:');
  console.log('  admin@test.com / admin1234 (ADMIN)');
  console.log('  analyst@test.com / analyst1234 (ANALYST)');
  console.log('  viewer@test.com / viewer1234 (VIEWER)');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());