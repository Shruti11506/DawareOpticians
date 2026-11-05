import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  CreditCard,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  LayoutGrid,
  List
} from 'lucide-react';

export const PaymentsPage = () => {
  const {
    payments,
    metrics,
    setModalState
  } = useApp();

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  const filteredPayments = payments.filter(p => {
    const matchesSearch =
      p.receiptNo?.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.referenceNo?.toLowerCase().includes(search.toLowerCase());

    const matchesMethod =
      methodFilter === 'All' || p.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase());

    return matchesSearch && matchesMethod;
  });

  const totalCollectedAllTime = payments.reduce((acc, p) => acc + p.amountPaid, 0);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="card-matte p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Payment Records & Customer Dues
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track UPI, Card and Cash payments and collect customer balances
          </p>
        </div>

        <button
          onClick={() => setModalState(prev => ({ ...prev, recordPayment: true }))}
          className="btn-gold px-5 py-2.5 text-sm font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-slate-900" />
          <span>+ Record Payment</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="card-matte p-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Money Collected
          </span>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {formatCurrency(totalCollectedAllTime)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Cleared through UPI, Card POS & Cash
          </p>
        </div>

        <div className="card-matte p-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Customer Balance Dues
          </span>
          <p className="text-3xl font-bold text-rose-600 mt-1">
            {formatCurrency(metrics.pendingPaymentsAmount)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Across {metrics.pendingPaymentsCount} customer orders
          </p>
        </div>

        <div className="card-matte p-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Preferred Payment Modes
          </span>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="badge-matte-navy text-xs">UPI 55%</span>
            <span className="badge-matte-gold text-xs">Card 30%</span>
            <span className="badge-matte-neutral text-xs">Cash 15%</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Digital payments verified
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card-matte p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by receipt number (REC-...), customer name, or txn reference..."
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
      </div>

      {/* Payment Display: CASD VIEW */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPayments.map((pay) => (
            <div
              key={pay.id}
              className="card-matte p-5 hover:border-slate-300 hover:shadow-card-hover transition-all space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                  {pay.receiptNo || 'REC-001'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {formatDate(pay.date)}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {pay.customerName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Invoice: {pay.invoiceNo}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="text-base font-bold text-emerald-700">{formatCurrency(pay.amountPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-semibold text-slate-900">{pay.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Balance Remaining:</span>
                  <span className={`font-bold ${pay.outstandingAfter > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                    {formatCurrency(pay.outstandingAfter)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="card-matte overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-th">Receipt #</th>
                  <th className="table-th">Customer</th>
                  <th className="table-th">Invoice #</th>
                  <th className="table-th text-right">Amount Paid</th>
                  <th className="table-th text-right">Remaining Due</th>
                  <th className="table-th">Method</th>
                  <th className="table-th text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/70">
                    <td className="table-td font-mono font-bold text-slate-900">
                      {pay.receiptNo || 'REC-001'}
                    </td>
                    <td className="table-td font-bold text-slate-900 text-sm">
                      {pay.customerName}
                    </td>
                    <td className="table-td font-mono text-slate-600">
                      {pay.invoiceNo}
                    </td>
                    <td className="table-td text-right font-bold text-emerald-700 text-base">
                      {formatCurrency(pay.amountPaid)}
                    </td>
                    <td className="table-td text-right font-bold">
                      {pay.outstandingAfter > 0 ? (
                        <span className="text-rose-600">{formatCurrency(pay.outstandingAfter)}</span>
                      ) : (
                        <span className="text-slate-400">₹0</span>
                      )}
                    </td>
                    <td className="table-td font-medium text-slate-800">
                      {pay.paymentMethod}
                    </td>
                    <td className="table-td text-center">
                      <span className={pay.status === 'Completed' ? 'badge-matte-success text-xs' : 'badge-matte-warning text-xs'}>
                        {pay.status}
                      </span>
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
