import { BarChart3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { useMemo } from 'react'
import { useData } from '@/data/DataProvider'
import { currency, currencyCompact, percent } from '@/utils/format'
import { Card, KpiCard, Badge, PageHeader, SectionCard, ErrorState } from '@/components/ui'
import { SkKpiRow, SkPageHeader, SkChart, SkCard } from '@/components/skeleton'
import { AreaChartWidget, BarChartWidget } from '@/components/charts'

const TH = { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }

export default function Relatorios() {
  const { data: rawSeries, isLoading, error, refetch } = useData('monthlySeries')
  const { data: rawReport } = useData('monthlyReport')

  const series = Array.isArray(rawSeries) ? rawSeries : []
  const report = Array.isArray(rawReport) ? rawReport : []

  const { lastRec, lastDesp, lastSaldo, deltaRec, deltaDesp, deltaSaldo } = useMemo(() => {
    const lastM = series[series.length - 1] || {}
    const prevM = series[series.length - 2] || {}

    const lRec = lastM.receitas || 0
    const lDesp = lastM.despesas || 0
    const lSaldo = lastM.saldo || 0
    const pRec = prevM.receitas || 1
    const pDesp = prevM.despesas || 1
    const pSaldo = prevM.saldo || 1

    const dRec = ((lRec - pRec) / pRec) * 100
    const dDesp = ((lDesp - pDesp) / pDesp) * 100
    const dSaldo = ((lSaldo - pSaldo) / pSaldo) * 100

    return {
      lastRec: lRec,
      lastDesp: lDesp,
      lastSaldo: lSaldo,
      deltaRec: isFinite(dRec) ? dRec : 0,
      deltaDesp: isFinite(dDesp) ? dDesp : 0,
      deltaSaldo: isFinite(dSaldo) ? dSaldo : 0,
    }
  }, [series])

  if (isLoading) {
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

  return (
    <div className="k-page-enter">
      <PageHeader title="Relatórios" subtitle="Visão consolidada · Últimos 6 meses" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KpiCard label="Receitas"  value={currency(lastRec)}  delta={deltaRec}  icon={TrendingUp}  color="var(--accent-success)" sub="último mês" />
        <KpiCard label="Despesas"  value={currency(lastDesp)} delta={deltaDesp} icon={TrendingDown} color="var(--accent-danger)"  sub="último mês" />
        <KpiCard label="Saldo"     value={currency(lastSaldo)} delta={deltaSaldo} icon={DollarSign}  color="var(--accent-light)"   sub="último mês" />
        <KpiCard label="Margem"    value={percent((lastRec > 0 ? (lastSaldo / lastRec) : 0) * 100)} icon={BarChart3} color="var(--accent-info)" sub="receita líquida" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <SectionCard title="Evolução Mensal" subtitle="Receitas x Despesas">
          <BarChartWidget
            data={series}
            keys={[
              { key: 'receitas', label: 'Receitas', color: '#4CCFA8' },
              { key: 'despesas', label: 'Despesas', color: '#E85C7A' },
            ]}
            height={280}
            formatter={currencyCompact}
          />
        </SectionCard>

        <SectionCard title="Saldo Mensal" subtitle="Lucro / Prejuízo">
          <AreaChartWidget
            data={series}
            keys={[{ key: 'saldo', label: 'Saldo', color: '#7D4EBF' }]}
            height={280}
            formatter={currencyCompact}
          />
        </SectionCard>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '140px 1fr 1fr 1fr 120px',
          gap: 12,
          padding: '12px 20px',
          background: 'var(--surface-3)',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          {['Mês', 'Receitas', 'Despesas', 'Saldo', 'Margem'].map(h => <span key={h} style={TH}>{h}</span>)}
        </div>
        {report.length > 0 ? (
          report.map((m, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr 1fr 1fr 120px',
                gap: 12,
                padding: '12px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', alignSelf: 'center' }}>
                {m?.month || '-'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--accent-success)', alignSelf: 'center' }}>
                +{currency(m?.receitas || 0)}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--accent-danger)', alignSelf: 'center' }}>
                -{currency(m?.despesas || 0)}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: (m?.saldo || 0) >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)', alignSelf: 'center' }}>
                {(m?.saldo || 0) >= 0 ? '+' : ''}{currency(m?.saldo || 0)}
              </span>
              <span style={{ alignSelf: 'center' }}>
                <Badge variant={parseFloat(m?.margem || 0) >= 0 ? 'success' : 'danger'} size="xs">
                  {m?.margem || 0}%
                </Badge>
              </span>
            </div>
          ))
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Nenhum dado disponível
          </div>
        )}
      </Card>
    </div>
  )
}
