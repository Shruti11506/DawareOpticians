import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Users, AlertCircle, Loader2 } from 'lucide-react';

export const AddCustomerModal = ({ isOpen, onClose, editCustomer = null }) => {
  const { addCustomer, updateCustomer } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: 'Male',
    age: '',
    address: '',
    tag: 'Regular',
    notes: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editCustomer) {
      setFormData({
        name: editCustomer.name || editCustomer.full_name || '',
        phone: editCustomer.phone || '',
        email: editCustomer.email || '',
        gender: editCustomer.gender || 'Male',
        age: editCustomer.age ? String(editCustomer.age) : '',
        address: editCustomer.address || '',
        tag: editCustomer.tag || 'Regular',
        notes: editCustomer.notes || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        gender: 'Male',
        age: '',
        address: '',
        tag: 'Regular',
        notes: ''
      });
    }
    setError('');
    setIsSubmitting(false);
  }, [editCustomer, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Customer Name and Contact Phone are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (editCustomer) {
        await updateCustomer(editCustomer.id, {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          address: formData.address.trim() || null
        });
      } else {
        await addCustomer({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          address: formData.address.trim() || null
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save customer record to MySQL.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-card-lg border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header - Clean Light Matte */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {editCustomer ? 'Edit Customer Details' : 'Register New Customer'}
              </h3>
              <p className="text-xs text-slate-500">
                Save customer details, contact info and optical preferences
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
              Customer Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Vikramaditya Singhania"
              className="input-field font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number (WhatsApp / Calling) *
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98201 12345"
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="customer@example.com"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="select-field"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="45"
                className="input-field"
                min="1"
                max="120"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Client Category
              </label>
              <select
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                className="select-field font-semibold"
              >
                <option value="Regular">Regular</option>
                <option value="VIP">VIP Client</option>
                <option value="Frequent">Frequent Buyer</option>
                <option value="New">New Walk-in</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Residential Area / Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Bandra West, Mumbai"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Customer Preferences & Optical Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              placeholder="e.g. Prefers lightweight titanium, screen fatigue complaints..."
              className="input-field"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-white" />}
              <span>
                {isSubmitting
                  ? (editCustomer ? 'Updating in MySQL...' : 'Saving in MySQL...')
                  : (editCustomer ? 'Update Customer' : 'Save Customer Record')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
