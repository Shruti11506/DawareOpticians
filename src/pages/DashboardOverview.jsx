import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Receipt,
  Users,
  AlertTriangle,
  ArrowRight,
  Printer,
  CreditCard,
  Plus
} from 'lucide-react';

export const DashboardOverview = () => {
  const {
    metrics,
    sales,
    products,
    setActiveTab,
    setModalState
  } = useApp();

  const lowStockItems = (products || []).filter(
    p => p && (p.status === 'low_stock' || p.status === 'out_of_stock')
  ).slice(0, 3);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Header with greeting and primary actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-graphite-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-graphite-900 tracking-tight">
            Store Overview
          </h1>
          <p className="text-sm text-graphite-500 mt-1">
            Welcome back, <strong className="text-graphite-800 font-semibold">Shruti Daware</strong>. Here is your store summary today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalState(prev => ({ ...prev, newSale: true }))}
            className="btn-sunshine px-5 py-2.5 text-sm font-bold shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-graphite-950" />
            <span>New Bill</span>
          </button>
          <button
            onClick={() => setModalState(prev => ({ ...prev, addCustomer: true }))}
            className="btn-secondary px-4 py-2.5 text-sm font-semibold flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-graphite-600" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* 2. Three Clean, High-Readability Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Today's Sales */}
        <div
          onClick={() => setActiveTab('sales')}
          className="bg-white rounded-2xl border border-graphite-200/90 p-6 shadow-sm hover:border-sunshine-400 hover:shadow-card-hover transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-graphite-400">
              Today's Sales
            </span>
            <div className="w-9 h-9 rounded-xl bg-sunshine-100 text-sunshine-900 flex items-center justify-center border border-sunshine-300/70 group-hover:scale-105 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-graphite-900 mt-3">
            {formatCurrency(metrics.todaySales)}
          </p>
          <p className="text-xs text-graphite-500 mt-1">
            {metrics.todaySalesCount} bills generated today
          </p>
        </div>

        {/* Pending Customer Dues */}
        <div
          onClick={() => setActiveTab('payments')}
          className="bg-white rounded-2xl border border-graphite-200/90 p-6 shadow-sm hover:border-graphite-300 hover:shadow-card-hover transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-graphite-400">
              Balance to Collect
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60 group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-rose-600 mt-3">
            {formatCurrency(metrics.pendingPaymentsAmount)}
          </p>
          <p className="text-xs text-graphite-500 mt-1">
            From {metrics.pendingPaymentsCount} customer orders
          </p>
        </div>

        {/* Low Stock Watchlist */}
        <div
          onClick={() => setActiveTab('inventory')}
          className="bg-white rounded-2xl border border-graphite-200/90 p-6 shadow-sm hover:border-graphite-300 hover:shadow-card-hover transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-graphite-400">
              Stock Needs Reorder
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-graphite-900 mt-3">
            {metrics.lowStockCount} <span className="text-sm font-medium text-graphite-400">items</span>
          </p>
          <p className="text-xs text-graphite-500 mt-1">
            Units below safe minimum threshold
          </p>
        </div>
      </div>

      {/* 3. Main Section: Clean Recent Bills (2/3 width) + Low Stock Alert (1/3 width) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bills (Clean & Simple) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-graphite-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-100">
            <div>
              <h2 className="text-base font-bold text-graphite-900">
                Recent Customer Bills
              </h2>
              <p className="text-xs text-graphite-400">
                Latest sales made in the store
              </p>
            </div>

            <button
              onClick={() => setActiveTab('sales')}
              className="text-xs font-bold text-graphite-600 hover:text-graphite-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Simple Spacious Bill Rows */}
          <div className="divide-y divide-graphite-100">
            {sales.slice(0, 4).map((sale) => (
              <div
                key={sale.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-graphite-50/70 -mx-2 px-2 rounded-xl transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-graphite-700 bg-graphite-100 px-2 py-0.5 rounded">
                      {sale.invoiceNo}
                    </span>
                    <span className="text-xs text-graphite-400">
                      {formatDate(sale.date)}
                    </span>
                    <span className={
                      sale.paymentStatus === 'Paid'
                        ? 'badge-matte-success text-[11px]'
                        : 'badge-matte-warning text-[11px]'
                    }>
                      {sale.paymentStatus}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-graphite-900 mt-1">
                    {sale.customerName || 'Customer'}
                  </p>
                  <p className="text-xs text-graphite-500">
                    {sale.items && sale.items.length > 0
                      ? sale.items.map(i => i?.name || 'Eyewear Item').join(' • ')
                      : 'Prescription Eyewear'}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-sm font-bold text-graphite-900 block">
                      {formatCurrency(sale.grandTotal)}
                    </span>
                    {sale.balanceDue > 0 ? (
                      <span className="text-xs text-rose-600 font-bold block">
                        Due: {formatCurrency(sale.balanceDue)}
                      </span>
                    ) : (
                      <span className="text-xs text-emerald-700 font-medium block">
                        Paid in full
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setModalState(prev => ({ ...prev, viewInvoice: sale }))}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
                  >
                    <Printer className="w-3.5 h-3.5 text-graphite-600" />
                    <span>Print Bill</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Items (Clean & Simple) */}
        <div className="bg-white rounded-2xl border border-graphite-200/90 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-graphite-100">
              <h2 className="text-base font-bold text-graphite-900">
                Low Stock Alert
              </h2>
              <button
                onClick={() => setActiveTab('inventory')}
                className="text-xs font-bold text-sunshine-700 hover:text-sunshine-800 hover:underline"
              >
                Catalog →
              </button>
            </div>

            <p className="text-xs text-graphite-400 mt-1">
              Items that need to be reordered soon:
            </p>

            <div className="divide-y divide-graphite-100 mt-3">
              {lowStockItems.map((prod) => (
                <div key={prod.id || prod.product_id} className="py-3 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-graphite-900 truncate">
                      {prod.name || prod.product_name || 'Eyewear Frame'}
                    </p>
                    <p className="text-[11px] text-graphite-400">
                      {prod.brand || 'Store'} • {prod.category || prod.category_name || 'Frames'}
                    </p>
                  </div>

                  <span className={
                    (prod.stock || 0) === 0
                      ? 'badge-matte-danger text-xs shrink-0'
                      : 'badge-matte-warning text-xs shrink-0'
                  }>
                    {(prod.stock || 0) === 0 ? 'Out of Stock' : `${prod.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('inventory')}
            className="w-full btn-secondary text-xs py-2.5 font-bold text-center justify-center"
          >
            <span>Manage Inventory</span>
          </button>
        </div>
      </div>
    </div>
  );
};
