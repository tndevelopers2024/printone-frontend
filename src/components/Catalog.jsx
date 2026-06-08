import { useState, useEffect } from 'react'
import { HiOutlineShieldCheck, HiOutlineComputerDesktop, HiOutlineBriefcase, HiOutlineCheckBadge, HiOutlineEye, HiOutlineXMark } from 'react-icons/hi2'

export default function Catalog({ onSelect, selectedKits, onCheckout }) {
  const [kits, setKits] = useState([])
  const [loading, setLoading] = useState(true)
  const [previewItem, setPreviewItem] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/kits`)
      .then(res => res.json())
      .then(data => {
        const sortedData = data.sort((a, b) => a.order - b.order)
        setKits(sortedData)
        setLoading(false)

        // Auto-select standard items if they aren't selected
        const standardItems = sortedData.filter(k => k.category === 'Standard')
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
    <div className="flex items-start justify-between mb-6 group">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 rounded-lg bg-white shadow-soft border border-slate-100 flex items-center justify-center text-brand-blue text-2xl group-hover:scale-110 transition-transform">
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
        className={`group relative flex flex-col bg-white rounded-2xl transition-all duration-500 border-2 overflow-hidden animate-in fade-in slide-in-from-bottom-4 fill-mode-both ${
          isTshirt ? 'cursor-default' : 'cursor-pointer'
        } ${
          isSelected 
          ? 'border-brand-blue shadow-premium scale-[1.02] z-10' 
          : 'border-slate-100 hover:border-slate-200 hover:shadow-xl'
        }`}
      >
        {/* Selection Badge */}
        {isSelected && (!isTshirt || currentSelectedSize) && (
          <div className="absolute top-4 left-4 z-30 w-7 h-7 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
            <HiOutlineCheckBadge className="text-lg" />
          </div>
        )}

        {/* Image Section */}
        <div className="relative aspect-[12/10] w-full bg-slate-50 flex items-center justify-center overflow-hidden">
          <img 
            src={kit.image} 
            alt={kit.title} 
            className="w-full h-full transition-transform duration-700 group-hover:scale-110" 
          />
          
          {/* Preview Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); setPreviewItem(kit); }}
            className="absolute top-4 right-4 z-30 w-8 h-8 bg-white/80 hover:bg-white text-slate-600 rounded-full flex items-center justify-center shadow-sm backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-110"
            title="Preview Image"
          >
            <HiOutlineEye className="text-lg" />
          </button>
          
          {/* Size Overlay for T-shirts */}
          {isTshirt && (
            <div className={`absolute inset-x-0 bottom-0 p-3 bg-white/80 backdrop-blur-md border-t border-white/20 transform transition-transform duration-500 z-20 ${
              currentSelectedSize ? 'translate-y-0' : 'translate-y-0 md:translate-y-full md:group-hover:translate-y-0'
            }`}>
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 text-center">Quick Size Select</p>
               <div className="flex justify-center gap-1.5">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect({ ...kit, selectedSize: size })
                    }}
                    className={`w-8 h-8 rounded-lg text-[9px] font-black transition-all border flex items-center justify-center cursor-pointer ${
                      currentSelectedSize === size
                      ? 'bg-brand-blue text-white border-brand-blue shadow-lg'
                      : 'bg-white border-slate-100 text-slate-400 hover:border-brand-blue hover:text-brand-blue'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Persistent Size View if selected */}
          {isTshirt && currentSelectedSize && (
            <div className="absolute bottom-4 right-4 w-10 h-10 bg-brand-blue text-white rounded-xl flex flex-col items-center justify-center shadow-lg border border-white/20 z-10">
               <span className="text-[7px] font-black opacity-60 leading-none">SIZE</span>
               <span className="text-xs font-black leading-none">{currentSelectedSize}</span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-5 flex flex-col items-center justify-center bg-white border-t border-slate-50">
          <h4 className="text-sm font-extrabold text-slate-900 tracking-tight text-center group-hover:text-brand-blue transition-colors">
            {kit.title}
          </h4>
          {isSelected && (!isTshirt || currentSelectedSize) && (
            <span className="mt-2 text-[10px] font-black text-brand-blue uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
              SELECTED
            </span>
          )}
          {isTshirt && !currentSelectedSize && (
            <span className="mt-2 text-[9px] font-black text-brand-orange uppercase tracking-widest animate-pulse">
              Please select the size
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="mb-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-[2px] bg-brand-orange" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">Official Welcome Kit</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-slate-900 leading-none">
            Choose Your Gear
          </h1>
        </div>
      </div>

      <div className="space-y-16">
        {/* Section 1: Standard Essentials (Locked) */}
        <section>
          <SectionHeader 
            icon={<HiOutlineShieldCheck />} 
            title="The Essential Pack" 
            subtitle="Standard inclusion for all employees"
            badge="Locked & Included"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Bottom Action Bar */}
      <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Assets</p>
          <p className="text-lg font-black text-slate-900">{selectedKits.length} Items Selected</p>
        </div>
        <button 
          disabled={!canProceed}
          onClick={onCheckout}
          className={`group rounded-xl px-10 py-5 flex items-center gap-4 transition-all duration-500 cursor-pointer ${
            canProceed 
            ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20 hover:scale-[1.03] active:scale-95' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
          }`}
        >
          <span className="text-[11px] font-black uppercase tracking-[0.3em]">
            {canProceed ? 'Confirm Selection' : 'Complete Selection'}
          </span>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform ${canProceed ? 'bg-white/20 group-hover:translate-x-1' : 'bg-slate-200'}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </button>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setPreviewItem(null)}>
          <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/5 hover:bg-black/10 text-slate-800 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
            >
              <HiOutlineXMark className="text-xl" />
            </button>
            <div className="bg-slate-50 flex items-center justify-center p-12 min-h-[40vh]">
              <img src={previewItem.image} alt={previewItem.title} className="max-h-[60vh] w-auto object-contain drop-shadow-2xl" />
            </div>
            <div className="p-6 bg-white border-t border-slate-100 text-center">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{previewItem.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
