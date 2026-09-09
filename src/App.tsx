import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { KitProvider } from './kit/KitContext'
import { Layout } from './ui/Layout'
import { SimPage } from './pages/SimPage'
import { ModelPage } from './pages/ModelPage'
import { BomPage } from './pages/BomPage'

export default function App() {
  return (
    <KitProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/model" replace />} />
            <Route path="model" element={<ModelPage />} />
            <Route path="sim" element={<SimPage />} />
            <Route path="bom" element={<BomPage />} />
            <Route path="specs" element={<Navigate to="/bom" replace />} />
            <Route path="*" element={<Navigate to="/model" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </KitProvider>
  )
}
