import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/formatters';
import {
  FileText,
  Search,
  Plus,
  Printer,
  Eye,
  Calendar,
  Sparkles
} from 'lucide-react';

export const PrescriptionsPage = () => {
  const {
    prescriptions,
    setModalState,
    storeInfo
  } = useApp();

  const [search, setSearch] = useState('');

  const filteredPrescriptions = prescriptions.filter(rx =>
    rx.prescriptionNo.toLowerCase().includes(search.toLowerCase()) ||
    rx.customerName.toLowerCase().includes(search.toLowerCase()) ||
    rx.customerPhone?.toLowerCase().includes(search.toLowerCase()) ||
    rx.lensRecommendation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="card-matte p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Eye Refraction Prescriptions (Rx)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Clinical eye check records with Right (OD) & Left (OS) eye power numbers
          </p>
        </div>

        <button
          onClick={() => setModalState(prev => ({ ...prev, addPrescription: true }))}
          className="btn-gold px-5 py-2.5 text-sm font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-slate-900" />
          <span>+ Write New Prescription</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="card-matte p-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prescriptions by patient name, phone number, or prescription number (RX-...)..."
            className="input-field pl-11 text-sm py-3"
          />
        </div>
      </div>

      {/* Prescriptions in CASD FORMAT (Easy for anyone to read) */}
      <div className="space-y-4">
        {filteredPrescriptions.length === 0 ? (
          <div className="card-matte py-12 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-base font-bold text-slate-700">No prescriptions found</p>
            <p className="text-xs text-slate-400 mt-1">Click "+ Write New Prescription" to record an eye test.</p>
          </div>
        ) : (
          filteredPrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="card-matte p-6 hover:border-slate-300 hover:shadow-card-hover transition-all space-y-4"
            >
              {/* Prescription Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                    {rx.prescriptionNo}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {rx.customerName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Phone: {rx.customerPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left sm:text-right text-xs">
                    <p className="text-slate-800 font-bold">
                      Exam Date: {formatDate(rx.date)}
                    </p>
                    <p className="text-slate-500 font-medium">{rx.optometristName}</p>
                  </div>

                  <button
                    onClick={() => setModalState(prev => ({ ...prev, viewPrescription: rx }))}
                    className="btn-secondary text-xs py-2 px-3.5 font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-700" />
                    <span>Print Rx Slip</span>
                  </button>
                </div>
              </div>

              {/* Eye Power Box (OD & OS) - Crystal Clear Medical Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Right Eye (OD) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Right Eye (OD)
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      PD: <strong>{rx.od.pd || '31.0'} mm</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                    <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                      <span className="text-[11px] font-bold text-slate-400 block">SPH</span>
                      <span className="text-base font-bold text-slate-900 font-mono">{rx.od.sph}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                      <span className="text-[11px] font-bold text-slate-400 block">CYL</span>
                      <span className="text-base font-bold text-slate-900 font-mono">{rx.od.cyl}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                      <span className="text-[11px] font-bold text-slate-400 block">AXIS</span>
                      <span className="text-base font-bold text-slate-900 font-mono">{rx.od.axis ? `${rx.od.axis}°` : '-'}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                      <span className="text-[11px] font-bold text-amber-700 block">ADD</span>
                      <span className="text-base font-bold text-slate-900 font-mono">{rx.od.add}</span>
                    </div>
                  </div>
                </div>

                {/* Left Eye (OS) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Left Eye (OS)
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      PD: <strong>{rx.os.pd || '31.0'} mm</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                    <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                      <span className="text-[11px] font-bold text-slate-400 block">SPH</span>
                      <span className="text-base font-bold text-slate-900 font-mono">{rx.os.sph}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                      <span className="text-[11px] font-bold text-slate-400 block">CYL</span>
                      <span className="text-base font-bold text-slate-900 font-mono">{rx.os.cyl}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                      <span className="text-[11px] font-bold text-slate-400 block">AXIS</span>
                      <span className="text-base font-bold text-slate-900 font-mono">{rx.os.axis ? `${rx.os.axis}°` : '-'}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                      <span className="text-[11px] font-bold text-amber-700 block">ADD</span>
                      <span className="text-base font-bold text-slate-900 font-mono">{rx.os.add}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lens Recommendation & Remarks */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                    Prescribed Lens Treatment:
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {rx.lensRecommendation || 'Digital Single Vision 1.60 Index Anti-Reflective'}
                  </p>
                  {rx.notes && (
                    <p className="text-slate-600 italic mt-0.5">
                      Doctor's Note: "{rx.notes}"
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-500 block">Total Binocular PD:</span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {rx.totalPd || '62.0'} mm
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
