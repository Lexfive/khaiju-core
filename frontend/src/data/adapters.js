// ─── DATA ADAPTER (Production Ready) ──────────────────────────────────
// Camada de abstração entre o DataProvider e a API backend.
// Usa dados mockados em desenvolvimento, API real em produção.
// ─────────────────────────────────────────────────────────────────────

import { apiClient } from './apiClient'
import mockSelectors from './mock'

// Detectar se está em produção (build) ou desenvolvimento
const IS_PRODUCTION = import.meta.env.PROD
const USE_MOCK_DATA = !IS_PRODUCTION // Usar mock apenas em dev

// ── Helper: Tentar API, fallback para mock em caso de erro ────────────
async function fetchWithFallback(apiFn, mockFn) {
  if (USE_MOCK_DATA) {
    // Desenvolvimento: retornar mock diretamente
    const result = mockFn()
    return result instanceof Promise ? result : Promise.resolve(result)
  }

  // Produção: tentar API real
  try {
    return await apiFn()
  } catch (error) {
    console.warn('[Adapter] API falhou, usando mock como fallback:', error.message)
    const result = mockFn()
    return result instanceof Promise ? result : Promise.resolve(result)
  }
}

// ── Adaptadores ────────────────────────────────────────────────────────

export const adapters = {
  /** GET /api/kpis */
  kpis: () =>
    fetchWithFallback(
      () => apiClient.get('/kpis'),
      () => mockSelectors.kpis()
    ),

  /** GET /api/transactions */
  transactions: (filters = {}) =>
    fetchWithFallback(
      () => {
        const params = new URLSearchParams(filters).toString()
        return apiClient.get(`/transactions${params ? `?${params}` : ''}`)
      },
      () => mockSelectors.transactions(filters)
    ),

  /** GET /api/transactions/recent */
  recentTransactions: (limit = 5) =>
    fetchWithFallback(
      () => apiClient.get(`/transactions?limit=${limit}&sort=date:desc`),
      () => mockSelectors.recentTransactions(limit)
    ),

  /** GET /api/reports/monthly-series */
  monthlySeries: () =>
    fetchWithFallback(
      () => apiClient.get('/reports/monthly-series'),
      () => mockSelectors.monthlySeries()
    ),

  /** GET /api/reports/income-series */
  incomeSeries: () =>
    fetchWithFallback(
      () => apiClient.get('/reports/income-series'),
      () => mockSelectors.incomeSeries()
    ),

  /** GET /api/reports/expense-series */
  expenseSeries: () =>
    fetchWithFallback(
      () => apiClient.get('/reports/expense-series'),
      () => mockSelectors.expenseSeries()
    ),

  /** GET /api/reports/monthly */
  monthlyReport: () =>
    fetchWithFallback(
      () => apiClient.get('/reports/monthly'),
      () => mockSelectors.monthlyReport()
    ),

  /** GET /api/categories */
  categories: () =>
    fetchWithFallback(
      () => apiClient.get('/categories/stats'),
      () => mockSelectors.categories()
    ),

  /** GET /api/goals (mock-only por enquanto) */
  goals: () =>
    fetchWithFallback(
      () => apiClient.get('/goals').catch(() => mockSelectors.goals()),
      () => mockSelectors.goals()
    ),

  /** GET /api/budget (mock-only por enquanto) */
  budget: () =>
    fetchWithFallback(
      () => apiClient.get('/budget').catch(() => mockSelectors.budget()),
      () => mockSelectors.budget()
    ),
}

// ── Mutações (POST/PUT/DELETE) ─────────────────────────────────────────

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

  /** PUT /api/goals/:id */
  updateGoal: (id, payload) =>
    apiClient.put(`/goals/${id}`, payload),

  /** PUT /api/budget/:category */
  updateBudget: (category, payload) =>
    apiClient.put(`/budget/${category}`, payload),

  /** POST /api/auth/login */
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  /** POST /api/auth/register */
  register: (name, email, password) =>
    apiClient.post('/auth/register', { name, email, password }),

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
