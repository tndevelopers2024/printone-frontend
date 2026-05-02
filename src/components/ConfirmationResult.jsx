import { useSearchParams, useNavigate } from 'react-router-dom'
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineClock, HiOutlineChevronRight } from 'react-icons/hi2'

export default function ConfirmationResult() {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')
  const orderId = searchParams.get('id')
  const navigate = useNavigate()

  const config = {
    success: {
      icon: <HiOutlineCheckCircle className="text-6xl text-emerald-500" />,
      title: 'Delivery Confirmed',
      desc: 'Thank you for confirming your receipt. Your onboarding kit status has been updated to Delivered.',
      color: 'emerald'
    },
    reported: {
      icon: <HiOutlineClock className="text-6xl text-brand-orange" />,
      title: 'Report Received',
      desc: "We're sorry to hear you haven't received your kit. We've notified our support team and admins to investigate immediately.",
      color: 'orange'
    },
    'not-found': {
      icon: <HiOutlineExclamationCircle className="text-6xl text-red-500" />,
      title: 'Order Not Found',
      desc: "We couldn't locate the order details for this confirmation link. Please contact support.",
      color: 'red'
    },
    error: {
      icon: <HiOutlineExclamationCircle className="text-6xl text-red-500" />,
      title: 'Something went wrong',
      desc: 'An error occurred while processing your request. Please try again later.',
      color: 'red'
    }
  }

  const current = config[status] || config.error

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-700">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 p-10 text-center relative overflow-hidden">
        {/* Decorative background */}
        <div className={`absolute top-0 inset-x-0 h-1.5 bg-${current.color}-500`} />
        
        <div className="mb-8 flex justify-center">
          <div className="animate-bounce">
            {current.icon}
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
          {current.title}
        </h1>
        
        <p className="text-slate-500 font-medium mb-10 text-sm leading-relaxed">
          {current.desc}
        </p>

        {orderId && (
          <div className="bg-slate-50 rounded-2xl p-4 mb-10 border border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Order Identification</span>
            <span className="text-xs font-mono font-black text-slate-700">#{orderId.slice(-8).toUpperCase()}</span>
          </div>
        )}

        <button 
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl transition-all active:scale-95 group"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Return Home</span>
          <HiOutlineChevronRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}
