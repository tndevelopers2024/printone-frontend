import { useState, useEffect } from 'react'
import { HiOutlineShieldCheck, HiOutlineComputerDesktop, HiOutlineBriefcase, HiOutlineCheckBadge } from 'react-icons/hi2'

export default function Catalog({ onSelect, selectedKits, onCheckout }) {
  const [kits, setKits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/kits`)
      .then(res => res.json())
      .then(data => {
        setKits(data)
        setLoading(false)

        // Auto-select standard items if they aren't selected
        const standardItems = data.filter(k => k.category === 'Standard')
        standardItems.forEach(item => {
          if (!selectedKits.find(k => k._id === item._id)) {
            onSelect(item)
          }
        })
      })
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-48 space-y-8 animate-pulse">
      <div className="relative">
         <div className="w-16 h-16 border-2 border-brand-blue/10 border-t-brand-blue rounded-full animate-spin" />
         <div className="absolute inset-0 bg-brand-blue/5 rounded-full blur-xl" />
      </div>
      <p className="text-slate-400 font-extrabold text-[10px] uppercase tracking-[0.5em]">Compiling Your Proposal</p>
    </div>
  )

  const sizes = ['S', 'M', 'L', 'XL', 'XXL']
  
  const isASelected = selectedKits.some(k => k.category === 'Choice_A')
  const isBSelected = selectedKits.some(k => k.category === 'Choice_B')
  
  // Verify if T-Shirt has size if it's selected
  const tshirt = kits.find(k => k.title.toLowerCase().includes('t-shirt'))
  const isTshirtSizeSelected = tshirt 
    ? selectedKits.find(k => k._id === tshirt._id)?.selectedSize 
    : true

  const canProceed = isASelected && isBSelected && isTshirtSizeSelected

  const SectionHeader = ({ icon, title, subtitle, badge }) => (
    <div className="flex items-start justify-between mb-10 group">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-white shadow-soft border border-slate-100 flex items-center justify-center text-brand-blue text-2xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h3>
            {badge && (
              <span className="px-2.5 py-0.5 bg-green-50 text-green-600 text-[8px] font-black uppercase tracking-widest rounded-full border border-green-100">
                {badge}
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{subtitle}</p>
        </div>
      </div>
    </div>
  )

  const ProductCard = ({ kit, isSelected, index }) => {
    const isTshirt = kit.title.toLowerCase().includes('t-shirt')
    const currentSelectedSize = selectedKits.find(k => k._id === kit._id)?.selectedSize

    return (
      <div 
        onClick={() => !isTshirt && onSelect(kit)}
        style={{ animationDelay: `${index * 50}ms` }}
        className={`group relative flex flex-col bg-white rounded-[32px] transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-bottom-4 fill-mode-both border-2 ${
          isTshirt ? 'cursor-default' : 'cursor-pointer'
        } ${
          isSelected 
          ? 'border-brand-blue shadow-premium scale-[1.02] z-10' 
          : 'border-transparent bg-white/60 hover:bg-white hover:border-slate-200 hover:shadow-soft'
        }`}
      >
        {/* Selection Badge */}
        {isSelected && (!isTshirt || currentSelectedSize) && (
          <div className="absolute top-4 right-4 z-20 w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
            <HiOutlineCheckBadge className="text-xl" />
          </div>
        )}

        {/* Image Container */}
        <div className="relative h-48 w-full bg-slate-50/50 flex items-center justify-center p-6 overflow-hidden">
          <img 
            src={kit.image} 
            alt={kit.title} 
            className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="px-8 pb-8 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-md font-extrabold text-slate-900 tracking-tight group-hover:text-brand-blue transition-colors">
              {kit.title}
            </h4>
          </div>

          {isTshirt && (
            <div className="mt-auto pt-4 border-t border-slate-50">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Select Your Fit</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect({ ...kit, selectedSize: size })
                    }}
                    className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all border-2 flex items-center justify-center cursor-pointer ${
                      currentSelectedSize === size
                      ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20 scale-110'
                      : 'bg-white border-slate-100 text-slate-400 hover:border-brand-blue hover:text-brand-blue'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-[2.5px] bg-brand-orange" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">Official Welcome Kit</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5 tracking-tighter text-slate-900 leading-none">
            Review Your <br/>Proposal & <span className="text-brand-blue">Choice.</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl">
            We've prepared your essential Tiger Gear. Complete your kit by selecting your preferred workspace setup and premium carry bags.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Assets</p>
            <p className="text-lg font-black text-slate-900">{selectedKits.length} Items Locked</p>
          </div>
          <button 
            disabled={!canProceed}
            onClick={onCheckout}
            className={`group rounded-[28px] px-10 py-5 flex items-center gap-4 transition-all duration-500 cursor-pointer ${
              canProceed 
              ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20 hover:scale-[1.03] active:scale-95' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">
              {canProceed ? 'Confirm Selection' : 'Complete Selection'}
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform ${canProceed ? 'bg-white/20 group-hover:translate-x-1' : 'bg-slate-200'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-24">
        {/* Section 1: Standard Essentials (Locked) */}
        <section>
          <SectionHeader 
            icon={<HiOutlineShieldCheck />} 
            title="The Essential Pack" 
            subtitle="Standard inclusion for all employees"
            badge="Locked & Included"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 opacity-80">
            {kits.filter(k => k.category === 'Standard').map((kit, i) => (
              <ProductCard key={kit._id} kit={kit} isSelected={true} index={i} />
            ))}
          </div>
        </section>

        {/* Section 2: Workspace Choices */}
        <section>
          <SectionHeader 
            icon={<HiOutlineComputerDesktop />} 
            title="Professional Upgrade" 
            subtitle="Personalize your workspace setup"
            badge={isASelected ? 'Selection Made' : 'REQUIRED: Pick One'}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {kits.filter(k => k.category === 'Choice_A').map((kit, i) => (
              <ProductCard 
                key={kit._id} 
                kit={kit} 
                isSelected={selectedKits.some(s => s._id === kit._id)} 
                index={i + 4} 
              />
            ))}
          </div>
        </section>

        {/* Section 3: Carry Choices */}
        <section>
          <SectionHeader 
            icon={<HiOutlineBriefcase />} 
            title="Premium Carry" 
            subtitle="Choose your executive bag style"
            badge={isBSelected ? 'Selection Made' : 'REQUIRED: Pick One'}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {kits.filter(k => k.category === 'Choice_B').map((kit, i) => (
              <ProductCard 
                key={kit._id} 
                kit={kit} 
                isSelected={selectedKits.some(s => s._id === kit._id)} 
                index={i + 7} 
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
