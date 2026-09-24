import React, { useState } from 'react';
import { Sparkles, PackageSearch, CalendarPlus, Menu, X, Shield } from 'lucide-react';

export default function Navbar({ onNavigate, onOpenAdmin, isAdminLoggedIn }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900">Fresh<span className="text-brand-600">Fold</span></span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded border border-brand-200/60">India</span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Doorstep Laundry & Dry Cleaning</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => handleNavClick('services')}
            className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50/60 rounded-lg transition-colors"
          >
            Services & Pricing
          </button>
          <button
            onClick={() => handleNavClick('tracker')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50/60 rounded-lg transition-colors"
          >
            <PackageSearch className="w-4 h-4 text-brand-500" />
            Track Order
          </button>
          <button
            onClick={() => handleNavClick('why-us')}
            className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50/60 rounded-lg transition-colors"
          >
            Why FreshFold
          </button>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Admin Access Button */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              isAdminLoggedIn
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Administrator Portal"
          >
            <Shield className="w-3.5 h-3.5 text-brand-500" />
            <span>{isAdminLoggedIn ? 'Console' : 'Admin'}</span>
          </button>

          <button
            onClick={() => handleNavClick('order-form')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white font-medium text-sm shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-200 active:scale-95"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Book Pickup</span>
          </button>
        </div>

        {/* Mobile menu hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
          <button
            onClick={() => handleNavClick('services')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Services & Pricing
          </button>
          <button
            onClick={() => handleNavClick('tracker')}
            className="w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <PackageSearch className="w-4 h-4 text-brand-600" />
            Track Order
          </button>
          <button
            onClick={() => handleNavClick('why-us')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Why FreshFold
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <Shield className="w-4 h-4 text-brand-600" />
            <span>{isAdminLoggedIn ? 'Open Admin Console' : 'Admin Sign-In'}</span>
          </button>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => handleNavClick('order-form')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 text-white font-medium text-sm shadow-md shadow-brand-600/30"
            >
              <CalendarPlus className="w-4 h-4" />
              Schedule Pickup Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
