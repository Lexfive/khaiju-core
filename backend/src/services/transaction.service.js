import { prisma } from '../index.js';

export const getTransactions = async (userId, filters = {}) => {
  const { page = 1, limit = 20, search, startDate, endDate, categoryId, type } = filters;
  const skip = (page - 1) * limit;

  const where = { userId };

  if (search) where.description = { contains: search, mode: 'insensitive' };
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }
  if (categoryId) where.categoryId = categoryId;
  if (type) where.type = type;

  const [data, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true, account: true },
      skip,
      take: +limit,
      orderBy: { date: 'desc' }
    }),
    prisma.transaction.count({ where })
  ]);

  return {
    data,
    pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) }
  };
};

export const createTransaction = async (userId, data) => {
  const transaction = await prisma.transaction.create({
    data: { ...data, userId },
    include: { category: true, account: true }
  });
  await updateAccountBalance(transaction.accountId, transaction.type, transaction.amount);
  return transaction;
};

export const updateTransaction = async (userId, id, data) => {
  return prisma.transaction.update({
    where: { id, userId },
    data,
    include: { category: true, account: true }
  });
};

export const deleteTransaction = async (userId, id) => {
  await prisma.transaction.delete({ where: { id, userId } });
  return { id };
};

async function updateAccountBalance(accountId, type, amount) {
  const delta = type === 'income' ? amount : -amount;
  await prisma.account.update({
    where: { id: accountId },
    data: { balance: { increment: delta } }
  });
}