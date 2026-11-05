import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Receipt,
  Search,
  Plus,
  Printer,
  CreditCard,
  LayoutGrid,
  List,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const SalesBillingPage = () => {
  const {
    sales,
    updateSaleStatus,
    setModalState
  } = useApp();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  const filteredSales = sales.filter(s => {
    const matchesSearch =
      s.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.customerPhone?.toLowerCase().includes(search.toLowerCase()) ||
      s.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter =
      filter === 'All' ||
      (filter === 'Paid' && s.paymentStatus === 'Paid') ||
      (filter === 'Due' && s.balanceDue > 0) ||
      (filter === 'Lab' && s.orderStatus === 'In Lab Processing');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="card-matte p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Sales & Optical Billing (POS)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Create customer invoices, track optical lab status and print tax receipts
          </p>
        </div>

        <button
          onClick={() => setModalState(prev => ({ ...prev, newSale: true }))}
          className="btn-gold px-5 py-2.5 text-sm font-bold flex items-center gap-2"
        >
          <Receipt className="w-4 h-4 text-slate-900" />
          <span>+ Create New Bill (POS)</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="card-matte p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, phone number, invoice number (INV-...)..."
              className="input-field pl-11 text-sm py-3"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Card View</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'All', label: 'All Bills' },
            { id: 'Paid', label: 'Fully Paid' },
            { id: 'Due', label: 'Has Balance Due' },
            { id: 'Lab', label: 'In Lab Processing' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filter === item.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bills in CASD VIEW (Clear, High Readability) */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSales.length === 0 ? (
            <div className="col-span-full card-matte py-12 text-center text-slate-400">
              <Receipt className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-base font-bold text-slate-700">No invoices found</p>
              <p className="text-xs text-slate-400 mt-1">Click "+ Create New Bill" to record a sale.</p>
            </div>
          ) : (
            filteredSales.map((sale) => (
              <div
                key={sale.id}
                className="card-matte p-6 hover:border-slate-300 hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                      {sale.invoiceNo}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">
                        {formatDate(sale.date)}
                      </span>
                      <span className={
                        sale.paymentStatus === 'Paid'
                          ? 'badge-matte-success text-xs'
                          : 'badge-matte-warning text-xs'
                      }>
                        {sale.paymentStatus === 'Paid' ? 'Paid' : 'Partial'}
                      </span>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="mt-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      {sale.customerName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Phone: {sale.customerPhone}
                    </p>
                  </div>

                  {/* Purchased Items Box */}
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Eyewear & Lens Details:
                    </span>
                    {sale.items.map((item, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{item.name} (x{item.quantity})</span>
                          <span>{formatCurrency(item.total)}</span>
                        </div>
                        {item.lensOption && item.lensOption !== 'None' && (
                          <div className="text-[11px] text-amber-900 font-medium">
                            + {item.lensOption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-amber-50/50 border border-amber-200/50">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Total Bill</span>
                      <span className="text-base font-bold text-slate-900">
                        {formatCurrency(sale.grandTotal)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Amount Paid</span>
                      <span className="text-base font-bold text-emerald-700">
                        {formatCurrency(sale.amountPaid)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Balance Due</span>
                      <span className={`text-base font-bold ${sale.balanceDue > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        {formatCurrency(sale.balanceDue)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions of Card */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Status:</span>
                    <select
                      value={sale.orderStatus}
                      onChange={(e) => updateSaleStatus(sale.id, e.target.value)}
                      className="text-xs font-bold py-1.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                      <option value="In Lab Processing">In Lab Processing</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {sale.balanceDue > 0 && (
                      <button
                        onClick={() => setModalState(prev => ({ ...prev, recordPayment: sale }))}
                        className="btn-secondary text-xs py-2 px-3 font-bold text-rose-700 hover:text-rose-900"
                        title="Collect Remaining Balance"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-rose-600" />
                        <span>Collect Due</span>
                      </button>
                    )}
                    <button
                      onClick={() => setModalState(prev => ({ ...prev, viewInvoice: sale }))}
                      className="btn-secondary text-xs py-2 px-3.5 font-bold flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-700" />
                      <span>Print Tax Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Bills in TABLE VIEW */
        <div className="card-matte overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-th">Invoice #</th>
                  <th className="table-th">Customer</th>
                  <th className="table-th">Date</th>
                  <th className="table-th text-right">Grand Total</th>
                  <th className="table-th text-right">Paid</th>
                  <th className="table-th text-right">Balance Due</th>
                  <th className="table-th text-center">Status</th>
                  <th className="table-th text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70">
                    <td className="table-td font-mono font-bold text-slate-900">
                      {sale.invoiceNo}
                    </td>
                    <td className="table-td">
                      <div className="font-bold text-slate-900 text-sm">{sale.customerName}</div>
                      <div className="text-xs text-slate-500">{sale.customerPhone}</div>
                    </td>
                    <td className="table-td text-xs text-slate-500">
                      {formatDate(sale.date)}
                    </td>
                    <td className="table-td text-right font-bold text-slate-900">
                      {formatCurrency(sale.grandTotal)}
                    </td>
                    <td className="table-td text-right font-bold text-emerald-700">
                      {formatCurrency(sale.amountPaid)}
                    </td>
                    <td className="table-td text-right font-bold">
                      {sale.balanceDue > 0 ? (
                        <span className="text-rose-600">{formatCurrency(sale.balanceDue)}</span>
                      ) : (
                        <span className="text-slate-400">₹0</span>
                      )}
                    </td>
                    <td className="table-td text-center">
                      <span className={sale.paymentStatus === 'Paid' ? 'badge-matte-success text-xs' : 'badge-matte-warning text-xs'}>
                        {sale.paymentStatus}
                      </span>
                    </td>
                    <td className="table-td text-right">
                      <button
                        onClick={() => setModalState(prev => ({ ...prev, viewInvoice: sale }))}
                        className="btn-secondary text-xs py-1.5 px-3 font-semibold"
                      >
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
