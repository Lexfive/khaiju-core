import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import Dashboard from '@/pages/Dashboard'
import Transacoes from '@/pages/Transacoes'
import Receitas from '@/pages/Receitas'
import Despesas from '@/pages/Despesas'
import Relatorios from '@/pages/Relatorios'
import Configuracoes from '@/pages/Configuracoes'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/"               element={<Dashboard />}    />
          <Route path="/transacoes"     element={<Transacoes />}   />
          <Route path="/receitas"       element={<Receitas />}     />
          <Route path="/despesas"       element={<Despesas />}     />
          <Route path="/relatorios"     element={<Relatorios />}   />
          <Route path="/configuracoes"  element={<Configuracoes />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
