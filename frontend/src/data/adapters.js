// ═══════════════════════════════════════════════════════════════
// 🔌 Data Adapters - Conexão REAL com API (SEM MOCK)
// ═══════════════════════════════════════════════════════════════

import { apiClient } from './apiClient'

// ✅ PRODUÇÃO: Sem fallback para mock
// Se API falhar, erro deve ser mostrado ao usuário

export const adapters = {
  /** GET /api/kpis */
  kpis: () => apiClient.get('/kpis'),

  /** GET /api/transactions */
  transactions: (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    return apiClient.get(`/transactions${params ? `?${params}` : ''}`)
  },

  /** GET /api/transactions/recent */
  recentTransactions: (limit = 5) => 
    apiClient.get(`/transactions?limit=${limit}&sort=date:desc`),

  /** GET /api/reports/monthly-series */
  monthlySeries: () => apiClient.get('/reports/monthly-series'),

  /** GET /api/reports/income-series */
  incomeSeries: () => apiClient.get('/reports/income-series'),

  /** GET /api/reports/expense-series */
  expenseSeries: () => apiClient.get('/reports/expense-series'),

  /** GET /api/reports/monthly */
  monthlyReport: () => apiClient.get('/reports/monthly'),

  /** GET /api/categories/stats */
  categories: () => apiClient.get('/categories/stats'),

  /** GET /api/goals (placeholder até implementar) */
  goals: () => apiClient.get('/goals').catch(() => ({ goals: [] })),

  /** GET /api/budget (placeholder até implementar) */
  budget: () => apiClient.get('/budget').catch(() => ({ categories: [] })),
}

// ═══════════════════════════════════════════════════════════════
// ✏️ Mutations (POST/PUT/DELETE)
// ═══════════════════════════════════════════════════════════════

export const mutations = {
  /** POST /api/transactions */
  createTransaction: (payload) =>
    apiClient.post('/transactions', payload),

  /** PUT /api/transactions/:id */
  updateTransaction: (id, payload) =>
    apiClient.put(`/transactions/${id}`, payload),

  /** DELETE /api/transactions/:id */
  deleteTransaction: (id) =>
    apiClient.delete(`/transactions/${id}`),

  /** POST /api/categories */
  createCategory: (payload) =>
    apiClient.post('/categories', payload),

  /** PUT /api/categories/:id */
  updateCategory: (id, payload) =>
    apiClient.put(`/categories/${id}`, payload),

  /** DELETE /api/categories/:id */
  deleteCategory: (id) =>
    apiClient.delete(`/categories/${id}`),
}
