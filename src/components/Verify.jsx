import { useState, useRef, useEffect } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, eachDayOfInterval, getDay, setYear, setMonth, getYear } from 'date-fns'
import { HiOutlineCalendar, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2'

export default function Verify({ onVerified }) {
  const [formData, setFormData] = useState({ name: '', email: '', dob: '' })
  const [error, setError] = useState('')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [viewDate, setViewDate] = useState(new Date())
  const [calendarDirection, setCalendarDirection] = useState('down')
  const calendarRef = useRef(null)

  const [inputValue, setInputValue] = useState('')

  // Sync Input Value with formData.dob
  useEffect(() => {
    if (formData.dob) {
      setInputValue(format(new Date(formData.dob), 'dd-MM-yyyy'))
    }
  }, [formData.dob])

  const handleDateChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 8)
    let formatted = ''
    
    if (rawVal.length > 0) {
      formatted += rawVal.slice(0, 2)
      if (rawVal.length > 2) {
        formatted += '-' + rawVal.slice(2, 4)
        if (rawVal.length > 4) {
          formatted += '-' + rawVal.slice(4, 8)
        }
      }
    }
    
    setInputValue(formatted)

    // Only update formData if we have a full date
    if (rawVal.length === 8) {
      const day = parseInt(rawVal.slice(0, 2))
      const month = parseInt(rawVal.slice(2, 4)) - 1
      const year = parseInt(rawVal.slice(4, 8))
      
      const date = new Date(year, month, day)
      if (!isNaN(date.getTime()) && year > 1900 && year <= getYear(new Date())) {
        setFormData(prev => ({ ...prev, dob: format(date, 'yyyy-MM-dd') }))
        setViewDate(date)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.dob) {
      setError('Please select your date of birth')
      return
    }

    try {
      const sanitizedData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        dob: formData.dob
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
      }
    } catch (err) {
      setError('System communication error.')
    }
  }

  const renderCalendarContent = () => {
    const monthStart = startOfMonth(viewDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

    const years = []
    const currentYear = getYear(new Date())
    for (let i = currentYear; i >= currentYear - 60; i--) {
      years.push(i)
    }

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]

    return (
      <>
        <div className="flex flex-col gap-4 ">
          <div className="flex items-center justify-between">
            <button 
              type="button"
              onClick={() => setViewDate(subMonths(viewDate, 1))}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-brand-blue transition-all"
            >
              <HiOutlineChevronLeft className="text-xl" />
            </button>
            <div className="flex gap-2">
               <select 
                value={viewDate.getMonth()}
                onChange={(e) => setViewDate(setMonth(viewDate, parseInt(e.target.value)))}
                className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-50 border-none rounded-lg px-2 py-1 outline-none cursor-pointer hover:bg-brand-blue/5 transition-colors"
               >
                 {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
               </select>
               <select 
                value={getYear(viewDate)}
                onChange={(e) => setViewDate(setYear(viewDate, parseInt(e.target.value)))}
                className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-50 border-none rounded-lg px-2 py-1 outline-none cursor-pointer hover:bg-brand-blue/5 transition-colors"
               >
                 {years.map(y => <option key={y} value={y}>{y}</option>)}
               </select>
            </div>
            <button 
              type="button"
              onClick={() => setViewDate(addMonths(viewDate, 1))}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-brand-blue transition-all"
            >
              <HiOutlineChevronRight className="text-xl" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-[10px] font-black text-slate-300 uppercase py-2">
                {day}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, idx) => {
            const isSelected = formData.dob && isSameDay(date, new Date(formData.dob))
            const isCurrentMonth = isSameMonth(date, monthStart)
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, dob: format(date, 'yyyy-MM-dd') })
                  setIsCalendarOpen(false)
                }}
                className={`
                  h-10 w-10 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center
                  ${isSelected ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : ''}
                  ${!isSelected && isCurrentMonth ? 'text-slate-700 hover:bg-brand-blue/5 hover:text-brand-blue' : ''}
                  ${!isSelected && !isCurrentMonth ? 'text-slate-200' : ''}
                `}
              >
                {format(date, 'd')}
              </button>
            )
          })}
        </div>
      </>
    )
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="relative" ref={calendarRef}>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Date of birth</label>
                <div 
                  className="flex items-center bg-white border border-slate-200 rounded-xl px-5 py-3.5 focus-within:border-brand-blue group transition-all"
                >
                  <input
                    type="text"
                    placeholder="DD-MM-YYYY"
                    className="flex-1 text-sm font-bold text-slate-900 border-none outline-none bg-transparent placeholder:text-slate-300 font-bold tracking-[0.05em]"
                    value={inputValue}
                    onChange={handleDateChange}
                    onFocus={() => {
                        if (!isCalendarOpen) {
                          const rect = calendarRef.current?.getBoundingClientRect()
                          const spaceBelow = window.innerHeight - (rect?.bottom || 0)
                          setCalendarDirection(spaceBelow < 400 ? 'up' : 'down')
                        }
                        setIsCalendarOpen(true)
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!isCalendarOpen) {
                          const rect = calendarRef.current?.getBoundingClientRect()
                          const spaceBelow = window.innerHeight - (rect?.bottom || 0)
                          setCalendarDirection(spaceBelow < 400 ? 'up' : 'down')
                      }
                      setIsCalendarOpen(!isCalendarOpen)
                    }}
                    className="p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <HiOutlineCalendar className={`text-xl transition-colors ${isCalendarOpen ? 'text-brand-blue' : 'text-slate-300'}`} />
                  </button>
                </div>
                {isCalendarOpen && (
                  <div className={`
                    absolute left-0 w-[320px] bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 z-50 animate-in fade-in zoom-in duration-300
                    ${calendarDirection === 'up' ? 'bottom-full mb-4 origin-bottom' : 'top-full mt-4 origin-top'}
                  `}>
                    {renderCalendarContent()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2">
              
              <button 
                type="submit"
                className="w-full sm:w-auto bg-brand-orange hover:bg-orange-600 text-white font-black py-4 px-8 rounded-full transition-all shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2 text-xs uppercase tracking-widest cursor-pointer"
              >
                Verify & Continue
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </form>
        </div>

        {error && <p className="text-red-500 text-[10px] font-bold mt-4 text-center uppercase tracking-widest">{error}</p>}

        <div className="grid grid-cols-2 gap-4 mt-12 border-t border-slate-100 pt-6">
           <div className="text-center sm:text-left">
              <p className="text-[14px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Verify</p>
              <p className="text-[16px] font-bold text-slate-900">Tiger Analytics API</p>
           </div>
           <div className="text-center sm:text-left">
              <p className="text-[14px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Dispatch</p>
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
