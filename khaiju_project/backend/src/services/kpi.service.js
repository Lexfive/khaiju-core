import { prisma } from '../index.js';

export const getKpis = async (userId) => {
  const now = new Date();
  const startCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
  const endCurrent = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const startPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endPrev = new Date(now.getFullYear(), now.getMonth(), 0);

  const [currentIncome, currentExpense, prevIncome, prevExpense] = await Promise.all([
    prisma.transaction.aggregate({ where: { userId, type: 'income', date: { gte: startCurrent, lte: endCurrent } }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: 'expense', date: { gte: startCurrent, lte: endCurrent } }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: 'income', date: { gte: startPrev, lte: endPrev } }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: 'expense', date: { gte: startPrev, lte: endPrev } }, _sum: { amount: true } })
  ]);

  const income = currentIncome._sum.amount || 0;
  const expense = currentExpense._sum.amount || 0;
  const balance = income - expense;

  const prevIncomeVal = prevIncome._sum.amount || 0;
  const prevExpenseVal = prevExpense._sum.amount || 0;

  return {
    balance,
    income: { current: income, previous: prevIncomeVal, delta: prevIncomeVal ? Math.round(((income - prevIncomeVal) / prevIncomeVal) * 100) : 0 },
    expense: { current: expense, previous: prevExpenseVal, delta: prevExpenseVal ? Math.round(((expense - prevExpenseVal) / prevExpenseVal) * 100) : 0 },
    transactionCount: await prisma.transaction.count({ where: { userId, date: { gte: startCurrent, lte: endCurrent } } })
  };
};