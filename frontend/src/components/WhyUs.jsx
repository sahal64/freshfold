import React from 'react';
import { ShieldCheck, Sparkles, Clock, HeartHandshake, Award, Leaf } from 'lucide-react';

const REASONS = [
  {
    icon: Sparkles,
    title: 'Hygienic Hospital-Grade Wash',
    desc: 'Each customer’s load is washed separately with premium antiseptic liquid detergents. Zero mix-ups guaranteed.'
  },
  {
    icon: Clock,
    title: 'Guaranteed 24-48h Delivery',
    desc: 'Never run out of crisp clothes. Fast scheduled doorstep pickups and reliable on-time delivery across your city.'
  },
  {
    icon: ShieldCheck,
    title: 'Custom Fabric Care',
    desc: 'From daily cottons to delicate silk sarees and woolens, our specialists apply garment-specific gentle wash cycles.'
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Solvents',
    desc: 'We use 100% bio-degradable detergents and eco solvents that are gentle on garments, skin, and the planet.'
  },
  {
    icon: Award,
    title: 'High-Pressure Steam Finish',
    desc: 'Steam ironed at optimal temperature and delivered on free hangers or crisp folds ready for your wardrobe.'
  },
  {
    icon: HeartHandshake,
    title: 'Transparent INR Pricing',
    desc: 'Simple per-kg and per-item pricing in Indian Rupees with zero delivery surge fees or hidden packaging costs.'
  }
];

export default function WhyUs() {
  return (
    <section id="why-us" className="py-16 sm:py-20 bg-white border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            The FreshFold Promise
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Thousands Trust FreshFold
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Professional laundry technology paired with local doorstep care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {REASONS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/70 hover:border-brand-300 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
