import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './ui/Layout'
import { HomePage } from './pages/HomePage'
import { SimPage } from './pages/SimPage'
import { ModelPage } from './pages/ModelPage'
import { BomPage } from './pages/BomPage'
import { DocsPage } from './pages/DocsPage'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="sim" element={<SimPage />} />
          <Route path="model" element={<ModelPage />} />
          <Route path="bom" element={<BomPage />} />
          <Route path="specs" element={<Navigate to="/bom" replace />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
