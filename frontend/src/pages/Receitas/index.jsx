import { TrendingUp, DollarSign, Hash } from 'lucide-react'
import { useMemo } from 'react'
import { useData } from '@/data/DataProvider'
import { currency, currencyCompact, dateShort } from '@/utils/format'
import { Card, KpiCard, Badge, PageHeader, SectionCard, ErrorState } from '@/components/ui'
import { SkKpiRow, SkPageHeader, SkChart, SkCard, SkTable, Sk } from '@/components/skeleton'
import { AreaChartWidget } from '@/components/charts'

const CAT_LABELS = {
  salario: 'Salário', freelance: 'Freelance',
  dividendos: 'Dividendos', investimento: 'Investimentos',
}

const TH = { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }
const GRID = '100px 1fr 140px 130px'

export default function Receitas() {
  const { data: transactions, isLoading, error, refetch } = useData('transactions', { type: 'income' })
  const { data: series } = useData('incomeSeries')

  if (isLoading && !transactions) {
    return (
      <div className="k-page-enter">
        <SkPageHeader />
        <SkKpiRow count={3} />
        <SkCard style={{ marginBottom: 20 }}><SkChart h={220} /></SkCard>
        <SkCard><SkTable rows={6} cols={4} /></SkCard>
      </div>
    )
  }

  if (error) {
    return (
      <div className="k-page-enter">
        <PageHeader title="Receitas" />
        <Card><ErrorState message={error} onRetry={refetch} /></Card>
      </div>
    )
  }

  // ✅ Performance: useMemo for expensive calculations
  const { total, maior, mediaM, byCategory, sortedByCategory } = useMemo(() => {
    const computedTotal = transactions?.reduce((s, t) => s + t.amount, 0) || 0
    const computedMaior = transactions?.length ? Math.max(...transactions.map(t => t.amount)) : 0
    const computedMediaM = computedTotal / 6

    const computedByCategory = transactions?.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {}) || {}

    const sorted = Object.entries(computedByCategory).sort((a, b) => b[1] - a[1])

    return {
      total: computedTotal,
      maior: computedMaior,
      mediaM: computedMediaM,
      byCategory: computedByCategory,
      sortedByCategory: sorted,
    }
  }, [transactions])

  return (
    <div className="k-page-enter">
      <PageHeader title="Receitas" subtitle="Todas as entradas · Outubro 2024" />

      <div className="k-grid-3" style={{ marginBottom: 24 }}>
        <KpiCard label="Total Receitas"  value={currency(total)}   delta={12.4} icon={TrendingUp}  color="var(--accent-success)" sub="este mês" />
        <KpiCard label="Maior Entrada"   value={currency(maior)}                icon={DollarSign}  color="var(--accent-light)"   sub="em uma transação" />
        <KpiCard label="Média Mensal"    value={currency(mediaM)}  delta={5.8}  icon={Hash}        color="var(--accent-info)"    sub="últimos 6 meses" />
      </div>

      <SectionCard title="Evolução de Receitas" subtitle="Últimos 6 meses" style={{ marginBottom: 20 }}>
        <AreaChartWidget
          data={series}
          keys={[{ key: 'value', label: 'Receitas', color: '#4CCFA8' }]}
          height={220}
          formatter={currencyCompact}
        />
      </SectionCard>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        {/* By origin */}
        <SectionCard title="Por Origem">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {sortedByCategory.map(([cat, val]) => {
              const pct = (val / total) * 100
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {CAT_LABELS[cat] || cat}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                    <div className="k-progress-track">
                      <div
                        className="k-progress-fill"
                        style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--accent-success), #3bb88e)' }}
                      />
                    </div>
                    <div style={{ marginTop: 3, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {currency(val)}
                    </div>
                  </div>
                )
              })}
          </div>
        </SectionCard>

        {/* Table */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 12, padding: '12px 20px', background: 'var(--surface-3)', borderBottom: '1px solid var(--border-subtle)' }}>
            {['Data', 'Descrição', 'Origem', 'Valor'].map(h => <span key={h} style={TH}>{h}</span>)}
          </div>
          {transactions?.map((t, i) => (
            <div
              key={t.id}
              className="k-table-row"
              style={{
                display: 'grid', gridTemplateColumns: GRID,
                gap: 12, padding: '12px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
              }}
            >
              <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>{dateShort(t.date)}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', alignSelf: 'center' }}>{t.description}</span>
              <span style={{ alignSelf: 'center' }}>
                <Badge variant="success" size="xs">{CAT_LABELS[t.category] || t.category}</Badge>
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--accent-success)', alignSelf: 'center' }}>
                +{currency(t.amount)}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
