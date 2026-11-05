import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import {
  Truck,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  X,
  AlertCircle
} from 'lucide-react';

export const SuppliersPage = () => {
  const { suppliers, addSupplier } = useApp();

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    gstin: '',
    brands: '',
    address: '',
    paymentTerms: 'Net 30 Days'
  });
  const [error, setError] = useState('');

  const filteredSuppliers = suppliers.filter(s =>
    s.companyName.toLowerCase().includes(search.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    s.brands.toLowerCase().includes(search.toLowerCase()) ||
    s.gstin?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.phone.trim()) {
      setError('Company Name and Phone are required.');
      return;
    }
    addSupplier(formData);
    setFormData({
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      gstin: '',
      brands: '',
      address: '',
      paymentTerms: 'Net 30 Days'
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="card-matte p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Eyewear & Lens Suppliers
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Brand distributors (Luxottica, Essilor, Zeiss, Silhouette) and accounts
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-gold px-5 py-2.5 text-sm font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-slate-900" />
          <span>+ Add New Supplier</span>
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
            placeholder="Search suppliers by distributor name, brand (Ray-Ban, Essilor) or GSTIN..."
            className="input-field pl-11 text-sm py-3"
          />
        </div>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSuppliers.map((sup) => (
          <div
            key={sup.id}
            className="card-matte p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 hover:shadow-card-hover transition-all"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {sup.companyName}
                  </h3>
                  <p className="text-xs text-amber-900 font-bold mt-0.5">
                    Account Contact: {sup.contactPerson}
                  </p>
                </div>
                <span className="badge-matte-navy text-xs">
                  {sup.status || 'Active'}
                </span>
              </div>

              <div className="space-y-3 mt-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">
                    Product Lines Distributed:
                  </span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">
                    {sup.brands}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-slate-600 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-bold block">Contact</span>
                    <p className="font-bold text-slate-900 mt-0.5">{sup.phone}</p>
                    <p className="text-[11px] text-slate-500 truncate">{sup.email}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-bold block">GSTIN & Terms</span>
                    <p className="font-mono font-bold text-slate-900 mt-0.5">{sup.gstin || '27AAACL1456Q1ZV'}</p>
                    <p className="text-[11px] text-slate-500">{sup.paymentTerms || 'Net 30'}</p>
                  </div>
                </div>

                {sup.address && (
                  <p className="text-slate-500 text-xs flex items-start gap-1 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{sup.address}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Total Purchase: </span>
                <strong className="text-slate-900 font-bold">{formatCurrency(sup.totalPurchases || 0)}</strong>
              </div>
              <div>
                <span className="text-slate-400">Payable Balance: </span>
                <strong className={sup.outstandingPayable > 0 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                  {formatCurrency(sup.outstandingPayable || 0)}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-card-lg border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add Eyewear Distributor</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Agency Name *</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData(p => ({ ...p, companyName: e.target.value }))}
                  placeholder="e.g. Luxottica India Eyewear Pvt Ltd"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData(p => ({ ...p, contactPerson: e.target.value }))}
                    placeholder="e.g. Arjun Verma"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98112 55400"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="orders@vendor.com"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => setFormData(p => ({ ...p, gstin: e.target.value }))}
                    placeholder="06AAACL1456Q1ZV"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Eyewear Brands Distributed</label>
                <input
                  type="text"
                  value={formData.brands}
                  onChange={(e) => setFormData(p => ({ ...p, brands: e.target.value }))}
                  placeholder="e.g. Ray-Ban, Oakley, Vogue Eyewear"
                  className="input-field"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
