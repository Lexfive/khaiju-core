import { useState } from 'react'
import { Search, Plus, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useData, useMutation } from '@/data/DataProvider'
import { useToast } from '@/data/ToastProvider'
import { mutations } from '@/data/adapters'
import { currency, dateShort } from '@/utils/format'
import { Card, Badge, Button, Input, Select, PageHeader, EmptyState, ErrorState } from '@/components/ui'
import { Modal } from '@/components/ui/Modal'
import { SkTable, SkCard, Sk, SkPageHeader } from '@/components/skeleton'

// ── Constants ─────────────────────────────────────────────────────────

const TYPE_OPTIONS = [
  { value: '',        label: 'Todos os tipos' },
  { value: 'receita', label: 'Receitas'       },
  { value: 'despesa', label: 'Despesas'       },
]

const CAT_OPTIONS = [
  { value: '',            label: 'Todas as categorias' },
  { value: 'moradia',     label: 'Moradia'     },
  { value: 'alimentacao', label: 'Alimentação' },
  { value: 'transporte',  label: 'Transporte'  },
  { value: 'saude',       label: 'Saúde'       },
  { value: 'lazer',       label: 'Lazer'       },
  { value: 'educacao',    label: 'Educação'    },
  { value: 'vestuario',   label: 'Vestuário'   },
  { value: 'investimento',label: 'Investimentos'},
  { value: 'salario',     label: 'Salário'     },
  { value: 'freelance',   label: 'Freelance'   },
  { value: 'dividendos',  label: 'Dividendos'  },
]

const TH_STYLE = {
  fontSize: 11, fontWeight: 600,
  color: 'var(--text-muted)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
}

const GRID = '1fr 2fr 140px 130px 100px'

// ── Sub-components ────────────────────────────────────────────────────

function StatPill({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 3,
      padding: '10px 16px',
      background: 'var(--surface-2)',
      border: `1px solid ${color}25`,
      borderRadius: 'var(--radius-sm)',
      minWidth: 120,
    }}>
      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color }}>
        {value}
      </span>
    </div>
  )
}

function NewTransactionForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'despesa',
    category: 'alimentacao',
    date: new Date().toISOString().slice(0, 10),
  })
  const [errors, setErrors] = useState({})
  const toast = useToast()

  const { mutate, isLoading } = useMutation(mutations.createTransaction, {
    onSuccess: () => {
      toast.success('Transação adicionada com sucesso!')
      onSuccess?.()
      onClose()
    },
    onError: (msg) => toast.error(msg),
  })

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    if (errors[k]) setErrors(p => ({ ...p, [k]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.description.trim()) e.description = 'Campo obrigatório'
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Valor inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    mutate({ ...form, amount: Number(form.amount) })
  }

  const label = (text, required) => (
    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
      {text}{required && <span style={{ color: 'var(--accent-danger)', marginLeft: 2 }}>*</span>}
    </label>
  )

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        {label('Descrição', true)}
        <Input
          placeholder="Ex: Supermercado, Salário..."
          value={form.description}
          onChange={e => set('description', e.target.value)}
          error={errors.description}
        />
        {errors.description && (
          <span style={{ fontSize: 11, color: 'var(--accent-danger)', marginTop: 4, display: 'block' }}>
            {errors.description}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          {label('Valor', true)}
          <Input
            type="number"
            placeholder="0,00"
            value={form.amount}
            onChange={e => set('amount', e.target.value)}
            error={errors.amount}
          />
          {errors.amount && (
            <span style={{ fontSize: 11, color: 'var(--accent-danger)', marginTop: 4, display: 'block' }}>
              {errors.amount}
            </span>
          )}
        </div>
        <div>
          {label('Data')}
          <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div>
          {label('Tipo')}
          <Select value={form.type} onChange={v => set('type', v)} options={TYPE_OPTIONS.filter(o => o.value)} />
        </div>
        <div>
          {label('Categoria')}
          <Select value={form.category} onChange={v => set('category', v)} options={CAT_OPTIONS.filter(o => o.value)} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit} loading={isLoading}>Salvar transação</Button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────

export default function Transacoes() {
  const [search,     setSearch]     = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterCat,  setFilterCat]  = useState('')
  const [showModal,  setShowModal]  = useState(false)

  const filters = {
    type:     filterType || undefined,
    category: filterCat  || undefined,
    search:   search     || undefined,
  }

  const { data: all,      isLoading, error } = useData('transactions', {})
  const { data: filtered, refetch }          = useData('transactions', filters)

  const stats = all ? {
    total:    all.length,
    receitas: all.filter(t => t.type === 'receita').reduce((s, t) => s + t.amount, 0),
    despesas: Math.abs(all.filter(t => t.type === 'despesa').reduce((s, t) => s + t.amount, 0)),
  } : null

  const hasFilters = search || filterType || filterCat
  const clearFilters = () => { setSearch(''); setFilterType(''); setFilterCat('') }

  if (isLoading && !all) {
    return (
      <div className="k-page-enter">
        <SkPageHeader />
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          {[0, 1, 2, 3].map(i => (
            <SkCard key={i} style={{ flex: 1, padding: '10px 16px' }}>
              <Sk h={11} w="60%" style={{ marginBottom: 8 }} />
              <Sk h={20} w="80%" />
            </SkCard>
          ))}
        </div>
        <SkCard><SkTable rows={8} /></SkCard>
      </div>
    )
  }

  if (error) {
    return (
      <div className="k-page-enter">
        <PageHeader title="Transações" />
        <Card><ErrorState message={error} onRetry={refetch} /></Card>
      </div>
    )
  }

  return (
    <div className="k-page-enter">
      <PageHeader
        title="Transações"
        subtitle={`${filtered?.length ?? 0} de ${all?.length ?? 0} registros`}
        actions={
          <Button icon={Plus} variant="primary" size="sm" onClick={() => setShowModal(true)}>
            Nova Transação
          </Button>
        }
      />

      {/* Stats pills */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatPill label="Total"    value={stats?.total ?? 0}                                         color="var(--text-secondary)" />
        <StatPill label="Receitas" value={currency(stats?.receitas ?? 0)}                            color="var(--accent-success)" />
        <StatPill label="Despesas" value={currency(stats?.despesas ?? 0)}                            color="var(--accent-danger)"  />
        <StatPill label="Saldo"    value={currency((stats?.receitas ?? 0) - (stats?.despesas ?? 0))} color="var(--accent-light)"   />
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Input
            icon={Search}
            placeholder="Buscar por descrição ou categoria..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: '1 1 240px', minWidth: 200 }}
          />
          <Select value={filterType} onChange={setFilterType} options={TYPE_OPTIONS} style={{ width: 180 }} />
          <Select value={filterCat}  onChange={setFilterCat}  options={CAT_OPTIONS}  style={{ width: 200 }} />
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>Limpar filtros</Button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: GRID,
          gap: 12, padding: '12px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-3)',
        }}>
          {['Data', 'Descrição', 'Categoria', 'Valor', 'Tipo'].map(h => (
            <span key={h} style={TH_STYLE}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {!filtered?.length ? (
          <EmptyState
            icon={Filter}
            title="Nenhuma transação encontrada"
            description={hasFilters ? 'Tente ajustar os filtros.' : 'Adicione sua primeira transação.'}
            action={hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters}>Limpar filtros</Button>}
          />
        ) : (
          filtered.map((t, i) => {
            const isReceita = t.type === 'receita'
            const bg = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'
            return (
              <div
                key={t.id}
                className="k-table-row"
                style={{
                  display: 'grid', gridTemplateColumns: GRID,
                  gap: 12, padding: '13px 20px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: bg,
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>
                  {dateShort(t.date)}
                </span>
                <span style={{
                  fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
                  alignSelf: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {t.description}
                </span>
                <span style={{ alignSelf: 'center' }}>
                  <Badge variant="default" size="xs">{t.category}</Badge>
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
                  color: isReceita ? 'var(--accent-success)' : 'var(--accent-danger)',
                  alignSelf: 'center',
                }}>
                  {isReceita ? '+' : ''}{currency(t.amount)}
                </span>
                <span style={{ alignSelf: 'center' }}>
                  <Badge variant={isReceita ? 'success' : 'danger'} size="xs">
                    {isReceita ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {isReceita ? 'Receita' : 'Despesa'}
                  </Badge>
                </span>
              </div>
            )
          })
        )}
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nova Transação">
        <NewTransactionForm onClose={() => setShowModal(false)} onSuccess={refetch} />
      </Modal>
    </div>
  )
}
