import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { HiOutlineCheckCircle } from 'react-icons/hi2'
import Verify from './components/Verify'
import Catalog from './components/Catalog'
import Checkout from './components/Checkout'
import AdminDashboard from './components/AdminDashboard'
import AdminLogin from './components/AdminLogin'
import Tracking from './components/Tracking'
import ConfirmationResult from './components/ConfirmationResult'

const MainLayout = ({ children, hideNavFooter, onReset, onNavigate }) => (
  <div className="min-h-screen bg-brand-light text-brand-dark selection:bg-brand-blue/10 overflow-x-hidden w-full font-sans">
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-blue/5 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-orange/5 blur-[120px]" />
    </div>

    {!hideNavFooter && (
      <nav className="relative z-50 px-8 py-4 md:px-12">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center bg-white/50 backdrop-blur-xl border border-white/50 px-6 md:px-10 py-3 rounded-[32px] shadow-soft">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={onReset}>
            <div className="relative">
              <img src="/tiger.svg" alt="Tiger Analytics" className="h-8 md:h-10 transition-all duration-500 group-hover:scale-105" />
              <div className="absolute -inset-2 bg-brand-orange/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:block h-6 w-[1px] bg-slate-200 mx-2" />
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-3 mr-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by</span>
              <img src="/printone-logo.png" alt="Printone" className="h-10 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </nav>
    )}

    <main className={`relative z-10 ${hideNavFooter ? '' : 'mx-auto max-w-[1400px] px-6 md:px-0 py-6 pb-20 w-full min-h-[calc(100vh-200px)]'}`}>
      {children}
    </main>

    {!hideNavFooter && (
      <footer className="relative z-10 border-t border-slate-100 bg-white/40 backdrop-blur-xl py-12 px-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          <div className="md:col-span-4 max-w-xs">
            <img src="/tiger.svg" alt="Printone" className="h-16 mb-8" />
            <p className="text-xs text-slate-500 leading-loose font-medium">
              We are defining the next generation of corporate onboarding. Empowering employees with selection, and companies with control.
            </p>
          </div>
          <div className="md:col-span-8 flex flex-wrap md:justify-end gap-16 md:gap-20">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Contact Us</h4>
              <div className="space-y-3">
                 <p className="text-sm text-brand-dark font-bold">+91 8939914747</p>
                 <p className="text-sm text-brand-dark font-bold hover:text-brand-blue transition-colors cursor-pointer underline decoration-brand-blue/20 underline-offset-8">info@printone.co.in</p>
              </div>
            </div>
            <div className="space-y-6 max-w-[250px]">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Shop</h4>
              <p className="text-sm text-brand-dark font-bold leading-relaxed">
                PRINTONE, No.122, Rajaji Road, West Tambaram, Chennai - 600045
              </p>
            </div>
            <div className="space-y-6 flex flex-col md:items-end">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Powered by</h4>
              <img src="/printone-logo.png" alt="Printone" className="h-12" />
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto mt-12 pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-center items-center gap-6">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">&copy; {new Date().getFullYear()} PrintOne. All Rights Reserved.</p>
          <div className="flex gap-4">
             {/* <div className="flex items-center gap-2 group transition-all">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:scale-150 transition-transform" />
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Global Ops Active</span>
             </div> */}
          </div>
        </div>
      </footer>
    )}
  </div>
)

const SuccessPopup = ({ order, employee, onDone }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 animate-in fade-in duration-500">
    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onDone} />
    <div className="relative w-full max-w-xl bg-white rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.15)] overflow-hidden animate-in zoom-in slide-in-from-bottom-12 duration-700">
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-green-400 to-emerald-500" />
      
      <div className="p-10 md:p-14 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-green-50 text-green-500 mb-8 animate-bounce">
          <HiOutlineCheckCircle className="text-5xl" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
          Your order is <br/><span className="text-green-500 italic">confirmed!</span>
        </h2>
        
        <p className="text-slate-500 font-medium text-lg mb-10">
          Excellent choice, {employee?.name?.split(' ')[0]}! Your premium onboarding kits are being prepared by the fulfillment team.
        </p>

        <div className="bg-slate-50 rounded-[32px] p-6 mb-10 border border-slate-100 flex flex-col items-center justify-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Confirmation Hash</span>
            <span className="text-sm font-black text-brand-blue tracking-[0.2em]">#{order._id.slice(-8).toUpperCase()}</span>
        </div>

        <button 
          onClick={onDone}
          className="cursor-pointer w-full bg-brand-dark hover:bg-black text-white font-black py-5 rounded-[24px] shadow-xl transition-all active:scale-95 uppercase tracking-[0.4em] text-[11px]"
        >
          Done
        </button>
      </div>
    </div>
  </div>
)

function App() {
  const navigate = useNavigate()
  
  // State initialization with persistence
  const [employee, setEmployee] = useState(() => {
    const saved = localStorage.getItem('onboarding_employee')
    return saved ? JSON.parse(saved) : null
  })
  
  const [selectedKits, setSelectedKits] = useState(() => {
    const saved = localStorage.getItem('onboarding_kits')
    return saved ? JSON.parse(saved) : []
  })

  const [lastOrder, setLastOrder] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Single Unified Auth State
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('printone_auth')
    return saved ? JSON.parse(saved) : null
  })

  // Sync state to local storage
  useEffect(() => {
    if (employee) localStorage.setItem('onboarding_employee', JSON.stringify(employee))
    else localStorage.removeItem('onboarding_employee')
  }, [employee])

  useEffect(() => {
    localStorage.setItem('onboarding_kits', JSON.stringify(selectedKits))
  }, [selectedKits])

  useEffect(() => {
    if (auth) localStorage.setItem('printone_auth', JSON.stringify(auth))
    else localStorage.removeItem('printone_auth')
  }, [auth])

  const handleLogin = (user) => {
    setAuth(user)
    navigate('/admin')
  }

  const handleLogout = () => {
    setAuth(null)
    navigate('/')
  }

  const handleVerified = (emp, existingOrder) => {
    console.log('App.jsx handleVerified called with:', emp.name, 'existingOrder:', !!existingOrder)
    setEmployee(emp)
    if (existingOrder) {
      navigate('/track')
    } else {
      navigate('/catalog')
    }
  }

  const toggleKit = (kit) => {
    setSelectedKits(prev => {
      const isSelected = prev.find(k => k._id === kit._id)
      const isChoices = kit.category.startsWith('Choice_')
      
      // If it's the T-shirt (standard) and we just want to update the size
      if (kit.title.toLowerCase().includes('t-shirt') && kit.selectedSize) {
        if (isSelected) {
          return prev.map(k => k._id === kit._id ? { ...k, selectedSize: kit.selectedSize } : k)
        } else {
          return [...prev, kit]
        }
      }

      // Existing toggle logic
      if (kit.category === 'Standard' && isSelected) return prev
      
      if (isSelected) {
        return prev.filter(k => k._id !== kit._id)
      } else {
        if (isChoices) {
          const othersRemoved = prev.filter(k => k.category !== kit.category)
          return [...othersRemoved, kit]
        } else {
          return [...prev, kit]
        }
      }
    })
  }

  const handleOrderPlaced = (order) => {
    setLastOrder(order)
    setShowSuccess(true)
  }

  const reset = () => {
    setEmployee(null)
    setSelectedKits([])
    setLastOrder(null)
    setShowSuccess(false)
    navigate('/')
  }

  return (
    <>
      {showSuccess && <SuccessPopup order={lastOrder} employee={employee} onDone={reset} />}
      
      <Routes>
        <Route path="/" element={<MainLayout onReset={reset} onNavigate={navigate}><div className="pt-4 md:pt-8"><Verify onVerified={handleVerified} /></div></MainLayout>} />
        <Route path="/catalog" element={employee ? <MainLayout onReset={reset} onNavigate={navigate}><div className="animate-in fade-in slide-in-from-bottom-8 duration-700"><Catalog onSelect={toggleKit} selectedKits={selectedKits} onCheckout={() => navigate('/checkout')} /></div></MainLayout> : <Navigate to="/" />} />
        <Route path="/checkout" element={employee && selectedKits.length > 0 ? <MainLayout onReset={reset} onNavigate={navigate}><Checkout selectedKits={selectedKits} employee={employee} onOrderPlaced={handleOrderPlaced} /></MainLayout> : <Navigate to="/" />} />
        <Route path="/track" element={employee ? <MainLayout onReset={reset} onNavigate={navigate}><Tracking employee={employee} /></MainLayout> : <Navigate to="/" />} />
        <Route path="/confirmation-result" element={<MainLayout hideNavFooter onReset={reset} onNavigate={navigate}><ConfirmationResult /></MainLayout>} />
        
        {/* Unified Admin/Viewer Route */}
        <Route path="/admin/*" element={
          auth ? (
            <AdminDashboard
              onLogout={handleLogout}
              readOnly={auth.role === 'viewer'}
            />
          ) : (
            <MainLayout onReset={reset} onNavigate={navigate}>
              <AdminLogin onLogin={handleLogin} />
            </MainLayout>
          )
        } />
      </Routes>
    </>
  )
}

export default App
