// ─── TOAST PROVIDER ───────────────────────────────────────────────────
import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

let uid = 0

const DEFAULTS = {
  success: { duration: 3500, label: 'Sucesso' },
  error:   { duration: 5000, label: 'Erro' },
  warning: { duration: 4000, label: 'Atenção' },
  info:    { duration: 3500, label: 'Info' },
}

const ICONS   = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info }
const COLORS  = {
  success: { text: 'var(--accent-success)', border: 'rgba(76,207,168,0.3)',  bg: 'rgba(76,207,168,0.06)'  },
  error:   { text: 'var(--accent-danger)',  border: 'rgba(232,92,122,0.3)',  bg: 'rgba(232,92,122,0.06)'  },
  warning: { text: 'var(--accent-warning)', border: 'rgba(232,168,76,0.3)',  bg: 'rgba(232,168,76,0.06)'  },
  info:    { text: 'var(--accent-light)',   border: 'rgba(160,126,232,0.3)', bg: 'rgba(160,126,232,0.06)' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setToasts(p => p.filter(t => t.id !== id))
  }, []) // Stable - uses setState callback

  const push = useCallback((message, type = 'info', duration) => {
    const id = ++uid
    const dur = duration ?? DEFAULTS[type]?.duration ?? 3500
    setToasts(p => [...p.slice(-4), { id, message, type, dur }]) // max 5 toasts
    timers.current[id] = setTimeout(() => dismiss(id), dur)
    return id
  }, [dismiss]) // dismiss is stable

  const toast = {
    success: (msg, dur) => push(msg, 'success', dur),
    error:   (msg, dur) => push(msg, 'error',   dur),
    warning: (msg, dur) => push(msg, 'warning', dur),
    info:    (msg, dur) => push(msg, 'info',    dur),
    dismiss,
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider')
  return ctx
}

// ── Toast Item ─────────────────────────────────────────────────────────
function ToastItem({ toast: t, onDismiss }) {
  const Icon = ICONS[t.type]
  const c = COLORS[t.type]

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        pointerEvents: 'all',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        background: 'var(--surface-3)',
        backgroundImage: `linear-gradient(135deg, ${c.bg}, transparent)`,
        border: `1px solid ${c.border}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.55), 0 0 0 1px ${c.border}`,
        borderRadius: 'var(--radius-md)',
        padding: '11px 14px 11px 12px',
        minWidth: 290,
        maxWidth: 400,
        position: 'relative',
        overflow: 'hidden',
        animation: 'toastIn 0.28s var(--ease-spring)',
      }}
    >
      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0,
        height: 2,
        background: c.text,
        borderRadius: '0 0 var(--radius-md) var(--radius-md)',
        opacity: 0.5,
        animation: `toastProgress ${t.dur}ms linear forwards`,
      }} />

      <div style={{ paddingTop: 1, flexShrink: 0 }}>
        <Icon size={15} color={c.text} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>
          {t.message}
        </div>
      </div>

      <button
        onClick={() => onDismiss(t.id)}
        aria-label="Fechar notificação"
        style={{
          flexShrink: 0,
          marginTop: 1,
          color: 'var(--text-muted)',
          padding: 2,
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          transition: 'color var(--duration-fast)',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <X size={13} />
      </button>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(12px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  )
}

// ── Stack container ────────────────────────────────────────────────────
function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null
  return (
    <div
      aria-label="Notificações"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 'var(--z-toast)',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
