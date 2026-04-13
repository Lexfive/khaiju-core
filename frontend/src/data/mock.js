// ─── KHAIJU MOCK DATA ──────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'moradia',     label: 'Moradia',       icon: '🏠', color: '#7D4EBF' },
  { id: 'alimentacao', label: 'Alimentação',    icon: '🍽️', color: '#5214D9' },
  { id: 'transporte',  label: 'Transporte',     icon: '🚗', color: '#4CB4CF' },
  { id: 'saude',       label: 'Saúde',          icon: '💊', color: '#4CCFA8' },
  { id: 'lazer',       label: 'Lazer',          icon: '🎮', color: '#E8A84C' },
  { id: 'educacao',    label: 'Educação',       icon: '📚', color: '#A07EE8' },
  { id: 'vestuario',   label: 'Vestuário',      icon: '👔', color: '#E85C7A' },
  { id: 'investimento',label: 'Investimentos',  icon: '📈', color: '#4CCFA8' },
  { id: 'salario',     label: 'Salário',        icon: '💼', color: '#4CCFA8' },
  { id: 'freelance',   label: 'Freelance',      icon: '💻', color: '#A07EE8' },
  { id: 'dividendos',  label: 'Dividendos',     icon: '💰', color: '#E8A84C' },
]

const TRANSACTIONS_RAW = [
  { id: 't001', date: '2024-10-01', description: 'Aluguel Outubro',      category: 'moradia',      amount: -2800,  type: 'despesa'  },
  { id: 't002', date: '2024-10-01', description: 'Salário Net Solutions',category: 'salario',      amount: 12500,  type: 'receita'  },
  { id: 't003', date: '2024-10-02', description: 'Supermercado Pão de Açúcar', category: 'alimentacao', amount: -387.50, type: 'despesa' },
  { id: 't004', date: '2024-10-03', description: 'Uber — reunião cliente',category: 'transporte',   amount: -34.90, type: 'despesa'  },
  { id: 't005', date: '2024-10-04', description: 'Freelance UX Design',  category: 'freelance',    amount: 3200,   type: 'receita'  },
  { id: 't006', date: '2024-10-05', description: 'Farmácia Drogasil',    category: 'saude',        amount: -128.40,type: 'despesa'  },
  { id: 't007', date: '2024-10-06', description: 'Netflix + Spotify',    category: 'lazer',        amount: -89.80, type: 'despesa'  },
  { id: 't008', date: '2024-10-07', description: 'Curso React Advanced', category: 'educacao',     amount: -297,   type: 'despesa'  },
  { id: 't009', date: '2024-10-08', description: 'Restaurante Fogo de Chão', category: 'alimentacao', amount: -210, type: 'despesa' },
  { id: 't010', date: '2024-10-09', description: 'Dividendos ITSA4',     category: 'dividendos',   amount: 450,    type: 'receita'  },
  { id: 't011', date: '2024-10-10', description: 'Combustível Shell',    category: 'transporte',   amount: -180,   type: 'despesa'  },
  { id: 't012', date: '2024-10-11', description: 'Camisa Reserva',       category: 'vestuario',    amount: -289,   type: 'despesa'  },
  { id: 't013', date: '2024-10-12', description: 'Dividendos VALE3',     category: 'dividendos',   amount: 680,    type: 'receita'  },
  { id: 't014', date: '2024-10-13', description: 'iFood semana',         category: 'alimentacao',  amount: -156.70,type: 'despesa'  },
  { id: 't015', date: '2024-10-14', description: 'Gym — Smart Fit',      category: 'saude',        amount: -109.90,type: 'despesa'  },
  { id: 't016', date: '2024-10-15', description: 'Freelance API Backend',category: 'freelance',    amount: 4500,   type: 'receita'  },
  { id: 't017', date: '2024-10-16', description: 'Livros Técnicos',      category: 'educacao',     amount: -198,   type: 'despesa'  },
  { id: 't018', date: '2024-10-17', description: 'Metrô mensal',         category: 'transporte',   amount: -220,   type: 'despesa'  },
  { id: 't019', date: '2024-10-18', description: 'Cinema + jantar',      category: 'lazer',        amount: -145,   type: 'despesa'  },
  { id: 't020', date: '2024-10-19', description: 'Plano de saúde',       category: 'saude',        amount: -320,   type: 'despesa'  },
  { id: 't021', date: '2024-10-20', description: 'Supermercado Extra',   category: 'alimentacao',  amount: -298.30,type: 'despesa'  },
  { id: 't022', date: '2024-10-21', description: 'Consultoria mensal',   category: 'freelance',    amount: 2800,   type: 'receita'  },
  { id: 't023', date: '2024-10-22', description: 'Tênis Nike',           category: 'vestuario',    amount: -499,   type: 'despesa'  },
  { id: 't024', date: '2024-10-23', description: 'Dividendos BBAS3',     category: 'dividendos',   amount: 320,    type: 'receita'  },
  { id: 't025', date: '2024-10-24', description: 'Conta de luz',         category: 'moradia',      amount: -187.40,type: 'despesa'  },
  { id: 't026', date: '2024-10-25', description: 'Conta de internet',    category: 'moradia',      amount: -119.90,type: 'despesa'  },
  { id: 't027', date: '2024-10-26', description: 'Dentista',             category: 'saude',        amount: -280,   type: 'despesa'  },
  { id: 't028', date: '2024-10-27', description: 'Happy Hour sexta',     category: 'lazer',        amount: -95,    type: 'despesa'  },
  { id: 't029', date: '2024-10-28', description: 'Condomínio',           category: 'moradia',      amount: -680,   type: 'despesa'  },
  { id: 't030', date: '2024-10-29', description: 'Freelance Design Logo',category: 'freelance',    amount: 1800,   type: 'receita'  },
  { id: 't031', date: '2024-10-30', description: 'Mercado semanal',      category: 'alimentacao',  amount: -243.60,type: 'despesa'  },
  { id: 't032', date: '2024-10-31', description: 'Aporte PETR4',         category: 'investimento', amount: -1000,  type: 'despesa'  },
]

const MONTHLY_SERIES = [
  { month: 'Mai', receitas: 18200, despesas: 12400, saldo: 5800 },
  { month: 'Jun', receitas: 16800, despesas: 11900, saldo: 4900 },
  { month: 'Jul', receitas: 21500, despesas: 13200, saldo: 8300 },
  { month: 'Ago', receitas: 19300, despesas: 14800, saldo: 4500 },
  { month: 'Set', receitas: 22100, despesas: 13600, saldo: 8500 },
  { month: 'Out', receitas: 26050, despesas: 15671, saldo: 10379 },
]

const GOALS = [
  { id: 'g1', label: 'Reserva de Emergência', target: 50000, current: 32400, color: '#4CCFA8' },
  { id: 'g2', label: 'Viagem Europa',         target: 15000, current: 7800,  color: '#7D4EBF' },
  { id: 'g3', label: 'Notebook Pro',          target: 12000, current: 9600,  color: '#E8A84C' },
  { id: 'g4', label: 'Investimentos 2024',    target: 30000, current: 18900, color: '#4CB4CF' },
]

const BUDGET = [
  { category: 'Moradia',      budget: 4000,  spent: 3787.30 },
  { category: 'Alimentação',  budget: 1500,  spent: 1296.10 },
  { category: 'Transporte',   budget: 600,   spent: 434.90  },
  { category: 'Saúde',        budget: 800,   spent: 837.90  },
  { category: 'Lazer',        budget: 500,   spent: 329.80  },
  { category: 'Educação',     budget: 600,   spent: 495.00  },
]

// ─── SELECTORS ──────────────────────────────────────────────────────────

export const selectors = {
  transactions: (filters = {}) => {
    let data = [...TRANSACTIONS_RAW]
    if (filters.type)     data = data.filter(t => t.type === filters.type)
    if (filters.category) data = data.filter(t => t.category === filters.category)
    if (filters.search)   data = data.filter(t =>
      t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.category.toLowerCase().includes(filters.search.toLowerCase())
    )
    return data.sort((a, b) => new Date(b.date) - new Date(a.date))
  },

  kpis: () => {
    const receitas = TRANSACTIONS_RAW.filter(t => t.type === 'receita').reduce((s, t) => s + t.amount, 0)
    const despesas = Math.abs(TRANSACTIONS_RAW.filter(t => t.type === 'despesa').reduce((s, t) => s + t.amount, 0))
    const saldo    = receitas - despesas
    const savings  = (saldo / receitas) * 100
    return { receitas, despesas, saldo, savings, savingsRate: savings }
  },

  monthlySeries: () => MONTHLY_SERIES,

  goals: () => GOALS,

  budget: () => BUDGET,

  categories: () => {
    const despesas = TRANSACTIONS_RAW.filter(t => t.type === 'despesa')
    const totals = {}
    despesas.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount)
    })
    const total = Object.values(totals).reduce((s, v) => s + v, 0)
    return Object.entries(totals)
      .map(([id, value]) => {
        const cat = CATEGORIES.find(c => c.id === id)
        return { id, label: cat?.label || id, value, percent: (value / total) * 100, color: cat?.color || '#7D4EBF' }
      })
      .sort((a, b) => b.value - a.value)
  },

  recentTransactions: (limit = 8) =>
    selectors.transactions().slice(0, limit),

  incomeSeries: () =>
    MONTHLY_SERIES.map(m => ({ month: m.month, value: m.receitas })),

  expenseSeries: () =>
    MONTHLY_SERIES.map(m => ({ month: m.month, value: m.despesas })),

  monthlyReport: () => MONTHLY_SERIES.map(m => ({
    ...m,
    margem: ((m.saldo / m.receitas) * 100).toFixed(1),
  })),
}

export default selectors
