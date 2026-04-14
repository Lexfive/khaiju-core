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
    const params = new URLSearchParams()
    
    // Normalizar type: receita/despesa/income/expense → income/expense
    if (filters.type) {
      if (filters.type === 'receita') filters.type = 'income'
      if (filters.type === 'despesa') filters.type = 'expense'
    }
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    
    const queryString = params.toString()
    return apiClient.get(`/transactions${queryString ? `?${queryString}` : ''}`)
      .then(res => res.data || res) // Backend retorna { data, pagination }
  },

  /** GET /api/transactions (recent) */
  recentTransactions: (limit = 5) => {
    const numLimit = typeof limit === 'number' ? limit : 5
    return apiClient.get(`/transactions?limit=${numLimit}`)
      .then(res => res.data || res)
  },

  /** GET /api/reports - Séries mensais calculadas no backend */
  monthlySeries: () => apiClient.get('/reports')
    .then(res => res.monthlySeries || []),

  /** GET /api/reports - Série de receitas */
  incomeSeries: () => apiClient.get('/reports')
    .then(res => res.incomeSeries || []),

  /** GET /api/reports - Série de despesas */
  expenseSeries: () => apiClient.get('/reports')
    .then(res => res.expenseSeries || []),

  /** GET /api/reports - Relatório mensal */
  monthlyReport: () => apiClient.get('/reports')
    .then(res => res.monthlyReport || []),

  /** GET /api/categories */
  categories: () => apiClient.get('/categories')
    .then(res => res.data || res),

  /** Placeholder - Goals não implementado ainda */
  goals: () => Promise.resolve([]),

  /** Placeholder - Budget não implementado ainda */
  budget: () => Promise.resolve([]),
}

// ═══════════════════════════════════════════════════════════════
// ✏️ Mutations (POST/PUT/DELETE)
// ═══════════════════════════════════════════════════════════════

export const mutations = {
  /** POST /api/transactions */
  createTransaction: (payload) => {
    // Normalizar type antes de enviar
    const normalized = { ...payload }
    if (normalized.type === 'receita') normalized.type = 'income'
    if (normalized.type === 'despesa') normalized.type = 'expense'
    
    return apiClient.post('/transactions', normalized)
  },

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
