import { prisma } from '../lib/prisma.js';

export const getAccounts = async (userId) => {
  return prisma.account.findMany({ where: { userId } });
};

export const createAccount = async (userId, data) => {
  return prisma.account.create({ data: { ...data, userId } });
};
