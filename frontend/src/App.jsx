import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/data/AuthProvider'
import { DataProvider } from '@/data/DataProvider'
import { ToastProvider } from '@/data/ToastProvider'
import { AppLayout } from '@/components/layout/AppLayout'
import LoginPage from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Transacoes from '@/pages/Transacoes'
import Receitas from '@/pages/Receitas'
import Despesas from '@/pages/Despesas'
import Relatorios from '@/pages/Relatorios'
import Configuracoes from '@/pages/Configuracoes'

// ═══════════════════════════════════════════════════════════════
// 🔐 Protected Route - Redireciona para login se não autenticado
// ═══════════════════════════════════════════════════════════════

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface-base)',
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid var(--surface-3)',
          borderTopColor: 'var(--accent-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// ═══════════════════════════════════════════════════════════════
// 📱 App Principal
// ═══════════════════════════════════════════════════════════════

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Rota pública */}
              <Route path="/login" element={<LoginPage />} />

              {/* Rotas protegidas */}
              <Route element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route path="/"              element={<Dashboard />}    />
                <Route path="/transacoes"    element={<Transacoes />}   />
                <Route path="/receitas"      element={<Receitas />}     />
                <Route path="/despesas"      element={<Despesas />}     />
                <Route path="/relatorios"    element={<Relatorios />}   />
                <Route path="/configuracoes" element={<Configuracoes />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </DataProvider>
    </AuthProvider>
  )
}
