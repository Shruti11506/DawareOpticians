import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, exportToCSV } from '../utils/formatters';
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  Glasses,
  FileSpreadsheet
} from 'lucide-react';

export const ReportsPage = () => {
  const { sales, products, metrics } = useApp();

  // Category breakdown calculation
  const categoryTotals = {
    Frames: 0,
    Sunglasses: 0,
    Lenses: 0,
    Accessories: 0
  };

  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (categoryTotals[item.category] !== undefined) {
        categoryTotals[item.category] += item.total || 0;
      } else {
        categoryTotals.Frames += item.total || 0;
      }
    });
  });

  const totalCatSum = Object.values(categoryTotals).reduce((a, b) => a + b, 0) || 1;

  const handleExportSales = () => {
    const rows = sales.map(s => ({
      InvoiceNo: s.invoiceNo,
      Date: s.date,
      Customer: s.customerName,
      Phone: s.customerPhone,
      Subtotal: s.subtotal,
      Discount: s.discountTotal,
      TaxGST: s.taxAmount,
      GrandTotal: s.grandTotal,
      AmountPaid: s.amountPaid,
      BalanceDue: s.balanceDue,
      PaymentStatus: s.paymentStatus,
      OrderStatus: s.orderStatus,
      PaymentMethod: s.paymentMethod
    }));
    exportToCSV(`Daware_Opticians_Sales_${new Date().toISOString().split('T')[0]}.csv`, rows);
  };

  const handleExportInventory = () => {
    const rows = products.map(p => ({
      SKU: p.sku,
      Name: p.name,
      Category: p.category,
      Brand: p.brand,
      Model: p.model || '',
      CostPrice: p.costPrice,
      SellingPrice: p.sellingPrice,
      Stock: p.stock,
      MinAlert: p.minStockAlert,
      Status: p.status
    }));
    exportToCSV(`Daware_Opticians_Inventory_${new Date().toISOString().split('T')[0]}.csv`, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="card-matte p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Business Statements & Reports
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Store revenue summaries, product category shares and spreadsheet downloads
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportSales}
            className="btn-secondary px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-700" />
            <span>Export Sales (CSV)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="btn-gold px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-900" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card-matte p-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Invoiced Revenue
          </span>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {formatCurrency(metrics.monthlyRevenue)}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Billed sales across store</p>
        </div>

        <div className="card-matte p-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Actual Cash & Bank Inflow
          </span>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
            {formatCurrency(sales.reduce((acc, s) => acc + s.amountPaid, 0))}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Settled payments received</p>
        </div>

        <div className="card-matte p-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Optical GST Tax (12%)
          </span >
          <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
            {formatCurrency(sales.reduce((acc, s) => acc + (s.taxAmount || 0), 0))}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Tax liability ledger</p>
        </div>

        <div className="card-matte p-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Customer Balance Dues
          </span>
          <p className="text-2xl sm:text-3xl font-bold text-rose-600 mt-1">
            {formatCurrency(metrics.pendingPaymentsAmount)}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">To collect on delivery</p>
        </div>
      </div>

      {/* Category Breakdown & Low Stock Audit in Clean Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Share */}
        <div className="card-matte p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Product Category Sales Distribution
            </h3>
            <span className="badge-matte-navy text-xs">Current Month</span>
          </div>

          <div className="space-y-4">
            {Object.entries(categoryTotals).map(([cat, amount]) => {
              const pct = Math.round((amount / totalCatSum) * 100);
              return (
                <div key={cat} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-800 text-sm">{cat}</span>
                    <span className="text-slate-900 text-sm">{formatCurrency(amount)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full ${
                        cat === 'Frames' ? 'bg-slate-900' :
                        cat === 'Lenses' ? 'bg-amber-500' :
                        cat === 'Sunglasses' ? 'bg-emerald-600' : 'bg-slate-400'
                      }`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Progressive & anti-glare lenses are the highest margin contributors</span>
            <span className="font-bold text-slate-900">Total: {formatCurrency(totalCatSum)}</span>
          </div>
        </div>

        {/* Low Stock Reorder Audit */}
        <div className="card-matte p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Low Stock Reorder List
              </h3>
              <button
                onClick={handleExportInventory}
                className="text-xs text-amber-800 font-bold hover:underline"
              >
                Download Inventory CSV
              </button>
            </div>

            <div className="space-y-2.5 mt-3">
              {products.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').map(p => (
                <div key={p.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.brand} • SKU: {p.sku}</p>
                  </div>
                  <div className="text-right">
                    <span className={p.stock === 0 ? 'badge-matte-danger text-xs' : 'badge-matte-warning text-xs'}>
                      {p.stock === 0 ? 'Out of Stock' : `${p.stock} units left`}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Reorder threshold: {p.minStockAlert}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
            <strong>Store Advice:</strong> Contact Luxottica and Essilor distributors to replenish stock.
          </div>
        </div>
      </div>
    </div>
  );
};
