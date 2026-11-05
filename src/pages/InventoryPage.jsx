import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import {
  Glasses,
  Search,
  Plus,
  LayoutGrid,
  List,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';

export const InventoryPage = () => {
  const { products, deleteProduct, setModalState } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [viewProductDetails, setViewProductDetails] = useState(null);

  const categories = [
    { id: 'All', label: 'All Products' },
    { id: 'Frames', label: 'Frames / Glasses' },
    { id: 'Sunglasses', label: 'Sunglasses' },
    { id: 'Lenses', label: 'Prescription Lenses' },
    { id: 'Accessories', label: 'Care & Accessories' },
  ];

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.model?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="card-matte p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Store Eyewear & Lens Inventory
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse and manage all frames, sunglasses and optical lenses in store
          </p>
        </div>

        <button
          onClick={() => setModalState(prev => ({ ...prev, addProduct: true }))}
          className="btn-gold px-4 py-2.5 text-sm font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-slate-900" />
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-matte p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by brand name (e.g. Ray-Ban, Zeiss, Oakley) or model number..."
              className="input-field pl-11 text-sm py-3"
            />
          </div>

          {/* View Mode Toggle: Cards vs Table */}
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

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Display: CASD VIEW (High Readability) */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full card-matte py-12 text-center text-slate-400">
              <Glasses className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-base font-bold text-slate-700">No matching items found</p>
              <p className="text-xs text-slate-400 mt-1">Try clearing your search or choose another category.</p>
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="card-matte p-5 hover:border-slate-300 hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Category & Stock Pill */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {prod.category}
                    </span>
                    <span className={
                      prod.stock === 0 ? 'badge-matte-danger text-xs' :
                      prod.stock <= prod.minStockAlert ? 'badge-matte-warning text-xs' :
                      'badge-matte-success text-xs'
                    }>
                      {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} in stock`}
                    </span>
                  </div>

                  {/* Title & Brand */}
                  <div className="mt-3">
                    <span className="text-xs font-bold text-amber-800 tracking-wide uppercase">
                      {prod.brand}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      Model: {prod.model || prod.sku}
                    </p>
                  </div>

                  {/* Material & Fit details */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Material:</span>
                      <span className="font-semibold text-slate-800">{prod.material || 'Acetate'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dimensions:</span>
                      <span className="font-semibold text-slate-800">{prod.size || prod.frameType}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Selling Price</span>
                    <span className="text-xl font-bold text-slate-900">
                      {formatCurrency(prod.sellingPrice)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setViewProductDetails(prod)}
                      className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setModalState(prev => ({ ...prev, editProduct: prod }))}
                      className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-bold"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Product Display: TABLE VIEW */
        <div className="card-matte overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-th">Item Name & Model</th>
                  <th className="table-th">Category</th>
                  <th className="table-th text-right">Selling Price</th>
                  <th className="table-th text-center">Available Stock</th>
                  <th className="table-th text-center">Status</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="table-td">
                      <div className="font-bold text-slate-900 text-base">{prod.name}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        {prod.brand} • {prod.model || prod.sku}
                      </div>
                    </td>

                    <td className="table-td">
                      <span className="badge-matte-navy text-xs">{prod.category}</span>
                    </td>

                    <td className="table-td text-right font-bold text-slate-900 text-base">
                      {formatCurrency(prod.sellingPrice)}
                    </td>

                    <td className="table-td text-center font-bold text-slate-900 text-base font-mono">
                      {prod.stock}
                    </td>

                    <td className="table-td text-center">
                      <span className={
                        prod.stock === 0 ? 'badge-matte-danger text-xs' :
                        prod.stock <= prod.minStockAlert ? 'badge-matte-warning text-xs' :
                        'badge-matte-success text-xs'
                      }>
                        {prod.stock === 0 ? 'Out of Stock' : prod.stock <= prod.minStockAlert ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>

                    <td className="table-td text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewProductDetails(prod)}
                          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setModalState(prev => ({ ...prev, editProduct: prod }))}
                          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Details Spec Modal */}
      {viewProductDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-card-lg border border-slate-200 overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="badge-matte-navy text-xs uppercase font-bold">{viewProductDetails.category}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {viewProductDetails.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {viewProductDetails.brand} • {viewProductDetails.model || viewProductDetails.sku}
                </p>
              </div>
              <button
                onClick={() => setViewProductDetails(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-4 text-sm">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-xs text-slate-500 block">Selling Price:</span>
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(viewProductDetails.sellingPrice)}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Available Stock:</span>
                  <p className="text-xl font-bold text-slate-900 font-mono">{viewProductDetails.stock} Units</p>
                </div>
              </div>

              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Color / Finish:</span>
                  <span className="font-semibold text-slate-800">{viewProductDetails.color || 'Standard'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Mount Type:</span>
                  <span className="font-semibold text-slate-800">{viewProductDetails.frameType || 'Full Rim'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Frame Material:</span>
                  <span className="font-semibold text-slate-800">{viewProductDetails.material || 'Acetate'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Frame Size (Eye-Bridge-Temple):</span>
                  <span className="font-semibold text-slate-800">{viewProductDetails.size || '52-18-140'}</span>
                </div>
              </div>

              {viewProductDetails.description && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Description
                  </span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                    {viewProductDetails.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  const prod = viewProductDetails;
                  setViewProductDetails(null);
                  setModalState(prev => ({ ...prev, editProduct: prod }));
                }}
                className="btn-primary text-xs py-2 px-4"
              >
                Edit Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
