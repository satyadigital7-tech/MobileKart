import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Smartphone, 
  Wrench, 
  Truck, 
  Building2, 
  Sparkles, 
  Clock, 
  Award,
  ArrowRight,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface VistaShieldSectionProps {
  onPlanSelected?: () => void;
  showBookingRedirect?: boolean;
}

export const VistaShieldSection: React.FC<VistaShieldSectionProps> = ({ 
  onPlanSelected,
  showBookingRedirect = true 
}) => {
  const navigate = useNavigate();
  const { 
    vistaShieldConfig, 
    selectedVistaShieldPlan, 
    selectVistaShieldPlan, 
    clearSelectedVistaShieldPlan 
  } = useApp();

  const [notification, setNotification] = useState<string | null>(null);

  if (!vistaShieldConfig || !vistaShieldConfig.isEnabled) {
    return null;
  }

  const handleChoosePlan = (variantId: 'variant-1' | 'variant-2') => {
    selectVistaShieldPlan(variantId);
    
    const benefitStr = variantId === 'variant-1' 
      ? `₹${vistaShieldConfig.v1MaxBenefit.toLocaleString()}` 
      : `₹${vistaShieldConfig.v2MaxBenefit.toLocaleString()}`;
      
    setNotification(`Selected Vista Shield (${benefitStr} Benefit). Plan added to your booking flow!`);
    
    setTimeout(() => {
      setNotification(null);
    }, 4000);

    if (onPlanSelected) {
      onPlanSelected();
    } else if (showBookingRedirect) {
      navigate('/repair-booking');
    }
  };

  const planDetailsList = [
    {
      icon: <Calendar className="w-5 h-5 text-[#C9A646]" />,
      title: '1-Year Plan Tenure',
      desc: vistaShieldConfig.tenure || '1 Year from date of purchase'
    },
    {
      icon: <Smartphone className="w-5 h-5 text-[#C9A646]" />,
      title: vistaShieldConfig.serviceBenefit || 'Screen Protection',
      desc: vistaShieldConfig.productName || 'Existing Phone Screen Protection Plan'
    },
    {
      icon: <Wrench className="w-5 h-5 text-[#C9A646]" />,
      title: `${vistaShieldConfig.serviceRequestsCount || '1'} Service Request`,
      desc: 'Screen damage claim request'
    },
    {
      icon: <Truck className="w-5 h-5 text-[#C9A646]" />,
      title: 'Free Doorstep Pickup & Drop',
      desc: vistaShieldConfig.freeDoorstepPickupDrop ? 'Yes (Zero Extra Cost)' : 'Available'
    },
    {
      icon: <Building2 className="w-5 h-5 text-[#C9A646]" />,
      title: 'Authorized Service Center',
      desc: vistaShieldConfig.authorizedServiceCenter || 'OneAssist Authorized Service Center / MobileKart'
    },
    {
      icon: <Award className="w-5 h-5 text-[#C9A646]" />,
      title: `${vistaShieldConfig.excessFees || '₹199/-'} Excess Fee`,
      desc: 'Flat claim processing fee'
    },
    {
      icon: <Clock className="w-5 h-5 text-[#C9A646]" />,
      title: `${vistaShieldConfig.coolingPeriod || '15-Day'} Cooling Period`,
      desc: 'Standard policy verification period'
    },
  ];

  return (
    <section 
      id="vista-shield-section"
      className="py-12 bg-white text-[#123477] relative overflow-hidden border-y border-slate-200"
    >
      {/* Subtle Background Accent Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#123477]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9A646]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-10">
        
        {/* Toast Notification when Plan Selected */}
        {notification && (
          <div className="bg-[#123477] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-[#C9A646] animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#C9A646] shrink-0" />
              <span className="text-xs sm:text-sm font-bold">{notification}</span>
            </div>
            <button 
              onClick={() => navigate('/repair-booking')}
              className="bg-[#C9A646] hover:bg-[#b5943b] text-[#123477] text-xs font-black px-4 py-2 rounded-xl transition shrink-0 ml-2"
            >
              Proceed to Booking →
            </button>
          </div>
        )}

        {/* Header Section with SEO Compliant H2 & H3 */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#123477]/10 border border-[#123477]/20 px-4 py-1.5 rounded-full text-xs font-black text-[#123477] tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4 text-[#C9A646]" />
            <span>Official Protection Partner</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#123477] tracking-tight leading-tight">
            {vistaShieldConfig.sectionTitle || 'MobileKart Vista Shield – Powered by OneAssist'}
          </h2>

          <h3 className="text-xs sm:text-sm font-extrabold text-[#C9A646] uppercase tracking-widest">
            {vistaShieldConfig.subtitle || 'Know Your Plan Better'}
          </h3>

          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto font-medium leading-relaxed">
            Shield your phone screen against unexpected drops & accidents. Enjoy official OneAssist authorized repair coverage with free doorstep pickup and hassle-free processing.
          </p>
        </div>

        {/* Plan Variant Cards Grid (Side-by-Side on Desktop, Stacked on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* VARIANT 1 CARD */}
          <div className={`relative rounded-3xl p-6 sm:p-8 transition duration-300 flex flex-col justify-between ${
            selectedVistaShieldPlan?.variantId === 'variant-1'
              ? 'bg-gradient-to-b from-amber-50/80 via-white to-amber-50/40 border-2 border-[#C9A646] shadow-xl ring-4 ring-[#C9A646]/20'
              : 'bg-white border-2 border-[#C9A646] shadow-lg hover:shadow-xl hover:-translate-y-1'
          }`}>
            {/* MOST POPULAR BADGE */}
            {vistaShieldConfig.v1Badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C9A646] text-[#123477] text-[11px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md border border-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-[#123477]" />
                <span>{vistaShieldConfig.v1Badge}</span>
              </div>
            )}

            <div className="space-y-6 pt-2">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-black text-[#C9A646] uppercase tracking-wider block">PLAN VARIANT 1</span>
                  <h4 className="text-xl font-black text-[#123477]">Maximum Protection</h4>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#123477]/10 flex items-center justify-center text-[#123477]">
                  <Shield className="w-5 h-5 text-[#123477]" />
                </div>
              </div>

              {/* Benefits Highlight */}
              <div className="space-y-2 bg-[#123477]/5 p-4 rounded-2xl border border-[#123477]/10">
                <div className="text-xs text-slate-600 font-bold">Maximum Coverage Benefit</div>
                <div className="text-3xl sm:text-4xl font-black text-[#123477]">
                  ₹{vistaShieldConfig.v1MaxBenefit ? vistaShieldConfig.v1MaxBenefit.toLocaleString() : '10,000'}/-
                </div>
                <div className="text-[11px] text-[#C9A646] font-bold">Screen Damage Repair Cover</div>
              </div>

              {/* Pricing Display */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-[#123477]">
                    ₹{vistaShieldConfig.v1Price ? vistaShieldConfig.v1Price.toLocaleString() : '1,798'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">/ 1 Year</span>
                </div>
                <div className="text-xs font-extrabold text-[#C9A646]">
                  MRP: ₹{vistaShieldConfig.v1Price ? vistaShieldConfig.v1Price.toLocaleString() : '1,798'}/- (Incl. of GST)
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              {selectedVistaShieldPlan?.variantId === 'variant-1' ? (
                <div className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-black py-4 px-6 rounded-2xl text-sm shadow-md">
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Selected ₹{vistaShieldConfig.v1MaxBenefit ? vistaShieldConfig.v1MaxBenefit.toLocaleString() : '10,000'} Plan</span>
                </div>
              ) : (
                <button
                  onClick={() => handleChoosePlan('variant-1')}
                  className="w-full bg-[#123477] hover:bg-[#0e2759] text-white font-black py-4 px-6 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2 border border-[#123477]"
                >
                  <span>Choose ₹{vistaShieldConfig.v1MaxBenefit ? vistaShieldConfig.v1MaxBenefit.toLocaleString() : '10,000'} Plan</span>
                  <ArrowRight className="w-4 h-4 text-[#C9A646]" />
                </button>
              )}
            </div>
          </div>

          {/* VARIANT 2 CARD */}
          <div className={`relative rounded-3xl p-6 sm:p-8 transition duration-300 flex flex-col justify-between ${
            selectedVistaShieldPlan?.variantId === 'variant-2'
              ? 'bg-gradient-to-b from-amber-50/80 via-white to-amber-50/40 border-2 border-[#123477] shadow-xl ring-4 ring-[#123477]/20'
              : 'bg-white border-2 border-slate-200 hover:border-[#123477] shadow-md hover:shadow-xl hover:-translate-y-1'
          }`}>
            <div className="space-y-6 pt-2">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">PLAN VARIANT 2</span>
                  <h4 className="text-xl font-black text-[#123477]">Essential Protection</h4>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-[#123477]">
                  <ShieldCheck className="w-5 h-5 text-[#123477]" />
                </div>
              </div>

              {/* Benefits Highlight */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-xs text-slate-600 font-bold">Maximum Coverage Benefit</div>
                <div className="text-3xl sm:text-4xl font-black text-[#123477]">
                  ₹{vistaShieldConfig.v2MaxBenefit ? vistaShieldConfig.v2MaxBenefit.toLocaleString() : '7,500'}/-
                </div>
                <div className="text-[11px] text-[#C9A646] font-bold">Screen Damage Repair Cover</div>
              </div>

              {/* Pricing Display */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-[#123477]">
                    ₹{vistaShieldConfig.v2Price ? vistaShieldConfig.v2Price.toLocaleString() : '1,598'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">/ 1 Year</span>
                </div>
                <div className="text-xs font-extrabold text-[#C9A646]">
                  MRP: ₹{vistaShieldConfig.v2Price ? vistaShieldConfig.v2Price.toLocaleString() : '1,598'}/- (Incl. of GST)
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              {selectedVistaShieldPlan?.variantId === 'variant-2' ? (
                <div className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-black py-4 px-6 rounded-2xl text-sm shadow-md">
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Selected ₹{vistaShieldConfig.v2MaxBenefit ? vistaShieldConfig.v2MaxBenefit.toLocaleString() : '7,500'} Plan</span>
                </div>
              ) : (
                <button
                  onClick={() => handleChoosePlan('variant-2')}
                  className="w-full bg-white hover:bg-slate-50 text-[#123477] font-black py-4 px-6 rounded-2xl shadow border-2 border-[#123477] transition transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2"
                >
                  <span>Choose ₹{vistaShieldConfig.v2MaxBenefit ? vistaShieldConfig.v2MaxBenefit.toLocaleString() : '7,500'} Plan</span>
                  <ArrowRight className="w-4 h-4 text-[#123477]" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Plan Details Grid (Clean Icon-Based Information Below Cards) */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-black text-[#C9A646] uppercase tracking-wider">Comprehensive Features</span>
            <h4 className="text-xl font-black text-[#123477]">Plan Details & Coverage Summary</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {planDetailsList.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3 hover:border-[#123477] transition"
              >
                <div className="w-10 h-10 rounded-xl bg-[#123477]/5 border border-[#123477]/10 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 font-black text-[#123477] text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold leading-tight">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IMPORTANT TRUST INFORMATION BOX ("Trust Line") */}
        <div className="bg-gradient-to-r from-[#123477] via-[#1a449c] to-[#123477] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#C9A646] shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#C9A646]/20 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C9A646] text-[#123477] flex items-center justify-center shrink-0 font-black shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-[#C9A646] text-[#123477] text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    {vistaShieldConfig.trustLineTitle || 'Trust Line'}
                  </span>
                  <span className="text-[#C9A646] font-extrabold text-xs">
                    {vistaShieldConfig.trustLineHighlight || '100% Official & Secure.'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-100 max-w-2xl leading-relaxed">
                  "{vistaShieldConfig.trustLineText || 'After booking your plan, always verify the policy document directly through the official OneAssist App.'}"
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-xs font-bold text-amber-300">
                <span>Official Partner: OneAssist</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Selection Banner if plan is selected */}
        {selectedVistaShieldPlan && (
          <div className="bg-emerald-50 border-2 border-emerald-500 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">
                ✓
              </div>
              <div>
                <div className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                  Active Selection: MobileKart Vista Shield – Powered by OneAssist ({selectedVistaShieldPlan.variantName})
                </div>
                <div className="text-xs font-bold text-emerald-800">
                  Maximum Benefit: ₹{selectedVistaShieldPlan.maxBenefit.toLocaleString()} | Price: ₹{selectedVistaShieldPlan.mrp.toLocaleString()} (Incl. of GST)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/repair-booking')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
              >
                Continue Booking →
              </button>
              <button
                onClick={clearSelectedVistaShieldPlan}
                className="text-xs text-slate-500 hover:text-red-600 font-bold underline px-2 py-1"
              >
                Remove
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
