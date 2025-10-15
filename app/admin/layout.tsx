'use client'

import '../globals.css'
import AdminSidebar from '../../components/AdminSidebar'
import { ProductProvider } from '../../contexts/ProductContext'
import { AuthProvider } from '../../contexts/AuthContext'
import ProtectedRoute from '../../components/ProtectedRoute'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Don't apply admin layout to login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <AuthProvider>
      <ProductProvider>
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-100">
            <AdminSidebar />
            <main className="lg:ml-64 p-4 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </ProtectedRoute>
      </ProductProvider>
    </AuthProvider>
  )
}
