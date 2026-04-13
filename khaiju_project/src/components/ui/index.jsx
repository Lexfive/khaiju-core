// ─── UI COMPONENTS ────────────────────────────────────────────────────
import { useState } from 'react'
import { ChevronDown, AlertCircle } from 'lucide-react'

// ── CARD ──────────────────────────────────────────────────────────────
export function Card({ children, style = {}, glow = false, onClick, as: Tag = 'div' }) {
  return (
    <Tag
      onClick={onClick}
      className={`k-card${glow ? ' k-card--glow' : ''}${onClick ? ' k-card--clickable' : ''}`}
      style={style}
    >
      {children}
    </Tag>
  )
}

// ── KPI CARD ──────────────────────────────────────────────────────────
export function KpiCard({ label, value, delta: deltaValue, icon: Icon, color, sub }) {
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="k-row-between">
        <span className="k-label">{label}</span>
        {Icon && (
          <div className="k-icon-badge" style={{ '--icon-color': color || 'var(--accent-purple)' }}>
            <Icon size={15} color={color || 'var(--accent-purple)'} />
          </div>
        )}
      </div>
      <div>
        <div className="k-value-lg">{value}</div>
        {(deltaValue !== undefined || sub) && (
          <div className="k-row" style={{ gap: 8, marginTop: 4 }}>
            {deltaValue !== undefined && <DeltaBadge value={deltaValue} />}
            {sub && <span className="k-caption">{sub}</span>}
          </div>
        )}
      </div>
    </Card>
  )
}

// ── BADGE ─────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'default', size = 'sm', style = {} }) {
  return (
    <span className={`k-badge k-badge--${variant} k-badge--${size}`} style={style}>
      {children}
    </span>
  )
}

// ── DELTA BADGE ───────────────────────────────────────────────────────
export function DeltaBadge({ value }) {
  const isPos = value >= 0
  return (
    <span className={`k-delta ${isPos ? 'k-delta--pos' : 'k-delta--neg'}`}>
      {isPos ? '↑' : '↓'} {Math.abs(value).toFixed(1)}%
    </span>
  )
}

// ── BUTTON ────────────────────────────────────────────────────────────
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  style = {},
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`k-btn k-btn--${variant} k-btn--${size}`}
      style={style}
      aria-busy={loading}
    >
      {loading
        ? <span className="k-spinner" aria-hidden="true" />
        : Icon && <Icon size={14} aria-hidden="true" />
      }
      {children}
    </button>
  )
}

// ── INPUT ─────────────────────────────────────────────────────────────
export function Input({
  placeholder,
  value,
  onChange,
  icon: Icon,
  type = 'text',
  style = {},
  error,
  name,
  id,
  disabled = false,
}) {
  return (
    <div className={`k-input-wrap${error ? ' k-input-wrap--error' : ''}`} style={style}>
      {Icon && (
        <span className="k-input-icon" aria-hidden="true">
          <Icon size={15} />
        </span>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`k-input${Icon ? ' k-input--icon' : ''}${error ? ' k-input--error' : ''}`}
        aria-invalid={!!error}
      />
      {error && (
        <span className="k-input-error-icon" aria-hidden="true">
          <AlertCircle size={14} />
        </span>
      )}
    </div>
  )
}

// ── SELECT ────────────────────────────────────────────────────────────
export function Select({ value, onChange, options = [], style = {}, disabled = false }) {
  return (
    <div className="k-select-wrap" style={style}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="k-select"
      >
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: 'var(--surface-3)' }}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="k-select-icon" aria-hidden="true">
        <ChevronDown size={14} />
      </span>
    </div>
  )
}

// ── EMPTY STATE ───────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="k-empty" role="status">
      {Icon && (
        <div className="k-empty__icon">
          <Icon size={22} aria-hidden="true" />
        </div>
      )}
      <div className="k-empty__body">
        <p className="k-empty__title">{title}</p>
        {description && <p className="k-empty__desc">{description}</p>}
      </div>
      {action && <div className="k-empty__action">{action}</div>}
    </div>
  )
}

// ── ERROR STATE ───────────────────────────────────────────────────────
export function ErrorState({ message, onRetry }) {
  return (
    <div className="k-empty" role="alert">
      <div className="k-empty__icon k-empty__icon--error">
        <AlertCircle size={22} aria-hidden="true" />
      </div>
      <div className="k-empty__body">
        <p className="k-empty__title">Erro ao carregar</p>
        <p className="k-empty__desc">{message || 'Tente novamente em instantes.'}</p>
      </div>
      {onRetry && (
        <div className="k-empty__action">
          <Button variant="secondary" size="sm" onClick={onRetry}>Tentar novamente</Button>
        </div>
      )}
    </div>
  )
}

// ── PAGE HEADER ───────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions, style = {} }) {
  return (
    <div className="k-page-header" style={style}>
      <div>
        <h1 className="k-page-title">{title}</h1>
        {subtitle && <p className="k-page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="k-row" style={{ gap: 8 }}>{actions}</div>}
    </div>
  )
}

// ── DIVIDER ───────────────────────────────────────────────────────────
export function Divider({ style = {} }) {
  return <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0', ...style }} />
}

// ── SECTION CARD ─────────────────────────────────────────────────────
// Card com title + optional subtitle + optional action
export function SectionCard({ title, subtitle, action, children, style = {} }) {
  return (
    <Card style={style}>
      <div className="k-row-between" style={{ marginBottom: 16 }}>
        <div>
          <h3 className="k-section-title">{title}</h3>
          {subtitle && <p className="k-caption" style={{ marginTop: 2 }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  )
}
