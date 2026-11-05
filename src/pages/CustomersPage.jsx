import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  RotateCcw,
  Loader2,
  LayoutGrid,
  List,
  AlertCircle,
  X
} from 'lucide-react';

export const CustomersPage = () => {
  const {
    customers,
    loadingCustomers,
    refreshCustomers,
    deleteCustomer,
    prescriptions,
    sales,
    setModalState
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [viewCustomerProfile, setViewCustomerProfile] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const tags = ['All', 'VIP', 'Frequent', 'Regular', 'New'];

  const filteredCustomers = customers.filter(c => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.address?.toLowerCase().includes(q);

    const matchesTag = selectedTag === 'All' || c.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteCustomer(customerToDelete.id);
      setCustomerToDelete(null);
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete customer from MySQL.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="card-matte p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Customer & Patient Directory
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {customers.length} in MySQL
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Registered customer records, contact numbers and optical history synced with MySQL
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => refreshCustomers(search)}
            disabled={loadingCustomers}
            className="btn-secondary px-3.5 py-2.5 text-xs font-bold flex items-center gap-2"
            title="Refresh records from MySQL database"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-slate-600 ${loadingCustomers ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setModalState(prev => ({ ...prev, addCustomer: true }))}
            className="btn-gold px-5 py-2.5 text-sm font-bold flex items-center gap-2 flex-1 sm:flex-none justify-center"
          >
            <Plus className="w-4 h-4 text-slate-900" />
            <span>+ Register New Customer</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-matte p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, mobile number, or city in MySQL..."
              className="input-field pl-11 pr-10 text-sm py-3"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Card View</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
          </div>
        </div>

        {/* Tag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedTag === tag
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tag === 'All' ? 'All Customers' : `${tag} Clients`}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loadingCustomers && customers.length === 0 ? (
        <div className="card-matte py-16 text-center text-slate-500 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-800" />
          <p className="text-sm font-semibold">Loading customers directly from MySQL database...</p>
        </div>
      ) : viewMode === 'cards' ? (
        /* CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCustomers.length === 0 ? (
            <div className="col-span-full card-matte py-12 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-base font-bold text-slate-700">No customers found</p>
              <p className="text-xs text-slate-400 mt-1">Try another search or register a new customer.</p>
            </div>
          ) : (
            filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                className="card-matte p-5 hover:border-slate-300 hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="badge-matte-neutral text-xs font-mono">
                      ID #{cust.Customer_id || cust.id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Since {formatDate(cust.registrationDate)}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      {cust.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      Phone: {cust.phone || 'N/A'}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {cust.email || 'No email provided'}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {cust.address ? `Address: ${cust.address}` : 'No address provided'}
                    </p>
                  </div>

                  {/* Financial Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Total Spent:</span>
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(cust.totalSpent || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Pending Dues:</span>
                      <span className={`text-sm font-bold ${cust.pendingBalance > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                        {formatCurrency(cust.pendingBalance || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setViewCustomerProfile(cust)}
                    className="btn-secondary text-xs py-2 px-3 font-bold flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>Profile & Rx</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setModalState(prev => ({ ...prev, editCustomer: cust }))}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
                      title="Edit Customer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCustomerToDelete(cust);
                        setDeleteError('');
                      }}
                      className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors"
                      title="Delete Customer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="card-matte overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-th">ID</th>
                  <th className="table-th">Customer Name</th>
                  <th className="table-th">Mobile Number</th>
                  <th className="table-th">Address</th>
                  <th className="table-th text-center">Purchases</th>
                  <th className="table-th text-right">Total Spent</th>
                  <th className="table-th text-right">Balance Due</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No customer records match your filter.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50/70">
                      <td className="table-td font-mono text-xs font-bold text-slate-500">
                        #{cust.Customer_id || cust.id}
                      </td>
                      <td className="table-td">
                        <div className="font-bold text-slate-900 text-base">{cust.name}</div>
                        <div className="text-xs text-slate-400">{cust.email || '-'}</div>
                      </td>
                      <td className="table-td font-semibold text-slate-800">
                        {cust.phone || '-'}
                      </td>
                      <td className="table-td text-xs text-slate-600 max-w-[150px] truncate">
                        {cust.address || '-'}
                      </td>
                      <td className="table-td text-center font-bold text-slate-900 font-mono">
                        {cust.totalPurchases || 0}
                      </td>
                      <td className="table-td text-right font-bold text-slate-900">
                        {formatCurrency(cust.totalSpent || 0)}
                      </td>
                      <td className="table-td text-right font-bold">
                        {cust.pendingBalance > 0 ? (
                          <span className="text-rose-600">{formatCurrency(cust.pendingBalance)}</span>
                        ) : (
                          <span className="text-slate-400">₹0</span>
                        )}
                      </td>
                      <td className="table-td text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewCustomerProfile(cust)}
                            className="btn-secondary text-xs py-1.5 px-2.5 font-semibold"
                            title="View Customer Profile"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => setModalState(prev => ({ ...prev, editCustomer: cust }))}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
                            title="Edit Customer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setCustomerToDelete(cust);
                              setDeleteError('');
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors"
                            title="Delete Customer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-card-lg border border-slate-200 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Delete Customer Record?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to delete <strong className="text-slate-900">{customerToDelete.name}</strong> (ID #{customerToDelete.Customer_id || customerToDelete.id})? This will remove the record directly from MySQL.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setCustomerToDelete(null);
                  setDeleteError('');
                }}
                disabled={isDeleting}
                className="btn-secondary text-xs py-2 px-3.5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors flex items-center gap-2"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? 'Deleting in MySQL...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Profile Drawer Modal */}
      {viewCustomerProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-card-lg border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">
                  {viewCustomerProfile.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {viewCustomerProfile.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    ID #{viewCustomerProfile.Customer_id || viewCustomerProfile.id} • {viewCustomerProfile.phone || 'No phone'} • Registered on {formatDate(viewCustomerProfile.registrationDate)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewCustomerProfile(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm">
              {/* Prescriptions on File */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Prescriptions on File
                </h4>
                {(() => {
                  const custRxs = prescriptions.filter(
                    rx => rx.customerId === viewCustomerProfile.id || rx.customer_id === viewCustomerProfile.id || rx.customerName === viewCustomerProfile.name
                  );
                  if (custRxs.length === 0) {
                    return <p className="text-xs text-slate-400 italic">No prescription records filed yet.</p>;
                  }
                  return (
                    <div className="space-y-3">
                      {custRxs.map(rx => (
                        <div key={rx.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="font-mono text-slate-900">{rx.prescriptionNo}</span>
                            <span className="text-slate-500">Date: {formatDate(rx.date)}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                              <span className="font-bold text-slate-900 block mb-1">Right Eye (OD):</span>
                              <p className="font-mono">SPH: {rx.rightEye?.sph || '0.00'} | CYL: {rx.rightEye?.cyl || '0.00'} | AXIS: {rx.rightEye?.axis || '0°'} | ADD: {rx.add || '+0.00'}</p>
                            </div>
                            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                              <span className="font-bold text-slate-900 block mb-1">Left Eye (OS):</span>
                              <p className="font-mono">SPH: {rx.leftEye?.sph || '0.00'} | CYL: {rx.leftEye?.cyl || '0.00'} | AXIS: {rx.leftEye?.axis || '0°'} | ADD: {rx.add || '+0.00'}</p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-700">
                            <strong>Recommended:</strong> {rx.lensRecommendation || rx.notes || 'None'}
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Order History */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Previous Purchases & Bills
                </h4>
                {(() => {
                  const custSales = sales.filter(
                    s => s.customerId === viewCustomerProfile.id || s.customer_id === viewCustomerProfile.id || s.customerName === viewCustomerProfile.name
                  );
                  if (custSales.length === 0) {
                    return <p className="text-xs text-slate-400 italic">No purchases recorded yet.</p>;
                  }
                  return (
                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="py-2.5 px-3">Invoice #</th>
                            <th className="py-2.5 px-3">Date</th>
                            <th className="py-2.5 px-3">Items</th>
                            <th className="py-2.5 px-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {custSales.map(sale => (
                            <tr key={sale.id}>
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{sale.invoiceNo}</td>
                              <td className="py-2.5 px-3 text-slate-500">{formatDate(sale.date)}</td>
                              <td className="py-2.5 px-3 text-slate-700">{sale.items.map(i => i.name).join(', ')}</td>
                              <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatCurrency(sale.grandTotal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewCustomerProfile(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
