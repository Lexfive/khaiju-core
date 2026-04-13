import { prisma } from '../index.js';
export const getAccounts = async (userId) => prisma.account.findMany({ where: { userId } });
export const createAccount = async (userId, data) => prisma.account.create({ data: { ...data, userId } });