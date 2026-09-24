import React, { useState, useEffect } from 'react';
import { Search, PackageCheck, Clock, MapPin, Truck, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { formatINR } from '../data/servicesData';

const ORDER_STEPS = [
  { key: 'placed', label: 'Order Placed', desc: 'Received & confirmed' },
  { key: 'pickup_scheduled', label: 'Pickup Scheduled', desc: 'Rider assigned' },
  { key: 'in_wash', label: 'In Wash & Care', desc: 'Sanitizing & cleaning' },
  { key: 'ironed_packed', label: 'Steam Ironed', desc: 'Neatly packed' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'On its way back' },
  { key: 'delivered', label: 'Delivered', desc: 'Returned fresh' }
];

export default function OrderStatus({ initialTrackingId, onSearchOrder, searchResult, isLoading, error }) {
  const [trackingId, setTrackingId] = useState(initialTrackingId || '');

  useEffect(() => {
    if (initialTrackingId) {
      setTrackingId(initialTrackingId);
      if (onSearchOrder) {
        onSearchOrder(initialTrackingId);
      }
    }
  }, [initialTrackingId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    if (onSearchOrder) {
      onSearchOrder(trackingId.trim().toUpperCase());
    }
  };

  // Determine which step is current
  const getStepIndex = (status) => {
    const map = {
      'PLACED': 0,
      'PICKUP_SCHEDULED': 1,
      'IN_WASH': 2,
      'IRONED_PACKED': 3,
      'OUT_FOR_DELIVERY': 4,
      'DELIVERED': 5
    };
    return map[status] !== undefined ? map[status] : 1;
  };

  const currentStepIdx = searchResult ? getStepIndex(searchResult.status) : 0;

  return (
    <section id="tracker" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold mb-2">
            <Search className="w-3.5 h-3.5" />
            Live Status Tracker
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Track Your Laundry in Real Time
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Enter your FreshFold tracking ID (e.g. <span className="font-mono text-brand-600 font-bold">FF-2026-8910</span>) to see the current processing and delivery stage.
          </p>
        </div>

        {/* Search Bar Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100 border border-slate-200/90 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Enter Tracking ID (e.g. FF-2026-8910)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-base font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !trackingId.trim()}
              className="py-3.5 px-8 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Track Order</span>
                  <Truck className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Helper */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Forgot your ID? Check your order confirmation screen.</span>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <div>
                <p className="font-semibold">Order Not Found</p>
                <p className="mt-0.5 text-rose-600">
                  {error || 'No matching order exists with that tracking number. Please verify the code and try again.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Search Results Display */}
        {searchResult && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100 border border-slate-200/90 animate-fadeIn space-y-8">
            
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Tracking Code</span>
                <h3 className="text-2xl font-mono font-extrabold text-brand-600">{searchResult.trackingId}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Placed on {new Date(searchResult.createdAt || Date.now()).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 border border-brand-200/80 text-brand-800 text-xs font-bold self-start sm:self-auto">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping" />
                <span>Status: {searchResult.status.replace(/_/g, ' ')}</span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Live Order Progression</h4>
              
              <div className="relative">
                {/* Desktop Horizontal Stepper */}
                <div className="hidden md:grid grid-cols-6 gap-2 relative z-10">
                  {ORDER_STEPS.map((step, idx) => {
                    const isDone = idx < currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    const isPending = idx > currentStepIdx;

                    return (
                      <div key={step.key} className="flex flex-col items-center text-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                            isDone
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <span
                          className={`mt-2.5 text-xs font-semibold ${
                            isCurrent ? 'text-brand-700' : isDone ? 'text-slate-800' : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{step.desc}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Vertical Stepper */}
                <div className="md:hidden space-y-4">
                  {ORDER_STEPS.map((step, idx) => {
                    const isDone = idx < currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step.key} className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isDone
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-brand-600 text-white ring-2 ring-brand-100'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div>
                          <p className={`text-xs font-semibold ${isCurrent ? 'text-brand-700 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                            {step.label}
                          </p>
                          <p className="text-[11px] text-slate-400">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-bold text-slate-700 block">Pickup Details</span>
                <p className="text-slate-600"><strong>Name:</strong> {searchResult.customerName}</p>
                <p className="text-slate-600"><strong>Phone:</strong> +91 {searchResult.phone}</p>
                <p className="text-slate-600"><strong>Scheduled:</strong> {searchResult.pickupDate} ({searchResult.pickupTimeSlot})</p>
                <p className="text-slate-600"><strong>Address:</strong> {searchResult.address}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-bold text-slate-700 block">Package & Pricing</span>
                <p className="text-slate-600"><strong>Service:</strong> {searchResult.service}</p>
                <p className="text-slate-600"><strong>Quantity:</strong> ~{searchResult.quantity} {searchResult.unit || 'kg'}</p>
                <p className="text-slate-600 flex items-baseline gap-1">
                  <strong>Estimated Total:</strong>
                  <span className="text-base font-extrabold text-brand-700">
                    {formatINR(searchResult.estimatedPrice)}
                  </span>
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">Payment on Delivery (Cash / UPI)</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
