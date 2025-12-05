import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import DashboardHome from '@/pages/dashboard/DashboardHome'
import ProductsPage from '@/pages/products/ProductsPage'
import UsersPage from '@/pages/users/UsersPage'
import ProfilePage from '@/pages/profile/ProfilePage'
import InquiryPage from '@/pages/inquiry/InquiryPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import UnauthorizedPage from '@/pages/auth/UnauthorizedPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { RoleProtectedRoute } from '@/components/RoleProtectedRoute'



function App() {
  return (
    <>
      <Routes>
        {/* Authentication routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Protected Dashboard routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
        </Route>
        
        {/* Protected individual pages */}
        <Route path="/products" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ProductsPage />} />
        </Route>
        
        <Route path="/users" element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['seller']}>
              <DashboardLayout />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }>
          <Route index element={<UsersPage />} />
        </Route>
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ProfilePage />} />
        </Route>

        <Route path="/inquiry" element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['customer']}>
              <DashboardLayout />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }>
          <Route index element={<InquiryPage />} />
        </Route>
      </Routes>

    </>
  )
}

export default App