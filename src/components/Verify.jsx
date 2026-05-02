import { useState, useRef, useEffect } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, eachDayOfInterval, getDay, setYear, setMonth, getYear } from 'date-fns'
import { HiOutlineCalendar, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2'

export default function Verify({ onVerified }) {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')


    setIsLoading(true)
    try {
      const sanitizedData = {
        name: formData.name.trim(),
        email: formData.email.trim()
      }
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData)
      })
      const data = await res.json()
      console.log('Verify API Response:', data)
      if (data.success) {
        if (data.hasOrder) {
          onVerified(data.employee, data.order)
        } else {
          onVerified(data.employee)
        }
      } else {
        setError(data.message || 'Verification failed')
        setIsLoading(false)
      }
    } catch (err) {
      setError('System communication error.')
      setIsLoading(false)
    }
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-700 max-w-[1300px] mx-auto">
      <div className="px-2">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Identity Verification</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tighter leading-tight mb-4">
          Claim your welcome kits.
        </h1>
        <p className="text-slate-500 text-base font-medium leading-relaxed max-w-md mb-8">
          Verify your details to choose your items. No payment or passwords required.
        </p>

        <div className="bg-slate-50/50 border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full name</label>
              <input 
                type="text" 
                placeholder="As per records"
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 focus:border-brand-blue outline-none transition-all placeholder:text-slate-300 font-bold"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="Email ID"
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 focus:border-brand-blue outline-none transition-all placeholder:text-slate-300 font-bold"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2">
              
              <button 
                type="submit"
                disabled={isLoading || !formData.name.trim() || !formData.email.trim()}
                className={`w-full sm:w-auto bg-brand-orange hover:bg-orange-600 text-white font-black py-4 px-8 rounded-full transition-all shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2 text-xs uppercase tracking-widest ${isLoading || !formData.name.trim() || !formData.email.trim() ? 'opacity-50 cursor-not-allowed grayscale-[0.5]' : 'cursor-pointer hover:scale-105 active:scale-95'}`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {error && <p className="text-red-500 text-[10px] font-bold mt-4 text-center uppercase tracking-widest">{error}</p>}

        <div className="grid grid-cols-2 gap-4 mt-12 border-t border-slate-100 pt-6">
           <div className="text-center sm:text-left">
              <p className="text-[14px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Verified by</p>
              <p className="text-[16px] font-bold text-slate-900">Tiger Analytics</p>
           </div>
           <div className="text-center sm:text-left">
              <p className="text-[14px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Fulfillment Partner</p>
              <p className="text-[16px] font-bold text-slate-900">PrintOne</p>
           </div>
        </div>
      </div>

      <div className="lg:block hidden h-full">
        <div className="relative rounded-[40px] h-full min-h-[500px] overflow-hidden border border-white/50 shadow-sm group">
           <img 
            src="/combo-kit.png" 
            alt="Onboarding Combo Kit" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/10" />
           <div className="absolute inset-x-12 top-12 bottom-12 flex flex-col justify-between">
              <div className="relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 mb-6 drop-shadow-sm">Curated Onboarding Essentials &bull; 2026</p>
                 <h3 className="text-5xl font-extrabold text-white tracking-tighter leading-[0.95] drop-shadow-md">
                   Premium <br/>Kits for <br/><span className="text-brand-orange">New Tigers.</span>
                 </h3>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
