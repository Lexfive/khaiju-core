import { RefreshCw, TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react'
import { useData } from '@/data/DataProvider'
import { useToast } from '@/data/ToastProvider'
import { currency, currencyCompact, percent, dateShort } from '@/utils/format'
import { Card, KpiCard, Badge, Button, PageHeader, SectionCard, ErrorState } from '@/components/ui'
import { Sk, SkCard, SkKpiRow, SkPageHeader, SkChart } from '@/components/skeleton'
import { AreaChartWidget } from '@/components/charts'

// ── Sub-components ────────────────────────────────────────────────────

function GoalBar({ goal }) {
  const pct = Math.min((goal.current / goal.target) * 100, 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
          {goal.label}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
          {currencyCompact(goal.current)} / {currencyCompact(goal.target)}
        </span>
      </div>
      <div className="k-progress-track">
        <div
          className="k-progress-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${goal.color}, ${goal.color}99)`,
            boxShadow: `0 0 8px ${goal.color}40`,
          }}
        />
      </div>
      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{pct.toFixed(0)}% concluído</span>
    </div>
  )
}

function TxRow({ t }) {
  const isReceita = t.type === 'receita'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: isReceita ? 'rgba(76,207,168,0.1)' : 'rgba(232,92,122,0.1)',
        border: `1px solid ${isReceita ? 'rgba(76,207,168,0.2)' : 'rgba(232,92,122,0.2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15,
      }}>
        {isReceita ? '↑' : '↓'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {t.description}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
          {dateShort(t.date)}
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, flexShrink: 0,
        color: isReceita ? 'var(--accent-success)' : 'var(--accent-danger)',
      }}>
        {isReceita ? '+' : ''}{currency(t.amount)}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { data: kpis, isLoading, error: kpiError, refetch } = useData('kpis')
  const { data: series }     = useData('monthlySeries')
  const { data: goals }      = useData('goals')
  const { data: budget }     = useData('budget')
  const { data: categories } = useData('categories')
  const { data: recent }     = useData('recentTransactions')
  const toast = useToast()

  const handleRefetch = () => {
    refetch()
    toast.success('Dados atualizados!')
  }

  // ── Loading ──────────────────────────────────────────────────────────
  if (isLoading && !kpis) {
    return (
      <div className="k-page-enter">
        <SkPageHeader />
        <SkKpiRow count={4} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          <SkCard><SkChart h={220} /></SkCard>
          <SkCard><Sk h={14} w="60%" style={{ marginBottom: 16 }} /><SkChart h={180} /></SkCard>
        </div>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────
  if (kpiError) {
    return (
      <div className="k-page-enter">
        <PageHeader title="Dashboard" />
        <Card>
          <ErrorState message={kpiError} onRetry={refetch} />
        </Card>
      </div>
    )
  }

  const savingsColor =
    kpis?.savingsRate >= 20 ? 'var(--accent-success)'
    : kpis?.savingsRate >= 10 ? 'var(--accent-warning)'
    : 'var(--accent-danger)'

  return (
    <div className="k-page-enter">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral · Outubro 2024"
        actions={
          <Button icon={RefreshCw} variant="secondary" size="sm" onClick={handleRefetch}>
            Atualizar
          </Button>
        }
      />

      {/* KPIs */}
      <div className="k-grid-4" style={{ marginBottom: 24 }}>
        <KpiCard label="Saldo Total"      value={currency(kpis.saldo)}        delta={8.2}   icon={Wallet}     color="var(--accent-light)"   sub="vs. mês anterior" />
        <KpiCard label="Receitas"         value={currency(kpis.receitas)}      delta={12.4}  icon={TrendingUp} color="var(--accent-success)" sub="este mês" />
        <KpiCard label="Despesas"         value={currency(kpis.despesas)}      delta={-3.1}  icon={TrendingDown} color="var(--accent-danger)"  sub="este mês" />
        <KpiCard label="Taxa de Poupança" value={percent(kpis.savingsRate)}                  icon={PiggyBank}  color={savingsColor}           sub="da receita total" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
        <SectionCard
          title="Fluxo Financeiro"
          subtitle="Receitas vs Despesas — últimos 6 meses"
          action={
            <div style={{ display: 'flex', gap: 6 }}>
              <Badge variant="success">Receitas</Badge>
              <Badge variant="danger">Despesas</Badge>
            </div>
          }
        >
          <AreaChartWidget
            data={series}
            keys={[
              { key: 'receitas', label: 'Receitas', color: '#4CCFA8' },
              { key: 'despesas', label: 'Despesas', color: '#E85C7A' },
            ]}
            height={220}
            formatter={currencyCompact}
          />
        </SectionCard>

        <SectionCard title="Orçamento" subtitle="Uso por categoria">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {budget?.map(b => {
              const pct = (b.spent / b.budget) * 100
              const over = pct > 100
              return (
                <div key={b.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{b.category}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11,
                      color: over ? 'var(--accent-danger)' : 'var(--text-muted)',
                    }}>
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="k-progress-track" style={{ height: 4 }}>
                    <div
                      className="k-progress-fill"
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                        background: over
                          ? 'var(--accent-danger)'
                          : 'linear-gradient(90deg, var(--accent-purple), var(--accent-vivid))',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px 280px', gap: 20 }}>
        <SectionCard
          title="Transações Recentes"
          subtitle="Últimas movimentações"
          action={<Badge variant="purple">{recent?.length} itens</Badge>}
        >
          {recent?.map(t => <TxRow key={t.id} t={t} />)}
        </SectionCard>

        <SectionCard title="Metas" subtitle="Progresso atual">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {goals?.map(g => <GoalBar key={g.id} goal={g} />)}
          </div>
        </SectionCard>

        <SectionCard title="Categorias" subtitle="Top gastos">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {categories?.slice(0, 6).map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{c.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                  {currencyCompact(c.value)}
                </span>
                <span style={{ fontSize: 10, color: c.color, fontWeight: 600, minWidth: 32, textAlign: 'right' }}>
                  {c.percent.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
