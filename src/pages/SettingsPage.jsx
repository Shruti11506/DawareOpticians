import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Building,
  Users,
  Save,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

export const SettingsPage = () => {
  const { storeInfo, setStoreInfo, resetToSampleData, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: storeInfo.name || 'DAWARE OPTICIANS',
    tagline: storeInfo.tagline || 'Precision Eyecare & Luxury Eyewear',
    address: storeInfo.address || '',
    phone: storeInfo.phone || '',
    email: storeInfo.email || '',
    gstin: storeInfo.gstin || '',
    optometristLicense: storeInfo.optometristLicense || '',
    taxRatePercent: storeInfo.taxRatePercent || 12,
    workingHours: storeInfo.workingHours || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setStoreInfo(prev => ({
      ...prev,
      ...formData,
      taxRatePercent: Number(formData.taxRatePercent) || 12
    }));
    showToast('Store settings saved successfully.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header Card */}
      <div className="card-matte p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Store Profile & Configuration
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            DAWARE OPTICIANS clinic credentials, GST rates and authorized optometrists
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-gold px-5 py-2.5 text-sm font-bold flex items-center gap-2"
        >
          <Save className="w-4 h-4 text-slate-900" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Credentials Card */}
        <div className="card-matte p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-700" />
            <span>Clinic & Store Business Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Store / Clinic Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Store Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Store Physical Address (Printed on Invoices & Prescription Slips)
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Store Phone Contacts
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Store Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                GSTIN Tax Number
              </label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                className="input-field font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Optometry Clinic License
              </label>
              <input
                type="text"
                name="optometristLicense"
                value={formData.optometristLicense}
                onChange={handleChange}
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default Optical GST Tax (%)
              </label>
              <input
                type="number"
                name="taxRatePercent"
                value={formData.taxRatePercent}
                onChange={handleChange}
                className="input-field font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Working Store Timings
            </label>
            <input
              type="text"
              name="workingHours"
              value={formData.workingHours}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        {/* Staff Optometrists Roster */}
        <div className="card-matte p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-700" />
            <span>Authorized Optometrists & Clinicians</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {storeInfo.optometrists.map(opt => (
              <div key={opt.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <span className="badge-matte-navy text-[10px] mb-1">Authorized</span>
                <p className="font-bold text-slate-900 text-sm mt-1">{opt.name}</p>
                <p className="text-amber-900 font-bold">{opt.qualification}</p>
                <p className="text-slate-500 mt-1">{opt.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Demo Data Card */}
        <div className="card-matte p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Reset Demonstration Catalog
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Restore default sample frames, patients, prescriptions and invoices.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset store data back to default sample records?')) {
                resetToSampleData();
              }
            }}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Reset Demo Records</span>
          </button>
        </div>
      </form>
    </div>
  );
};
