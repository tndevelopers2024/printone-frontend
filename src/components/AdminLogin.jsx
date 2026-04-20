import { useState } from 'react'

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.success) {
        onLogin(data.user)
      } else {
        setError(data.message || 'Authentication failed')
      }
    } catch (err) {
      setError('System communication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[600px] flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
      <div className="w-full max-w-xl">
        <div className="bg-white border border-slate-100 rounded-[28px] p-6 md:p-6 md:px-10 shadow-premium relative overflow-hidden group">
          {/* Subtle Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-brand-blue opacity-20 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-[24px] bg-slate-50 mb-6 border border-slate-100">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tighter mb-3">Portal Access</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Secure Enterprise Gateway</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <input 
                type="email" 
                required
                placeholder="Enter Email"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:bg-white focus:border-brand-blue outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password token</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:bg-white focus:border-brand-blue outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 animate-in shake duration-500">
                <span className="text-red-500 text-sm font-black uppercase tracking-widest">!</span>
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[24px] transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-12 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            PrintOne Security Protocol v4.0
          </p>
        </div>
      </div>
    </div>
  )
}
