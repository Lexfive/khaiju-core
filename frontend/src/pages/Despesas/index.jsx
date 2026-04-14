import { TrendingDown, Receipt, Hash } from 'lucide-react'
import { useMemo } from 'react'
import { useData } from '@/data/DataProvider'
import { currency, currencyCompact, dateShort } from '@/utils/format'
import { Card, KpiCard, Badge, PageHeader, SectionCard, ErrorState } from '@/components/ui'
import { SkKpiRow, SkPageHeader, SkChart, SkCard, SkTable } from '@/components/skeleton'
import { PieChartWidget } from '@/components/charts'

const TH = { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }
const GRID = '100px 1fr 140px 130px'

export default function Despesas() {
  const { data: rawTransactions, isLoading, error, refetch } = useData('transactions', { type: 'expense' })
  const transactions = Array.isArray(rawTransactions) ? rawTransactions : []

  const { total, maior, qtd, byCategory, pieData } = useMemo(() => {
    const computedTotal = transactions.reduce((s, t) => s + Math.abs(t?.amount || 0), 0)
    const amounts = transactions.map(t => Math.abs(t?.amount || 0)).filter(a => a > 0)
    const computedMaior = amounts.length > 0 ? Math.max(...amounts) : 0
    const computedQtd = transactions.length

    const computedByCategory = transactions.reduce((acc, t) => {
      const cat = t?.category || 'outros'
      acc[cat] = (acc[cat] || 0) + Math.abs(t?.amount || 0)
      return acc
    }, {})

    const computedPieData = Object.entries(computedByCategory).map(([name, value]) => ({
      name,
      value,
    }))

    return {
      total: computedTotal,
      maior: computedMaior,
      qtd: computedQtd,
      byCategory: computedByCategory,
      pieData: computedPieData,
    }
  }, [transactions])

  if (isLoading) {
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

  return (
    <div className="k-page-enter">
      <PageHeader title="Despesas" subtitle="Todas as saídas · Outubro 2024" />

      <div className="k-grid-3" style={{ marginBottom: 24 }}>
        <KpiCard label="Total Despesas" value={currency(total)} delta={-3.1} icon={TrendingDown} color="var(--accent-danger)"  sub="este mês" />
        <KpiCard label="Maior Gasto"    value={currency(maior)}              icon={Receipt}      color="var(--accent-warning)" sub="em uma transação" />
        <KpiCard label="Transações"     value={qtd}                          icon={Hash}         color="var(--accent-info)"    sub="este mês" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, marginBottom: 20 }}>
        <SectionCard title="Por Categoria">
          {pieData.length > 0 ? (
            <PieChartWidget data={pieData} height={240} />
          ) : (
            <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              Nenhum dado disponível
            </div>
          )}
        </SectionCard>

        <SectionCard title="Top 5 Categorias">
          {Object.keys(byCategory).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Object.entries(byCategory)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([cat, val]) => {
                  const pct = total > 0 ? (val / total) * 100 : 0
                  return (
                    <div key={cat}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{cat}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                      <div className="k-progress-track">
                        <div
                          className="k-progress-fill"
                          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--accent-danger), #e05c7a)' }}
                        />
                      </div>
                      <div style={{ marginTop: 3, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {currency(val)}
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              Nenhuma despesa registrada
            </div>
          )}
        </SectionCard>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 12, padding: '12px 20px', background: 'var(--surface-3)', borderBottom: '1px solid var(--border-subtle)' }}>
          {['Data', 'Descrição', 'Categoria', 'Valor'].map(h => <span key={h} style={TH}>{h}</span>)}
        </div>
        {transactions.length > 0 ? (
          transactions.map((t, i) => (
            <div
              key={t?.id || i}
              className="k-table-row"
              style={{
                display: 'grid', gridTemplateColumns: GRID,
                gap: 12, padding: '12px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
              }}
            >
              <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>{dateShort(t?.date)}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', alignSelf: 'center' }}>{t?.description || 'Sem descrição'}</span>
              <span style={{ alignSelf: 'center' }}>
                <Badge variant="danger" size="xs">{t?.category || 'Outros'}</Badge>
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--accent-danger)', alignSelf: 'center' }}>
                -{currency(Math.abs(t?.amount || 0))}
              </span>
            </div>
          ))
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Nenhuma transação de saída encontrada
          </div>
        )}
      </Card>
    </div>
  )
}
