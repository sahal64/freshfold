import React, { useState, useEffect } from 'react';
import { services as defaultServices, formatINR } from '../data/servicesData';
import { Calendar, Clock, MapPin, Phone, User, Package, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function OrderForm({ plans, selectedServiceId, onOrderSuccess, onSubmitOrder, isSubmitting }) {
  const activePlans = plans && plans.length > 0 ? plans : defaultServices;

  // Tomorrow's date formatted as YYYY-MM-DD for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    city: 'Bengaluru',
    pincode: '',
    serviceId: selectedServiceId || (activePlans[0]?.slug || activePlans[0]?.id || 'wash-fold'),
    estimatedQuantity: 4, // 4 kg or items
    pickupDate: minDateStr,
    pickupSlot: 'Morning (08:00 AM - 11:00 AM)',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Sync external selectedServiceId prop changes
  useEffect(() => {
    if (selectedServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: selectedServiceId }));
    }
  }, [selectedServiceId]);

  // Selected service details
  const currentService =
    activePlans.find(
      (s) => (s.slug || s.id || s._id) === formData.serviceId
    ) || activePlans[0];

  const estimatedTotal = (formData.estimatedQuantity || 1) * (currentService?.price || 79);

  const validate = () => {
    const errs = {};
    if (!formData.customerName.trim()) {
      errs.customerName = 'Please enter your full name';
    } else if (formData.customerName.trim().length < 3) {
      errs.customerName = 'Name must be at least 3 characters';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone) {
      errs.phone = 'Please enter a 10-digit mobile number';
    } else if (cleanPhone.length !== 10) {
      errs.phone = 'Mobile number must be exactly 10 digits';
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid Indian mobile number (starts with 6, 7, 8, or 9)';
    }

    if (!formData.address.trim()) {
      errs.address = 'Please provide full house/flat no., street, and landmark';
    } else if (formData.address.trim().length < 8) {
      errs.address = 'Please provide a more detailed address for the pickup rider';
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Pincode must be 6 digits (e.g. 560001)';
    }

    if (!formData.pickupDate) {
      errs.pickupDate = 'Please select a pickup date';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Snapshot current plan's price and details so future plan updates never alter this order
    const payload = {
      customerName: formData.customerName.trim(),
      phone: formData.phone.replace(/\D/g, ''),
      address: `${formData.address.trim()}, ${formData.city} - ${formData.pincode || '560001'}`,
      service: currentService.name,
      serviceId: currentService.slug || currentService.id || currentService._id,
      quantity: Number(formData.estimatedQuantity) || 1,
      unit: currentService.unit,
      estimatedPrice: estimatedTotal,
      pickupDate: formData.pickupDate,
      pickupTimeSlot: formData.pickupSlot,
      specialInstructions: formData.notes.trim(),
    };

    if (onSubmitOrder) {
      onSubmitOrder(payload);
    }
  };

  return (
    <section id="order-form" className="py-16 sm:py-20 bg-white border-t border-slate-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Form Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5" />
            Quick 2-Minute Booking
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Schedule Your Doorstep Pickup
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Fill in your pickup details. Our rider will arrive with laundry bags during your selected slot. Pay in ₹ upon delivery or online.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-brand-600 via-sky-600 to-brand-700 px-6 sm:px-8 py-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-sky-100 font-semibold">New Laundry Request</p>
              <h3 className="text-lg font-bold">Doorstep Pickup Details</h3>
            </div>
            <div className="text-left sm:text-right bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-xs border border-white/20">
              <span className="text-xs text-sky-100 block">Est. Bill Amount:</span>
              <span className="text-xl font-extrabold text-white">{formatINR(estimatedTotal)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {/* Step 1: Customer Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[11px] font-bold">1</span>
                Customer Contact Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="customerName" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.customerName}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                        errors.customerName
                          ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400'
                          : 'border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-brand-500/20'
                      }`}
                    />
                  </div>
                  {errors.customerName && (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.customerName}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number (10 Digits) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-xs font-bold">
                      +91
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      maxLength={10}
                      placeholder="Enter 10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                        errors.phone
                          ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400'
                          : 'border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-brand-500/20'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Address */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[11px] font-bold">2</span>
                Pickup Address in India
              </h4>

              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Flat / House No., Apartment & Street Landmark <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <textarea
                      id="address"
                      name="address"
                      rows={2}
                      placeholder="e.g. Flat 302, Green Glen Layout, Bellandur, Near Central Mall"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                        errors.address
                          ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400'
                          : 'border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-brand-500/20'
                      }`}
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      City
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Pune">Pune</option>
                      <option value="Chennai">Chennai</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Pincode (6 digits)
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      maxLength={6}
                      placeholder="560103"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-xs text-rose-500">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Service & Quantity */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[11px] font-bold">3</span>
                Service & Estimated Quantity
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="serviceId" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select Laundry Service
                  </label>
                  <select
                    id="serviceId"
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    {activePlans.map((plan) => {
                      const key = plan.slug || plan.id || plan._id;
                      const unitClean = plan.unit ? plan.unit.replace('per ', '') : 'kg';
                      return (
                        <option key={key} value={key}>
                          {plan.name} — ₹{plan.price}/{unitClean}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label htmlFor="estimatedQuantity" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Approx. Load ({currentService?.unit || 'kg'})
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      id="estimatedQuantity"
                      name="estimatedQuantity"
                      min={1}
                      max={50}
                      value={formData.estimatedQuantity}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                    <span className="text-xs text-slate-500 font-medium whitespace-nowrap bg-slate-100 px-3 py-2.5 rounded-xl">
                      {currentService?.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Details Snippet */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-brand-600" />
                  <span>Rate: <strong>₹{currentService?.price}</strong> {currentService?.unit}</span>
                </div>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                  Est. Delivery: {currentService?.turnaround}
                </span>
              </div>
            </div>

            {/* Step 4: Schedule Pickup */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[11px] font-bold">4</span>
                Select Pickup Slot
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pickupDate" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pickup Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      id="pickupDate"
                      name="pickupDate"
                      min={minDateStr}
                      value={formData.pickupDate}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  {errors.pickupDate && (
                    <p className="mt-1 text-xs text-rose-500">{errors.pickupDate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="pickupSlot" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Time Window
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <select
                      id="pickupSlot"
                      name="pickupSlot"
                      value={formData.pickupSlot}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="Morning (08:00 AM - 11:00 AM)">Morning (08:00 AM - 11:00 AM)</option>
                      <option value="Afternoon (01:00 PM - 04:00 PM)">Afternoon (01:00 PM - 04:00 PM)</option>
                      <option value="Evening (05:00 PM - 08:00 PM)">Evening (05:00 PM - 08:00 PM)</option>
                      <option value="Night (08:00 PM - 10:00 PM)">Night (08:00 PM - 10:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Special Notes (optional) */}
              <div className="mt-4">
                <label htmlFor="notes" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Special Care / Instructions <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  id="notes"
                  name="notes"
                  placeholder="e.g. Ring the doorbell, use gentle detergent on linen shirt, etc."
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            {/* Price Breakdown Summary */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>{currentService?.name} (~{formData.estimatedQuantity} {currentService?.unit}):</span>
                <span className="font-semibold text-slate-800">{formatINR(estimatedTotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Doorstep Pickup & Delivery:</span>
                <span className="font-bold text-emerald-600 uppercase text-[11px] bg-emerald-50 px-2 py-0.5 rounded">FREE</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Applicable GST:</span>
                <span className="text-slate-500">Included</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Estimated Total Payable:</span>
                <span className="text-xl font-extrabold text-brand-700">{formatINR(estimatedTotal)}</span>
              </div>
              <p className="text-[11px] text-slate-400 text-right">
                *Final weight & payment confirmed upon rider pickup weighing.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-sky-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold text-base shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Confirming Your Pickup...</span>
                </>
              ) : (
                <>
                  <span>Schedule Pickup Now</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

          </form>

        </div>

      </div>
    </section>
  );
}
