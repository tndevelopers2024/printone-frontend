import { useState, useEffect } from 'react'
import { HiOutlineCheck, HiOutlineShoppingBag, HiOutlineCog, HiOutlineTruck, HiOutlineHome, HiOutlineMapPin, HiOutlineCube } from 'react-icons/hi2'
import { format } from 'date-fns'

const TRACKING_STEPS = [
  { id: 'Pending', label: 'Order Confirmed', desc: 'We have received your kit selection.', icon: <HiOutlineShoppingBag className="text-xl" /> },
  { id: 'Processing', label: 'Assembling Gear', desc: 'Packing your exclusive tiger assets.', icon: <HiOutlineCog className="text-xl" /> },
  { id: 'Dispatched', label: 'Out for Delivery', desc: 'Your kit is on its way to you.', icon: <HiOutlineTruck className="text-xl" /> },
  { id: 'Delivered', label: 'Kit Delivered', desc: 'Welcome to the team!', icon: <HiOutlineHome className="text-xl" /> }
]

export default function Tracking({ employee }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/track?name=${encodeURIComponent(employee.name)}&email=${encodeURIComponent(employee.email)}`)
        const data = await res.json()
        if (data.success) {
          setOrder(data.order)
        } else {
          setError(data.message || 'Could not find tracking details')
        }
      } catch (err) {
        setError('Failed to load tracking data')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [employee.name, employee.email])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 relative">
           <div className="absolute inset-0 border-4 border-slate-100 border-t-brand-orange rounded-full animate-spin" />
           <div className="absolute inset-2 border-4 border-brand-blue/10 border-b-brand-blue rounded-full animate-spin border-t-transparent border-l-transparent border-r-transparent" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-4">Locating your kit...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-12 bg-white rounded-[40px] border border-red-100 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-red-50/50" />
        <div className="relative z-10">
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineCube className="text-4xl" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Tracking Unavailable</h2>
          <p className="text-slate-500 font-medium">{error || 'Could not find your order. Please contact IT support.'}</p>
        </div>
      </div>
    )
  }

  const currentStepIndex = TRACKING_STEPS.findIndex(s => s.id === order.status)
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0
  const progressPercentage = (activeIndex / (TRACKING_STEPS.length - 1)) * 100

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 px-4 md:px-8 mt-4 mb-24">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-6 h-[2px] bg-brand-orange" />
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-orange">Live Status</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tighter leading-none mb-2">
            Track Your <span className="text-brand-blue">Tiger Gear.</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Welcome back, {employee.name.split(' ')[0]}. Here is the real-time status of your onboarding bundle.
          </p>
        </div>
        <div className="text-left md:text-right bg-white px-5 py-4 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-center">
           <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Confirmation Code</p>
           <p className="text-lg font-black text-slate-900 tracking-widest font-mono leading-none">#{order._id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Vertical Modern Timeline */}
        <div className="lg:col-span-5 relative">
          <div className="bg-slate-900 rounded-[40px] p-10 md:p-12 shadow-2xl relative overflow-hidden h-full">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/30 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3" />
            
            <div className="relative z-10">
              <h3 className="text-white text-2xl font-black tracking-tight mb-12 flex items-center justify-between">
                Workflow
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                </span>
              </h3>

              <div className="relative">
                <div className="space-y-12">
                  {TRACKING_STEPS.map((step, idx) => {
                    const isFinalStep = idx === TRACKING_STEPS.length - 1
                    const isOrderDelivered = activeIndex === TRACKING_STEPS.length - 1
                    
                    const isCompleted = idx < activeIndex || (isOrderDelivered && isFinalStep)
                    const isActive = idx === activeIndex && !isOrderDelivered
                    const isPending = idx > activeIndex

                    const hasSolidLine = isOrderDelivered || activeIndex > idx + 1;
                    const hasGradientLine = !isOrderDelivered && activeIndex === idx + 1;

                    return (
                      <div key={step.id} className="relative flex items-start gap-8 group">
                        
                        {/* Connecting Line to next step */}
                        {!isFinalStep && (
                          <>
                            {/* Background Line */}
                            <div className="absolute left-7 top-7 w-[2px] bg-white/10 z-0" style={{ height: 'calc(100% + 3rem)' }} />
                            
                            {/* Active Fill Line */}
                            {(hasSolidLine || hasGradientLine) && (
                              <div 
                                className={`absolute left-7 top-7 w-[2px] z-0 ${hasSolidLine ? 'bg-brand-orange' : 'bg-gradient-to-b from-brand-orange to-brand-blue'}`} 
                                style={{ height: 'calc(100% + 3rem)' }} 
                              />
                            )}
                          </>
                        )}
                        
                        {/* Step Icon */}
                        <div 
                          className={`
                            relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-700
                            ${isCompleted ? 'bg-brand-orange text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]' : ''}
                            ${isActive ? 'bg-brand-blue text-white shadow-[0_0_30px_rgba(15,23,42,0.6)] border-2 border-white/20 scale-110' : ''}
                            ${isPending ? 'bg-white/5 text-slate-500 border border-white/10' : ''}
                          `}
                        >
                          {isCompleted ? <HiOutlineCheck className="text-2xl" /> : step.icon}
                        </div>

                        {/* Step Details */}
                        <div className="pt-2 flex-1">
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 transition-colors duration-500 ${isActive ? 'text-brand-orange' : isCompleted ? 'text-brand-orange' : 'text-slate-600'}`}>
                            {isActive ? 'Current Phase' : (isCompleted && isFinalStep) ? 'Mission Accomplished' : isCompleted ? 'Phase Cleared' : 'Awaiting Phase'}
                          </p>
                          <h4 className={`text-xl font-extrabold tracking-tight mb-2 transition-colors duration-500 ${isActive || isCompleted ? 'text-white' : 'text-slate-500'}`}>
                            {step.label}
                          </h4>
                          <p className={`text-sm leading-relaxed ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Digital Receipt Style */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Shipping Card */}
          <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-0 transition-transform duration-500 group-hover:scale-110" />
            
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-brand-blue flex-shrink-0 relative z-10 border border-slate-100 shadow-inner">
              <HiOutlineMapPin className="text-3xl" />
            </div>
            <div className="relative z-10 flex-1 text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Destination Coordinates</p>
              <h4 className="text-xl font-extrabold text-slate-900 mb-2 leading-tight">
                {order.shippingAddress.doorNo}, {order.shippingAddress.street}
              </h4>
              <p className="text-sm text-slate-500 mb-4">{order.shippingAddress.address}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-black text-slate-700 border border-slate-100 uppercase tracking-widest">
                  {order.shippingAddress.city}
                </span>
                <span className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-black text-slate-700 border border-slate-100 uppercase tracking-widest">
                  {order.shippingAddress.pincode}
                </span>
              </div>
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl shadow-slate-200/40 border border-slate-100 flex-1">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Acquired Assets</h3>
              <span className="w-10 h-10 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center font-black text-lg">
                {order.items.length}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {order.items.map((item, i) => (
                <div key={i} className="group relative p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 overflow-hidden flex items-center gap-4">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-blue/20 group-hover:bg-brand-blue transition-colors" />
                  
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 font-black text-xs border border-slate-100">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900 leading-snug group-hover:text-brand-blue transition-colors">
                      {item.title}
                    </p>
                    {item.selectedSize && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-brand-orange/10 text-brand-orange rounded text-[9px] font-black uppercase tracking-widest">
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
