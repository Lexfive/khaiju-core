// ─── DATA ADAPTER ─────────────────────────────────────────────────────
// Camada de abstração entre o DataProvider e a fonte de dados.
// Para integrar com API real, substitua as funções abaixo por chamadas
// fetch/axios — o restante do app não precisa mudar.
//
// Contrato de cada adapter:
//   (params: object) => Promise<T>  ← para API real
//   (params: object) => T           ← para mock síncrono (suportado)
//
// Quando usar React Query, envolva cada função aqui como queryFn:
//   queryFn: () => adapters.kpis()

import selectors from '@/data/mock'

// ── Adaptadores mock (substituir por fetch quando houver API) ──────────

export const adapters = {
  /** GET /api/transactions */
  transactions: (filters = {}) =>
    Promise.resolve(selectors.transactions(filters)),

  /** GET /api/kpis */
  kpis: () =>
    Promise.resolve(selectors.kpis()),

  /** GET /api/series/monthly */
  monthlySeries: () =>
    Promise.resolve(selectors.monthlySeries()),

  /** GET /api/goals */
  goals: () =>
    Promise.resolve(selectors.goals()),

  /** GET /api/budget */
  budget: () =>
    Promise.resolve(selectors.budget()),

  /** GET /api/categories (computed) */
  categories: () =>
    Promise.resolve(selectors.categories()),

  /** GET /api/transactions?limit=N */
  recentTransactions: (filters = {}) =>
    Promise.resolve(selectors.recentTransactions(filters.limit)),

  /** GET /api/series/income */
  incomeSeries: () =>
    Promise.resolve(selectors.incomeSeries()),

  /** GET /api/series/expenses */
  expenseSeries: () =>
    Promise.resolve(selectors.expenseSeries()),

  /** GET /api/reports/monthly */
  monthlyReport: () =>
    Promise.resolve(selectors.monthlyReport()),
}

// ── Mutações (POST/PUT/DELETE) ─────────────────────────────────────────
// Prontos para plugar chamadas API reais.

export const mutations = {
  /** POST /api/transactions */
  createTransaction: (payload) => {
    // TODO: return fetch('/api/transactions', { method: 'POST', body: JSON.stringify(payload) })
    return Promise.resolve({ ok: true, data: { ...payload, id: `t${Date.now()}` } })
  },

  /** PUT /api/transactions/:id */
  updateTransaction: (id, payload) => {
    // TODO: return fetch(`/api/transactions/${id}`, { method: 'PUT', ... })
    return Promise.resolve({ ok: true })
  },

  /** DELETE /api/transactions/:id */
  deleteTransaction: (id) => {
    // TODO: return fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    return Promise.resolve({ ok: true })
  },

  /** PUT /api/goals/:id */
  updateGoal: (id, payload) => {
    return Promise.resolve({ ok: true })
  },

  /** PUT /api/budget/:category */
  updateBudget: (category, payload) => {
    return Promise.resolve({ ok: true })
  },
}
