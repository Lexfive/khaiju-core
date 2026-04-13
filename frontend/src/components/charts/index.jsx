import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--surface-3)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      padding: '8px 12px',
      boxShadow: 'var(--shadow-md)',
    }}>
      {label && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color || p.fill }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
            {formatter ? formatter(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function AreaChartWidget({ data, keys, height = 240, formatter, gradient = true }) {
  const COLORS = ['#7D4EBF', '#5214D9', '#4CCFA8', '#E8A84C']
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
        <defs>
          {keys.map((k, i) => (
            <linearGradient key={k.key} id={`grad-${k.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={k.color || COLORS[i]} stopOpacity={0.4} />
              <stop offset="100%" stopColor={k.color || COLORS[i]} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatter} width={60} />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        {keys.map((k, i) => (
          <Area
            key={k.key}
            type="monotone"
            dataKey={k.key}
            name={k.label}
            stroke={k.color || COLORS[i]}
            strokeWidth={2}
            fill={gradient ? `url(#grad-${k.key})` : 'none'}
            dot={false}
            activeDot={{ r: 4, fill: k.color || COLORS[i], stroke: 'var(--surface-base)', strokeWidth: 2 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function BarChartWidget({ data, keys, height = 240, formatter }) {
  const COLORS = ['#7D4EBF', '#5214D9', '#4CCFA8']
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatter} width={60} />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)' }} />
        {keys.map((k, i) => (
          <Bar key={k.key} dataKey={k.key} name={k.label} fill={k.color || COLORS[i]} radius={[3,3,0,0]} maxBarSize={32} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function PieChartWidget({ data, height = 240, formatter }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
          nameKey="label"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="var(--surface-2)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)' }} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  )
}
