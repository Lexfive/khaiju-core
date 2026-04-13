// ─── SKELETON COMPONENTS ──────────────────────────────────────────────
// A animação kPulse é injetada uma vez via tokens.css — sem <style> em
// cada render. Skeletons usam classes CSS para garantir consistência.

const SK = {
  background: 'linear-gradient(90deg, var(--surface-3) 0%, var(--surface-4) 50%, var(--surface-3) 100%)',
  backgroundSize: '200% 100%',
  animation: 'kPulse 1.8s ease-in-out infinite',
  borderRadius: 'var(--radius-sm)',
}

export function Sk({ w = '100%', h = 16, r, style = {} }) {
  return (
    <div style={{ ...SK, width: w, height: h, ...(r ? { borderRadius: r } : {}), ...style }} />
  )
}

export function SkCard({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--surface-2)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 24,
      ...style,
    }}>
      {children}
    </div>
  )
}

export function SkRow({ cols = 4, gap = 16, style = {} }) {
  return (
    <div style={{ display: 'flex', gap, ...style }}>
      {Array.from({ length: cols }, (_, i) => (
        <Sk key={i} h={36} style={{ flex: 1, animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  )
}

export function SkChart({ h = 240, style = {} }) {
  const heights = [60, 80, 45, 90, 70, 55, 85, 65, 75, 50, 88, 72]
  return (
    <div style={{ height: h, display: 'flex', alignItems: 'flex-end', gap: 8, padding: '16px 0', ...style }}>
      {heights.map((pct, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${pct}%`,
          ...SK,
          borderRadius: '4px 4px 0 0',
          animationDelay: `${i * 0.07}s`,
        }} />
      ))}
    </div>
  )
}

export function SkTable({ rows = 6, cols = 5 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* header */}
      <div style={{ display: 'flex', gap: 16, padding: '12px 20px' }}>
        {Array.from({ length: cols }, (_, i) => (
          <Sk key={i} h={11} style={{ flex: i === 1 ? 2 : 1 }} />
        ))}
      </div>
      {/* rows */}
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} style={{
          display: 'flex', gap: 16,
          padding: '14px 20px',
          background: r % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
        }}>
          {Array.from({ length: cols }, (_, c) => (
            <Sk key={c} h={12}
              style={{ flex: c === 1 ? 2 : 1, animationDelay: `${(r * cols + c) * 0.03}s` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Page-level skeleton presets ───────────────────────────────────────

export function SkKpiRow({ count = 4 }) {
  return (
    <div className="k-grid-4" style={{ marginBottom: 24 }}>
      {Array.from({ length: count }, (_, i) => (
        <SkCard key={i}>
          <Sk h={11} w="60%" style={{ marginBottom: 14 }} />
          <Sk h={28} w="80%" style={{ marginBottom: 10 }} />
          <Sk h={11} w="40%" />
        </SkCard>
      ))}
    </div>
  )
}

export function SkPageHeader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
      <div>
        <Sk w={180} h={26} style={{ marginBottom: 8 }} />
        <Sk w={120} h={13} />
      </div>
      <Sk w={110} h={34} />
    </div>
  )
}
