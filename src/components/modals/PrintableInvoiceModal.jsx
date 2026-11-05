import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Printer, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PrintableInvoiceModal = ({ invoice, onClose }) => {
  const { storeInfo } = useApp();

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-soft-lg border border-slate-200 overflow-hidden my-8">
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-navy-900 text-white border-b border-navy-800">
          <div className="flex items-center gap-3">
            <span className="badge-gold">Tax Invoice Preview</span>
            <span className="text-sm font-semibold tracking-wide">
              {invoice.invoiceNo}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-gold text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="print-container p-8 sm:p-10 text-slate-800 bg-white">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b-2 border-slate-900">
            <div>
              {/* Official Supplied Logo */}
              <div className="flex items-center gap-3">
                <img
                  src="/logo-navy.png"
                  alt="DAWARE OPTICIANS"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <p className="text-xs font-semibold text-gold-700 tracking-wider uppercase mt-1">
                {storeInfo.tagline || 'Precision Eyecare & Luxury Eyewear'}
              </p>
              <p className="text-xs text-slate-600 mt-2 max-w-md leading-relaxed">
                {storeInfo.address}
              </p>
              <p className="text-xs text-slate-600">
                <span className="font-medium text-slate-700">Phone:</span> {storeInfo.phone} | <span className="font-medium text-slate-700">Email:</span> {storeInfo.email}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 text-xs font-mono text-slate-700">
                <span><strong>GSTIN:</strong> {storeInfo.gstin}</span>
                <span><strong>DL No:</strong> {storeInfo.optometristLicense}</span>
              </div>
            </div>

            <div className="text-left sm:text-right bg-slate-50 p-4 rounded-xl border border-slate-200/80 min-w-[220px]">
              <span className="text-xs font-bold uppercase tracking-wider text-navy-900 block mb-1">
                TAX INVOICE
              </span>
              <p className="text-lg font-bold font-mono text-navy-950">
                {invoice.invoiceNo}
              </p>
              <div className="text-xs text-slate-600 mt-2 space-y-1">
                <div>Date: <strong>{formatDate(invoice.date)}</strong></div>
                {invoice.time && <div>Time: <strong>{invoice.time}</strong></div>}
                <div>Delivery: <strong>{invoice.expectedPickupDate ? formatDate(invoice.expectedPickupDate) : 'Immediate'}</strong></div>
                <div>Status: <strong className="text-navy-900">{invoice.paymentStatus}</strong></div>
              </div>
            </div>
          </div>

          {/* Customer & Prescribing Optometrist Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-ivory-50 border border-ivory-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Billed To (Customer)
              </span>
              <p className="text-sm font-bold text-navy-900">{invoice.customerName}</p>
              <p className="text-slate-600 mt-0.5 font-medium">{invoice.customerPhone}</p>
              <p className="text-slate-500 mt-1">Authorized Patient Account</p>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Optometrist & Dispensing Lead
              </span>
              <p className="text-sm font-bold text-navy-900">{invoice.optometrist || 'Shruti Daware'}</p>
              <p className="text-slate-600 mt-0.5">B.Optom, F.I.A.C.L.E</p>
              <p className="text-slate-500 mt-1">Dispensed at Bandra Flagship Clinic</p>
            </div>
          </div>

          {/* Itemized Optical Products Table */}
          <table className="w-full text-xs text-left border-collapse my-6">
            <thead>
              <tr className="border-y-2 border-slate-800 bg-slate-100/70 text-slate-700 uppercase font-bold tracking-wider text-[11px]">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3">Lens / Customization</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Rate</th>
                <th className="py-2.5 px-3 text-right">Discount</th>
                <th className="py-2.5 px-3 text-right">Net Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-mono text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                    <p className="text-[11px] text-slate-500">Brand: {item.brand} | Category: {item.category}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    {item.lensOption && item.lensOption !== 'None' ? (
                      <div>
                        <span className="font-semibold text-navy-900">{item.lensOption}</span>
                        {item.lensPrice > 0 && (
                          <span className="text-slate-500 ml-1">({formatCurrency(item.lensPrice)})</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Standard / None</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-medium">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-medium">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-3 px-3 text-right text-rose-600 font-medium">
                    {item.discount > 0 ? `-${formatCurrency(item.discount)}` : '₹0'}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculations & Totals */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-slate-200">
            {/* Payment Mode & Instructions */}
            <div className="flex-1 space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <p className="font-bold text-navy-900 mb-1">Payment Method & Terms:</p>
                <p className="text-slate-600">
                  Settled via <strong>{invoice.paymentMethod || 'UPI / Cash'}</strong>
                </p>
                {invoice.notes && (
                  <p className="text-slate-600 mt-1 italic">Note: "{invoice.notes}"</p>
                )}
              </div>

              <div className="text-[11px] text-slate-500 space-y-0.5 leading-relaxed">
                <p><strong>1. Warranty:</strong> Frames carry 12-month manufacturing warranty.</p>
                <p><strong>2. Progressive Adaptation:</strong> Free power adaptation verification within 30 days.</p>
                <p><strong>3. Verification:</strong> Lenses manufactured according to ANSI Z80.1 optical standards.</p>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="w-full sm:w-80 space-y-2 text-xs">
              <div className="flex justify-between py-1 text-slate-600">
                <span>Subtotal (Before Tax):</span>
                <span className="font-semibold text-slate-900">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.discountTotal > 0 && (
                <div className="flex justify-between py-1 text-rose-600">
                  <span>Store Privilege Discount:</span>
                  <span className="font-semibold">-{formatCurrency(invoice.discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between py-1 text-slate-600">
                <span>Optical Goods GST ({invoice.taxPercent || 12}%):</span>
                <span className="font-semibold text-slate-900">{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold border-y-2 border-slate-900 text-navy-950">
                <span>Grand Total:</span>
                <span className="text-base text-navy-900">{formatCurrency(invoice.grandTotal)}</span>
              </div>
              <div className="flex justify-between py-1 text-emerald-700 font-semibold">
                <span>Amount Paid:</span>
                <span>{formatCurrency(invoice.amountPaid)}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-xs">
                <span>Balance Due:</span>
                <span className={invoice.balanceDue > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                  {formatCurrency(invoice.balanceDue)}
                </span>
              </div>
            </div>
          </div>

          {/* Signoff Stamp */}
          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-600" />
              <span>Certified Genuine Eyewear & Clinical Refraction Dispensed</span>
            </div>
            <div className="text-right mt-4 sm:mt-0">
              <div className="w-48 border-b border-slate-400 pb-1 text-center font-serif italic text-navy-900 font-bold">
                Shruti Daware
              </div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1 text-center">
                For DAWARE OPTICIANS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

