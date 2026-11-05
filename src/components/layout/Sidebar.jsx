import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Glasses,
  Users,
  FileText,
  Receipt,
  CreditCard,
  Truck,
  Wrench,
  Calendar,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    metrics,
    logout
  } = useApp();

  const [isHovered, setIsHovered] = useState(false);

  // The sidebar extends when pinned open OR when hovered in compact mode
  const isExpanded = !sidebarCollapsed || isHovered;

  const navigationItems = [
    { id: 'overview', label: 'Overview', shortLabel: 'Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', shortLabel: 'Inventory', icon: Glasses, badge: metrics.lowStockCount > 0 ? `${metrics.lowStockCount} Low` : null, badgeColor: 'bg-sunshine-400/20 text-sunshine-300 border-sunshine-400/30' },
    { id: 'customers', label: 'Customers', shortLabel: 'Customers', icon: Users },
    { id: 'prescriptions', label: 'Prescriptions', shortLabel: 'Rx Tests', icon: FileText },
    { id: 'sales', label: 'Sales & Billing', shortLabel: 'Billing', icon: Receipt },
    { id: 'payments', label: 'Payments', shortLabel: 'Payments', icon: CreditCard, badge: metrics.pendingPaymentsCount > 0 ? `${metrics.pendingPaymentsCount} Due` : null, badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    { id: 'suppliers', label: 'Suppliers', shortLabel: 'Suppliers', icon: Truck },
    { id: 'repairs', label: 'Repairs & Services', shortLabel: 'Repairs', icon: Wrench, badge: metrics.ongoingRepairsCount > 0 ? `${metrics.ongoingRepairsCount}` : null, badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { id: 'appointments', label: 'Appointments', shortLabel: 'Appts', icon: Calendar, badge: metrics.pendingAppointmentsCount > 0 ? `${metrics.pendingAppointmentsCount}` : null, badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { id: 'reports', label: 'Reports', shortLabel: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', shortLabel: 'Settings', icon: Settings },
  ];

  return (
    <aside
      onMouseEnter={() => {
        if (sidebarCollapsed) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        if (sidebarCollapsed) {
          setIsHovered(false);
        }
      }}
      className={`fixed top-20 left-0 bottom-0 z-30 bg-graphite-900 text-graphite-300 flex flex-col border-r border-graphite-800 transition-all duration-300 ease-in-out select-none ${
        isExpanded ? 'w-64 shadow-2xl' : 'w-[96px] shadow-lg'
      }`}
    >
      {/* Sidebar Header Section - Perfectly Aligned */}
      <div className="h-10 px-2 flex items-center overflow-hidden border-b border-graphite-800/60 shrink-0">
        <div className="w-14 shrink-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-graphite-400 uppercase tracking-wider">
            Menu
          </span>
        </div>
      </div>

      {/* Navigation Links - Single Unified DOM Structure with 60FPS CSS Transitions */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5 overflow-x-hidden">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <div key={item.id} className="relative group/navitem">
              <button
                onClick={() => {
                  setActiveTab(item.id);
                  if (sidebarCollapsed) {
                    setIsHovered(false);
                  }
                }}
                className={`w-full h-12 flex items-center rounded-xl transition-all duration-150 relative cursor-pointer overflow-hidden ${
                  isActive
                    ? 'bg-graphite-800 text-white shadow-sm ring-1 ring-graphite-700/80'
                    : 'text-graphite-300 hover:text-white hover:bg-graphite-800/60'
                }`}
                title={item.label}
              >
                {/* Sunshine Yellow Left Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-sunshine-400 rounded-r-full shadow-sunshine"></span>
                )}

                {/* Left Anchor Slot (56px wide): Icon + Short Name when compressed */}
                <div className="w-14 h-12 shrink-0 flex flex-col items-center justify-center relative">
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-sunshine-400' : 'text-graphite-400 group-hover/navitem:text-sunshine-300'
                    } ${isExpanded ? 'translate-y-0' : '-translate-y-0.5'}`}
                  />

                  {/* Symbol Name underneath when compressed */}
                  <span
                    className={`text-[10px] font-bold tracking-tight text-center truncate max-w-full px-0.5 leading-none transition-all duration-200 ${
                      isActive ? 'text-sunshine-400' : 'text-graphite-300 group-hover/navitem:text-white'
                    } ${
                      !isExpanded
                        ? 'opacity-100 max-h-3 mt-1'
                        : 'opacity-0 max-h-0 overflow-hidden m-0 pointer-events-none'
                    }`}
                  >
                    {item.shortLabel || item.label}
                  </span>

                  {/* Micro Badge Dot on Icon when compressed */}
                  {!isExpanded && item.badge && (
                    <span className="absolute top-1 right-2 min-w-[15px] h-3.5 px-0.5 flex items-center justify-center text-[9px] font-extrabold rounded-full bg-sunshine-400 text-graphite-950 ring-2 ring-graphite-900 shadow-sm">
                      {item.badge.split(' ')[0]}
                    </span>
                  )}
                </div>

                {/* Expanding Label & Badge Zone - Buttery Smooth & Perfectly Aligned */}
                <div
                  className={`flex-1 min-w-0 flex items-center justify-between pl-1.5 pr-2.5 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
                    isExpanded
                      ? 'opacity-100 max-w-[190px] translate-x-0'
                      : 'opacity-0 max-w-0 -translate-x-3 pointer-events-none'
                  }`}
                >
                  <span className={`text-sm font-semibold truncate ${
                    isActive ? 'text-white font-bold' : 'text-graphite-200'
                  }`}>
                    {item.label}
                  </span>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-full border whitespace-nowrap shrink-0 ml-2 ${
                        isActive
                          ? 'bg-sunshine-400/20 text-sunshine-300 border-sunshine-400/40'
                          : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </nav>

      {/* Bottom Actions: Expand/Collapse Toggle & Sign Out - Perfectly Aligned */}
      <div className="p-2 border-t border-graphite-800 bg-graphite-950/60 space-y-1 shrink-0">
        {/* Pin / Expand Toggle */}
        <button
          onClick={() => {
            setSidebarCollapsed(!sidebarCollapsed);
            setIsHovered(false);
          }}
          className="w-full h-11 flex items-center rounded-xl text-graphite-400 hover:text-white hover:bg-graphite-800 transition-colors cursor-pointer overflow-hidden"
          title={sidebarCollapsed ? "Pin sidebar open" : "Collapse sidebar"}
        >
          <div className="w-14 h-11 shrink-0 flex flex-col items-center justify-center">
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-sunshine-400" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-sunshine-400" />
            )}
            <span className={`text-[9.5px] font-bold transition-opacity ${!isExpanded ? 'opacity-100 mt-0.5' : 'hidden'}`}>
              Expand
            </span>
          </div>
          <div
            className={`flex-1 flex items-center whitespace-nowrap overflow-hidden transition-all duration-300 pl-1.5 ${
              isExpanded ? 'opacity-100 max-w-[190px]' : 'opacity-0 max-w-0 pointer-events-none'
            }`}
          >
            <span className="text-xs font-semibold text-graphite-300">
              {sidebarCollapsed ? "Pin Sidebar Open" : "Collapse Sidebar"}
            </span>
          </div>
        </button>

        {/* Sign Out Button */}
        <button
          onClick={logout}
          className="w-full h-11 flex items-center rounded-xl text-graphite-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer overflow-hidden"
          title="Sign Out of Portal"
        >
          <div className="w-14 h-11 shrink-0 flex flex-col items-center justify-center">
            <LogOut className="w-4 h-4 text-graphite-400 hover:text-rose-400" />
            <span className={`text-[9.5px] font-bold transition-opacity ${!isExpanded ? 'opacity-100 mt-0.5' : 'hidden'}`}>
              Logout
            </span>
          </div>
          <div
            className={`flex-1 flex items-center whitespace-nowrap overflow-hidden transition-all duration-300 pl-1.5 ${
              isExpanded ? 'opacity-100 max-w-[190px]' : 'opacity-0 max-w-0 pointer-events-none'
            }`}
          >
            <span className="text-xs font-semibold text-graphite-300 hover:text-rose-400">
              Sign Out of Portal
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
