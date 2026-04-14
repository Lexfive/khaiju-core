import { useState } from 'react'
import { User, Palette, Bell, Shield, CreditCard, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/data/ToastProvider'
import { Card, Button, Input, Badge, PageHeader } from '@/components/ui'

const TABS = [
  { id: 'perfil',       label: 'Perfil',        icon: User        },
  { id: 'temas',        label: 'Temas',         icon: Palette     },
  { id: 'notificacoes', label: 'Notificações',  icon: Bell        },
  { id: 'seguranca',    label: 'Segurança',     icon: Shield      },
  { id: 'plano',        label: 'Plano',         icon: CreditCard  },
  { id: 'danger',       label: 'Danger Zone',   icon: AlertTriangle },
]

function SectionTitle({ children }) {
  return (
    <h3 style={{
      fontFamily: 'var(--font-display)',
      fontSize: 14, fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: 16,
      paddingBottom: 10,
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {children}
    </h3>
  )
}

function FieldRow({ label, description, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: 24, padding: '14px 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        {description && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{description}</div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

function Toggle({ value, onChange, disabled = false }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      style={{
        width: 44, height: 24, borderRadius: 12, cursor: disabled ? 'not-allowed' : 'pointer',
        background: value ? 'var(--accent-vivid)' : 'var(--surface-4)',
        border: `1px solid ${value ? 'var(--accent-vivid)' : 'var(--border-default)'}`,
        position: 'relative',
        transition: 'all var(--duration-normal)',
        boxShadow: value ? 'var(--glow-sm)' : 'none',
        opacity: disabled ? 0.5 : 1,
        padding: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 2,
        left: value ? 22 : 2,
        transition: 'left var(--duration-normal) var(--ease-spring)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }} />
    </button>
  )
}

function ThemeCard({ label, preview, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer',
        border: `2px solid ${active ? 'var(--accent-vivid)' : 'var(--border-subtle)'}`,
        transition: 'border-color var(--duration-normal), box-shadow var(--duration-normal)',
        boxShadow: active ? 'var(--glow-sm)' : 'none',
        background: 'none', padding: 0, textAlign: 'left', width: '100%',
      }}
    >
      <div style={{ height: 72, background: preview, position: 'relative' }}>
        {active && (
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <CheckCircle size={16} color="var(--accent-vivid)" />
          </div>
        )}
      </div>
      <div style={{
        padding: '7px 12px',
        background: 'var(--surface-3)',
        fontSize: 12, fontWeight: 500,
        color: active ? 'var(--accent-light)' : 'var(--text-secondary)',
      }}>
        {label}
      </div>
    </button>
  )
}

const Field = ({ label, required, children }) => (
  <div>
    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
      {label}{required && <span style={{ color: 'var(--accent-danger)', marginLeft: 2 }}>*</span>}
    </label>
    {children}
  </div>
)

export default function Configuracoes() {
  const [tab,     setTab]     = useState('perfil')
  const [showPw,  setShowPw]  = useState(false)
  const [theme,   setTheme]   = useState('dark-purple')
  const [notifs,  setNotifs]  = useState({ email: true, push: true, resumo: true, alertas: false, metas: true })
  const [profile, setProfile] = useState({ name: 'Alexandre Melo', email: 'alexandre@khaiju.app', phone: '+55 31 9 8765-4321' })
  const toast = useToast()

  const save = (section) => toast.success(`${section} atualizado com sucesso!`)
  const soon = () => toast.info('Em breve disponível')

  const setP = (k, v) => setProfile(p => ({ ...p, [k]: v }))
  const setN = (k, v) => setNotifs(p => ({ ...p, [k]: v }))

  return (
    <div className="k-page-enter">
      <PageHeader title="Configurações" subtitle="Personalize sua experiência no Khaiju" />

      <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', gap: 24 }}>
        {/* Sidebar tabs */}
        <nav aria-label="Seções de configurações">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TABS.map(t => {
              const Icon    = t.icon
              const active  = tab === t.id
              const isDanger = t.id === 'danger'
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`k-btn k-btn--ghost k-btn--sm`}
                  style={{
                    justifyContent: 'flex-start', width: '100%',
                    background: active ? (isDanger ? 'rgba(232,92,122,0.1)' : 'rgba(125,78,191,0.15)') : 'transparent',
                    border: `1px solid ${active ? (isDanger ? 'rgba(232,92,122,0.25)' : 'var(--border-emphasis)') : 'transparent'}`,
                    color: isDanger ? 'var(--accent-danger)' : active ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: active ? 600 : 400,
                    padding: '9px 12px',
                  }}
                >
                  <Icon size={15} />
                  {t.label}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Content panels */}
        <Card>
          {/* ── Perfil ── */}
          {tab === 'perfil' && (
            <div>
              <SectionTitle>Informações Pessoais</SectionTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-vivid))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 700, color: '#fff',
                  boxShadow: 'var(--glow-md)',
                }}>{profile.name[0]}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{profile.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{profile.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                <Field label="Nome completo">
                  <Input value={profile.name} onChange={e => setP('name', e.target.value)} />
                </Field>
                <Field label="E-mail">
                  <Input type="email" value={profile.email} onChange={e => setP('email', e.target.value)} />
                </Field>
                <Field label="Telefone">
                  <Input value={profile.phone} onChange={e => setP('phone', e.target.value)} />
                </Field>
              </div>
              <Button variant="primary" onClick={() => save('Perfil')}>Salvar alterações</Button>
            </div>
          )}

          {/* ── Temas ── */}
          {tab === 'temas' && (
            <div>
              <SectionTitle>Aparência</SectionTitle>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                Escolha o tema visual do Khaiju
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
                <ThemeCard label="Dark Purple" preview="linear-gradient(135deg,#1a0a3d,#0D0D0D)" active={theme==='dark-purple'}  onClick={() => { setTheme('dark-purple'); toast.success('Tema aplicado!') }} />
                <ThemeCard label="Dark Navy"   preview="linear-gradient(135deg,#0a1628,#080d18)" active={theme==='dark-navy'}    onClick={soon} />
                <ThemeCard label="Dark Slate"  preview="linear-gradient(135deg,#141820,#0a0c10)" active={theme==='dark-slate'}   onClick={soon} />
              </div>
              <SectionTitle>Densidade</SectionTitle>
              <FieldRow label="Layout compacto" description="Reduz o espaçamento entre elementos">
                <Toggle value={false} onChange={soon} />
              </FieldRow>
            </div>
          )}

          {/* ── Notificações ── */}
          {tab === 'notificacoes' && (
            <div>
              <SectionTitle>Preferências de Notificação</SectionTitle>
              <FieldRow label="Notificações por e-mail"  description="Resumos e alertas no e-mail">
                <Toggle value={notifs.email}   onChange={v => { setN('email',  v); toast.success(v ? 'E-mail ativado' : 'E-mail desativado') }} />
              </FieldRow>
              <FieldRow label="Notificações push"        description="Alertas em tempo real no navegador">
                <Toggle value={notifs.push}    onChange={v => { setN('push',   v); toast.success(v ? 'Push ativado' : 'Push desativado') }} />
              </FieldRow>
              <FieldRow label="Resumo semanal"           description="Relatório automático toda segunda-feira">
                <Toggle value={notifs.resumo}  onChange={v => setN('resumo',  v)} />
              </FieldRow>
              <FieldRow label="Alertas de orçamento"     description="Aviso ao ultrapassar limite de categoria">
                <Toggle value={notifs.alertas} onChange={v => setN('alertas', v)} />
              </FieldRow>
              <FieldRow label="Progresso de metas"       description="Notificações em marcos importantes">
                <Toggle value={notifs.metas}   onChange={v => setN('metas',   v)} />
              </FieldRow>
            </div>
          )}

          {/* ── Segurança ── */}
          {tab === 'seguranca' && (
            <div>
              <SectionTitle>Segurança da Conta</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                <Field label="Senha atual">
                  <div style={{ position: 'relative' }}>
                    <Input type={showPw ? 'text' : 'password'} placeholder="••••••••" />
                    <button
                      onClick={() => setShowPw(!showPw)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', background: 'none', border: 'none', cursor: 'pointer' }}
                      aria-label={showPw ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </Field>
                <Field label="Nova senha">
                  <Input type="password" placeholder="••••••••" />
                </Field>
                <Field label="Confirmar nova senha">
                  <Input type="password" placeholder="••••••••" />
                </Field>
              </div>
              <Button variant="primary" onClick={() => save('Senha')}>Alterar senha</Button>

              <div style={{ marginTop: 32 }}>
                <SectionTitle>Autenticação em Dois Fatores</SectionTitle>
                <FieldRow label="2FA via Authenticator" description="TOTP — Google Authenticator, Authy">
                  <Toggle value={false} onChange={() => toast.info('Configure o 2FA no app mobile')} />
                </FieldRow>
              </div>
            </div>
          )}

          {/* ── Plano ── */}
          {tab === 'plano' && (
            <div>
              <SectionTitle>Plano Atual</SectionTitle>
              <div style={{
                padding: 20, borderRadius: 'var(--radius-md)', marginBottom: 24,
                background: 'linear-gradient(135deg, rgba(82,20,217,0.15), rgba(125,78,191,0.08))',
                border: '1px solid var(--border-emphasis)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800 }}>Gratuito</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Sem limite de uso</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent-light)' }}>R$ 0</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>/mês</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
                  {['Transações ilimitadas', 'Relatórios completos', 'Sem anúncios', 'Exportação de dados'].map(f => (
                    <Badge key={f} variant="purple" size="xs"><CheckCircle size={10} />{f}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Danger Zone ── */}
          {tab === 'danger' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <AlertTriangle size={18} color="var(--accent-danger)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--accent-danger)' }}>
                  Zona de Perigo
                </h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
                Ações irreversíveis. Proceda com extrema cautela.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Exportar todos os dados',          desc: 'Baixe um arquivo JSON com todos os seus dados.',                          btn: 'Exportar',           variant: 'secondary', action: () => toast.info('Exportação em desenvolvimento') },
                  { label: 'Apagar histórico de transações',   desc: 'Remove todas as transações. Não pode ser desfeito.',                       btn: 'Apagar histórico',   variant: 'danger', action: () => { if(confirm('Tem certeza? Esta ação não pode ser desfeita.')) toast.success('Histórico apagado') }    },
                  { label: 'Desativar conta',                  desc: 'Sua conta ficará inativa mas os dados serão mantidos por 30 dias.',        btn: 'Desativar',          variant: 'danger', action: () => { if(confirm('Tem certeza? Você terá 30 dias para reativar.')) toast.warning('Conta desativada') }    },
                  { label: 'Excluir conta permanentemente',    desc: 'Todos os dados são apagados. Essa ação não pode ser recuperada.',          btn: 'Excluir conta',      variant: 'danger', action: () => { if(confirm('ATENÇÃO: Isso apagará TUDO permanentemente. Confirmar?')) toast.error('Conta excluída') }    },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                    padding: 16, borderRadius: 'var(--radius-md)',
                    border: `1px solid ${item.variant === 'danger' ? 'rgba(232,92,122,0.2)' : 'var(--border-subtle)'}`,
                    background: item.variant === 'danger' ? 'rgba(232,92,122,0.04)' : 'transparent',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: item.variant === 'danger' ? 'var(--accent-danger)' : 'var(--text-primary)' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                    </div>
                    <Button variant={item.variant} size="sm" onClick={item.action}>{item.btn}</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
