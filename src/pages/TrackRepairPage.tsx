import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Check, 
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { RepairBooking } from '../types';

export const TrackRepairPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { repairBookings, approveOrRejectRepairPrice } = useApp();

  const queryId = searchParams.get('id') || 'HMC-RP-100245';
  const [searchIdInput, setSearchIdInput] = useState(queryId);
  const [activeBooking, setActiveBooking] = useState<RepairBooking | null>(null);

  useEffect(() => {
    const found = repairBookings.find(
      (b) => b.id.toLowerCase() === queryId.trim().toLowerCase()
    );
    setActiveBooking(found || null);
    setSearchIdInput(queryId);
  }, [queryId, repairBookings]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchIdInput.trim()) {
      setSearchParams({ id: searchIdInput.trim() });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-white border border-teal-300 px-3.5 py-1 rounded-full text-xs font-extrabold text-teal-800 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Real-time Status Monitor</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Track Your Repair Progress</h1>
        <p className="text-slate-600 text-xs font-semibold">Enter your Repair ID (e.g., HMC-RP-100245) to view technician diagnosis & stage updates</p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row gap-3 shadow-md">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchIdInput}
            onChange={(e) => setSearchIdInput(e.target.value)}
            placeholder="Enter Repair ID (e.g. HMC-RP-100245 or HMC-RP-100246)"
            className="w-full bg-slate-50 border border-slate-300 focus:border-teal-700 text-slate-950 font-mono text-sm font-extrabold rounded-xl py-3 pl-10 pr-4 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 text-white font-black px-6 py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow"
        >
          Track Status
        </button>
      </form>

      {/* Sample Demo IDs bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-slate-600 font-extrabold">Try Sample Demo IDs:</span>
        {repairBookings.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              setSearchIdInput(b.id);
              setSearchParams({ id: b.id });
            }}
            className={`px-3 py-1 rounded-lg border text-xs font-mono font-bold transition ${
              queryId === b.id
                ? 'bg-teal-100 text-teal-900 border-teal-400 font-black shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {b.id} ({b.brand} {b.model})
          </button>
        ))}
      </div>

      {/* Results Box */}
      {!activeBooking ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-slate-200 bg-white shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Repair ID Not Found</h2>
          <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto">
            We couldn't find repair records for <code className="text-teal-800 font-bold">{queryId}</code>. Please double check your booking receipt ID.
          </p>
          <Link
            to="/repair-booking"
            className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs px-5 py-2.5 rounded-xl transition shadow"
          >
            Book a New Mobile Repair
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Booking Summary Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-md space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-teal-800 font-mono">{activeBooking.id}</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded border border-amber-300 uppercase">
                    {activeBooking.status}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900">{activeBooking.brand} {activeBooking.model}</h2>
                <div className="text-xs text-slate-600 font-semibold">Issue: <span className="text-teal-800 font-bold">{activeBooking.problemTitle}</span></div>
              </div>

              <div className="text-left md:text-right bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold">Total Price Quote:</div>
                <div className="text-2xl font-black text-amber-700">₹{activeBooking.finalPrice || activeBooking.initialEstimatedPrice}</div>
                <div className="text-[10px] text-emerald-700 font-extrabold">90-Day Warranty Included</div>
              </div>
            </div>

            {/* Price Approval Alert Box if Pending */}
            {activeBooking.priceApprovalStatus === 'pending' && (
              <div className="bg-amber-50 border-2 border-amber-400 p-5 rounded-2xl space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Customer Approval Required for Updated Quote</span>
                </div>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                  During laboratory diagnosis, our technician found that replacing your display requires an updated quote of <strong>₹{activeBooking.finalPrice}</strong> (Initial estimate was ₹{activeBooking.initialEstimatedPrice}).
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    onClick={() => approveOrRejectRepairPrice(activeBooking.id, 'approved')}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-black py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow"
                  >
                    <Check className="w-4 h-4" /> Approve Updated Quote (₹{activeBooking.finalPrice})
                  </button>
                  <button
                    onClick={() => approveOrRejectRepairPrice(activeBooking.id, 'rejected')}
                    className="bg-white hover:bg-slate-100 text-slate-800 font-extrabold py-2.5 px-4 rounded-xl text-xs border border-slate-300 transition flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" /> Decline Repair
                  </button>
                </div>
              </div>
            )}

            {/* Diagnostic Notes */}
            {activeBooking.diagnosisNotes && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <div className="text-xs font-black text-teal-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Technician Diagnostic Report:
                </div>
                <p className="text-xs text-slate-700 italic font-medium">{activeBooking.diagnosisNotes}</p>
                {activeBooking.technicianName && (
                  <div className="text-[11px] text-slate-500 pt-1 font-semibold">
                    Assigned Specialist: <span className="text-slate-900 font-bold">{activeBooking.technicianName}</span> ({activeBooking.technicianPhone})
                  </div>
                )}
              </div>
            )}

            {/* Visual Timeline Pipeline */}
            <div className="space-y-4 pt-2">
              <h3 className="font-black text-slate-900 text-sm">Progress Timeline</h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeBooking.statusHistory.map((item, idx) => {
                  const isCurrent = idx === activeBooking.statusHistory.length - 1;
                  return (
                    <div key={idx} className="relative flex items-start gap-4 group">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                        isCurrent 
                          ? 'bg-teal-700 border-teal-600 text-white font-bold animate-pulse' 
                          : 'bg-white border-teal-600 text-teal-700 shadow-sm'
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-black text-xs ${isCurrent ? 'text-teal-800' : 'text-slate-900'}`}>
                            {item.status}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">{item.timestamp}</span>
                        </div>
                        {item.note && <p className="text-xs text-slate-600 font-medium">{item.note}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Details Box */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="space-y-1">
                <div className="text-slate-500">Customer Name:</div>
                <div className="font-bold text-slate-900">{activeBooking.customerName} ({activeBooking.customerPhone})</div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-500">Service Location:</div>
                <div className="font-bold text-slate-900">{activeBooking.address.area}, Hyderabad ({activeBooking.address.pincode})</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
