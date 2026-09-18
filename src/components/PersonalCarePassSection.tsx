import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PersonalCarePassSection: React.FC = () => {
  return (
    <section 
      id="personal-care-pass"
      className="py-12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#C9A646]/20 border border-[#C9A646]/40 px-3.5 py-1 rounded-full text-xs font-black text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>EXCLUSIVE HYDERABAD MEMBERSHIP</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                MobileKart Personal Care Pass
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                Enjoy complete peace of mind with 12 months of free screen guards, zero doorstep technician visit fees, express priority repair queues, and discounts across all accessories.
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-6 rounded-2xl space-y-2 text-center shrink-0 border border-amber-300 shadow-xl">
              <span className="text-xs font-black uppercase tracking-wider block">Annual VIP Pass</span>
              <div className="text-4xl font-black">₹499<span className="text-xs font-bold">/Year</span></div>
              <div className="text-[11px] font-bold text-slate-900">Valid across Hyderabad</div>
              <Link
                to="/repair-booking?pass=vip"
                className="mt-3 inline-flex items-center justify-center gap-2 bg-[#123477] hover:bg-[#0e2759] text-white text-xs font-black px-5 py-3 rounded-xl transition shadow-md w-full"
              >
                Get Personal Care Pass <ArrowRight className="w-4 h-4 text-[#C9A646]" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-black text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Free Screen Guard</span>
              </div>
              <p className="text-[11px] text-slate-300">Free tempered glass replacement every 3 months.</p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-black text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zero Visit Charges</span>
              </div>
              <p className="text-[11px] text-slate-300">Free doorstep arrival for all repairs across Hyderabad.</p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-black text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Deep Sanitization</span>
              </div>
              <p className="text-[11px] text-slate-300">2 Free ultrasonic cleaning & port maintenance visits.</p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-black text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Flat 20% Off Accessories</span>
              </div>
              <p className="text-[11px] text-slate-300">Save on chargers, cases, cables & TWS earbuds.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
