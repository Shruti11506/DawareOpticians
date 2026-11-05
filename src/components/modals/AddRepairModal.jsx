import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Wrench, AlertCircle } from 'lucide-react';

export const AddRepairModal = ({ isOpen, onClose }) => {
  const { customers, addRepair } = useApp();

  const [customerName, setCustomerName] = useState(customers[0]?.name || '');
  const [customerPhone, setCustomerPhone] = useState(customers[0]?.phone || '');
  const [itemDetails, setItemDetails] = useState('');
  const [serviceType, setServiceType] = useState('Temple Hinge Screw & Ultrasonic Cleaning');
  const [description, setDescription] = useState('');
  const [serviceCharge, setServiceCharge] = useState('500');
  const [advancePaid, setAdvancePaid] = useState('500');
  const [technician, setTechnician] = useState('Ramesh Mestry (Master Technician)');
  const [priority, setPriority] = useState('Normal');
  const [expectedDate, setExpectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCustomerSelect = (e) => {
    const found = customers.find(c => c.name === e.target.value);
    setCustomerName(e.target.value);
    if (found) {
      setCustomerPhone(found.phone);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !itemDetails.trim()) {
      setError('Customer name and frame/item details are required.');
      return;
    }

    addRepair({
      customerName,
      customerPhone,
      itemDetails,
      serviceType,
      description: description || serviceType,
      serviceCharge: Number(serviceCharge) || 0,
      advancePaid: Number(advancePaid) || 0,
      technician,
      priority,
      expectedDate
    });

    onClose();
  };

  const servicePresets = [
    'Temple Hinge Screw & Ultrasonic Cleaning',
    'Rimless Bushing & Compression Pin Mounting',
    'Acetate Deep Polish & Nose Pad Refresh',
    'Frame Alignment & 4-Point Symmetry Restoration',
    'Lens Remounting & Bevel Recutting'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-card-lg border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header - Clean Light Matte */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Log Spectacle Repair Job
              </h3>
              <p className="text-xs text-slate-500">
                Frame tuning, screw fitting and lens mounting job card
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={handleCustomerSelect}
                list="cust-names"
                placeholder="e.g. Vikramaditya Singhania"
                className="input-field font-semibold"
                required
              />
              <datalist id="cust-names">
                {customers.map(c => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98201 12345"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Frame / Item Details *
            </label>
            <input
              type="text"
              value={itemDetails}
              onChange={(e) => setItemDetails(e.target.value)}
              placeholder="e.g. Silhouette TMA Rimless Titanium Frame"
              className="input-field font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Service Type
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="select-field"
              >
                {servicePresets.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Technician
              </label>
              <select
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="select-field font-semibold"
              >
                <option value="Ramesh Mestry (Master Technician)">Ramesh Mestry (Master Tech)</option>
                <option value="Dinesh Kadam (Optical Fitter)">Dinesh Kadam (Optical Fitter)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Service Charge (₹)
              </label>
              <input
                type="number"
                value={serviceCharge}
                onChange={(e) => setServiceCharge(e.target.value)}
                className="input-field font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Advance Paid (₹)
              </label>
              <input
                type="number"
                value={advancePaid}
                onChange={(e) => setAdvancePaid(e.target.value)}
                className="input-field font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expected Ready Date
              </label>
              <input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Issue Description / Workshop Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="e.g. Left temple sheared, nose pad replacement..."
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
              Create Repair Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
