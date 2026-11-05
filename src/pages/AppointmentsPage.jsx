import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/formatters';
import {
  Calendar,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  Phone
} from 'lucide-react';

export const AppointmentsPage = () => {
  const {
    appointments,
    updateAppointmentStatus,
    setModalState
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch =
      a.customerName.toLowerCase().includes(search.toLowerCase()) ||
      a.phone?.toLowerCase().includes(search.toLowerCase()) ||
      a.purpose?.toLowerCase().includes(search.toLowerCase()) ||
      a.optometrist?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="card-matte p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Eye Examination & Fitting Appointments
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Schedule customer eye checks, progressive fittings and consultation slots
          </p>
        </div>

        <button
          onClick={() => setModalState(prev => ({ ...prev, bookAppointment: true }))}
          className="btn-gold px-5 py-2.5 text-sm font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-slate-900" />
          <span>+ Book Appointment</span>
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
            placeholder="Search by patient name, contact number, optometrist or purpose..."
            className="input-field pl-11 text-sm py-3"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((st) => (
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

      {/* Appointments in CASD FORMAT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAppointments.map((apt) => (
          <div
            key={apt.id}
            className="card-matte p-6 hover:border-slate-300 hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                  {apt.appointmentNo || 'APT-001'}
                </span>
                <span className={
                  apt.status === 'Confirmed' ? 'badge-matte-success text-xs' :
                  apt.status === 'Pending' ? 'badge-matte-warning text-xs' :
                  apt.status === 'Completed' ? 'badge-matte-navy text-xs' :
                  'badge-matte-neutral text-xs'
                }>
                  {apt.status}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {apt.customerName}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Phone: {apt.phone}
                </p>
              </div>

              {/* Purpose Box */}
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Purpose of Visit:
                </span>
                <p className="font-bold text-slate-900 text-sm">{apt.purpose}</p>
                <p className="text-slate-500 font-medium">With {apt.optometrist}</p>
              </div>

              {/* Date & Time */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(apt.date)}
                </span>
                <span className="flex items-center gap-1.5 font-bold font-mono text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  {apt.time}
                </span>
              </div>
            </div>

            {/* Status Switcher Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              <select
                value={apt.status}
                onChange={(e) => updateAppointmentStatus(apt.id, e.target.value)}
                className="text-xs font-bold py-1.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
