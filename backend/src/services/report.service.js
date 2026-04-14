import { prisma } from '../index.js';

export const getReports = async (userId) => {
  // Últimos 6 meses de transações
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: sixMonthsAgo }
    },
    orderBy: { date: 'asc' }
  });

  // Agrupar por mês
  const monthlyMap = {};
  const months = [];
  
  // Gerar últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    
    monthlyMap[key] = { month: monthLabel, receitas: 0, despesas: 0, saldo: 0 };
    months.push(key);
  }

  // Agregar transações
  transactions.forEach(t => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    
    if (monthlyMap[key]) {
      if (t.type === 'income') {
        monthlyMap[key].receitas += t.amount;
      } else if (t.type === 'expense') {
        monthlyMap[key].despesas += t.amount;
      }
    }
  });

  // Calcular saldo acumulado
  const monthlySeries = months.map(key => {
    const m = monthlyMap[key];
    m.saldo = m.receitas - m.despesas;
    return m;
  });

  // Série de receitas
  const incomeSeries = monthlySeries.map(m => ({
    month: m.month,
    value: m.receitas
  }));

  // Série de despesas
  const expenseSeries = monthlySeries.map(m => ({
    month: m.month,
    value: m.despesas
  }));

  // Relatório mensal com margem
  const monthlyReport = monthlySeries.map(m => ({
    month: m.month,
    receitas: m.receitas,
    despesas: m.despesas,
    saldo: m.saldo,
    margem: m.receitas > 0 ? ((m.saldo / m.receitas) * 100).toFixed(1) : '0'
  }));

  return {
    monthlySeries,
    incomeSeries,
    expenseSeries,
    monthlyReport
  };
};
