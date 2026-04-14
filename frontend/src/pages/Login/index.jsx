import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/data/AuthProvider'
import { Button, Input } from '@/components/ui'
import { LogIn, UserPlus, Mail, Lock, User } from 'lucide-react'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [localError, setLocalError] = useState(null)

  const { login, register, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)

    if (mode === 'login') {
      const result = await login(formData.email, formData.password)
      if (!result.success) {
        setLocalError(result.error)
      }
      // Não precisa redirecionar aqui - o useEffect acima faz isso
    } else {
      if (!formData.name) {
        setLocalError('Nome é obrigatório')
        return
      }
      
      const result = await register(formData.name, formData.email, formData.password)
      if (!result.success) {
        setLocalError(result.error)
      }
      // Não precisa redirecionar aqui - o useEffect acima faz isso
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setLocalError(null)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--surface-base) 0%, #0A0A0F 100%)',
      padding: 20,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16,
        padding: 40,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            marginBottom: 16,
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 8,
            fontFamily: 'var(--font-display)',
          }}>
            Khaiju
          </h1>
          
          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
          }}>
            {mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          padding: 4,
          background: 'var(--surface-2)',
          borderRadius: 8,
        }}>
          <button
            onClick={() => {
              setMode('login')
              setLocalError(null)
            }}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              background: mode === 'login' ? 'var(--accent-primary)' : 'transparent',
              color: mode === 'login' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Entrar
          </button>
          
          <button
            onClick={() => {
              setMode('register')
              setLocalError(null)
            }}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              background: mode === 'register' ? 'var(--accent-primary)' : 'transparent',
              color: mode === 'register' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Registrar
          </button>
        </div>

        {/* Error */}
        {localError && (
          <div style={{
            padding: 12,
            marginBottom: 16,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 8,
            color: '#EF4444',
            fontSize: 13,
          }}>
            {localError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'register' && (
            <Input
              name="name"
              type="text"
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              required
              autoFocus
            />
          )}
          
          <Input
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            icon={Mail}
            required
            autoFocus={mode === 'login'}
          />
          
          <Input
            name="password"
            type="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            icon={Lock}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={mode === 'login' ? LogIn : UserPlus}
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </Button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: 24,
          paddingTop: 24,
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 12,
            color: 'var(--text-muted)',
          }}>
            Sistema de Controle Financeiro
          </p>
        </div>
      </div>
    </div>
  )
}
