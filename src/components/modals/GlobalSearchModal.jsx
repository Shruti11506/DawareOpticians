import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Search,
  X,
  Glasses,
  Users,
  Receipt,
  FileText,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const {
    products,
    customers,
    sales,
    prescriptions,
    setActiveTab,
    setModalState
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedProducts = q
    ? products.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.model?.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedCustomers = q
    ? customers.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedSales = q
    ? sales.filter(
        s =>
          s.invoiceNo.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedPrescriptions = q
    ? prescriptions.filter(
        rx =>
          rx.prescriptionNo.toLowerCase().includes(q) ||
          rx.customerName.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const totalResults =
    matchedProducts.length +
    matchedCustomers.length +
    matchedSales.length +
    matchedPrescriptions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-card-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, customers, prescriptions, or bills..."
            className="w-full bg-transparent border-none text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 divide-y divide-slate-100">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-amber-500 opacity-60" />
              <p className="font-bold text-slate-700 text-sm">Quick Store Search</p>
              <p className="mt-1 text-slate-400">Search by customer name, brand (Ray-Ban), invoice # or power...</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p className="font-bold text-slate-700 text-sm">No results for "{query}"</p>
              <p className="mt-1">Try another keyword or category name.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matchedProducts.length > 0 && (
                <div>
                  <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Glasses className="w-3.5 h-3.5 text-slate-700" />
                    <span>Products ({matchedProducts.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedProducts.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActiveTab('inventory');
                          onClose();
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors border border-transparent hover:border-slate-200"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-amber-800">
                            {p.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {p.brand} • {p.category} • {p.stock} in stock
                          </p>
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {formatCurrency(p.sellingPrice)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedCustomers.length > 0 && (
                <div className="pt-3">
                  <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-700" />
                    <span>Customers ({matchedCustomers.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedCustomers.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveTab('customers');
                          onClose();
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors border border-transparent hover:border-slate-200"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-amber-800">
                            {c.name}
                          </p>
                          <p className="text-xs text-slate-500">{c.phone}</p>
                        </div>
                        <span className="badge-matte-navy text-xs">{c.tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedSales.length > 0 && (
                <div className="pt-3">
                  <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-slate-700" />
                    <span>Invoices ({matchedSales.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedSales.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setActiveTab('sales');
                          onClose();
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors border border-transparent hover:border-slate-200"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-amber-800 font-mono">
                            {s.invoiceNo} — {s.customerName}
                          </p>
                          <p className="text-xs text-slate-500">{formatDate(s.date)}</p>
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {formatCurrency(s.grandTotal)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Search inside DAWARE OPTICIANS</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded shadow-xs font-mono">ESC</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
};
