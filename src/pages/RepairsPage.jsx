import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Wrench,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const RepairsPage = () => {
  const { repairs, updateRepairStatus, setModalState } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredRepairs = repairs.filter(r => {
    const matchesSearch =
      r.jobNo.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.itemDetails.toLowerCase().includes(search.toLowerCase()) ||
      r.serviceType?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="card-matte p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Optical Workshop, Repairs & Services
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track spectacle frame repairs, screw replacements and ultrasonic servicing
          </p>
        </div>

        <button
          onClick={() => setModalState(prev => ({ ...prev, addRepair: true }))}
          className="btn-gold px-5 py-2.5 text-sm font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-slate-900" />
          <span>+ Log Repair Job</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-matte p-5 space-y-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job number (REP-...), customer name or frame details..."
            className="input-field pl-11 text-sm py-3"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'Received', 'In Progress', 'Ready for Pickup', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Repairs in CASD FORMAT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRepairs.map((rep) => (
          <div
            key={rep.id}
            className="card-matte p-6 hover:border-slate-300 hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-md">
                  {rep.jobNo}
                </span>
                <span className={
                  rep.status === 'Delivered' ? 'badge-matte-success text-xs' :
                  rep.status === 'Ready for Pickup' ? 'badge-matte-gold text-xs' :
                  rep.status === 'In Progress' ? 'badge-matte-navy text-xs' :
                  'badge-matte-neutral text-xs'
                }>
                  {rep.status}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {rep.customerName}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Phone: {rep.customerPhone}
                </p>
              </div>

              {/* Item Details Box */}
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Frame / Item:
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{rep.itemDetails}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                    Service Required:
                  </span>
                  <p className="font-semibold text-slate-700">{rep.serviceType}</p>
                  <p className="text-slate-500 italic mt-0.5">"{rep.description}"</p>
                </div>
              </div>

              {/* Technician & Due Date */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Tech: <strong className="text-slate-800">{rep.technician || 'Ramesh Mestry'}</strong></span>
                <span>Expected: <strong className="text-slate-800">{formatDate(rep.expectedDate)}</strong></span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Service Charge:</span>
                <span className="text-base font-bold text-slate-900">
                  {formatCurrency(rep.serviceCharge)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Status:</span>
                <select
                  value={rep.status}
                  onChange={(e) => updateRepairStatus(rep.id, e.target.value)}
                  className="text-xs font-bold py-1.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none"
                >
                  <option value="Received">Received</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Ready for Pickup">Ready for Pickup</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
