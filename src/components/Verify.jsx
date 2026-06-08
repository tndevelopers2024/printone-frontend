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
    <div className="relative w-full flex items-center justify-center p-4 sm:p-8 font-sans mt-4">
      <div className="relative z-10 w-full max-w-[1400px] bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row animate-in fade-in zoom-in-95 duration-700">
        
        {/* ── Left Panel (Form) ── */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
          
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-orange/10 to-brand-orange/5 border border-brand-orange/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange">Secure Identity Verification</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight leading-[1.1] mb-4">
              Claim your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">
                welcome kits.
              </span>
            </h1>
            <p className="text-slate-500 text-base sm:text-lg font-medium leading-relaxed max-w-md">
              {step === 'email' ? (
                "Enter your company email to receive a secure one-time passcode. No passwords required."
              ) : (
                <span className="flex flex-col gap-1">
                  <span>We sent a 6-digit passcode to</span>
                  <strong className="text-slate-800">{email}</strong>
                </span>
              )}
            </p>
          </div>

          <div className="w-full max-w-md">
            {/* ── EMAIL STEP ── */}
            {step === 'email' && (
              <form onSubmit={handleSendOtp} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
                <div className="relative group">
                  <input
                    id="verify-email-input"
                    type="email"
                    placeholder=" "
                    required
                    autoFocus
                    className="peer w-full bg-white/50 backdrop-blur-sm border-2 border-slate-200/80 rounded-2xl px-6 pt-7 pb-3 focus:border-brand-orange focus:bg-white outline-none transition-all text-slate-800 font-bold text-lg shadow-sm focus:shadow-md"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                  />
                  <label className="absolute left-6 top-5 text-slate-400 font-semibold text-base transition-all peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-brand-orange peer-focus:font-bold peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:font-bold pointer-events-none origin-left">
                    Company Email
                  </label>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 peer-focus:opacity-100 transition-opacity text-brand-orange">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                  </div>
                </div>

                <button
                  id="send-otp-btn"
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className={`relative w-full overflow-hidden rounded-2xl group transition-all duration-300 ${
                    isLoading || !email.trim()
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-orange/30 cursor-pointer active:translate-y-0'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-orange via-amber-500 to-brand-orange bg-[length:200%_auto] animate-[gradient_3s_linear_infinite] group-hover:bg-[position:100%_center] transition-all duration-500" />
                  <div className="relative flex items-center justify-center gap-3 py-4 px-8 text-white font-bold text-sm sm:text-base tracking-wide">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Secure Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue with Email</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    )}
                  </div>
                </button>
              </form>
            )}

            {/* ── OTP STEP ── */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-500">
                <div onPaste={handleOtpPaste}>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-4">
                    Enter the 6-digit code
                  </label>
                  <div className="flex gap-2 sm:gap-4 justify-between">
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
                        className={`w-full aspect-square text-center text-2xl sm:text-3xl font-extrabold bg-white rounded-[1.25rem] outline-none transition-all duration-200 border-2 border-slate-50 shadow-[0_4px_14px_rgba(0,0,0,0.03)] text-slate-800
                          focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/10 focus:-translate-y-0.5`}
                        style={{ minWidth: 0 }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  id="verify-otp-btn"
                  type="submit"
                  disabled={isLoading || otp.join('').length < 6}
                  className={`relative w-full overflow-hidden rounded-2xl group transition-all duration-300 ${
                    isLoading || otp.join('').length < 6
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-orange/30 cursor-pointer active:translate-y-0'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-orange via-amber-500 to-brand-orange bg-[length:200%_auto] animate-[gradient_3s_linear_infinite] group-hover:bg-[position:100%_center] transition-all duration-500" />
                  <div className="relative flex items-center justify-center gap-3 py-4 px-8 text-white font-bold text-sm sm:text-base tracking-wide">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Access Kits</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    )}
                  </div>
                </button>

                <div className="flex items-center justify-between pt-4 px-2">
                  <button
                    type="button"
                    onClick={() => { setStep('email'); setError(''); setOtp(['', '', '', '', '', '']) }}
                    className="group flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Wrong email?
                  </button>
                  {resendTimer > 0 ? (
                    <span className="text-sm font-bold text-slate-400 flex items-center gap-1.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      Wait {resendTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="text-sm font-bold text-brand-orange hover:text-amber-600 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                      </svg>
                      Resend Code
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* Error Message with Animation */}
            {error && (
              <div className="mt-6 flex items-center gap-3 bg-red-50/80 backdrop-blur-md border border-red-200 rounded-2xl p-4 animate-in slide-in-from-bottom-2 fade-in">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <p className="text-red-700 text-sm font-bold">{error}</p>
              </div>
            )}
          </div>

          <div className="mt-auto pt-12 flex flex-wrap gap-x-12 gap-y-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Verified by</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-white font-bold text-xs">TA</div>
                <p className="text-sm font-bold text-slate-800">Tiger Analytics</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Fulfillment Partner</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-brand-orange flex items-center justify-center text-white font-bold text-xs">P</div>
                <p className="text-sm font-bold text-slate-800">PrintOne</p>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right Panel (Image) ── */}
        <div className="hidden lg:block w-1/2 p-4">
          <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl group">
            <img
              src="/combo-kit.png"
              alt="Premium Onboarding Kit"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
            
            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-10 transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">2026 Collection</span>
              </div>
              <h2 className="text-4xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-lg mb-2">
                Premium Kits for <br />
                <span className="text-brand-orange">New Tigers.</span>
              </h2>
              <p className="text-white/80 font-medium text-sm max-w-[80%] drop-shadow">
                Curated onboarding essentials to kickstart your journey with Tiger Analytics.
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
