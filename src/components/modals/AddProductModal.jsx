import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Glasses, AlertCircle } from 'lucide-react';

export const AddProductModal = ({ isOpen, onClose, editProduct = null }) => {
  const { addProduct, updateProduct } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Frames',
    brand: 'Ray-Ban',
    model: '',
    color: '',
    frameType: 'Full Rim',
    material: 'Premium Acetate',
    size: '52-18-140',
    costPrice: '',
    sellingPrice: '',
    stock: '5',
    minStockAlert: '3',
    description: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || '',
        category: editProduct.category || 'Frames',
        brand: editProduct.brand || '',
        model: editProduct.model || '',
        color: editProduct.color || '',
        frameType: editProduct.frameType || 'Full Rim',
        material: editProduct.material || '',
        size: editProduct.size || '',
        costPrice: editProduct.costPrice ? String(editProduct.costPrice) : '',
        sellingPrice: editProduct.sellingPrice ? String(editProduct.sellingPrice) : '',
        stock: editProduct.stock !== undefined ? String(editProduct.stock) : '0',
        minStockAlert: editProduct.minStockAlert ? String(editProduct.minStockAlert) : '3',
        description: editProduct.description || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'Frames',
        brand: 'Ray-Ban',
        model: '',
        color: '',
        frameType: 'Full Rim',
        material: 'Premium Acetate',
        size: '52-18-140',
        costPrice: '',
        sellingPrice: '',
        stock: '5',
        minStockAlert: '3',
        description: ''
      });
    }
    setError('');
  }, [editProduct, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sellingPrice) {
      setError('Product Name and Selling Price are required.');
      return;
    }

    if (editProduct) {
      updateProduct(editProduct.id, {
        ...formData,
        costPrice: Number(formData.costPrice) || 0,
        sellingPrice: Number(formData.sellingPrice) || 0,
        stock: Number(formData.stock) || 0,
        minStockAlert: Number(formData.minStockAlert) || 3
      });
    } else {
      addProduct(formData);
    }
    onClose();
  };

  const categories = ['Frames', 'Sunglasses', 'Lenses', 'Accessories'];
  const popularBrands = ['Ray-Ban', 'Oakley', 'Silhouette', 'Essilor', 'Zeiss', 'Tom Ford', 'Vogue', 'Maui Jim', 'Police', 'Daware Care'];
  const frameTypes = ['Full Rim', 'Semi-Rimless', 'Rimless', 'Single Vision', 'Progressive', 'Bifocal', 'Care Kit'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-card-lg border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header - Clean Light Matte */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <Glasses className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {editProduct ? 'Edit Product Details' : 'Add New Inventory Item'}
              </h3>
              <p className="text-xs text-slate-500">
                Add frames, sunglasses or optical lenses to the store catalog
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Title / Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ray-Ban Clubmaster Classic"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="select-field font-semibold"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                list="brand-suggestions"
                placeholder="e.g. Ray-Ban"
                className="input-field"
              />
              <datalist id="brand-suggestions">
                {popularBrands.map(b => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Model Number / Code
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. RB5154-2000"
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Color / Finish
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. Gloss Black / Gold"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mount Type
              </label>
              <select
                name="frameType"
                value={formData.frameType}
                onChange={handleChange}
                className="select-field"
              >
                {frameTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Frame Material
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                placeholder="e.g. Titanium / Acetate"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dimensions
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g. 52-18-140"
                className="input-field font-mono"
              />
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cost Price (₹)
              </label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="5800"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="9990"
                className="input-field font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="input-field font-bold font-mono"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Low Stock Alert At
              </label>
              <input
                type="number"
                name="minStockAlert"
                value={formData.minStockAlert}
                onChange={handleChange}
                className="input-field font-mono"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description & Highlights
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="e.g. Lightweight Austrian titanium frame with screwless flex temples..."
              className="input-field"
            />
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
              className="btn-primary"
            >
              {editProduct ? 'Save Product Changes' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
