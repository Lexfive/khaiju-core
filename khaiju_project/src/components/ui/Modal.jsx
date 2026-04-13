import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export function Modal({ open, onClose, title, children, width = 520, footer }) {
  const firstFocusRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    firstFocusRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 'var(--z-modal)',
        background: 'rgba(5, 4, 14, 0.82)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'kModalBg 0.2s ease both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: width,
          background: 'var(--surface-2)',
          backgroundImage: 'var(--noise-url), linear-gradient(160deg, var(--surface-2), var(--surface-3))',
          border: '1px solid var(--border-emphasis)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg), var(--glow-md)',
          overflow: 'hidden',
          animation: 'kModalIn 0.26s var(--ease-spring) both',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px 16px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <h3
            id="modal-title"
            style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}
          >
            {title}
          </h3>
          <button
            ref={firstFocusRef}
            onClick={onClose}
            aria-label="Fechar"
            className="k-btn k-btn--ghost k-btn--sm"
            style={{ padding: '4px 6px' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', ...(footer ? { paddingBottom: 0 } : {}) }}>
          {children}
        </div>

        {/* Optional footer */}
        {footer && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex', justifyContent: 'flex-end', gap: 8,
          }}>
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes kModalBg { from { opacity: 0 } to { opacity: 1 } }
        @keyframes kModalIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  )
}
