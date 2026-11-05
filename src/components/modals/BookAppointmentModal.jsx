import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, AlertCircle } from 'lucide-react';

export const BookAppointmentModal = ({ isOpen, onClose }) => {
  const { customers, storeInfo, addAppointment } = useApp();

  const [customerName, setCustomerName] = useState(customers[0]?.name || '');
  const [phone, setPhone] = useState(customers[0]?.phone || '');
  const [email, setEmail] = useState(customers[0]?.email || '');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('11:00 AM');
  const [optometrist, setOptometrist] = useState(storeInfo.optometrists?.[0]?.name || 'Shruti Daware');
  const [purpose, setPurpose] = useState('Comprehensive Eye Examination');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCustomerSelect = (e) => {
    const val = e.target.value;
    setCustomerName(val);
    const found = customers.find(c => c.name === val);
    if (found) {
      setPhone(found.phone);
      setEmail(found.email || '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      setError('Patient name and contact phone are required.');
      return;
    }

    addAppointment({
      customerName,
      phone,
      email,
      date,
      time,
      optometrist,
      purpose,
      notes
    });

    onClose();
  };

  const purposes = [
    'Comprehensive Eye Examination',
    'Progressive Lens Trial & PD Centration',
    'Contact Lens Trial & Fitting',
    'Paediatric Vision Screening',
    'Frame Styling & Bespoke Fitting'
  ];

  const timeSlots = [
    '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
    '02:00 PM', '02:30 PM', '03:15 PM', '04:00 PM',
    '05:00 PM', '06:30 PM'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-card-lg border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header - Clean Light Matte */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Book Eye Examination Slot
              </h3>
              <p className="text-xs text-slate-500">
                Reserve clinical testing slot for refraction & frame fitting
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Patient / Customer Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={handleCustomerSelect}
              list="cust-names-apt"
              placeholder="e.g. Vikramaditya Singhania"
              className="input-field font-semibold"
              required
            />
            <datalist id="cust-names-apt">
              {customers.map(c => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98201 12345"
                className="input-field font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@example.com"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Appointment Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Time Slot
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="select-field font-semibold"
              >
                {timeSlots.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Optometrist
            </label>
            <select
              value={optometrist}
              onChange={(e) => setOptometrist(e.target.value)}
              className="select-field"
            >
              {storeInfo.optometrists.map(opt => (
                <option key={opt.id} value={opt.name}>{opt.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Purpose of Visit
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="select-field"
            >
              {purposes.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clinical Notes / Complaints
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Headache complaints, difficulty reading fine print..."
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
              className="btn-primary"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
