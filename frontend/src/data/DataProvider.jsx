// ─── DATA PROVIDER ────────────────────────────────────────────────────
// Responsabilidades:
//   1. Cache em memória com TTL por chave
//   2. Estado de loading/error por chave
//   3. Expose useData(selector, filters) — contrato estável
//   4. refetch() por chave ou global
//
// Para migrar para React Query: substitua o contexto interno e mantenha
// o hook useData com o mesmo contrato — as páginas não precisam mudar.

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { adapters } from '@/data/adapters'

// ── Cache TTL (ms) por tipo de dado ───────────────────────────────────
const CACHE_TTL = {
  kpis:               30_000,
  transactions:       60_000,
  monthlySeries:     120_000,
  monthlyReport:     120_000,
  categories:         60_000,
  goals:              60_000,
  budget:             60_000,
  recentTransactions: 30_000,
  incomeSeries:      120_000,
  expenseSeries:     120_000,
}

const DEFAULT_TTL = 60_000

// ── Context ────────────────────────────────────────────────────────────
const DataContext = createContext(null)

// ── Helpers ────────────────────────────────────────────────────────────
function makeCacheKey(selector, filters) {
  if (!filters || Object.keys(filters).length === 0) return selector
  // Remove undefined values before serialising so filters are stable
  const clean = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  )
  if (Object.keys(clean).length === 0) return selector
  return `${selector}::${JSON.stringify(clean)}`
}

function isFresh(entry, selector) {
  if (!entry) return false
  const ttl = CACHE_TTL[selector] ?? DEFAULT_TTL
  return Date.now() - entry.ts < ttl
}

// ── Provider ───────────────────────────────────────────────────────────
export function DataProvider({ children }) {
  // cache: { [cacheKey]: { data, ts, error } }
  const cacheRef = useRef({})

  // loading/error state per cacheKey (drives re-renders)
  const [states, setStates] = useState({})

  const setKeyState = useCallback((key, patch) => {
    setStates(prev => ({ ...prev, [key]: { ...(prev[key] || {}), ...patch } }))
  }, []) // Stable - uses setState callback, no external deps needed

  // ── fetch + cache a single key ──────────────────────────────────────
  const fetchKey = useCallback(async (selector, filters, cacheKey, force = false) => {
    if (!force && isFresh(cacheRef.current[cacheKey], selector)) return

    const adapter = adapters[selector]
    if (!adapter) {
      console.warn(`[DataProvider] No adapter for selector: "${selector}"`)
      return
    }

    setKeyState(cacheKey, { loading: true, error: null })

    try {
      const data = await adapter(filters)
      cacheRef.current[cacheKey] = { data, ts: Date.now(), error: null }
      setKeyState(cacheKey, { loading: false, error: null })
    } catch (err) {
      const message = err?.message || 'Erro ao carregar dados'
      cacheRef.current[cacheKey] = { data: null, ts: 0, error: message }
      setKeyState(cacheKey, { loading: false, error: message })
    }
  }, [setKeyState])

  // ── Public: getData (sync from cache) ──────────────────────────────
  const getData = useCallback((selector, filters) => {
    const key = makeCacheKey(selector, filters)
    return cacheRef.current[key]?.data ?? null
  }, [states]) // states dep ensures re-read after fetch completes

  // ── Public: refetch (invalidate + re-fetch) ─────────────────────────
  const refetch = useCallback((selector, filters) => {
    if (!selector) {
      const keys = Object.keys(cacheRef.current)
      keys.forEach(key => {
        const [sel, filStr] = key.split('::')
        const fil = filStr ? JSON.parse(filStr) : {}
        fetchKey(sel, fil, key, true)
      })
      return
    }
    const key = makeCacheKey(selector, filters || {})
    fetchKey(selector, filters || {}, key, true)
  }, [fetchKey])

  // ── Public: isLoading ───────────────────────────────────────────────
  const isLoading = useCallback((selector, filters) => {
    const key = makeCacheKey(selector, filters || {})
    return states[key]?.loading === true
  }, [states])

  // ── Public: getError ────────────────────────────────────────────────
  const getError = useCallback((selector, filters) => {
    const key = makeCacheKey(selector, filters || {})
    return states[key]?.error ?? null
  }, [states])

  const value = { getData, fetchKey, refetch, isLoading, getError, makeCacheKey }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

// ── useData hook — contrato público ────────────────────────────────────
// Assinatura mantida idêntica ao original.
export function useData(selector, filters = {}) {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData deve ser usado dentro de DataProvider')

  const cacheKey = ctx.makeCacheKey(selector, filters)

  useEffect(() => {
    ctx.fetchKey(selector, filters, cacheKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]) // Intentionally minimal - cacheKey changes when selector/filters change

  return {
    data:       ctx.getData(selector, filters),
    isLoading:  ctx.isLoading(selector, filters),
    isFetching: ctx.isLoading(selector, filters),
    error:      ctx.getError(selector, filters),
    refetch:    () => ctx.refetch(selector, filters),
  }
}

// ── useRefetch — refetch global sem precisar de selector ───────────────
export function useRefetch() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useRefetch deve ser usado dentro de DataProvider')
  return ctx.refetch
}

// ── useMutation — wrapper para mutações com estado local ───────────────
// Interface compatível com React Query useMutation para migração futura.
export function useMutation(mutationFn, options = {}) {
  const [state, setState] = useState({ loading: false, error: null, data: null })

  const mutate = useCallback(async (...args) => {
    setState({ loading: true, error: null, data: null })
    try {
      const data = await mutationFn(...args)
      setState({ loading: false, error: null, data })
      options.onSuccess?.(data)
      return data
    } catch (err) {
      const message = err?.message || 'Erro na operação'
      setState({ loading: false, error: message, data: null })
      options.onError?.(message)
      throw err
    }
  }, [mutationFn]) // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, mutate, isLoading: state.loading }
}
