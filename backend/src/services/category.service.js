import { prisma } from '../index.js';

export const getCategories = async (userId) => {
  const categories = await prisma.category.findMany({ 
    where: { userId },
    orderBy: { name: 'asc' }
  });
  
  return { data: categories };
};

export const createCategory = async (userId, data) => {
  const category = await prisma.category.create({ 
    data: { ...data, userId } 
  });
  
  return category;
};
