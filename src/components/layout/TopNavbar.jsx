import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Calendar,
  Receipt,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronDown,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export const TopNavbar = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    setIsSearchOpen,
    setModalState,
    activities,
    logout
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const titlesMap = {
    overview: { title: 'Dashboard Overview', subtitle: 'Store performance, sales summary & today’s activities' },
    inventory: { title: 'Inventory & Products', subtitle: 'Manage frames, sunglasses, lenses and accessories' },
    customers: { title: 'Customer Records', subtitle: 'View customer directory, optical history and prescriptions' },
    prescriptions: { title: 'Prescriptions (Rx)', subtitle: 'Eye test refractive numbers (OD/OS) and doctor notes' },
    sales: { title: 'Sales & Billing (POS)', subtitle: 'Create new optical bills, view orders and print invoices' },
    payments: { title: 'Payments & Dues', subtitle: 'Track customer payments, advance amounts and remaining dues' },
    suppliers: { title: 'Suppliers & Vendors', subtitle: 'Eyewear distributor details and purchase accounts' },
    repairs: { title: 'Repairs & Services', subtitle: 'Spectacle frame fixes, nose-pad changes and workshop jobs' },
    appointments: { title: 'Eye Test Appointments', subtitle: 'Scheduled customer check-ups and frame fittings' },
    reports: { title: 'Business Reports', subtitle: 'Simple revenue statements, stock alerts and spreadsheet downloads' },
    settings: { title: 'Store Settings', subtitle: 'Store address, phone number, GST rate and staff details' },
  };

  const currentMeta = titlesMap[activeTab] || { title: 'Dashboard', subtitle: 'Daware Opticians Internal System' };

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-20 bg-graphite-900 text-white border-b border-graphite-800 px-4 sm:px-6 flex items-center justify-between shadow-sm">
      {/* 1. Permanent Brand Logo at Top-Left Corner + Collapse Toggle + Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Clickable Logo - ALWAYS fixed at Top-Left */}
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2 focus:outline-none cursor-pointer group py-1"
          title="DAWARE OPTICIANS - Return to Overview"
        >
          <img
            src="/logo-sunshine.png"
            alt="DAWARE OPTICIANS"
            className="h-8 sm:h-9 w-auto object-contain drop-shadow-sm group-hover:brightness-110 transition-all"
          />
        </button>

        {/* Subtle Vertical Divider */}
        <div className="h-6 w-px bg-graphite-800 hidden sm:block"></div>

        {/* Professional Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-xl text-graphite-400 hover:text-white hover:bg-graphite-800 active:bg-graphite-850 transition-colors cursor-pointer"
          title={sidebarCollapsed ? "Expand sidebar menu" : "Collapse sidebar menu"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-sunshine-400" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        {/* Section Title & Breadcrumb */}
        <div className="hidden lg:flex flex-col justify-center pl-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-graphite-400 uppercase tracking-wider">
            <span>Store</span>
            <span>/</span>
            <span className="text-sunshine-400 font-bold capitalize">{activeTab}</span>
          </div>
          <h2 className="text-sm font-bold text-white tracking-tight leading-tight">
            {currentMeta.title}
          </h2>
        </div>
      </div>

      {/* 2. Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Search */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="hidden md:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-graphite-800 hover:bg-graphite-750 hover:border-sunshine-400/50 border border-graphite-700 text-graphite-300 text-xs transition-all group cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-graphite-400 group-hover:text-sunshine-400 transition-colors" />
          <span className="text-graphite-400 font-medium">Search records (Ctrl+K)...</span>
        </button>

        {/* Quick Create Bill Button - Radiant Sunshine Yellow */}
        <button
          onClick={() => setModalState(prev => ({ ...prev, newSale: true }))}
          className="btn-sunshine text-xs py-2 px-3.5 sm:px-4 font-bold flex items-center gap-1.5 shadow-sunshine"
          title="Create New Customer Bill"
        >
          <Receipt className="w-3.5 h-3.5 text-graphite-950" />
          <span className="hidden sm:inline">+ Create New Bill</span>
          <span className="sm:hidden font-extrabold">+ Bill</span>
        </button>

        {/* Today's Date */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-graphite-800/80 border border-graphite-750 text-graphite-300 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-sunshine-400" />
          <span>{todayFormatted}</span>
        </div>

        {/* Notifications Icon with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-xl text-graphite-300 hover:text-white hover:bg-graphite-800 border border-graphite-750 transition-colors cursor-pointer"
            title="Recent Activity"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sunshine-400 ring-2 ring-graphite-900"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-card-lg border border-graphite-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-100 text-graphite-900">
              <div className="px-4 pb-2.5 border-b border-graphite-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-graphite-900 uppercase tracking-wider">
                    Recent Store Activity
                  </h3>
                  <p className="text-xs text-graphite-500">Latest bills and customer updates</p>
                </div>
                <span className="badge-sunshine text-[10px]">Real-time</span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-graphite-100">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="p-3.5 hover:bg-graphite-50 transition-colors text-left flex gap-3">
                    <div className="mt-0.5 shrink-0">
                      {act.type === 'billing' && <Receipt className="w-4 h-4 text-sunshine-600" />}
                      {act.type === 'prescription' && <FileText className="w-4 h-4 text-graphite-800" />}
                      {act.type === 'inventory' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {act.type === 'repair' && <Clock className="w-4 h-4 text-blue-600" />}
                      {act.type === 'payment' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {!['billing', 'prescription', 'inventory', 'repair', 'payment'].includes(act.type) && (
                        <CheckCircle2 className="w-4 h-4 text-graphite-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <p className="text-xs font-bold text-graphite-900 truncate">
                          {act.action}
                        </p>
                        <span className="text-[11px] text-graphite-400 shrink-0">
                          {act.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-graphite-600 mt-0.5 line-clamp-2">
                        {act.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-graphite-800 border border-graphite-750 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-graphite-950 text-sunshine-400 flex items-center justify-center font-bold text-xs ring-1 ring-graphite-700">
              SD
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">
                Shruti Daware
              </span>
              <span className="text-[10px] text-graphite-400 font-medium">
                Store Owner
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-graphite-400 hidden sm:inline" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-card-lg border border-graphite-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100 text-graphite-900">
              <div className="p-2 border-b border-graphite-100">
                <p className="text-sm font-bold text-graphite-900">Shruti Daware</p>
                <p className="text-xs text-graphite-500">store@dawareopticians.com</p>
                <span className="badge-sunshine text-[10px] mt-2">Store Admin</span>
              </div>
              <div className="py-2 text-xs text-graphite-600 space-y-1">
                <div><span className="text-graphite-400">Location:</span> Bandra West Flagship</div>
                <div><span className="text-graphite-400">License:</span> DL-MH-OPT-2018-8821</div>
              </div>
              <div className="pt-2 border-t border-graphite-100">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
