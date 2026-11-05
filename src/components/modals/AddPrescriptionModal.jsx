import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Eye, AlertCircle } from 'lucide-react';

export const AddPrescriptionModal = ({ isOpen, onClose, defaultCustomer = null }) => {
  const { customers, storeInfo, addPrescription } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState(defaultCustomer ? defaultCustomer.id : (customers[0]?.id || ''));
  const [customerName, setCustomerName] = useState(defaultCustomer ? defaultCustomer.name : (customers[0]?.name || ''));
  const [customerPhone, setCustomerPhone] = useState(defaultCustomer ? defaultCustomer.phone : (customers[0]?.phone || ''));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [optometristName, setOptometristName] = useState(storeInfo.optometrists?.[0]?.name || 'Shruti Daware (B.Optom)');

  // Right Eye (OD)
  const [od, setOd] = useState({
    sph: '-1.50',
    cyl: '-0.50',
    axis: '90',
    add: '+1.75',
    va: '6/6',
    pd: '31.0'
  });

  // Left Eye (OS)
  const [os, setOs] = useState({
    sph: '-1.75',
    cyl: '-0.50',
    axis: '85',
    add: '+1.75',
    va: '6/6',
    pd: '31.0'
  });

  const [totalPd, setTotalPd] = useState('62.0');
  const [lensRecommendation, setLensRecommendation] = useState('Essilor Crizal Prevencia 1.60 Blue-Cut Anti-Reflective');
  const [notes, setNotes] = useState('Mild astigmatic correction. Advised 420nm blue shield protection for extended screen sessions.');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCustomerSelect = (e) => {
    const custId = e.target.value;
    setSelectedCustomerId(custId);
    const found = customers.find(c => c.id === custId);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
    }
  };

  const handleOdChange = (field, val) => {
    setOd(prev => ({ ...prev, [field]: val }));
    if (field === 'pd') {
      const sum = (parseFloat(val) || 0) + (parseFloat(os.pd) || 0);
      if (sum > 0) setTotalPd(sum.toFixed(1));
    }
  };

  const handleOsChange = (field, val) => {
    setOs(prev => ({ ...prev, [field]: val }));
    if (field === 'pd') {
      const sum = (parseFloat(od.pd) || 0) + (parseFloat(val) || 0);
      if (sum > 0) setTotalPd(sum.toFixed(1));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Please select or specify a customer name.');
      return;
    }

    addPrescription({
      customerId: selectedCustomerId,
      customerName,
      customerPhone,
      date,
      optometristName,
      od,
      os,
      totalPd,
      lensRecommendation,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-card-lg border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header - Clean Light Matte */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Write Optical Prescription (Rx)
              </h3>
              <p className="text-xs text-slate-500">
                Record Right Eye (OD) and Left Eye (OS) powers, Near ADD and PD
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Patient and Optometrist row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Patient / Customer *
              </label>
              <select
                value={selectedCustomerId}
                onChange={handleCustomerSelect}
                className="select-field font-semibold"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Examining Optometrist *
              </label>
              <select
                value={optometristName}
                onChange={(e) => setOptometristName(e.target.value)}
                className="select-field"
              >
                {storeInfo.optometrists.map(opt => (
                  <option key={opt.id} value={`${opt.name} (${opt.qualification.split(',')[0]})`}>
                    {opt.name} ({opt.qualification.split(',')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Refraction Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Medical Optical Refraction Grid - Clean High Readability */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            {/* Right Eye (OD) */}
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                OD — Right Eye
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">SPH</label>
                  <input
                    type="text"
                    value={od.sph}
                    onChange={(e) => handleOdChange('sph', e.target.value)}
                    placeholder="-1.50"
                    className="input-field text-center font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">CYL</label>
                  <input
                    type="text"
                    value={od.cyl}
                    onChange={(e) => handleOdChange('cyl', e.target.value)}
                    placeholder="-0.50"
                    className="input-field text-center font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">AXIS</label>
                  <input
                    type="text"
                    value={od.axis}
                    onChange={(e) => handleOdChange('axis', e.target.value)}
                    placeholder="90"
                    className="input-field text-center font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-700 mb-1">Near ADD</label>
                  <input
                    type="text"
                    value={od.add}
                    onChange={(e) => handleOdChange('add', e.target.value)}
                    placeholder="+1.75"
                    className="input-field text-center font-mono font-bold text-amber-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">V/A</label>
                  <input
                    type="text"
                    value={od.va}
                    onChange={(e) => handleOdChange('va', e.target.value)}
                    placeholder="6/6"
                    className="input-field text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">PD (mm)</label>
                  <input
                    type="text"
                    value={od.pd}
                    onChange={(e) => handleOdChange('pd', e.target.value)}
                    placeholder="31.0"
                    className="input-field text-center font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Left Eye (OS) */}
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                OS — Left Eye
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">SPH</label>
                  <input
                    type="text"
                    value={os.sph}
                    onChange={(e) => handleOsChange('sph', e.target.value)}
                    placeholder="-1.75"
                    className="input-field text-center font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">CYL</label>
                  <input
                    type="text"
                    value={os.cyl}
                    onChange={(e) => handleOsChange('cyl', e.target.value)}
                    placeholder="-0.50"
                    className="input-field text-center font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">AXIS</label>
                  <input
                    type="text"
                    value={os.axis}
                    onChange={(e) => handleOsChange('axis', e.target.value)}
                    placeholder="85"
                    className="input-field text-center font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-700 mb-1">Near ADD</label>
                  <input
                    type="text"
                    value={os.add}
                    onChange={(e) => handleOsChange('add', e.target.value)}
                    placeholder="+1.75"
                    className="input-field text-center font-mono font-bold text-amber-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">V/A</label>
                  <input
                    type="text"
                    value={os.va}
                    onChange={(e) => handleOsChange('va', e.target.value)}
                    placeholder="6/6"
                    className="input-field text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">PD (mm)</label>
                  <input
                    type="text"
                    value={os.pd}
                    onChange={(e) => handleOsChange('pd', e.target.value)}
                    placeholder="31.0"
                    className="input-field text-center font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">Total Binocular PD:</span>
                <input
                  type="text"
                  value={totalPd}
                  onChange={(e) => setTotalPd(e.target.value)}
                  className="w-20 input-field text-center font-bold font-mono py-1"
                />
                <span className="text-slate-500">mm</span>
              </div>
              <span className="text-slate-400">Normal PD: 58mm - 68mm</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Recommended Lens Design & Treatment
            </label>
            <input
              type="text"
              value={lensRecommendation}
              onChange={(e) => setLensRecommendation(e.target.value)}
              placeholder="e.g. Progressive 1.60 Index with Blue-UV Protection"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Optometrist Remarks & Patient Advice
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Clinical observations, trial frame feedback..."
              className="input-field"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gold font-bold px-6 py-2.5"
            >
              Record Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
