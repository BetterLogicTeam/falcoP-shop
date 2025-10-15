import '../globals.css'
import AdminSidebar from '../../components/AdminSidebar'
import { ProductProvider } from '../../contexts/ProductContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProductProvider>
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="lg:ml-64 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ProductProvider>
  )
}
