import React from 'react';
import { Sparkles, Mail, MapPin, Heart, Shield } from 'lucide-react';

export default function Footer({ onNavigate, onOpenAdmin }) {
  const handleNav = (id) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Fresh<span className="text-brand-400">Fold</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India’s friendly doorstep laundry and dry cleaning companion. Dedicated to giving you your weekends back with fresh, wrinkle-free clothes.
            </p>
            <div className="text-xs text-slate-400">
              <span className="inline-block px-2.5 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-brand-300">
                All Prices in INR (₹)
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-brand-400 transition">
                  Laundry Services & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('order-form')} className="hover:text-brand-400 transition">
                  Schedule Pickup
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tracker')} className="hover:text-brand-400 transition">
                  Track Order Status
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('why-us')} className="hover:text-brand-400 transition">
                  Why Choose FreshFold
                </button>
              </li>
              {onOpenAdmin && (
                <li className="pt-1 border-t border-slate-800">
                  <button
                    onClick={onOpenAdmin}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-white transition"
                  >
                    <Shield className="w-3.5 h-3.5 text-brand-400" />
                    <span>Admin Operations Portal</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Pickup Hours</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="font-semibold text-slate-200">Monday – Sunday</p>
              <p>07:00 AM – 10:00 PM (IST)</p>
              <p className="pt-2 text-[11px] text-slate-400">
                Express same-day pickup available for bookings placed before 11:00 AM.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Customer Support</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>care@freshfold.in</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Indiranagar & Koramangala, Bengaluru, Karnataka, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 border-t border-slate-800 text-center sm:flex sm:justify-between sm:items-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} FreshFold Laundry Services Pvt. Ltd. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center justify-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for internship demonstration.
          </p>
        </div>
      </div>
    </footer>
  );
}
