import '../globals.css'
import Navigation from '../../components/Navigation'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-falco-primary">
      <Navigation />
      {children}
    </div>
  )
}


