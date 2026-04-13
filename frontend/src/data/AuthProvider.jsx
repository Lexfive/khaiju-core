import { createContext, useContext, useState, useEffect } from 'react'
import { apiClient } from './apiClient'

// ═══════════════════════════════════════════════════════════════
// 🔐 Auth Context - Gerenciamento de Autenticação Global
// ═══════════════════════════════════════════════════════════════

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ✅ Verificar autenticação ao carregar
  useEffect(() => {
    checkAuth()
  }, [])

  /**
   * Verificar se usuário está autenticado
   */
  const checkAuth = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get('/auth/me')
      setUser(data.user)
      setError(null)
    } catch (err) {
      setUser(null)
      // Não mostrar erro se não estiver autenticado (esperado)
      if (err.message !== 'Não autenticado. Faça login para continuar.') {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Login
   */
  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await apiClient.post('/auth/login', { email, password })
      
      setUser(data.user)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Registro
   */
  const register = async (name, email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await apiClient.post('/auth/register', { name, email, password })
      
      setUser(data.user)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Logout
   */
  const logout = async () => {
    try {
      await apiClient.post('/auth/logout')
      setUser(null)
      setError(null)
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
      // Limpar dados localmente mesmo se API falhar
      setUser(null)
    }
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook para usar autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  
  return context
}
