import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { X, Receipt, Plus, Trash2, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export const AddSaleModal = ({ isOpen, onClose, onSaleCreated }) => {
  const { customers, products, storeInfo, addSale } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [customerName, setCustomerName] = useState(customers[0]?.name || '');
  const [customerPhone, setCustomerPhone] = useState(customers[0]?.phone || '');
  const [optometrist, setOptometrist] = useState(storeInfo.optometrists?.[0]?.name || 'Shruti Daware');
  const [orderStatus, setOrderStatus] = useState('In Lab Processing');
  const [expectedPickupDate, setExpectedPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');

  // Lens add-ons library
  const lensOptions = [
    { label: 'Standard / None', price: 0 },
    { label: 'Essilor Crizal Prevencia 1.60 Blue-Cut', price: 4800 },
    { label: 'Zeiss DuraVision Platinum 1.67 Aspheric', price: 9200 },
    { label: 'Essilor Varilux Comfort Max Progressive', price: 14500 },
    { label: 'Single Vision Anti-Glare 1.56', price: 1800 },
    { label: 'Polycarbonate Sports Impact Resistant', price: 3200 },
    { label: 'Transitions Gen 8 Light Intelligent Photochromic', price: 6800 }
  ];

  // Sale line items
  const [items, setItems] = useState([
    {
      productId: products[0]?.id || '',
      name: products[0]?.name || '',
      brand: products[0]?.brand || '',
      category: products[0]?.category || 'Frames',
      quantity: 1,
      unitPrice: products[0]?.sellingPrice || 9990,
      discount: 0,
      lensOption: 'None',
      lensPrice: 0,
      total: products[0]?.sellingPrice || 9990
    }
  ]);

  const [paymentMethod, setPaymentMethod] = useState('UPI (Google Pay / PhonePe)');
  const [amountPaid, setAmountPaid] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCustomerChange = (e) => {
    const custId = e.target.value;
    setSelectedCustomerId(custId);
    const found = customers.find(c => c.id === custId);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
    }
  };

  const handleProductSelect = (index, prodId) => {
    const found = products.find(p => p.id === prodId);
    if (!found) return;

    setItems(prev => {
      const next = [...prev];
      const cur = next[index];
      const unitPrice = found.sellingPrice;
      const lensPrice = cur.lensPrice || 0;
      const qty = cur.quantity || 1;
      const discount = cur.discount || 0;
      const total = Math.max(0, (unitPrice + lensPrice) * qty - discount);

      next[index] = {
        ...cur,
        productId: found.id,
        name: found.name,
        brand: found.brand,
        category: found.category,
        unitPrice,
        total
      };
      return next;
    });
  };

  const handleLensSelect = (index, optionLabel) => {
    const opt = lensOptions.find(o => o.label === optionLabel) || { label: 'None', price: 0 };
    setItems(prev => {
      const next = [...prev];
      const cur = next[index];
      const lensPrice = opt.price;
      const unitPrice = cur.unitPrice || 0;
      const qty = cur.quantity || 1;
      const discount = cur.discount || 0;
      const total = Math.max(0, (unitPrice + lensPrice) * qty - discount);

      next[index] = {
        ...cur,
        lensOption: opt.label,
        lensPrice,
        total
      };
      return next;
    });
  };

  const handleItemFieldChange = (index, field, value) => {
    setItems(prev => {
      const next = [...prev];
      const cur = { ...next[index], [field]: value };
      const qty = field === 'quantity' ? Math.max(1, parseInt(value) || 1) : cur.quantity;
      const unitPrice = field === 'unitPrice' ? Math.max(0, parseFloat(value) || 0) : cur.unitPrice;
      const discount = field === 'discount' ? Math.max(0, parseFloat(value) || 0) : cur.discount;
      const lensPrice = cur.lensPrice || 0;
      const total = Math.max(0, (unitPrice + lensPrice) * qty - discount);

      next[index] = {
        ...cur,
        quantity: qty,
        unitPrice,
        discount,
        total
      };
      return next;
    });
  };

  const addItemRow = () => {
    const fallbackProd = products[0];
    setItems(prev => [
      ...prev,
      {
        productId: fallbackProd?.id || '',
        name: fallbackProd?.name || '',
        brand: fallbackProd?.brand || '',
        category: fallbackProd?.category || 'Frames',
        quantity: 1,
        unitPrice: fallbackProd?.sellingPrice || 5000,
        discount: 0,
        lensOption: 'None',
        lensPrice: 0,
        total: fallbackProd?.sellingPrice || 5000
      }
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  // Computations
  const subtotal = items.reduce((acc, it) => acc + (it.unitPrice + it.lensPrice) * it.quantity, 0);
  const discountTotal = items.reduce((acc, it) => acc + (it.discount || 0), 0);
  const taxableAmount = Math.max(0, subtotal - discountTotal);
  const taxPercent = storeInfo.taxRatePercent || 12;
  const taxAmount = Math.round(taxableAmount * (taxPercent / 100));
  const grandTotal = taxableAmount + taxAmount;

  // Paid vs Balance
  const effectivePaid = amountPaid === '' ? grandTotal : Math.min(grandTotal, Math.max(0, Number(amountPaid) || 0));
  const balanceDue = Math.max(0, grandTotal - effectivePaid);
  const paymentStatus = balanceDue === 0 ? 'Paid' : effectivePaid > 0 ? 'Partial' : 'Pending';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Please select or specify a customer.');
      return;
    }
    if (items.length === 0) {
      setError('Please add at least one item.');
      return;
    }

    const salePayload = {
      customerId: selectedCustomerId,
      customerName,
      customerPhone,
      optometrist,
      items,
      subtotal,
      discountTotal,
      taxPercent,
      taxAmount,
      grandTotal,
      amountPaid: effectivePaid,
      balanceDue,
      paymentStatus,
      orderStatus,
      paymentMethod,
      expectedPickupDate,
      notes
    };

    const createdSale = addSale(salePayload);
    onClose();
    if (onSaleCreated) {
      onSaleCreated(createdSale);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-card-lg border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header - Clean Light Matte */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Create New Customer Bill (POS)
              </h3>
              <p className="text-xs text-slate-500">
                Select frames, lenses, enter payment and generate tax invoice
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

        {/* POS Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Customer & Staff Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Customer *
              </label>
              <select
                value={selectedCustomerId}
                onChange={handleCustomerChange}
                className="select-field font-semibold"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dispensing Optometrist
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
                Order Status
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="select-field font-semibold"
              >
                <option value="Completed">Completed (Delivered OTC)</option>
                <option value="In Lab Processing">In Lab Processing</option>
                <option value="Ready for Pickup">Ready for Pickup</option>
              </select>
            </div>
          </div>

          {/* Line Items List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Selected Eyewear & Lens Items
              </h4>
              <button
                type="button"
                onClick={addItemRow}
                className="text-xs text-amber-900 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Another Product</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    {/* Product Select */}
                    <div className="sm:col-span-5">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Select Frame / Sunglasses / Item
                      </label>
                      <select
                        value={item.productId}
                        onChange={(e) => handleProductSelect(idx, e.target.value)}
                        className="select-field text-xs py-2"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.brand} - {p.name} ({formatCurrency(p.sellingPrice)}) [Stock: {p.stock}]
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Lens Customization */}
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Prescription Lens Add-on
                      </label>
                      <select
                        value={item.lensOption}
                        onChange={(e) => handleLensSelect(idx, e.target.value)}
                        className="select-field text-xs py-2"
                      >
                        {lensOptions.map((opt, i) => (
                          <option key={i} value={opt.label}>
                            {opt.label} {opt.price > 0 ? `(+${formatCurrency(opt.price)})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Qty */}
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1 text-center">
                        Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemFieldChange(idx, 'quantity', e.target.value)}
                        className="input-field text-xs py-2 text-center"
                      />
                    </div>

                    {/* Total & Remove */}
                    <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-bold">Total</span>
                        <span className="text-sm font-bold text-slate-900">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-slate-200">
            {/* Payment Mode */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Method *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="select-field"
                >
                  <option value="UPI (Google Pay / PhonePe / Paytm)">UPI (Google Pay / PhonePe)</option>
                  <option value="Card (Credit / Debit POS)">Card (Credit / Debit POS)</option>
                  <option value="Cash">Cash Currency</option>
                  <option value="Split (Cash + UPI)">Split (Cash + UPI)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount Paid Now (₹)
                  </label>
                  <input
                    type="number"
                    value={amountPaid === '' ? grandTotal : amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="input-field font-bold text-emerald-800"
                    min="0"
                    max={grandTotal}
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Full payment = no balance
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    value={expectedPickupDate}
                    onChange={(e) => setExpectedPickupDate(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Workshop / Lab Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Center PD carefully, high edge polish..."
                  className="input-field"
                />
              </div>
            </div>

            {/* Calculations Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Items:</span>
                <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST Tax (12%):</span>
                <span className="font-bold text-slate-900">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between py-2 text-base font-bold text-slate-900 border-y border-slate-200">
                <span>Grand Total:</span>
                <span className="text-xl text-slate-950 font-bold">{formatCurrency(grandTotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Paid Now:</span>
                <span>{formatCurrency(effectivePaid)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm">
                <span>Balance Due:</span>
                <span className={balanceDue > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                  {formatCurrency(balanceDue)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
              <Receipt className="w-4 h-4 text-slate-900" />
              <span>Generate Invoice & Record Sale</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
