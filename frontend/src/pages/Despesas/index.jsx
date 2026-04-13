import { TrendingDown, Receipt, Hash } from 'lucide-react'
import { useData } from '@/data/DataProvider'
import { currency, currencyCompact, dateShort } from '@/utils/format'
import { Card, KpiCard, Badge, PageHeader, SectionCard, ErrorState } from '@/components/ui'
import { SkKpiRow, SkPageHeader, SkChart, SkCard, SkTable } from '@/components/skeleton'
import { PieChartWidget } from '@/components/charts'

const TH = { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }
const GRID = '100px 1fr 140px 130px'

export default function Despesas() {
  const { data: transactions, isLoading, error, refetch } = useData('transactions', { type: 'despesa' })
  const { data: categories } = useData('categories')

  if (isLoading && !transactions) {
    return (
      <div className="k-page-enter">
        <SkPageHeader />
        <SkKpiRow count={3} />
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, marginBottom: 20 }}>
          <SkCard><SkChart h={260} /></SkCard>
          <SkCard><SkChart h={260} /></SkCard>
        </div>
        <SkCard><SkTable rows={6} cols={4} /></SkCard>
      </div>
    )
  }

  if (error) {
    return (
      <div className="k-page-enter">
        <PageHeader title="Despesas" />
        <Card><ErrorState message={error} onRetry={refetch} /></Card>
      </div>
    )
  }

  const total = transactions?.reduce((s, t) => s + Math.abs(t.amount), 0) || 0
  const maior = transactions?.length ? Math.max(...transactions.map(t => Math.abs(t.amount))) : 0
  const qtd   = transactions?.length || 0

  return (
    <div className="k-page-enter">
      <PageHeader title="Despesas" subtitle="Todas as saídas · Outubro 2024" />

      <div className="k-grid-3" style={{ marginBottom: 24 }}>
        <KpiCard label="Total Despesas" value={currency(total)} delta={-3.1} icon={TrendingDown} color="var(--accent-danger)"  sub="este mês" />
        <KpiCard label="Maior Gasto"    value={currency(maior)}              icon={Receipt}      color="var(--accent-warning)" sub="em uma transação" />
        <KpiCard label="Transações"     value={qtd}                          icon={Hash}         color="var(--accent-info)"    sub="este mês" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, marginBottom: 20 }}>
        <SectionCard title="Distribuição" subtitle="Por categoria">
          <PieChartWidget data={categories || []} height={260} formatter={currencyCompact} />
        </SectionCard>

        <SectionCard title="Ranking de Categorias">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {categories?.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 'var(--radius-xs)',
                  background: 'var(--surface-4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{c.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {currency(c.value)}
                    </span>
                  </div>
                  <div className="k-progress-track" style={{ height: 4 }}>
                    <div className="k-progress-fill" style={{ width: `${c.percent}%`, background: c.color, opacity: 0.8 }} />
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: c.color, minWidth: 36, textAlign: 'right', flexShrink: 0 }}>
                  {c.percent.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 12, padding: '12px 20px', background: 'var(--surface-3)', borderBottom: '1px solid var(--border-subtle)' }}>
          {['Data', 'Descrição', 'Categoria', 'Valor'].map(h => <span key={h} style={TH}>{h}</span>)}
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
            <span style={{ alignSelf: 'center' }}><Badge variant="danger" size="xs">{t.category}</Badge></span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--accent-danger)', alignSelf: 'center' }}>
              {currency(t.amount)}
            </span>
          </div>
        ))}
      </Card>
    </div>
  )
}
