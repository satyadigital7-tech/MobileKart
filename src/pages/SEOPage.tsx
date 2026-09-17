import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export const SEOPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12 bg-slate-50 text-slate-900">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Mobile Repair & Accessories Service Across Hyderabad
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
          Official service coverage areas for MobileKart™. Certified doorstep mobile screen replacement, battery renewal, and fast accessory delivery across Cyberabad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-700" />
            <span>Cyberabad Tech Hubs</span>
          </h2>
          <ul className="space-y-2 text-xs text-slate-700 font-medium">
            <li>• <strong>Madhapur (500081)</strong>: 15-min doorstep arrival, central repair laboratory near Cyber Towers.</li>
            <li>• <strong>Gachibowli (500032)</strong>: Express repair service for IT parks & residential towers.</li>
            <li>• <strong>Kondapur (500084)</strong>: Complete doorstep screen & battery replacement.</li>
            <li>• <strong>Hitech City (500081)</strong>: Corporate device repair & accessories express delivery.</li>
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            <span>Greater Hyderabad Zones</span>
          </h2>
          <ul className="space-y-2 text-xs text-slate-700 font-medium">
            <li>• <strong>Kukatpally / KPHB (500072)</strong>: Doorstep & lab pickup service for all mobile brands.</li>
            <li>• <strong>Jubilee Hills (500033)</strong>: VIP doorstep repair with original OEM display modules.</li>
            <li>• <strong>Banjara Hills (500034)</strong>: Same day accessories delivery & repair service.</li>
            <li>• <strong>Secunderabad (500003)</strong>: Express pickup and 90-day warranty repair.</li>
          </ul>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-teal-200 bg-white shadow-md text-center space-y-4">
        <h3 className="text-2xl font-black text-slate-900">Need Urgent Mobile Repair in Hyderabad?</h3>
        <p className="text-xs text-slate-600 font-semibold max-w-md mx-auto">
          Book online in 60 seconds. Our certified technician will arrive at your location with genuine spare parts.
        </p>
        <Link
          to="/repair-booking"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-700 to-teal-800 text-white font-black px-6 py-3 rounded-xl text-xs transition shadow"
        >
          Book Doorstep Repair Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export const AboutPage: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed font-medium bg-slate-50">
    <h1 className="text-3xl font-black text-slate-900">About MobileKart™</h1>
    <p>
      MobileKart™ was founded with a single mission: to revolutionize how people in Hyderabad buy phone accessories and fix broken smartphones.
    </p>
    <p>
      Unlike traditional repair centers where devices are kept for days without price transparency, MobileKart™ brings certified technicians right to your doorstep or offers real-time tracking from our Madhapur laboratory.
    </p>
    <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
      <h3 className="font-black text-slate-900 text-base">Our Core Promises</h3>
      <ul className="space-y-2">
        <li className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>100% Genuine-Quality Spare Parts with 90 to 180 Days Warranty</span>
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>Zero Surprise Charges — Customer Approval required before any additional repair work</span>
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>Dedicated Hyderabad Support Team available on WhatsApp and Phone</span>
        </li>
      </ul>
    </div>
  </div>
);
