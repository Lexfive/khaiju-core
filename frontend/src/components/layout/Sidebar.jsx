import { NavLink } from 'react-router-dom'
import { useAuth } from '@/data/AuthProvider'
import {
  LayoutDashboard, ArrowLeftRight, TrendingUp, TrendingDown,
  BarChart3, Settings, LogOut, Zap
} from 'lucide-react'

const NAV = [
  { to: '/',             label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/transacoes',   label: 'Transações',   icon: ArrowLeftRight  },
  { to: '/receitas',     label: 'Receitas',     icon: TrendingUp      },
  { to: '/despesas',     label: 'Despesas',     icon: TrendingDown    },
  { to: '/relatorios',   label: 'Relatórios',   icon: BarChart3       },
  { to: '/configuracoes',label: 'Configurações', icon: Settings       },
]

export function Sidebar() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    if (confirm('Deseja realmente sair?')) {
      logout()
    }
  }

  return (
    <>
      <style>{`
        .k-sidebar {
          width: var(--sidebar-width);
          min-height: 100vh;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--sidebar-border);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0; top: 0; bottom: 0;
          z-index: var(--z-raised);
        }
        .k-nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 400;
          color: var(--text-muted);
          background: transparent;
          border: 1px solid transparent;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition:
            background var(--duration-normal) var(--ease-smooth),
            color     var(--duration-normal) var(--ease-smooth),
            border-color var(--duration-normal) var(--ease-smooth);
        }
        .k-nav-link:hover {
          background: var(--alpha-8);
          color: var(--text-secondary);
        }
        .k-nav-link.active {
          background: rgba(125, 78, 191, 0.15);
          border-color: rgba(125, 78, 191, 0.25);
          color: var(--text-primary);
          font-weight: 600;
        }
        .k-nav-link.active .k-nav-icon {
          color: var(--accent-light);
        }
        .k-nav-link:not(.active) .k-nav-indicator { display: none; }
        .k-nav-label { flex: 1; }
        .k-user-badge {
          width: 32px; 
          height: 32px; 
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-purple), var(--accent-vivid));
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-size: 13px; 
          font-weight: 700; 
          color: #fff; 
          flex-shrink: 0;
        }
      `}</style>

      <aside className="k-sidebar">
        {/* ── Logo ── */}
        <div style={{
          padding: '22px 20px 18px',
          borderBottom: '1px solid rgba(125,78,191,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-vivid))',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--glow-sm)',
              flexShrink: 0,
            }}>
              <Zap size={17} color="#fff" />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18, fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}>
                Khaiju
              </div>
              <div style={{
                fontSize: 10,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: 2,
              }}>
                Finance OS
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}
          aria-label="Navegação principal">
          <div style={{
            fontSize: 10, fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '4px 8px',
            marginBottom: 4,
          }}>
            Menu
          </div>

          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `k-nav-link${isActive ? ' active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="k-nav-indicator" aria-hidden="true" />}
                  <Icon
                    size={16}
                    className="k-nav-icon"
                    aria-hidden="true"
                    style={{ flexShrink: 0 }}
                  />
                  <span className="k-nav-label">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── User card ── */}
        <div style={{
          padding: '14px 12px',
          borderTop: '1px solid rgba(125,78,191,0.1)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div className="k-user-badge">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{
                fontSize: 12, fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user?.name || 'Usuário'}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                {user?.email || ''}
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-danger)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              title="Sair"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
