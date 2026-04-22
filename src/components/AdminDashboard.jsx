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
                  <div className="flex justify-between"><span className="text-xs font-bold text-slate-400">Email Address</span><span className="text-xs font-black text-slate-900 font-mono tracking-widest">{order.employeeDetails.email}</span></div>
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
                <div className={`p-6 rounded-lg border bg-brand-blue/5 border-brand-blue/10 flex flex-col md:flex-row items-center justify-between gap-4`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-brand-blue text-white shadow-lg shadow-brand-blue/20">
                      <HiOutlineTruck className="text-xl" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Current: {order.status}</p>
                      <p className="text-[9px] font-bold text-slate-400">System Recorded</p>
                    </div>
                  </div>
                  {!readOnly && (
                    <div className="flex gap-2">
                       {['Pending', 'Processing', 'Dispatched', 'Delivered'].map(s => (
                         <button 
                           key={s}
                           onClick={() => onUpdateStatus(order._id, s, false)} 
                           className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all border ${order.status === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-brand-blue hover:text-brand-blue'}`} 
                         >
                           {s}
                         </button>
                       ))}
                    </div>
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
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const location = useLocation()

  const isEmployeesView = location.pathname.includes('/employees')

  useEffect(() => {
    setCurrentPage(1)
  }, [isEmployeesView, statusFilter, searchQuery, dateRange, itemsPerPage])

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

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentData = isEmployeesView ? filteredEmployees : filteredOrders
  const totalPages = Math.ceil(currentData.length / itemsPerPage)
  const paginatedData = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const updateStatus = async (orderId, newStatus, skipConfirm = false) => {
    if (readOnly) return
    if (!skipConfirm && (newStatus === 'Dispatched' || newStatus === 'Delivered')) {
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
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdateStatus={updateStatus} readOnly={readOnly} />
      <ConfirmationModal isOpen={!!confirmingAction} message={`Are you sure you want to mark this bundle as ${confirmingAction?.status}? This will trigger the employee tracking notification.`} onConfirm={() => updateStatus(confirmingAction.id, confirmingAction.status, true)} onCancel={() => setConfirmingAction(null)} />

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
                { to: `${basePath}/employees`, label: 'Employees List', icon: <HiOutlineUsers /> }
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
                {isEmployeesView ? 'User Directory' : 'Admin Dashboard'}
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
              <Route path="*" element={
                <>
                  {/* Premium Stat Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-0">
                    {!isEmployeesView ? (
                      <>
                        <StatCard label="Total Shipments" val={orders.length} icon={<HiOutlineShoppingBag />} color="blue" />
                        <StatCard label="Pending Orders" val={orders.filter(o => o.status === 'Pending').length} icon={<HiOutlineCalendar />} color="orange" />
                        <StatCard label="Live Dispatched" val={orders.filter(o => o.status === 'Dispatched').length} icon={<HiOutlineTruck />} color="green" />
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
                                <option value="Delivered">Delivered</option>
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
                             <span className="text-sm font-black text-slate-900 tracking-tight">{employees.length}</span>
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
                                    <th className="px-8 py-5">Credentials</th>
                                    <th className="px-8 py-5">Timeline</th>
                                    <th className="px-8 py-5 text-right">Affiliation</th>
                                  </>
                                ) : (
                                  <>
                                    <th className="px-8 py-5">Profile</th>
                                    <th className="px-8 py-5">Items</th>
                                    <th className="px-8 py-5">Address</th>
                                    <th className="px-8 py-5 text-center">Action</th>
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
                                    <div className="flex items-center gap-2 text-slate-500">
                                      <HiOutlineCalendar className="text-base opacity-40" />
                                      <span className="text-[11px] font-bold">{emp.dob ? format(new Date(emp.dob), 'MMM dd, yyyy') : '---'}</span>
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
                                      {order.items.slice(0, 2).map((it, i) => (
                                        <span key={i} className="px-2 py-1 bg-white border border-slate-100 rounded-md text-[8px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
                                          {it.title}
                                        </span>
                                      ))}
                                      {order.items.length > 2 && (
                                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest self-center">
                                          +{order.items.length - 2}
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
                                    <div className="flex items-center justify-center gap-2">
                                      <button 
                                        onClick={() => setSelectedOrder(order)} 
                                        className="w-9 h-9 bg-white hover:bg-brand-blue text-slate-400 hover:text-white rounded-lg transition-all shadow-sm border border-slate-100 flex items-center justify-center" 
                                        title="Inspect Details"
                                      >
                                        <HiOutlineEye className="text-lg" />
                                      </button>
                                      {!readOnly && (
                                        <select
                                          value={order.status}
                                          onChange={(e) => updateStatus(order._id, e.target.value)}
                                          className="bg-white border border-slate-200 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-lg px-2 py-2 outline-none focus:border-brand-blue cursor-pointer shadow-sm"
                                        >
                                          <option value="Pending">Pending</option>
                                          <option value="Processing">Processing</option>
                                          <option value="Dispatched">Dispatched</option>
                                          <option value="Delivered">Delivered</option>
                                        </select>
                                      )}
                                      {readOnly && (
                                        <span className="px-2 py-1 bg-brand-blue/5 text-brand-blue rounded border border-brand-blue/10 text-[9px] font-black uppercase tracking-widest">
                                          {order.status}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-8 py-4 text-right">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                    </p>
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

function StatCard({ label, val, icon, color, full }) {
  const themes = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', progress: 'bg-blue-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', progress: 'bg-orange-600' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', progress: 'bg-emerald-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', progress: 'bg-purple-600' }
  }
  
  const theme = themes[color]
  
  return (
    <div className={`bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-500 group cursor-default ${full ? 'col-span-full' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${theme.bg} ${theme.text} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500 border ${theme.border}`}>
          {icon}
        </div>
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">{label}</p>
          <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{val}</p>
        </div>
      </div>
      <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
         <div className={`h-full ${theme.progress} opacity-20 w-2/3 rounded-full`} />
      </div>
    </div>
  )
}
