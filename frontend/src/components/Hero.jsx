import React from 'react';
import { Calendar, PackageSearch, ShieldCheck, Sparkles, Clock, Truck, IndianRupee } from 'lucide-react';

export default function Hero({ onBookClick, onTrackClick }) {
  return (
    <section id="hero" className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-brand-50/70 via-white to-slate-50">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200/80 text-brand-800 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Doorstep Pickup Across Your City • Starting @ ₹79/kg</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Smarter, Cleaner <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-sky-600 to-teal-600">
                Doorstep Laundry
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Say goodbye to weekend laundry chores. Book a convenient pickup slot, let our fabric experts wash, steam iron, and neatly pack your garments, then receive them fresh at your door.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onBookClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                <Calendar className="w-5 h-5" />
                <span>Schedule a Pickup</span>
              </button>

              <button
                onClick={onTrackClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100/80 text-slate-700 font-semibold text-base border border-slate-200 shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                <PackageSearch className="w-5 h-5 text-brand-600" />
                <span>Track Existing Order</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Free Pickup</p>
                  <p className="text-[11px] text-slate-500">Zero delivery fee</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">24-48h Delivery</p>
                  <p className="text-[11px] text-slate-500">Prompt turnaround</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Fabric Safe</p>
                  <p className="text-[11px] text-slate-500">Antiseptic care</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Fair Pricing</p>
                  <p className="text-[11px] text-slate-500">Transparent in ₹</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Highlights Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Card Container */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/70 border border-slate-100 space-y-6 relative z-10">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                      🧺
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">How FreshFold Works</h2>
                      <p className="text-xs text-slate-500">3 simple steps to fresh clothes</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200/60">
                    Live Pickup
                  </span>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Book Pickup in 30 Seconds</p>
                      <p className="text-xs text-slate-500 mt-0.5">Choose your service, address, and a convenient date & time slot.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Doorstep Collection & Wash</p>
                      <p className="text-xs text-slate-500 mt-0.5">Our rider collects your bag. Clothes are weighed and treated with premium detergents.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-7 h-7 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Steam Ironed & Delivered</p>
                      <p className="text-xs text-slate-500 mt-0.5">Folded or on hangers, delivered to your door. Track live progress anytime!</p>
                    </div>
                  </div>
                </div>

                {/* Sample pricing teaser pill */}
                <div className="bg-gradient-to-r from-brand-50 to-sky-50 rounded-2xl p-4 border border-brand-100/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">Most Popular</span>
                    <p className="text-sm font-bold text-slate-900">Wash & Fold Everyday</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-brand-700">₹79</span>
                    <span className="text-xs text-slate-500"> / kg</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
