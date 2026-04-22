import { useState } from 'react'
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineHome, HiOutlineMapPin, HiOutlineBuildingOffice } from 'react-icons/hi2'

const InputField = ({ label, icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group transition-all">
      <input 
        {...props}
        className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all placeholder:text-slate-300 font-bold text-slate-700 shadow-sm"
      />
      {icon && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors">
          {icon}
        </div>
      )}
    </div>
  </div>
)

export default function Checkout({ selectedKits, employee, onOrderPlaced }) {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    doorNo: '',
    street: '',
    address: '',
    city: '',
    pincode: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const orderData = {
      employeeDetails: {
        name: employee.name,
        email: formData.email,
        phone: formData.phone
      },
      shippingAddress: {
        doorNo: formData.doorNo,
        street: formData.street,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode
      },
      items: selectedKits.map(k => ({ kitId: k._id, title: k.title }))
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      const data = await res.json()
      if (data.success) {
        onOrderPlaced(data.order)
      }
    } catch (err) {
      alert('Order processing failed. Please verify your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-in fade-in slide-in-from-right-12 duration-1000">
      <div className="lg:col-span-7">
        <div className="flex items-center gap-4 mb-6">
           <div className="w-12 h-[2px] bg-brand-blue" />
           <span className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-blue">Step 03</span>
        </div>
        <h2 className="text-5xl font-extrabold mb-3 tracking-tighter text-slate-900 leading-tight">Checkout</h2>
        <p className="text-slate-500 text-lg font-medium mb-6 max-w-md">Finalize your destination for the premium onboarding collection.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <section className="space-y-6 p-6 bg-slate-50/50 rounded-[28px] border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-6 flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center text-[8px]">01</span>
                Contact Profile
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField 
                  label="Work Email"
                  type="email" required
                  placeholder="Enter Your Email"
                  icon={<HiOutlineEnvelope />}
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                <InputField 
                  label="Primary Phone"
                  type="tel" required
                  placeholder="10-digit number"
                  icon={<HiOutlinePhone />}
                  value={formData.phone}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                    setFormData({ ...formData, phone: val })
                  }}
                />
              </div>
            </section>

            <section className="space-y-6 p-6 bg-slate-50/50 rounded-[28px] border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-6 flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center text-[8px]">02</span>
                Shipping Matrix
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <InputField 
                  label="Door / Block No."
                  type="text" required
                  placeholder="Door / Block No."
                  icon={<HiOutlineHome />}
                  value={formData.doorNo}
                  onChange={e => setFormData({ ...formData, doorNo: e.target.value })}
                />
                <div className="md:col-span-2">
                  <InputField 
                    label="Street / Residency Name"
                    type="text" required
                    placeholder="Street / Residency Name"
                    icon={<HiOutlineMapPin />}
                    value={formData.street}
                    onChange={e => setFormData({ ...formData, street: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Complete Address</label>
                <textarea 
                  required rows="3"
                  placeholder="Full address with landmarks for delivery team..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all resize-none placeholder:text-slate-300 font-bold text-slate-700 shadow-sm"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField 
                  label="City"
                  type="text" required
                  placeholder="City"
                  icon={<HiOutlineBuildingOffice />}
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                />
                <InputField 
                  label="Pincode"
                  type="text" required
                  placeholder="000 000"
                  value={formData.pincode}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setFormData({ ...formData, pincode: val })
                  }}
                />
              </div>
            </section>
          </div>

          <button 
            type="submit" disabled={loading}
            className="cursor-pointer w-full bg-brand-dark hover:bg-brand-orange text-white font-black py-6 rounded-[28px] shadow-2xl hover:shadow-brand-orange/30 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.4em] text-xs mt-8 flex items-center justify-center gap-6 group"
          >
            {loading ? 'Committing Selection...' : 'Place Order'}
          </button>
        </form>
      </div>

      <div className="lg:col-span-5 h-fit sticky top-24">
        <div className="bg-white rounded-[40px] p-8 shadow-premium relative overflow-hidden border border-slate-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <h3 className="text-2xl font-black mb-10 text-slate-900 tracking-tight flex items-center justify-between">
            Your Selection
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">{selectedKits.length} Packs</span>
          </h3>
          
          <div className="space-y-10 mb-12">
            {[
              { id: 'Standard', label: 'Essential Gear', badge: 'Included' },
              { id: 'Choice_A', label: 'Workspace Choice', badge: 'Verified' },
              { id: 'Choice_B', label: 'Carry Choice', badge: 'Verified' }
            ].map(group => {
              const items = selectedKits.filter(k => k.category === group.id)
              if (items.length === 0) return null
              
              return (
                <div key={group.id} className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{group.label}</p>
                    <span className="text-[8px] font-black text-brand-blue uppercase bg-brand-blue/5 px-2 py-0.5 rounded border border-brand-blue/10">{group.badge}</span>
                  </div>
                  {items.map(kit => (
                    <div key={kit._id} className="flex gap-4 items-center group">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 shadow-soft border border-slate-200">
                        <img src={kit.image} className="w-full h-full object-cover group-hover:transition-all duration-700" />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight">
                          {kit.title}
                          {kit.selectedSize && <span className="ml-2 text-brand-blue font-black uppercase text-[10px]">({kit.selectedSize})</span>}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60 line-clamp-1">Confirmed</p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          <div className="pt-8 border-t-2 border-dashed border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Employee Ledger</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400">Assigned To</span>
                <span className="font-black text-slate-900 tracking-tight">{employee.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400">Verified Email</span>
                <span className="font-black text-slate-900 tracking-tight">{employee.email}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400">Status</span>
                <span className="font-black text-brand-blue tracking-tighter uppercase">Authorized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
