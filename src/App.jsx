import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/useAuth'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import PackagesPage from './pages/PackagesPage'
import NewPackagePage from './pages/NewPackagePage'
import PackageDetailPage from './pages/PackageDetailPage'
import UsersPage from './pages/UsersPage'
import CategoriesPage from './pages/CategoriesPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="packages/new" element={<NewPackagePage />} />
            <Route path="packages/:id" element={<PackageDetailPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="categories" element={<CategoriesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
