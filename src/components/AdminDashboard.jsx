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
  HiOutlineInbox
} from 'react-icons/hi2'

const OrderDetailsModal = ({ order, onClose, onUpdateStatus, readOnly }) => {
  if (!order) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[10px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">{readOnly ? 'Secure View Mode' : 'Detailed Ledger View'}</h3>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">Order #{order._id.slice(-6).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-slate-200 text-slate-400 transition-colors"><HiOutlineXMark className="text-2xl" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-10">
              <section>
                <h4 className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-6">Employee Profile</h4>
                <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between"><span className="text-xs font-bold text-slate-400">Full Name</span><span className="text-xs font-black text-slate-900">{order.employeeDetails.name}</span></div>
                  <div className="flex justify-between"><span className="text-xs font-bold text-slate-400">Employee ID</span><span className="text-xs font-black text-slate-900 font-mono tracking-widest">{order.employeeDetails.employeeId}</span></div>
                  <div className="flex justify-between"><span className="text-xs font-bold text-slate-400">Work Email</span><span className="text-xs font-black text-slate-900">{order.employeeDetails.email}</span></div>
                  <div className="flex justify-between"><span className="text-xs font-bold text-slate-400">Contact</span><span className="text-xs font-black text-slate-900">{order.employeeDetails.phone}</span></div>
                </div>
              </section>
              <section>
                <h4 className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-6">Asset Bundle Selection</h4>
                <div className="grid grid-cols-2 gap-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                      <p className="text-[10px] font-black text-slate-900 tracking-tight leading-tight">
                        {item.title}
                        {item.selectedSize && <span className="ml-2 text-brand-orange">({item.selectedSize})</span>}
                      </p>
                      <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Verified Kit {item.selectedSize ? `• Size ${item.selectedSize}` : ''}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <div className="space-y-10">
              <section>
                <h4 className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-6">Logistics Hub Details</h4>
                <div className="bg-slate-50 rounded-lg p-8 space-y-6">
                  <div className="space-y-1"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Street Address</p><p className="text-sm font-bold text-slate-900 leading-relaxed">{order.shippingAddress.doorNo}, {order.shippingAddress.street}</p></div>
                  <div className="space-y-1"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Full Address Ledger</p><p className="text-xs font-medium text-slate-900 leading-relaxed italic">{order.shippingAddress.address}</p></div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                    <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">City</p><p className="text-xs font-black text-slate-900">{order.shippingAddress.city}</p></div>
                    <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pincode</p><p className="text-xs font-black text-slate-900">{order.shippingAddress.pincode}</p></div>
                  </div>
                </div>
              </section>
              <section>
                <h4 className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-6">Workflow Status</h4>
                <div className={`p-6 rounded-lg border ${order.status === 'Dispatched' ? 'bg-green-50 border-green-100' : 'bg-brand-blue/5 border-brand-blue/10'} flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${order.status === 'Dispatched' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'}`}>{order.status === 'Dispatched' ? <HiOutlineCheckCircle className="text-xl" /> : <HiOutlineTruck className="text-xl" />}</div>
                    <div><p className={`text-[10px] font-black uppercase tracking-widest ${order.status === 'Dispatched' ? 'text-green-600' : 'text-brand-blue'}`}>{order.status}</p><p className="text-[9px] font-bold text-slate-400">System Recorded</p></div>
                  </div>
                  {order.status !== 'Dispatched' && !readOnly && (
                    <button onClick={() => onUpdateStatus(order._id, 'Dispatched', false)} className="px-6 py-3 bg-slate-900 hover:bg-brand-orange text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg hover:shadow-brand-orange/30 active:scale-95" >Ship Order</button>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-lg p-8 shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-6 mx-auto"><HiOutlineTruck className="text-3xl" /></div>
        <h3 className="text-xl font-extrabold text-slate-900 text-center mb-2 tracking-tight">Confirm Dispatch?</h3>
        <p className="text-slate-500 text-xs text-center font-medium leading-relaxed mb-8 px-4">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-6 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-6 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-brand-orange transition-all shadow-lg hover:shadow-brand-orange/30">Confirm</button>
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
      <div className="grid grid-cols-7 gap-1 mb-2">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center text-[9px] font-black text-slate-300 py-2">{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-1">{days.map((date, i) => {
        const isSelected = (range.from && isSameDay(date, range.from)) || (range.to && isSameDay(date, range.to))
        const isInRange = range.from && range.to && isWithinInterval(date, { start: startOfDay(range.from), end: endOfDay(range.to) })
        return (<button key={i} onClick={() => handleDateClick(date)} className={`h-9 w-9 text-[10px] font-bold rounded-lg transition-all ${isSelected ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : ''} ${isInRange && !isSelected ? 'bg-brand-blue/10 text-brand-blue' : ''} ${!isSelected && !isInRange && isSameMonth(date, monthStart) ? 'text-slate-700 hover:bg-slate-50' : ''} ${!isSameMonth(date, monthStart) ? 'text-slate-200' : ''}`} >{format(date, 'd')}</button>)
      })}</div>
      {(range.from || range.to) && (<button onClick={() => onSelect({ from: null, to: null })} className="w-full mt-4 py-2 text-[9px] font-black text-brand-orange uppercase tracking-widest hover:bg-orange-50 rounded-lg transition-all text-center">Reset Selection</button>)}
    </div>
  )
}

const HiOutlineChevronLeft = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
const HiOutlineChevronRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>

export default function AdminDashboard({ onLogout, readOnly = false }) {
  const [orders, setOrders] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [confirmingAction, setConfirmingAction] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const location = useLocation()

  const isEmployeesView = location.pathname.includes('/employees')

  useEffect(() => {
    setLoading(true)
    const endpoint = isEmployeesView ? 'employees' : 'orders'
    fetch(`${import.meta.env.VITE_API_URL}/api/${endpoint}`)
      .then(res => res.json())
      .then(data => {
        if (isEmployeesView) setEmployees(data)
        else setOrders(data)
        setLoading(false)
      })
  }, [isEmployeesView])

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' ? true : order.status === statusFilter
    const matchesSearch =
      order.employeeDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.employeeDetails.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const updateStatus = async (orderId, newStatus, skipConfirm = false) => {
    if (readOnly) return
    if (!skipConfirm && newStatus === 'Dispatched') {
      setConfirmingAction({ id: orderId, status: newStatus })
      return
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await res.json()
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
        if (selectedOrder && selectedOrder._id === orderId) { setSelectedOrder({ ...selectedOrder, status: newStatus }) }
        setConfirmingAction(null)
      }
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const exportCSV = () => {
    let headers, rows, filename
    if (isEmployeesView) {
      headers = ['Name', 'EmployeeID', 'DOB', 'Company']
      rows = filteredEmployees.map(e => [e.name, e.employeeId, e.dob, e.company])
      filename = `employees_export_${format(new Date(), 'yyyy-MM-dd')}.csv`
    } else {
      headers = ['OrderID', 'Name', 'EmployeeID', 'Status', 'Address', 'City', 'Pincode', 'Items', 'CreatedAt']
      rows = filteredOrders.map(o => [o._id, o.employeeDetails.name, o.employeeDetails.employeeId, o.status, `"${o.shippingAddress.address}"`, o.shippingAddress.city, o.shippingAddress.pincode, `"${o.items.map(it => it.title).join(', ')}"`, new Date(o.createdAt).toLocaleDateString()])
      filename = `orders_export_${statusFilter.toLowerCase()}_${format(new Date(), 'yyyy-MM-dd')}.csv`
    }

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a"); const url = URL.createObjectURL(blob); link.setAttribute("href", url); link.setAttribute("download", filename); link.style.visibility = 'hidden'; document.body.appendChild(link); link.click(); document.body.removeChild(link);
  }

  const basePath = '/admin'

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden">
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdateStatus={updateStatus} readOnly={readOnly} />
      <ConfirmationModal isOpen={!!confirmingAction} message="Are you sure you want to mark this bundle as dispatched? This will trigger the employee tracking notification." onConfirm={() => updateStatus(confirmingAction.id, confirmingAction.status, true)} onCancel={() => setConfirmingAction(null)} />

      <aside className="w-72 bg-slate-900 h-full flex flex-col border-r border-slate-800 shadow-2xl relative z-20">
        <div className="p-8 pb-12">
          <div className="mb-12"><div className="flex items-center gap-4 mb-8"><img src="/tiger.svg" alt="Tiger Analytics" className="h-8 brightness-0 invert" /><div className="h-6 w-[1px] bg-slate-700" /><img src="/printone-logo.png" alt="Printone" className="h-7" /></div></div>
          <nav className="space-y-2">
            {[
              { to: basePath, label: 'Orders', icon: <HiOutlineShoppingBag />, end: true },
              { to: `${basePath}/employees`, label: 'Employees', icon: <HiOutlineUsers /> }
            ].map(item => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `w-full flex items-center gap-4 px-5 py-4 rounded-lg transition-all duration-300 group ${isActive ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`} >
                {({ isActive }) => (<><span className={`text-[19px] ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{item.icon}</span><span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span></>)}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-8 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-lg text-red-400 hover:bg-red-500/10 transition-all group" ><HiOutlineArrowLeftOnRectangle className="text-[19px] group-hover:-translate-x-1 transition-transform" /><span className="text-[11px] font-black uppercase tracking-widest">Logout</span></button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-12 relative z-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div><h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">{readOnly ? 'Tiger Analytics Portal' : ''}</h2><p className="text-xl font-extrabold text-slate-900 tracking-tight">{isEmployeesView ? 'Personnel Directory' : 'Admin Dashboard'}</p></div>
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">{readOnly ? 'TA' : 'SA'}</div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
          <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Routes>
              <Route path="*" element={
                <>
                  {!isEmployeesView && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[{ label: 'Total Orders', val: orders.length, color: 'brand-blue' }, { label: 'Pending', val: orders.filter(o => o.status === 'Pending').length, color: 'brand-orange' }, { label: 'Total Dispatched', val: orders.filter(o => o.status === 'Dispatched').length, color: 'brand-blue' }].map(stat => (
                        <div key={stat.label} className="bg-white p-8 rounded-lg border border-slate-100 shadow-soft hover:scale-[1.02] transition-all cursor-default"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p><p className={`text-4xl font-extrabold text-${stat.color} tracking-tighter`}>{stat.val}</p></div>
                      ))}
                    </div>
                  )}

                  {isEmployeesView && (
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                      {[{ label: 'Total Authorized', val: employees.length, color: 'brand-blue' }].map(stat => (
                        <div key={stat.label} className="bg-white p-8 rounded-lg border border-slate-100 shadow-soft hover:scale-[1.02] transition-all cursor-default"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p><p className={`text-4xl font-extrabold text-${stat.color} tracking-tighter`}>{stat.val}</p></div>
                      ))}
                    </div>
                  )}

                  <div className="bg-white rounded-lg border border-slate-100 shadow-soft">
                    <div className="px-10 py-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-6">
                      <div className="flex items-center gap-8 flex-1 min-w-[300px]">
                        <div className="relative flex-1 max-w-sm"><HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" /><input type="text" placeholder={isEmployeesView ? "Search employees..." : "Search orders..."} className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand-blue/10 transition-all placeholder:text-slate-300" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>

                        {!isEmployeesView && (
                          <>
                            <div className="relative flex items-center gap-3">
                              <HiOutlineFunnel className="text-slate-400 text-lg" />
                              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-slate-50 border-none rounded-xl px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-2 focus:ring-brand-blue/10 appearance-none cursor-pointer pr-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }} >
                                <option value="All">All Orders</option>
                                <option value="Pending">Pending Only</option>
                                <option value="Dispatched">Dispatched Only</option>
                              </select>
                            </div>
                            <div className="relative"><button onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border transition-all cursor-pointer ${dateRange.from ? 'bg-brand-blue/5 border-brand-blue/20 text-brand-blue' : 'bg-slate-50 border-transparent text-slate-400 hover:text-slate-600'}`} ><HiOutlineCalendar className="text-lg" /><span className="text-[10px] font-black uppercase tracking-widest">{dateRange.from ? `${format(dateRange.from, 'dd MMM')} ${dateRange.to ? `- ${format(dateRange.to, 'dd MMM')}` : ''}` : 'Filter by Date'}</span></button><RangeDatePicker isOpen={isDatePickerOpen} range={dateRange} onSelect={setDateRange} onClose={() => setIsDatePickerOpen(false)} /></div>
                          </>
                        )}
                      </div>
                      <button onClick={exportCSV} className="flex items-center gap-3 px-6 py-3.5 bg-slate-900 hover:bg-brand-blue text-white rounded-xl transition-all shadow-lg hover:shadow-brand-blue/20 active:scale-95"><HiOutlineArrowDownTray className="text-lg" /><span className="text-[10px] font-black uppercase tracking-widest">Export CSV</span></button>
                    </div>

                    {loading ? (
                      <div className="py-32 flex flex-col items-center justify-center gap-4"><div className="w-8 h-8 border-2 border-slate-100 border-t-brand-blue rounded-full animate-spin" /><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Streaming Ledger...</p></div>
                    ) : (isEmployeesView ? filteredEmployees : filteredOrders).length === 0 ? (
                      <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-200">
                        <HiOutlineInbox className="text-6xl text-slate-500" />
                        <p className="text-xs text-slate-400 font-black uppercase tracking-widest">No Results Encountered</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-b-lg overflow-hidden">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50/50">
                            <tr className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em] border-b border-slate-100">
                              {isEmployeesView ? (
                                <>
                                  <th className="px-10 py-6">Employee Name</th>
                                  <th className="px-10 py-6">Personal ID</th>
                                  <th className="px-10 py-6">Date of Birth</th>
                                  <th className="px-10 py-6 text-right">Company</th>
                                </>
                              ) : (
                                <>
                                  <th className="px-10 py-6">Subject / ID</th>
                                  <th className="px-10 py-6">Items</th>
                                  <th className="px-10 py-6">Address</th>
                                  <th className="px-10 py-6 text-center">{readOnly ? 'Details' : 'Actions'}</th>
                                  <th className="px-10 py-6 text-right">Timestamp</th>
                                </>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {isEmployeesView ? filteredEmployees.map(emp => (
                              <tr key={emp._id} className="hover:bg-slate-50/30 transition-colors">
                                <td className="px-10 py-8"><p className="font-extrabold text-slate-900 text-[13px]">{emp.name}</p></td>
                                <td className="px-10 py-8"><p className="text-[10px] font-black text-brand-blue uppercase tracking-widest font-mono">{emp.employeeId}</p></td>
                                <td className="px-10 py-8"><p className="text-xs font-bold text-slate-500">{emp.dob ? format(new Date(emp.dob), 'dd/MM/yyyy') : 'N/A'}</p></td>
                                <td className="px-10 py-8 text-right"><span className="px-3 py-1 bg-brand-blue/5 text-brand-blue rounded-lg text-[9px] font-black uppercase tracking-widest">{emp.company}</span></td>
                              </tr>
                            )) : filteredOrders.map(order => (
                              <tr key={order._id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-10 py-8"><p className="font-extrabold text-slate-900 text-[13px]">{order.employeeDetails.name}</p><p className="text-[10px] font-black text-brand-blue uppercase tracking-widest opacity-60 mt-1">{order.employeeDetails.employeeId}</p></td>
                                <td className="px-10 py-8"><div className="flex flex-wrap gap-2">{order.items.slice(0, 2).map((it, i) => (<span key={i} className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">{it.title}</span>))}{order.items.length > 2 && <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">+{order.items.length - 2} Items</span>}</div></td>
                                <td className="px-10 py-8"><p className="text-[11px] font-bold text-slate-700">{order.shippingAddress.city}</p><p className="text-[9px] text-slate-400 line-clamp-1">{order.shippingAddress.address}</p></td>
                                <td className="px-10 py-8">
                                  <div className="flex items-center justify-center gap-3">
                                    <button onClick={() => setSelectedOrder(order)} className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-brand-blue rounded-lg transition-all shadow-sm border border-slate-100" title="View Details" ><HiOutlineEye className="text-lg" /></button>
                                    {readOnly ? (
                                      <div className={`p-3 rounded-lg shadow-sm border ${order.status === 'Dispatched' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-brand-blue/5 text-brand-blue border-brand-blue/10'}`} title={order.status === 'Dispatched' ? 'Dispatched' : 'Pending'}>
                                        {order.status === 'Dispatched' ? <HiOutlineCheckCircle className="text-lg" /> : <HiOutlineTruck className="text-lg" />}
                                      </div>
                                    ) : (
                                      <button onClick={() => updateStatus(order._id, order.status === 'Dispatched' ? 'Pending' : 'Dispatched')} className={`p-3 rounded-lg transition-all shadow-sm border ${order.status === 'Dispatched' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-brand-blue/5 text-brand-blue border-brand-blue/10'}`} title={order.status === 'Dispatched' ? 'Undo Dispatch' : 'Mark as Dispatched'}>
                                        {order.status === 'Dispatched' ? <HiOutlineCheckCircle className="text-lg" /> : <HiOutlineTruck className="text-lg" />}
                                      </button>
                                    )}
                                  </div>
                                </td>
                                <td className="px-10 py-8 text-right"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              } />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  )
}
