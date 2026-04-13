import { prisma } from '../index.js';

export const getCategories = async (userId) => prisma.category.findMany({ where: { userId } });
export const createCategory = async (userId, data) => prisma.category.create({ data: { ...data, userId } });