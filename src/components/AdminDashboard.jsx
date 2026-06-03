import { useState, useEffect, useRef } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval, getYear, setYear, setMonth, isWithinInterval, startOfDay, endOfDay, isBefore } from 'date-fns'
import {
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineEye,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineMagnifyingGlass,
  HiOutlineCalendar,
  HiOutlineArrowDownTray,
  HiOutlineFunnel,
  HiOutlineInbox,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi2'

const OrderDetailsModal = ({ order, kits, onClose, onUpdateStatus, updateDeliveryStatus, readOnly }) => {
  if (!order) return null
  const statuses = ['Pending', 'Processing', 'Dispatched']
  const timelineStatuses = ['Pending', 'Processing', 'Dispatched', 'Delivered']

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-7xl max-h-[95vh] rounded-[8px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        {/* Header - Fixed */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
          <div>
            <h3 className="text-[10px] font-black text-brand-blue uppercase tracking-[0.4em] mb-1">Order Intelligence Ledger</h3>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">
              Order <span className="text-slate-300">#</span>{order._id.slice(-6).toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-4">
             {!readOnly && (
                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Update Status</p>
                   <select
                     value={order.status}
                     onChange={(e) => onUpdateStatus(order._id, e.target.value, false)}
                     className="bg-white border border-slate-200 text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue cursor-pointer transition-all shadow-sm"
                   >
                     {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                   <select
                     value={order.isDelivered ? "Delivered" : "Not Delivered"}
                     onChange={(e) => updateDeliveryStatus(order._id, e.target.value === "Delivered")}
                     disabled={order.status !== 'Dispatched'}
                     className={`border text-[9px] font-black uppercase tracking-widest rounded-xl px-4 py-2.5 outline-none transition-all shadow-sm ${order.status !== 'Dispatched' ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed opacity-50' : order.isDelivered ? 'bg-emerald-50 border-emerald-200 text-emerald-600 cursor-pointer hover:bg-emerald-100' : 'bg-rose-50 border-rose-100 text-rose-600 cursor-pointer hover:bg-rose-100'}`}
                   >
                     <option value="Not Delivered">Not Delivered</option>
                     <option value="Delivered">Delivered</option>
                   </select>
                </div>
             )}
             <button onClick={onClose} className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-slate-50 text-slate-400 transition-all active:scale-95 group">
               <HiOutlineXMark className="text-2xl group-hover:rotate-90 transition-transform duration-500" />
             </button>
          </div>
        </div>
        
        {/* Main Content - Scrollable if needed but optimized for 1080p */}
        <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Side: Profile, Address & Tracking */}
            <div className="lg:col-span-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Column 1: Profile */}
                <section className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-brand-blue rounded-full" />
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Employee Profile</h4>
                  </div>
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 space-y-5">
                    <div className="flex justify-between items-start">
                       <div className="space-y-0.5">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Identification</p>
                          <p className="text-sm font-black text-slate-900">{order.employeeDetails.name}</p>
                       </div>
                       <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-xs font-black text-brand-blue shadow-sm">
                          {order.employeeDetails.name.charAt(0)}
                       </div>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Digital Address</p>
                      <p className="text-xs font-bold text-slate-600 truncate">{order.employeeDetails.email}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Contact Hash</p>
                      <p className="text-xs font-black text-slate-900">{order.employeeDetails.phone}</p>
                    </div>
                  </div>
                </section>

                {/* Column 2: Address */}
                <section className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-brand-orange rounded-full" />
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Address</h4>
                  </div>
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 space-y-5">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Point of Delivery</p>
                      <p className="text-xs font-black text-slate-900 leading-tight">{order.shippingAddress.doorNo}, {order.shippingAddress.street}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Full Address String</p>
                      <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">{order.shippingAddress.address}</p>
                    </div>
                    <div className={`grid ${order.shippingAddress.pincode === 'Pickup' ? 'grid-cols-1' : 'grid-cols-2'} gap-4 pt-1`}>
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Region</p>
                        <p className="text-xs font-black text-slate-900">{order.shippingAddress.city}</p>
                      </div>
                      {order.shippingAddress.pincode !== 'Pickup' && (
                        <div className="space-y-0.5">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Zipcode</p>
                          <p className="text-xs font-black text-slate-900">{order.shippingAddress.pincode}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>

              {/* Column 1 & 2 Bottom: Logistics Tracking */}
              <section className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-brand-blue rounded-full shadow-[0_0_12px_rgba(30,64,175,0.3)]" />
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Logistics Tracking</h4>
                </div>
                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6">
                  {order.trackingLink ? (
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-brand-blue text-white flex items-center justify-center text-3xl shadow-lg shadow-brand-blue/20">
                          <HiOutlineTruck />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Carrier Link</p>
                          <p className="text-[10px] font-bold text-slate-900 truncate max-w-[200px]">{order.trackingLink.replace(/^https?:\/\//, '')}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const url = order.trackingLink.startsWith('http') ? order.trackingLink : `https://${order.trackingLink}`;
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        className="cursor-pointer bg-brand-blue text-white text-[9px] font-black uppercase tracking-widest px-6 py-4 rounded-xl hover:bg-brand-blue/90 transition-all shadow-md active:scale-95 whitespace-nowrap"
                      >
                        Track Shipment
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-5 py-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-2xl border border-slate-200/50">
                        <HiOutlineTruck />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Awaiting Fulfillment</p>
                        <p className="text-[10px] font-bold text-slate-400 italic">Shipment link will appear once dispatched.</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <section className="lg:col-span-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Verified Inventory</h4>
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{order.items.length} units</span>
              </div>

              {/* Delivery Status Box */}
              <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-500 ${order.isDelivered ? 'bg-emerald-50/50 border-emerald-100 shadow-sm' : 'bg-slate-50/50 border-slate-100'}`}>
                 <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${order.isDelivered ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-200 text-slate-400'}`}>
                       <HiOutlineTruck className="text-xl" />
                    </div>
                    <div>
                       <p className={`text-[10px] font-black uppercase tracking-[0.1em] ${order.isDelivered ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {order.isDelivered ? 'Package Delivered' : 'In-Transit Status'}
                       </p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          {order.isDelivered ? 'Final Destination Reached' : 'Awaiting Final Confirmation'}
                       </p>
                    </div>
                 </div>
                 {order.isDelivered ? (
                    <div className="px-3 py-1.5 bg-emerald-500/10 rounded-lg flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Secured</span>
                    </div>
                 ) : (
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Pending</span>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-3  overflow-y-auto pr-2 scrollbar-hide">
                {order.items.map((item, i) => {
                  const kit = kits?.find(k => k.title === item.title);
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-brand-blue/30 transition-all group">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
                        {kit?.image && <img src={kit.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="text-[9px] font-black text-slate-900 truncate leading-tight">{item.title}</p>
                          {order.isDelivered && (
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" title="Delivered" />
                          )}
                        </div>
                        {item.selectedSize ? (
                          <div className="flex items-center gap-1.5 mt-0.5">
                             <div className="w-1 h-1 rounded-full bg-brand-orange" />
                             <p className="text-[8px] font-black text-brand-orange uppercase tracking-widest">Size {item.selectedSize}</p>
                          </div>
                        ) : (
                          <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest">Standard Size</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Row 2: Horizontal Timeline */}
          <div className="mt-12 pt-6 border-t border-slate-100">
             <div className="flex items-center gap-3 mb-10">
                <div className="w-1 h-5 bg-brand-blue rounded-full" />
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Operational Lifecycle</h4>
             </div>

             <div className="px-10 relative">
                {/* Connector Line */}
                <div className="absolute top-5 left-[calc(10%+20px)] right-[calc(10%+20px)] h-0.5 bg-slate-100 z-0" />
                <div 
                  className="absolute top-5 left-[calc(10%+20px)] h-0.5 bg-brand-blue z-0 transition-all duration-1000" 
                  style={{ 
                    width: order.isDelivered ? '80%' :
                           order.status === 'Pending' ? '0%' : 
                           order.status === 'Processing' ? '26.6%' : '53.3%' 
                  }} 
                />

                <div className="flex justify-between relative z-10">
                   {timelineStatuses.map((s, i) => {
                     const historyItem = order.statusHistory?.find(h => h.status === s);
                     const isCompleted = order.statusHistory?.some(h => h.status === s) || (s === 'Pending') || (s === 'Delivered' && order.isDelivered);
                     const isCurrent = (order.isDelivered && s === 'Delivered') || (!order.isDelivered && order.status === s);
                     
                     let dateText = null;
                     if (s === 'Delivered' && order.isDelivered) {
                       const delHistory = order.statusHistory?.slice().reverse().find(h => h.status === 'Delivered');
                       dateText = delHistory ? format(new Date(delHistory.updatedAt), 'MMM dd • hh:mm aa') : 'Confirmed';
                     } else if (historyItem) {
                       dateText = format(new Date(historyItem.updatedAt), 'MMM dd • hh:mm aa');
                     } else if (s === 'Pending') {
                       dateText = format(new Date(order.createdAt), 'MMM dd • hh:mm aa');
                     }
                     
                     const date = dateText;
                     
                     return (
                       <div key={s} className="flex flex-col items-center flex-1">
                          <div className={`
                            w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500
                            ${isCurrent ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/30 scale-110 ring-4 ring-brand-blue/10' : 
                              isCompleted ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-300'}
                          `}>
                            {isCompleted ? <HiOutlineCheckCircle className="text-xl" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                          </div>
                          <div className="mt-5 text-center">
                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 ${isCompleted ? 'text-slate-900' : 'text-slate-300'}`}>
                              {s}
                            </p>
                            {date ? (
                              <p className="text-[10px] font-bold text-slate-500">{date}</p>
                            ) : (
                              <p className="text-[8px] font-black text-slate-200 uppercase tracking-widest">Pending Action</p>
                            )}
                          </div>
                          {isCurrent && (
                            <div className="mt-3 px-2 py-0.5 bg-brand-blue/10 text-brand-blue rounded text-[7px] font-black animate-pulse uppercase tracking-widest">
                               Active
                            </div>
                          )}
                       </div>
                     )
                   })}
                </div>
             </div>
          </div>
        </div>

        {/* Footer info (Optional, to fill space if needed) */}
        <div className="px-12 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
           <div className="flex items-center gap-4">
              <HiOutlineTruck className="text-slate-400 text-xl" />
              <p className="text-[9px] font-bold text-slate-500">System verified and logged. All status updates are permanent.</p>
           </div>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Updated: {format(new Date(), 'HH:mm')}</p>
        </div>
      </div>
    </div>
  )
}

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message, status }) => {
  const [trackingLink, setTrackingLink] = useState('')
  
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm({ trackingLink })
    setTrackingLink('') // Reset for next time
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-300 border border-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-6 mx-auto ring-8 ring-brand-orange/5">
          <HiOutlineTruck className="text-3xl" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 text-center mb-2 tracking-tight">Confirm Dispatch?</h3>
        <p className="text-slate-500 text-[11px] text-center font-medium leading-relaxed mb-6 px-4">{message}</p>
        
        {status === 'Dispatched' && (
          <div className="mb-8 space-y-2 animate-in slide-in-from-top-2 duration-500">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Courier Tracking Link</label>
            <input 
              type="text" 
              placeholder="https://track.courier.com/..." 
              value={trackingLink}
              onChange={(e) => setTrackingLink(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[11px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">Cancel</button>
          <button onClick={handleConfirm} className="flex-1 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-brand-orange transition-all shadow-lg hover:shadow-brand-orange/30 active:scale-95">Confirm</button>
        </div>
      </div>
    </div>
  )
}

const RangeDatePicker = ({ isOpen, range, onSelect, onClose }) => {
  const [viewDate, setViewDate] = useState(new Date())
  const calendarRef = useRef(null)
  useEffect(() => {
    function handleClick(e) { if (calendarRef.current && !calendarRef.current.contains(e.target)) onClose() }
    if (isOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])
  if (!isOpen) return null
  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(monthStart)
  const days = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) })
  const handleDateClick = (date) => {
    if (!range.from || (range.from && range.to)) { onSelect({ from: date, to: null }) } else { if (isBefore(date, range.from)) { onSelect({ from: date, to: range.from }) } else { onSelect({ ...range, to: date }) } }
  }
  return (
    <div ref={calendarRef} className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-2xl border border-slate-100 p-6 z-[60] animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-6"><button onClick={() => setViewDate(subMonths(viewDate, 1))} className="p-2 hover:bg-slate-100 rounded-lg"><HiOutlineChevronLeft /></button><p className="text-[10px] font-black uppercase tracking-widest text-slate-900">{format(viewDate, 'MMMM yyyy')}</p><button onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-2 hover:bg-slate-100 rounded-lg"><HiOutlineChevronRight /></button></div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`${d}-${i}`} className="text-center text-[9px] font-black text-slate-300 py-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{days.map((date, i) => {
        const isSelected = (range.from && isSameDay(date, range.from)) || (range.to && isSameDay(date, range.to))
        const isInRange = range.from && range.to && isWithinInterval(date, { start: startOfDay(range.from), end: endOfDay(range.to) })
        return (<button key={i} onClick={() => handleDateClick(date)} className={`h-9 w-9 text-[10px] font-bold rounded-lg transition-all ${isSelected ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : ''} ${isInRange && !isSelected ? 'bg-brand-blue/10 text-brand-blue' : ''} ${!isSelected && !isInRange && isSameMonth(date, monthStart) ? 'text-slate-700 hover:bg-slate-50' : ''} ${!isSameMonth(date, monthStart) ? 'text-slate-200' : ''}`} >{format(date, 'd')}</button>)
      })}</div>
      {(range.from || range.to) && (<button onClick={() => onSelect({ from: null, to: null })} className="w-full mt-4 py-2 text-[9px] font-black text-brand-orange uppercase tracking-widest hover:bg-orange-50 rounded-lg transition-all text-center">Reset Selection</button>)}
    </div>
  )
}

const InventoryView = ({ inventory, setInventory, readOnly }) => {
  const [localEdits, setLocalEdits] = useState({});
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToastMessage = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  useEffect(() => {
    const edits = {};
    inventory.forEach(item => {
      edits[item._id] = { quantity: item.quantity, sizes: { ...item.sizes } };
    });
    setLocalEdits(edits);
  }, [inventory]);

  const handleEdit = (id, field, value) => {
    setLocalEdits(prev => {
      const current = prev[id] || {};
      if (field === 'quantity') {
        return { ...prev, [id]: { ...current, quantity: value } };
      } else {
        return { ...prev, [id]: { ...current, sizes: { ...current.sizes, [field]: value } } };
      }
    });
  };

  const saveQuantity = async (id) => {
    if (readOnly) return;
    try {
      const editData = localEdits[id];
      const itemToUpdate = inventory.find(i => i._id === id);
      const payload = itemToUpdate.hasSizes 
        ? { sizes: { S: Number(editData.sizes.S), M: Number(editData.sizes.M), L: Number(editData.sizes.L), XL: Number(editData.sizes.XL), XXL: Number(editData.sizes.XXL) } }
        : { quantity: Number(editData.quantity) };
        
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/inventory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setInventory(inventory.map(item => item._id === id ? data.item : item));
        showToastMessage('Inventory updated successfully!');
      }
    } catch (err) {
      showToastMessage('Failed to update inventory');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.03)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-10 right-10 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <HiOutlineCheckCircle className="text-emerald-400 text-xl" />
            <span className="text-sm font-bold tracking-wide">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="p-8 border-b border-slate-50 bg-slate-50/30">
        <h3 className="text-lg font-black text-slate-900 tracking-tight">Current Inventory</h3>
        <p className="text-[11px] font-bold text-slate-500 mt-1">Manage and track available stock for fixed products.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Product Name</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Available Quantity</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {inventory.map((item) => {
              const editData = localEdits[item._id] || { quantity: 0, sizes: {} };
              return item.hasSizes ? (
                    <>
                      {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                        <tr key={`${item._id}-${size}`} className="hover:bg-slate-50/30 transition-colors group">
                          <td className="px-8 py-5 border-t border-slate-50">
                            <span className="text-xs font-bold text-slate-700">{item.itemName} - Size {size}</span>
                          </td>
                          <td className="px-8 py-5 border-t border-slate-50">
                            {readOnly ? (
                              <span className="text-xs font-bold text-slate-700">{item.sizes?.[size] || 0} units</span>
                            ) : (
                              <input 
                                type="number" 
                                value={editData.sizes?.[size] ?? (item.sizes?.[size] || 0)} 
                                onChange={(e) => handleEdit(item._id, size, e.target.value)}
                                className="w-20 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all text-center"
                              />
                            )}
                          </td>
                          <td className="px-8 py-5 text-right border-t border-slate-50">
                            {!readOnly ? (
                              <button 
                                onClick={() => saveQuantity(item._id)}
                                className="bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                              >
                                Save
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">View Only</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr key={item._id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-slate-700">{item.itemName}</span>
                      </td>
                      <td className="px-8 py-5">
                        {readOnly ? (
                          <span className={`text-sm font-black ${item.quantity > 10 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {item.quantity} units
                          </span>
                        ) : (
                          <input 
                            type="number" 
                            value={editData.quantity ?? item.quantity} 
                            onChange={(e) => handleEdit(item._id, 'quantity', e.target.value)}
                            className="w-20 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all text-center"
                          />
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        {!readOnly ? (
                          <button 
                            onClick={() => saveQuantity(item._id)}
                            className="bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                          >
                            Save
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">View Only</span>
                        )}
                      </td>
                    </tr>
                  );
            })}
            {inventory.length === 0 && (
              <tr>
                <td colSpan="3" className="px-8 py-12 text-center text-slate-400 text-[11px] font-bold uppercase tracking-widest">No inventory items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function AdminDashboard({ onLogout, readOnly = false }) {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([])
  const [employees, setEmployees] = useState([])
  const [kits, setKits] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [confirmingAction, setConfirmingAction] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const location = useLocation()

  const isEmployeesView = location.pathname.includes('/employees')
  const isInventoryView = location.pathname.includes('/inventory')

  useEffect(() => {
    setCurrentPage(1)
  }, [isEmployeesView, isInventoryView, statusFilter, searchQuery, dateRange, itemsPerPage])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/kits`)
      .then(res => res.json())
      .then(data => setKits(data))
      .catch(err => console.error("Failed to load kits", err))
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/orders`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/employees`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/inventory`).then(res => res.json().catch(() => []))
    ]).then(([ordersData, employeesData, inventoryData]) => {
      setOrders(ordersData)
      setEmployees(employeesData)
      setInventory(Array.isArray(inventoryData) ? inventoryData : [])
      setLoading(false)
    }).catch(err => {
      console.error("Failed to load data", err)
      setLoading(false)
    })
  }, [isEmployeesView, isInventoryView])

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' ? true : 
                         statusFilter === 'Delivered' ? order.isDelivered :
                         order.status === statusFilter
    const matchesSearch =
      order.employeeDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.employeeDetails.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase())
    let matchesDate = true
    if (dateRange.from) {
      const orderDate = new Date(order.createdAt)
      const start = startOfDay(dateRange.from)
      const end = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from)
      matchesDate = isWithinInterval(orderDate, { start, end })
    }
    return matchesStatus && matchesSearch && matchesDate
  })

  const filteredEmployees = (() => {
    const orderedEmails = [...new Set(orders.map(o => o.employeeDetails.email.toLowerCase()))]
    const employeesWhoOrdered = orderedEmails.map(email => {
      const emp = employees.find(e => e.email.toLowerCase() === email)
      if (emp) return emp
      const order = orders.find(o => o.employeeDetails.email.toLowerCase() === email)
      return {
        _id: `virtual-${email}`,
        name: order.employeeDetails.name,
        email: order.employeeDetails.email,
        company: 'Tiger Analytics',
        dob: null,
        doorNo: order.shippingAddress.doorNo,
        street: order.shippingAddress.street,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        pincode: order.shippingAddress.pincode
      }
    })
    return employeesWhoOrdered.filter(emp =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })()

  const currentData = isEmployeesView ? filteredEmployees : filteredOrders
  const totalPages = Math.ceil(currentData.length / itemsPerPage)
  const paginatedData = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const updateStatus = async (orderId, newStatus, skipConfirm = false, trackingLink = null) => {
    if (readOnly) return
    if (!skipConfirm && (newStatus === 'Dispatched' || newStatus === 'Delivered')) {
      setConfirmingAction({ id: orderId, status: newStatus })
      return
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          ...(trackingLink && { trackingLink })
        })
      })
      const data = await res.json()
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus, statusHistory: data.order.statusHistory, trackingLink: data.order.trackingLink } : o))
        if (selectedOrder && selectedOrder._id === orderId) { setSelectedOrder({ ...selectedOrder, status: newStatus, statusHistory: data.order.statusHistory, trackingLink: data.order.trackingLink }) }
        setConfirmingAction(null)
      }
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const updateDeliveryStatus = async (orderId, isDelivered) => {
    if (readOnly) return
    const order = orders.find(o => o._id === orderId)
    if (order && order.status !== 'Dispatched') {
      alert('Delivery status can only be updated after the order has been Dispatched.')
      return
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDelivered })
      })
      const data = await res.json()
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, isDelivered } : o))
        if (selectedOrder && selectedOrder._id === orderId) { setSelectedOrder({ ...selectedOrder, isDelivered }) }
      }
    } catch (err) {
      alert('Failed to update delivery status')
    }
  }

  const exportCSV = () => {
    let headers, rows, filename
    if (isEmployeesView) {
      headers = ['Name', 'Email', 'DOB', 'Company']
      rows = filteredEmployees.map(e => [e.name, e.email, e.dob, e.company])
      filename = `employees_export_${format(new Date(), 'yyyy-MM-dd')}.csv`
    } else {
      headers = ['OrderID', 'Name', 'Email', 'Status', 'Address', 'City', 'Pincode', 'Items', 'CreatedAt']
      rows = filteredOrders.map(o => [o._id, o.employeeDetails.name, o.employeeDetails.email, o.status, `"${o.shippingAddress.address}"`, o.shippingAddress.city, o.shippingAddress.pincode, `"${o.items.map(it => it.title).join(', ')}"`, new Date(o.createdAt).toLocaleDateString()])
      filename = `orders_export_${statusFilter.toLowerCase()}_${format(new Date(), 'yyyy-MM-dd')}.csv`
    }

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a"); const url = URL.createObjectURL(blob); link.setAttribute("href", url); link.setAttribute("download", filename); link.style.visibility = 'hidden'; document.body.appendChild(link); link.click(); document.body.removeChild(link);
  }

  const basePath = '/admin'

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans overflow-hidden">
      <OrderDetailsModal 
        order={selectedOrder} 
        kits={kits} 
        onClose={() => setSelectedOrder(null)} 
        onUpdateStatus={updateStatus} 
        updateDeliveryStatus={updateDeliveryStatus}
        readOnly={readOnly} 
      />
      <ConfirmationModal 
        isOpen={!!confirmingAction} 
        status={confirmingAction?.status}
        message={`Are you sure you want to mark this bundle as ${confirmingAction?.status}? This will trigger the employee tracking notification.`} 
        onConfirm={(data) => updateStatus(confirmingAction.id, confirmingAction.status, true, data.trackingLink)} 
        onCancel={() => setConfirmingAction(null)} 
      />

      {/* Modern Sidebar */}
      <aside className="w-64 bg-[#0f172a] h-full flex flex-col relative z-20 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.1)]">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-blue rounded-full blur-[120px]" />
          <div className="absolute bottom-24 right-0 w-48 h-48 bg-brand-orange rounded-full blur-[100px]" />
        </div>

        <div className="relative h-full flex flex-col z-10">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-full w-full  flex items-center justify-center ">
                 <img src="/tiger.svg" alt="" className="invert" />
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { to: basePath, label: 'Manage Orders', icon: <HiOutlineShoppingBag />, end: true },
                { to: `${basePath}/employees`, label: 'Employees List', icon: <HiOutlineUsers /> },
                { to: `${basePath}/inventory`, label: 'Inventory Management', icon: <HiOutlineInbox /> }
              ].map(item => (
                <NavLink 
                  key={item.to} 
                  to={item.to} 
                  end={item.end} 
                  className={({ isActive }) => `
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 group relative
                    ${isActive ? 'bg-gradient-to-r from-brand-blue to-blue-600 text-white shadow-lg shadow-brand-blue/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <span className={`text-lg transition-transform group-hover:scale-110 duration-300 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                        {item.icon}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                      {isActive && <div className="absolute right-3 w-1 h-1 rounded-full bg-white animate-pulse" />}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-6">
            <button 
              onClick={onLogout} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all group border border-transparent hover:border-red-500/20 cursor-pointer"
            >
              <HiOutlineArrowLeftOnRectangle className="text-lg group-hover:-translate-x-1 transition-transform" />
              <span className="text-[9px] font-black uppercase tracking-widest">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Dynamic Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-10 relative z-30">
          <div className="flex items-center gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
            
            <div>
              <p className="text-xl font-black text-slate-900 tracking-tight">
                {isEmployeesView ? 'User Directory' : isInventoryView ? 'Inventory Management' : 'Admin Dashboard'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col items-end">
               <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-1 opacity-60">powered by</span>
               <img src="/printone-logo.png" alt="Printone" className="h-5" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 shadow-inner">
              {readOnly ? 'TA' : 'AD'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          <div className="max-w-[1700px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Routes>
              <Route path="/inventory" element={<InventoryView inventory={inventory} setInventory={setInventory} readOnly={readOnly} />} />
              <Route path="*" element={
                <>
                  {/* Premium Stat Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-0">
                    {!isEmployeesView ? (
                      <>
                        <StatCard 
                          label="Total Orders" 
                          val={orders.length} 
                          icon={<HiOutlineShoppingBag />} 
                          color="blue" 
                          onClick={() => setStatusFilter('All')}
                          active={statusFilter === 'All'}
                        />
                        <StatCard 
                          label="Pending Orders" 
                          val={orders.filter(o => o.status === 'Pending').length} 
                          icon={<HiOutlineCalendar />} 
                          color="orange" 
                          onClick={() => setStatusFilter('Pending')}
                          active={statusFilter === 'Pending'}
                        />
                        <StatCard 
                          label="Live Dispatched" 
                          val={orders.filter(o => o.status === 'Dispatched').length} 
                          icon={<HiOutlineTruck />} 
                          color="green" 
                          onClick={() => setStatusFilter('Dispatched')}
                          active={statusFilter === 'Dispatched'}
                        />
                        <StatCard 
                          label="Delivered Orders" 
                          val={orders.filter(o => o.isDelivered).length} 
                          icon={<HiOutlineCheckCircle />} 
                          color="purple" 
                          onClick={() => setStatusFilter('Delivered')}
                          active={statusFilter === 'Delivered'}
                        />
                      </>
                    ) : (
                      <div className='p-0 m-0'></div>
                      // <StatCard label="Total Authorized Personnel" val={employees.length} icon={<HiOutlineUsers />} color="blue" full />
                    )}
                  </div>                  <div className="mt-4 bg-white rounded-xl border border-slate-100 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.03)] overflow-visible relative">
                    {/* Table Filters */}
                    <div className="px-8 py-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-6 bg-slate-50/30">
                      <div className="flex flex-wrap items-center gap-4 flex-1 min-w-[300px]">
                        <div className="relative flex-1 max-w-sm group">
                          <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-brand-blue transition-colors" />
                          <input 
                            type="text" 
                            placeholder={isEmployeesView ? "Search personnel..." : "Locate order..."} 
                            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-[11px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all shadow-sm" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                          />
                        </div>

                        {!isEmployeesView && (
                          <div className="flex items-center gap-3">
                            <div className="relative group">
                              <select 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)} 
                                className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-[9px] font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-4 focus:ring-brand-blue/10 appearance-none cursor-pointer pr-10 shadow-sm"
                                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '0.8rem' }}
                              >
                                <option value="All">All</option>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Dispatched">Dispatched</option>
                              </select>
                            </div>
                            <div className="relative">
                              <button 
                                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} 
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all cursor-pointer shadow-sm ${dateRange.from ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                              >
                                <HiOutlineCalendar className="text-lg" />
                                <span className="text-[9px] font-black uppercase tracking-widest">
                                  {dateRange.from ? `${format(dateRange.from, 'dd MMM')} ${dateRange.to ? `- ${format(dateRange.to, 'dd MMM')}` : ''}` : 'Timeframe'}
                                </span>
                              </button>
                              <RangeDatePicker isOpen={isDatePickerOpen} range={dateRange} onSelect={setDateRange} onClose={() => setIsDatePickerOpen(false)} />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {isEmployeesView && (
                          <div className="hidden sm:flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                             <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Count</span>
                             <div className="h-4 w-[1px] bg-slate-100 mx-1" />
                             <span className="text-sm font-black text-slate-900 tracking-tight">{filteredEmployees.length}</span>
                          </div>
                        )}
                        <button 
                          onClick={exportCSV} 
                          className="flex items-center gap-3 px-6 py-3 bg-[#0f172a] hover:bg-brand-blue text-white rounded-xl transition-all shadow-lg shadow-slate-900/10 active:scale-95 group"
                        >
                          <HiOutlineArrowDownTray className="text-lg group-hover:translate-y-0.5 transition-transform" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Export Data</span>
                        </button>
                      </div>
                    </div>                    {/* Table View */}
                    {loading ? (
                      <div className="py-24 flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-2 border-slate-100 border-t-brand-blue rounded-full animate-spin" />
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Updating Ledger...</p>
                      </div>
                    ) : currentData.length === 0 ? (
                      <div className="py-24 flex flex-col items-center justify-center gap-4 text-slate-200">
                        <HiOutlineInbox className="text-4xl text-slate-200" />
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No matching records</p>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="text-[8px] text-slate-400 font-black uppercase tracking-[0.3em] border-b border-slate-50">
                                {isEmployeesView ? (
                                  <>
                                    <th className="px-8 py-5">Identification</th>
                                    <th className="px-8 py-5">Email</th>
                                    <th className="px-8 py-5">Residential Address</th>
                                    <th className="px-8 py-5 text-right">Affiliation</th>
                                  </>
                                ) : (
                                  <>
                                    <th className="px-8 py-5">Profile</th>
                                    <th className="px-8 py-5">Items</th>
                                    <th className="px-8 py-5">Address</th>
                                    <th className="px-8 py-5 text-left">Action</th>
                                    <th className="px-8 py-5 text-right">Date</th>
                                  </>
                                )}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {isEmployeesView ? paginatedData.map((emp, idx) => (
                                <tr key={emp._id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                                  <td className="px-8 py-4">
                                     <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:bg-brand-blue group-hover:text-white transition-all">
                                         {emp.name.charAt(0)}
                                       </div>
                                       <p className="font-extrabold text-slate-900 text-xs tracking-tight">{emp.name}</p>
                                     </div>
                                  </td>
                                  <td className="px-8 py-4">
                                    <span className="font-bold text-[10px]">
                                      {emp.email}
                                    </span>
                                  </td>
                                  <td className="px-8 py-4">
                                    <div className="flex flex-col gap-0.5 text-slate-500">
                                      <span className="text-[10px] font-bold leading-tight">{emp.doorNo}, {emp.street}</span>
                                      <span className="text-[9px] font-medium opacity-70 leading-tight">{emp.address}</span>
                                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{emp.city} - {emp.pincode}</span>
                                    </div>
                                  </td>
                                  <td className="px-8 py-4 text-right">
                                    <span className="px-3 py-1.5 bg-brand-blue/5 text-brand-blue rounded-lg text-[8px] font-black uppercase tracking-widest border border-brand-blue/10">
                                      {emp.company}
                                    </span>
                                  </td>
                                </tr>
                              )) : paginatedData.map((order, idx) => (
                                <tr key={order._id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                                  <td className="px-8 py-4">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:bg-brand-blue group-hover:text-white transition-all">
                                         {order.employeeDetails.name.charAt(0)}
                                       </div>
                                       <div>
                                         <p className="font-extrabold text-slate-900 text-xs tracking-tight">{order.employeeDetails.name}</p>
                                         <p className="text-[10px] font-black text-gray-500">{order.employeeDetails.email}</p>
                                       </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-4">
                                    <div className="flex flex-wrap gap-1.5">
                                      {order.items.slice(0, 1).map((it, i) => (
                                        <span key={i} className="px-2 py-1 bg-white border border-slate-100 rounded-md text-[8px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
                                          {it.title}
                                          {it.selectedSize && <span className="ml-1 text-brand-orange">({it.selectedSize})</span>}
                                        </span>
                                      ))}
                                      {order.items.length > 1 && (
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest self-center">
                                          +{order.items.length - 1}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-8 py-4">
                                    <div className="max-w-[180px]">
                                      <p className="text-[10px] font-bold text-slate-800 leading-none mb-0.5">{order.shippingAddress.city}</p>
                                      <p className="text-[8px] text-slate-400 line-clamp-1 font-medium">{order.shippingAddress.address}</p>
                                    </div>
                                  </td>
                                  <td className="px-8 py-4">
                                    <div className="flex items-center justify-start gap-3">
                                      <button 
                                        onClick={() => setSelectedOrder(order)} 
                                        className="w-9 h-9 bg-white hover:bg-brand-blue text-slate-400 hover:text-white rounded-lg transition-all shadow-sm border border-slate-100 flex items-center justify-center" 
                                        title="Inspect Details"
                                      >
                                        <HiOutlineEye className="text-lg" />
                                      </button>
                                      {!readOnly && (
                                          <div className="flex items-center gap-2">
                                            <select
                                              value={order.status}
                                              onChange={(e) => updateStatus(order._id, e.target.value)}
                                              className="bg-white border border-slate-200 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-lg px-2 py-2 outline-none focus:border-brand-blue cursor-pointer shadow-sm"
                                            >
                                              <option value="Pending">Pending</option>
                                              <option value="Processing">Processing</option>
                                              <option value="Dispatched">Dispatched</option>
                                            </select>
                                            <select
                                              value={order.isDelivered ? "Delivered" : "Not Delivered"}
                                              onChange={(e) => updateDeliveryStatus(order._id, e.target.value === "Delivered")}
                                              disabled={order.status !== 'Dispatched'}
                                              className={`border text-[9px] font-black uppercase tracking-widest rounded-lg px-2 py-2 outline-none shadow-sm transition-all ${order.status !== 'Dispatched' ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed opacity-50' : order.isDelivered ? 'bg-emerald-50 border-emerald-200 text-emerald-600 cursor-pointer hover:bg-emerald-100' : 'bg-rose-50 border-rose-200 text-rose-600 cursor-pointer hover:bg-rose-100'}`}
                                            >
                                              <option value="Not Delivered">Not Delivered</option>
                                              <option value="Delivered">Delivered</option>
                                            </select>
                                          </div>
                                      )}
                                      {readOnly && (
                                        <div className="flex flex-col items-center gap-1.5">
                                          <span className="px-2 py-1 bg-brand-blue/5 text-brand-blue rounded border border-brand-blue/10 text-[9px] font-black uppercase tracking-widest min-w-[80px] text-center">
                                            {order.status}
                                          </span>
                                          <span className={`px-2 py-1 rounded border text-[7px] font-black uppercase tracking-widest min-w-[80px] text-center ${order.isDelivered ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                                            {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-8 py-4 text-right">
                                    <div className="flex flex-col items-end gap-1">
                                      <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">
                                        {format(new Date(order.createdAt), 'MMM dd, yyyy • hh:mm aa')}
                                      </p>
                                      {order.isDelivered && (
                                        <div className="flex items-center gap-1.5 text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mt-1">
                                          Delivered: {
                                            order.statusHistory?.find(h => h.status === 'Delivered') 
                                              ? format(new Date(order.statusHistory.find(h => h.status === 'Delivered').updatedAt), 'MMM dd • hh:mm aa')
                                              : 'Confirmed'
                                          }
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="px-8 py-4 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4 bg-white">
                          <div className="flex items-center gap-6">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, currentData.length)} of {currentData.length} records
                            </p>
                            <div className="h-4 w-[1px] bg-slate-100" />
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Display</span>
                              <select 
                                value={itemsPerPage} 
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-600 outline-none focus:ring-2 focus:ring-brand-blue/10 cursor-pointer transition-all"
                              >
                                {[5, 10, 20, 50].map(val => (
                                  <option key={val} value={val}>{val} per page</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button 
                              disabled={currentPage === 1}
                              onClick={() => setCurrentPage(prev => prev - 1)}
                              className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                              <HiOutlineChevronLeft className="text-sm" />
                            </button>
                            <div className="flex items-center gap-1">
                              {[...Array(totalPages)].map((_, i) => {
                                const page = i + 1
                                // Show first, last, and pages around current
                                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                  return (
                                    <button 
                                      key={page}
                                      onClick={() => setCurrentPage(page)}
                                      className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === page ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20' : 'text-slate-400 hover:bg-slate-50'}`}
                                    >
                                      {page}
                                    </button>
                                  )
                                } else if (page === currentPage - 2 || page === currentPage + 2) {
                                  return <span key={page} className="text-slate-200 px-1 text-[10px]">...</span>
                                }
                                return null
                              })}
                            </div>
                            <button 
                              disabled={currentPage === totalPages}
                              onClick={() => setCurrentPage(prev => prev + 1)}
                              className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                              <HiOutlineChevronRight className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </>
                    )
                  }  </div>
                </>
              } />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, val, icon, color, full, onClick, active }) {
  const themes = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', progress: 'bg-blue-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', progress: 'bg-orange-600' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', progress: 'bg-emerald-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', progress: 'bg-purple-600' }
  }
  
  const theme = themes[color]
  
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-5 rounded-xl border transition-all duration-500 group relative overflow-hidden ${onClick ? 'cursor-pointer' : 'cursor-default'} ${
        active 
        ? 'border-brand-blue shadow-lg ring-4 ring-brand-blue/5 scale-[1.02] z-10' 
        : 'border-slate-100 shadow-sm hover:shadow-md'
      } ${full ? 'col-span-full' : ''}`}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl ${theme.bg} ${theme.text} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500 border ${theme.border}`}>
          {icon}
        </div>
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">{label}</p>
          <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{val}</p>
        </div>
      </div>
      <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden relative z-10">
         <div className={`h-full ${theme.progress} ${active ? 'opacity-40' : 'opacity-20'} w-2/3 rounded-full transition-all duration-500`} />
      </div>
      {active && (
        <div className={`absolute top-0 right-0 w-24 h-24 ${theme.bg} opacity-10 rounded-full -mr-8 -mt-8 blur-2xl`} />
      )}
    </div>
  )
}
