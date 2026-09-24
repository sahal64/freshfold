import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';

export default function PlanModal({ isOpen, onClose, onSave, planToEdit, isSaving }) {
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    price: '',
    unit: 'per kg',
    turnaround: '24-48 Hours',
    features: '',
    popular: false,
    isActive: true,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (planToEdit) {
      setFormData({
        name: planToEdit.name || '',
        tagline: planToEdit.tagline || '',
        price: planToEdit.price !== undefined ? planToEdit.price : '',
        unit: planToEdit.unit || 'per kg',
        turnaround: planToEdit.turnaround || '24-48 Hours',
        features: Array.isArray(planToEdit.features) ? planToEdit.features.join('\n') : '',
        popular: Boolean(planToEdit.popular),
        isActive: planToEdit.isActive !== undefined ? Boolean(planToEdit.isActive) : true,
      });
    } else {
      setFormData({
        name: '',
        tagline: '',
        price: '',
        unit: 'per kg',
        turnaround: '24-48 Hours',
        features: '',
        popular: false,
        isActive: true,
      });
    }
    setError(null);
  }, [planToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide a plan name.');
      return;
    }
    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Please provide a valid non-negative price in INR (₹).');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      tagline: formData.tagline.trim(),
      price: priceNum,
      unit: formData.unit,
      turnaround: formData.turnaround.trim(),
      features: formData.features
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0),
      popular: formData.popular,
      isActive: formData.isActive,
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {planToEdit ? 'Edit Laundry Plan' : 'Create New Laundry Plan'}
              </h3>
              <p className="text-xs text-slate-400">Configure public pricing in INR (₹) and service specifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Plan Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Wash & Steam Iron"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Price in INR (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="119"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pricing Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="per kg">per kg</option>
                <option value="per piece">per piece</option>
                <option value="per pair">per pair</option>
                <option value="per item">per item</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Turnaround Time
              </label>
              <input
                type="text"
                placeholder="24-48 Hours"
                value={formData.turnaround}
                onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Description / Tagline
            </label>
            <input
              type="text"
              placeholder="e.g. Office shirts, trousers, kurtas & dresses"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Features List <span className="text-slate-400 font-normal">(one per line)</span>
            </label>
            <textarea
              rows="3"
              placeholder="Antiseptic hygienic rinse&#10;Tumble dried&#10;Steam pressed"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span className="text-xs font-medium text-slate-700">Display "Most Popular" Ribbon</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span className="text-xs font-medium text-slate-700">Active (Visible to Customers)</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : planToEdit ? 'Save Changes' : 'Create Plan'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
