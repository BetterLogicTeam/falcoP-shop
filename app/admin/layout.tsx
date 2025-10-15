import '../globals.css'
import AdminSidebar from '../../components/AdminSidebar'
import { ProductProvider } from '../../contexts/ProductContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProductProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 ml-64">
            {children}
          </main>
        </div>
      </div>
    </ProductProvider>
  )
}
