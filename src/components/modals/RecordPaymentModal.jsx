import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { X, CreditCard, AlertCircle } from 'lucide-react';

export const RecordPaymentModal = ({ isOpen, onClose, invoice = null }) => {
  const { sales, recordPayment } = useApp();

  const unpaidSales = sales.filter(s => s.balanceDue > 0);
  const [selectedInvoiceNo, setSelectedInvoiceNo] = useState(invoice?.invoiceNo || unpaidSales[0]?.invoiceNo || '');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [referenceNo, setReferenceNo] = useState('');
  const [error, setError] = useState('');

  const activeSale = sales.find(s => s.invoiceNo === selectedInvoiceNo);

  useEffect(() => {
    if (invoice) {
      setSelectedInvoiceNo(invoice.invoiceNo);
      setAmount(String(invoice.balanceDue));
    } else if (unpaidSales.length > 0) {
      setSelectedInvoiceNo(unpaidSales[0].invoiceNo);
      setAmount(String(unpaidSales[0].balanceDue));
    }
    setError('');
  }, [invoice, isOpen]);

  useEffect(() => {
    if (activeSale) {
      setAmount(String(activeSale.balanceDue));
    }
  }, [selectedInvoiceNo]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeSale) {
      setError('Please select an active invoice.');
      return;
    }
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }
    if (numAmount > activeSale.balanceDue) {
      setError(`Payment cannot exceed outstanding balance of ${formatCurrency(activeSale.balanceDue)}.`);
      return;
    }

    recordPayment(selectedInvoiceNo, numAmount, paymentMethod, referenceNo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-card-lg border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header - Clean Light Matte */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Collect Payment / Installment
              </h3>
              <p className="text-xs text-slate-500">
                Log customer balance settlement into store records
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
              Select Invoice with Dues *
            </label>
            <select
              value={selectedInvoiceNo}
              onChange={(e) => setSelectedInvoiceNo(e.target.value)}
              className="select-field font-semibold"
            >
              {unpaidSales.length === 0 ? (
                <option value="">No outstanding bills</option>
              ) : (
                unpaidSales.map(s => (
                  <option key={s.id} value={s.invoiceNo}>
                    {s.invoiceNo} — {s.customerName} (Due: {formatCurrency(s.balanceDue)})
                  </option>
                ))
              )}
            </select>
          </div>

          {activeSale && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Customer:</span>
                <span className="font-bold text-slate-900">{activeSale.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Invoice:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(activeSale.grandTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Already Paid:</span>
                <span className="text-emerald-700 font-bold">{formatCurrency(activeSale.amountPaid)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-amber-200/60">
                <span className="text-slate-800">Remaining Due:</span>
                <span className="text-rose-600">{formatCurrency(activeSale.balanceDue)}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Amount Received Now (₹) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 2500"
              className="input-field font-bold text-base text-slate-900"
              min="1"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="select-field font-semibold"
              >
                <option value="UPI">UPI (Google Pay / PhonePe)</option>
                <option value="Card">Card POS (Credit / Debit)</option>
                <option value="Cash">Cash Currency</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reference / Note
              </label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="e.g. UPI Ref / Cash receipt"
                className="input-field"
              />
            </div>
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
              className="btn-gold font-bold px-5 py-2.5"
              disabled={!activeSale}
            >
              Record Payment Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
