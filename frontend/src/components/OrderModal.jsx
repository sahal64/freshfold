import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Calendar, MapPin, Package, X, ArrowRight } from 'lucide-react';
import { formatINR } from '../data/servicesData';

export default function OrderModal({ order, onClose, onTrackOrder }) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopy = () => {
    if (order.trackingId) {
      navigator.clipboard.writeText(order.trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-b from-brand-50 to-white px-6 pt-8 pb-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">Pickup Scheduled!</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs mx-auto">
            Your FreshFold laundry order is confirmed. Save your Tracking Number below.
          </p>

          {/* Tracking ID Badge */}
          <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 max-w-sm mx-auto">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Order Tracking ID</span>
              <span className="text-lg font-mono font-extrabold text-brand-700 tracking-wider">
                {order.trackingId}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:border-brand-300 shadow-xs transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-4 text-xs text-slate-600">
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-slate-400 block">Customer</span>
              <span className="font-semibold text-slate-800 text-sm">{order.customerName}</span>
              <span className="text-slate-500 block">+91 {order.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Estimated Bill</span>
              <span className="font-extrabold text-brand-700 text-sm">
                {formatINR(order.estimatedPrice)}
              </span>
              <span className="text-[11px] text-emerald-600 block">Pay on Delivery</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2.5">
              <Package className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Service: </span>
                <span>{order.service} (~{order.quantity} {order.unit})</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Pickup Slot: </span>
                <span>{order.pickupDate} • {order.pickupTimeSlot}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Address: </span>
                <span>{order.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onTrackOrder(order.trackingId)}
            className="flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-500/25 transition"
          >
            <span>Track Live Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
