import { useState, useRef, useEffect } from 'react'

export default function Verify({ onVerified }) {
  const [step, setStep] = useState('email') // 'email' | 'otp'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const otpRefs = useRef([])

  // Countdown for resend
  useEffect(() => {
    if (resendTimer <= 0) return
    const interval = setInterval(() => setResendTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  // ----- Step 1: Send OTP -----
  const handleSendOtp = async (e) => {
    e?.preventDefault()
    setError('')
    if (!email.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      })
      const data = await res.json()
      if (data.success) {
        setStep('otp')
        setOtp(['', '', '', '', '', ''])
        setResendTimer(60)
        setTimeout(() => otpRefs.current[0]?.focus(), 100)
      } else {
        setError(data.message || 'Could not send OTP')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // ----- OTP input handlers -----
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...otp]
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || ''
    setOtp(next)
    const lastFilled = Math.min(pasted.length, 5)
    otpRefs.current[lastFilled]?.focus()
  }

  // ----- Step 2: Verify OTP -----
  const handleVerifyOtp = async (e) => {
    e?.preventDefault()
    setError('')
    const otpValue = otp.join('')
    if (otpValue.length < 6) {
      setError('Please enter the complete 6-digit OTP.')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otpValue })
      })
      const data = await res.json()
      if (data.success) {
        if (data.hasOrder) {
          onVerified(data.employee, data.order)
        } else {
          onVerified(data.employee)
        }
      } else {
        setError(data.message || 'Invalid OTP')
        setOtp(['', '', '', '', '', ''])
        otpRefs.current[0]?.focus()
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-700 max-w-[1300px] mx-auto">
      {/* ── Left Panel ── */}
      <div className="px-2">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
          Identity Verification
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tighter leading-tight mb-4">
          Claim your welcome kits.
        </h1>
        <p className="text-slate-500 text-base font-medium leading-relaxed max-w-md mb-8">
          {step === 'email'
            ? 'Enter your company email to receive a one-time password. No passwords required.'
            : `We sent a 6-digit OTP to ${email}. Enter it below to continue.`}
        </p>

        <div className="bg-slate-50/50 border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-soft">

          {/* ── EMAIL STEP ── */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Company Email
                </label>
                <input
                  id="verify-email-input"
                  type="email"
                  placeholder="you@company.com"
                  required
                  autoFocus
                  className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 focus:border-brand-blue outline-none transition-all placeholder:text-slate-300 font-bold text-base"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                />
              </div>

              <button
                id="send-otp-btn"
                type="submit"
                disabled={isLoading || !email.trim()}
                className={`w-full bg-brand-orange hover:bg-orange-600 text-white font-black py-4 px-8 rounded-full transition-all shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2 text-xs uppercase tracking-widest ${
                  isLoading || !email.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:scale-[1.02] active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── OTP STEP ── */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-8">
              {/* OTP boxes */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
                  Enter 6-digit OTP
                </label>
                <div className="flex gap-2 sm:gap-3 justify-between" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-digit-${i}`}
                      ref={el => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className={`w-full aspect-square text-center text-xl font-black bg-white border-2 rounded-2xl outline-none transition-all
                        ${digit ? 'border-brand-orange text-brand-dark shadow-sm' : 'border-slate-200 text-slate-800'}
                        focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]`}
                      style={{ minWidth: 0 }}
                    />
                  ))}
                </div>
              </div>

              <button
                id="verify-otp-btn"
                type="submit"
                disabled={isLoading || otp.join('').length < 6}
                className={`w-full bg-brand-orange hover:bg-orange-600 text-white font-black py-4 px-8 rounded-full transition-all shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2 text-xs uppercase tracking-widest ${
                  isLoading || otp.join('').length < 6
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:scale-[1.02] active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>

              {/* Resend + Change email */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setStep('email'); setError(''); setOtp(['', '', '', '', '', '']) }}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors underline underline-offset-4 cursor-pointer"
                >
                  ← Change email
                </button>
                {resendTimer > 0 ? (
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Resend in {resendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="text-xs font-bold text-brand-blue hover:text-blue-700 transition-colors underline underline-offset-4 cursor-pointer disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
            <span className="text-red-500 text-base">⚠</span>
            <p className="text-red-600 text-xs font-bold">{error}</p>
          </div>
        )}

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

      {/* ── Right Panel (image) ── */}
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
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 mb-6 drop-shadow-sm">
                Curated Onboarding Essentials &bull; 2026
              </p>
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
