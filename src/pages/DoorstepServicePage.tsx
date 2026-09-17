import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { SERVICE_AREAS } from '../data/mockData';

export const DoorstepServicePage: React.FC = () => {
  const [pincodeQuery, setPincodeQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{ found: boolean; area?: typeof SERVICE_AREAS[0] } | null>(null);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincodeQuery.trim();
    if (!clean) return;

    const matched = SERVICE_AREAS.find((a) => a.pincode === clean || a.areaName.toLowerCase().includes(clean.toLowerCase()));
    if (matched) {
      setSearchResult({ found: true, area: matched });
    } else {
      setSearchResult({ found: false });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 bg-slate-50 text-slate-900">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white border border-teal-300 px-4 py-1.5 rounded-full text-xs font-bold text-teal-800 shadow-sm">
          <Truck className="w-4 h-4 text-amber-600" />
          <span>Hyderabad On-Site Mobile Repair</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Doorstep Mobile Repair <br />
          <span className="text-gradient">Right at Your Home or Office</span>
        </h1>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
          No need to leave your desk or travel through Hyderabad traffic. Certified technicians repair broken screens, batteries, and ports in front of you within 60 minutes.
        </p>
      </div>

      {/* Pincode Availability Checker Box */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-md space-y-6 max-w-2xl mx-auto">
        <h2 className="font-black text-slate-900 text-base text-center">Check Doorstep Service Availability in Your Area</h2>

        <form onSubmit={handleCheckPincode} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={pincodeQuery}
              onChange={(e) => setPincodeQuery(e.target.value)}
              placeholder="Enter Hyderabad Pincode (e.g., 500081, 500032, 500072)"
              className="w-full bg-slate-50 border border-slate-300 focus:border-teal-700 text-slate-900 text-sm font-mono font-bold rounded-xl py-3 pl-10 pr-4 outline-none"
            />
            <MapPin className="w-4 h-4 text-teal-700 absolute left-3 top-3.5" />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 text-white font-black px-6 py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow"
          >
            Check Pincode
          </button>
        </form>

        {/* Result Message */}
        {searchResult && (
          <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in duration-300 ${
            searchResult.found && searchResult.area?.isSupported
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
              : 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
          }`}>
            {searchResult.found && searchResult.area?.isSupported ? (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-black text-sm text-slate-900">
                    Service Available in {searchResult.area.areaName} ({searchResult.area.pincode})!
                  </div>
                  <div className="text-slate-700 text-xs font-medium">
                    Technicians available for 60-min doorstep visit. Doorstep Fee: {searchResult.area.doorstepFee === 0 ? 'FREE' : `₹${searchResult.area.doorstepFee}`}.
                  </div>
                  <div className="pt-2">
                    <Link
                      to={`/repair-booking?pincode=${searchResult.area.pincode}`}
                      className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black px-4 py-2 rounded-xl text-xs transition shadow-sm"
                    >
                      Book Repair in {searchResult.area.areaName.split('/')[0]} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Doorstep slot limited for pincode {pincodeQuery}</div>
                  <div className="text-slate-700 text-xs font-medium">
                    Our free central lab pickup & drop service is available for all Hyderabad addresses!
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid of Hyderabad Service Hubs */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Major Hyderabad Service Hubs Covered</h2>
          <p className="text-slate-600 text-xs font-semibold">Doorstep technician visits available across Cyberabad & Greater Hyderabad</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SERVICE_AREAS.map((sa) => (
            <div key={sa.id} className="glass-card p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-700" />
                  <span>{sa.areaName}</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">Pincode: <span className="font-mono font-bold text-amber-700">{sa.pincode}</span></div>
              </div>

              <Link
                to={`/repair-booking?pincode=${sa.pincode}`}
                className="bg-slate-100 hover:bg-teal-700 hover:text-white text-teal-800 font-extrabold text-xs px-3.5 py-1.5 rounded-xl border border-teal-200 transition"
              >
                Book
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
