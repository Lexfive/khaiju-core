import { prisma } from '../index.js';

export const getReports = async (userId) => {
  const monthly = await prisma.$queryRaw`
    SELECT 
      strftime('%Y-%m', date) as month,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
    FROM Transaction
    WHERE userId = ${userId}
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12
  `;
  return { monthly };
};