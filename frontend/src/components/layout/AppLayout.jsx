import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  const { pathname } = useLocation()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-base)' }}>
      <Sidebar />
      <main
        key={pathname}          /* remounts on route change → triggers kFadeIn */
        className="k-page-enter"
        style={{
          flex: 1,
          marginLeft: 'var(--sidebar-width)',
          minHeight: '100vh',
          padding: '32px 36px 48px',
          maxWidth: 'calc(100vw - var(--sidebar-width))',
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}
