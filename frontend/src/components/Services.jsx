import React from 'react';
import { services as defaultServices } from '../data/servicesData';
import { Check, Sparkles, Clock, ArrowRight } from 'lucide-react';

export default function Services({ plans, onSelectService }) {
  const displayPlans = plans && plans.length > 0 ? plans : defaultServices;

  return (
    <section id="services" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Simple & Transparent INR Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tailored Care for Every Garment
          </h2>
          <p className="mt-3 text-base text-slate-600">
            No hidden surge fees or surprise charges. Free pickup and doorstep delivery included on all standard orders.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayPlans.map((plan) => {
            const planKey = plan.slug || plan.id || plan._id;
            const unitClean = plan.unit ? plan.unit.replace('per ', '') : 'kg';

            return (
              <div
                key={planKey}
                className={`relative flex flex-col rounded-3xl bg-white border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  plan.popular
                    ? 'border-brand-500 shadow-lg shadow-brand-500/10 ring-2 ring-brand-500/20'
                    : 'border-slate-200/80 shadow-sm hover:border-slate-300'
                }`}
              >
                {/* Popular Ribbon */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-sky-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md whitespace-nowrap">
                    Most Popular Choice
                  </div>
                )}

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Service Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {plan.turnaround || '24-48 Hours'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-500 mb-6 min-h-[36px]">
                      {plan.tagline}
                    </p>

                    {/* Price Tag in INR */}
                    <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-slate-500 block">Starting from</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-slate-900">₹{plan.price}</span>
                          <span className="text-xs font-semibold text-slate-500">/{unitClean}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200/50">
                        Inclusive of GST
                      </span>
                    </div>

                    {/* Features List */}
                    {plan.features && plan.features.length > 0 && (
                      <ul className="space-y-2.5 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Select Button */}
                  <button
                    onClick={() => onSelectService(planKey)}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                      plan.popular
                        ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25'
                        : 'bg-slate-100 hover:bg-brand-50 text-slate-800 hover:text-brand-700 border border-slate-200 hover:border-brand-200'
                    }`}
                  >
                    <span>Select & Book</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
