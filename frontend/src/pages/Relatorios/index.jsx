import { BarChart3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { useData } from '@/data/DataProvider'
import { currency, currencyCompact, percent } from '@/utils/format'
import { safeNumber, safeArray } from '@/utils/safeData'
import { Card, KpiCard, Badge, PageHeader, SectionCard, ErrorState } from '@/components/ui'
import { SkKpiRow, SkPageHeader, SkChart, SkCard, SkTable, Sk } from '@/components/skeleton'
import { AreaChartWidget, BarChartWidget, PieChartWidget } from '@/components/charts'

const TH = { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }

export default function Relatorios() {
  const { data: series,     isLoading, error, refetch } = useData('monthlySeries')
  const { data: categories }  = useData('categories')
  const { data: report }      = useData('monthlyReport')
  const { data: kpis }        = useData('kpis')

  if (isLoading && !series) {
    return (
      <div className="k-page-enter">
        <SkPageHeader />
        <SkKpiRow count={4} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <SkCard><SkChart /></SkCard>
          <SkCard><SkChart /></SkCard>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="k-page-enter">
        <PageHeader title="Relatórios" />
        <Card><ErrorState message={error} onRetry={refetch} /></Card>
      </div>
    )
  }

  // ✅ Proteger acessos a dados de séries
  const safeSeries = safeArray(series)
  const lastM = safeSeries[safeSeries.length - 1] || {}
  const prevM = safeSeries[safeSeries.length - 2] || {}
  
  const lastRec = safeNumber(lastM.receitas, 0)
  const lastDesp = safeNumber(lastM.despesas, 0)
  const lastSaldo = safeNumber(lastM.saldo, 0)
  const prevRec = safeNumber(prevM.receitas, 1) // Evitar divisão por zero
  const prevDesp = safeNumber(prevM.despesas, 1)
  const prevSaldo = safeNumber(prevM.saldo, 1)
  
  const dR = prevRec > 0 ? ((lastRec - prevRec) / prevRec) * 100 : 0
  const dD = prevDesp > 0 ? ((lastDesp - prevDesp) / prevDesp) * 100 : 0
  const dS = prevSaldo !== 0 ? ((lastSaldo - prevSaldo) / Math.abs(prevSaldo)) * 100 : 0

  return (
    <div className="k-page-enter">
      <PageHeader title="Relatórios" subtitle="Consolidado financeiro · últimos 6 meses" />

      <div className="k-grid-4" style={{ marginBottom: 24 }}>
        <KpiCard label="Receitas (Out)"  value={currency(lastRec)} delta={dR} icon={TrendingUp}   color="var(--accent-success)" />
        <KpiCard label="Despesas (Out)"  value={currency(lastDesp)} delta={dD} icon={TrendingDown}  color="var(--accent-danger)"  />
        <KpiCard label="Saldo (Out)"     value={currency(lastSaldo)}    delta={dS} icon={DollarSign}   color="var(--accent-light)"   />
        <KpiCard label="Taxa Poupança"   value={percent(safeNumber(kpis?.savingsRate, 0))}            icon={BarChart3}    color="var(--accent-info)"    sub="receita total" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <SectionCard title="Fluxo Financeiro" subtitle="Receitas, despesas e saldo acumulado">
          <AreaChartWidget
            data={series}
            keys={[
              { key: 'receitas', label: 'Receitas', color: '#4CCFA8' },
              { key: 'despesas', label: 'Despesas', color: '#E85C7A' },
              { key: 'saldo',    label: 'Saldo',    color: '#A07EE8' },
            ]}
            height={220}
            formatter={currencyCompact}
          />
        </SectionCard>

        <SectionCard title="Comparativo Mensal" subtitle="Receitas vs Despesas por mês">
          <BarChartWidget
            data={series}
            keys={[
              { key: 'receitas', label: 'Receitas', color: '#4CCFA8' },
              { key: 'despesas', label: 'Despesas', color: '#7D4EBF' },
            ]}
            height={220}
            formatter={currencyCompact}
          />
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        <SectionCard title="Despesas por Categoria" subtitle="Distribuição acumulada">
          <PieChartWidget data={categories || []} height={260} formatter={currencyCompact} />
        </SectionCard>

        {/* Monthly table */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Tabela Mensal</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Detalhamento por mês</p>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '72px 1fr 1fr 1fr 76px',
            gap: 12, padding: '10px 20px',
            background: 'var(--surface-3)',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            {['Mês', 'Receitas', 'Despesas', 'Saldo', 'Margem'].map(h => (
              <span key={h} style={TH}>{h}</span>
            ))}
          </div>
          {safeArray(report).map((row, i) => {
            const isLast   = i === report.length - 1
            const saldoPos = safeNumber(row?.saldo, 0) >= 0
            const bgBase   = isLast ? 'rgba(82,20,217,0.07)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'
            return (
              <div
                key={row.month}
                className="k-table-row"
                style={{
                  display: 'grid', gridTemplateColumns: '72px 1fr 1fr 1fr 76px',
                  gap: 12, padding: '13px 20px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: bgBase,
                }}
              >
                <span style={{
                  fontSize: 13, fontWeight: isLast ? 700 : 500,
                  color: isLast ? 'var(--accent-light)' : 'var(--text-primary)',
                  alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {row.month}
                  {isLast && <Badge variant="purple" size="xs">Atual</Badge>}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-success)', alignSelf: 'center' }}>
                  {currency(safeNumber(row?.receitas, 0))}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-danger)', alignSelf: 'center' }}>
                  {currency(safeNumber(row?.despesas, 0))}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                  color: saldoPos ? 'var(--text-primary)' : 'var(--accent-danger)',
                  alignSelf: 'center',
                }}>
                  {currency(safeNumber(row?.saldo, 0))}
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 600, alignSelf: 'center',
                  color: parseFloat(row?.margem || 0) >= 20 ? 'var(--accent-success)' : 'var(--accent-warning)',
                }}>
                  {row.margem}%
                </span>
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}
