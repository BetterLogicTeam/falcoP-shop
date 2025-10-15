import '../../globals.css'
import { AuthProvider } from '../../../contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </AuthProvider>
  )
}
