import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Wrench, 
  Smartphone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Truck,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BRANDS, SERVICE_AREAS, TIME_SLOTS } from '../data/mockData';
import type { RepairCategoryType, ServiceType } from '../types';

export const RepairBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { createRepairBooking, isCustomerAuthenticated, customerUser, openCustomerAuthModal, repairProblems } = useApp();

  const paramBrand = searchParams.get('brand') || '';
  const paramModel = searchParams.get('model') || '';
  const paramProblem = searchParams.get('problem') || '';

  // Wizard Step State
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedBrand, setSelectedBrand] = useState<string>(paramBrand || 'Apple');
  const [selectedModel, setSelectedModel] = useState<string>(paramModel || 'iPhone 15');
  const [selectedCategory, setSelectedCategory] = useState<RepairCategoryType>('screen');
  const [selectedProblemId, setSelectedProblemId] = useState<string>(paramProblem || 'p-scr-1');
  const [serviceType, setServiceType] = useState<ServiceType>('doorstep');
  
  // Address & Pincode
  const [customerName, setCustomerName] = useState(customerUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(customerUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(customerUser?.email || '');
  const [houseNumber, setHouseNumber] = useState(customerUser?.address?.houseNumber || '');
  const [street, setStreet] = useState(customerUser?.address?.street || '');
  const [area, setArea] = useState(customerUser?.address?.area || 'Madhapur');
  const [pincode, setPincode] = useState(customerUser?.address?.pincode || '500081');
  const [landmark] = useState('');

  // Auto-fill customer details when customer signs in
  React.useEffect(() => {
    if (customerUser) {
      if (customerUser.name) setCustomerName(customerUser.name);
      if (customerUser.phone) setCustomerPhone(customerUser.phone);
      if (customerUser.email) setCustomerEmail(customerUser.email);
      if (customerUser.address?.houseNumber) setHouseNumber(customerUser.address.houseNumber);
      if (customerUser.address?.street) setStreet(customerUser.address.street);
      if (customerUser.address?.area) setArea(customerUser.address.area);
      if (customerUser.address?.pincode) setPincode(customerUser.address.pincode);
    }
  }, [customerUser]);

  // Date & Time
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(TIME_SLOTS[0].label);

  // Success State
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);

  // Pincode validation
  const pincodeAreaMatch = SERVICE_AREAS.find((sa) => sa.pincode === pincode.trim());
  const isPincodeSupported = pincodeAreaMatch ? pincodeAreaMatch.isSupported : false;

  const currentProblem = (repairProblems && repairProblems.length > 0)
    ? (repairProblems.find((p) => p.id === selectedProblemId) || repairProblems[0])
    : { id: 'p-scr-1', categoryId: 'screen' as RepairCategoryType, title: 'Screen Replacement', description: '', estimatedPrice: 1999, estimatedTime: '45 mins', warranty: '90 Days' };

  const categories = [
    { type: 'screen', name: 'Screen & Display', icon: '📱' },
    { type: 'battery', name: 'Battery & Power', icon: '🔋' },
    { type: 'charging', name: 'Charging Port', icon: '⚡' },
    { type: 'camera', name: 'Camera & Lens', icon: '📷' },
    { type: 'audio', name: 'Speaker & Mic', icon: '🔊' },
    { type: 'software', name: 'Software & OS', icon: '💻' },
    { type: 'other', name: 'Water Damage & General', icon: '💧' },
  ];

  const handleProceedToFinalStep = () => {
    if (!isCustomerAuthenticated) {
      openCustomerAuthModal('repair');
      return;
    }
    setStep(4);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCustomerAuthenticated) {
      openCustomerAuthModal('repair');
      return;
    }

    if (!customerName || !customerPhone || !pincode) {
      alert('Please fill out required customer information.');
      return;
    }

    const newBooking = createRepairBooking({
      customerName,
      customerPhone,
      customerEmail: customerEmail || 'customer@hyderabad.in',
      brand: selectedBrand,
      model: selectedModel,
      problemId: currentProblem.id,
      problemTitle: currentProblem.title,
      problemCategory: selectedCategory,
      serviceType,
      address: {
        houseNumber,
        street,
        area,
        city: 'Hyderabad',
        pincode,
        landmark
      },
      preferredDate,
      preferredTimeSlot,
      initialEstimatedPrice: currentProblem.estimatedPrice,
    });

    setBookingSuccessId(newBooking.id);
  };

  if (bookingSuccessId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 bg-slate-50 text-slate-900">
        <div className="glass-panel p-8 rounded-3xl border border-teal-200 bg-white shadow-xl space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
            <CheckCircle2 className="w-10 h-10 animate-bounce text-emerald-600" />
          </div>

          <div className="space-y-2">
            <span className="text-amber-700 font-black text-xs uppercase tracking-wider">Booking Successful!</span>
            <h1 className="text-3xl font-black text-slate-900">Your Doorstep Repair is Confirmed</h1>
            <p className="text-slate-600 text-xs font-semibold max-w-md mx-auto">
              Our technician will contact you before arriving at your location in Hyderabad.
            </p>
          </div>

          {/* Repair ID Pill */}
          <div className="bg-slate-50 border border-teal-300 p-4 rounded-2xl max-w-sm mx-auto space-y-1">
            <div className="text-slate-500 text-xs font-bold">Your Unique Repair ID:</div>
            <div className="text-2xl font-black text-teal-800 tracking-wider font-mono">{bookingSuccessId}</div>
            <div className="text-[11px] text-slate-600 font-semibold">Save this ID to live track your repair status anytime.</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl text-left border border-slate-200 text-xs space-y-2 font-medium">
            <div className="flex justify-between text-slate-700">
              <span className="text-slate-500">Phone Model:</span>
              <span className="font-bold text-slate-900">{selectedBrand} {selectedModel}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span className="text-slate-500">Repair Issue:</span>
              <span className="font-bold text-teal-800">{currentProblem.title}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span className="text-slate-500">Scheduled Date & Time:</span>
              <span className="font-bold text-amber-700">{preferredDate} ({preferredTimeSlot})</span>
            </div>
            <div className="flex justify-between text-slate-700 pt-2 border-t border-slate-200">
              <span className="text-slate-600 font-bold">Estimated Cost:</span>
              <span className="font-black text-slate-900 text-base">₹{currentProblem.estimatedPrice}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate(`/track-repair?id=${bookingSuccessId}`)}
              className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-black py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow"
            >
              <Wrench className="w-4 h-4" /> Live Track Repair Status
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold px-6 py-3 rounded-xl border border-slate-300 transition text-xs"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 bg-slate-50 text-slate-900">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-white border border-teal-300 px-3.5 py-1 rounded-full text-xs font-bold text-teal-800 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Hyderabad Doorstep & Lab Repair</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Book Mobile Repair Service</h1>
        <p className="text-slate-600 text-xs font-semibold">Complete 4 quick steps to schedule doorstep technician visit</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-xl mx-auto text-[10px] sm:text-xs font-black border-b border-slate-200 pb-3 sm:pb-4 gap-1 sm:gap-2">
        <div className={`flex items-center gap-1 sm:gap-2 ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs ${step >= 1 ? 'bg-blue-600 text-white font-black shadow-sm' : 'bg-slate-200'}`}>1</span>
          <span>Device</span>
        </div>
        <div className={`flex items-center gap-1 sm:gap-2 ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs ${step >= 2 ? 'bg-blue-600 text-white font-black shadow-sm' : 'bg-slate-200'}`}>2</span>
          <span>Problem</span>
        </div>
        <div className={`flex items-center gap-1 sm:gap-2 ${step >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs ${step >= 3 ? 'bg-blue-600 text-white font-black shadow-sm' : 'bg-slate-200'}`}>3</span>
          <span>Location</span>
        </div>
        <div className={`flex items-center gap-1 sm:gap-2 ${step >= 4 ? 'text-blue-600' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs ${step >= 4 ? 'bg-blue-600 text-white font-black shadow-sm' : 'bg-slate-200'}`}>4</span>
          <span>Review</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-md space-y-6">
        {/* STEP 1: SELECT DEVICE */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-black text-slate-900">Select Phone Brand & Model</h2>

            {/* Brand selection */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-800">Phone Brand</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {BRANDS.slice(0, 8).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBrand(b.name);
                      setSelectedModel(b.popularModels[0] || 'Generic Model');
                    }}
                    className={`p-3 rounded-xl border text-xs font-extrabold transition flex items-center gap-2 ${
                      selectedBrand === b.name
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                        : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>{b.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Model input / select */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-800">Phone Model</label>
              <input
                type="text"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                placeholder="e.g. iPhone 15 Pro Max, Galaxy S23, Nord 3"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 font-semibold outline-none focus:border-teal-700"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 text-white font-black py-3.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow"
            >
              Continue to Issue Selection <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: SELECT PROBLEM */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-black text-slate-900">What is wrong with your {selectedBrand} {selectedModel}?</h2>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.type}
                  onClick={() => {
                    setSelectedCategory(cat.type as RepairCategoryType);
                    const firstProb = repairProblems.find((p) => p.categoryId === cat.type);
                    if (firstProb) setSelectedProblemId(firstProb.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                    selectedCategory === cat.type
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Problem checklist */}
            <div className="space-y-3">
              {repairProblems.filter((p) => p.categoryId === selectedCategory).map((prob) => (
                <div
                  key={prob.id}
                  onClick={() => setSelectedProblemId(prob.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-4 ${
                    selectedProblemId === prob.id
                      ? 'bg-teal-50 border-teal-600 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-extrabold text-sm text-slate-900">{prob.title}</div>
                    <div className="text-xs text-slate-600 font-medium">{prob.description}</div>
                    <div className="text-[11px] text-teal-800 font-bold flex items-center gap-3 pt-1">
                      <span>⏱️ {prob.estimatedTime}</span>
                      <span>🛡️ {prob.warranty}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-amber-700">₹{prob.estimatedPrice}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Est. Total</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold px-5 py-3 rounded-xl border border-slate-300 text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 text-white font-black py-3.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow"
              >
                Select Location & Slot <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION & SERVICE MODE */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-black text-slate-900">Select Service Mode & Hyderabad Location</h2>

            {/* Service Type Radios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setServiceType('doorstep')}
                className={`p-4 rounded-2xl border text-left space-y-2 transition ${
                  serviceType === 'doorstep'
                    ? 'bg-teal-50 border-teal-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <Truck className="w-6 h-6 text-teal-700" />
                <div className="font-black text-sm text-slate-900">60-Min Doorstep</div>
                <div className="text-[11px] text-slate-600 font-semibold">Technician repairs at your home or office</div>
              </button>

              <button
                onClick={() => setServiceType('pickup')}
                className={`p-4 rounded-2xl border text-left space-y-2 transition ${
                  serviceType === 'pickup'
                    ? 'bg-teal-50 border-teal-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <MapPin className="w-6 h-6 text-amber-600" />
                <div className="font-black text-sm text-slate-900">Free Pickup & Drop</div>
                <div className="text-[11px] text-slate-600 font-semibold">We pick up phone & return post lab repair</div>
              </button>

              <button
                onClick={() => setServiceType('store_visit')}
                className={`p-4 rounded-2xl border text-left space-y-2 transition ${
                  serviceType === 'store_visit'
                    ? 'bg-teal-50 border-teal-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <Building2 className="w-6 h-6 text-emerald-700" />
                <div className="font-black text-sm text-slate-900">Madhapur Lab Visit</div>
                <div className="text-[11px] text-slate-600 font-semibold">Visit our central lab near Cyber Towers</div>
              </button>
            </div>

            {/* Address Form */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">Hyderabad Area / Locality</label>
                  <select
                    value={area}
                    onChange={(e) => {
                      const selectedAreaObj = SERVICE_AREAS.find(a => a.areaName.includes(e.target.value));
                      setArea(e.target.value);
                      if (selectedAreaObj) setPincode(selectedAreaObj.pincode);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-bold outline-none focus:border-teal-700"
                  >
                    {SERVICE_AREAS.map((sa) => (
                      <option key={sa.id} value={sa.areaName.split('/')[0]}>
                        {sa.areaName} ({sa.pincode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-mono font-bold outline-none focus:border-teal-700"
                  />
                </div>
              </div>

              {/* Pincode verification badge */}
              {pincode && (
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  isPincodeSupported 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' 
                    : 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                }`}>
                  {isPincodeSupported ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Great! Doorstep service is 100% available in pincode <strong>{pincode}</strong>.</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Note: Doorstep slot availability for pincode {pincode} is limited. Our lab pickup will assist!</span>
                    </>
                  )}
                </div>
              )}

              {/* Street & House */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">House / Flat / Building No.</label>
                  <input
                    type="text"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    placeholder="e.g. Flat 302, Sai Residency"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-semibold outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">Street / Landmark</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Near Metro Pillar 12, Road No 36"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-semibold outline-none focus:border-teal-700"
                  />
                </div>
              </div>

              {/* Schedule Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-bold outline-none focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">Time Slot</label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-bold outline-none focus:border-teal-700"
                  >
                    {TIME_SLOTS.map((ts) => (
                      <option key={ts.id} value={ts.label}>{ts.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold px-5 py-3 rounded-xl border border-slate-300 text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleProceedToFinalStep}
                className="flex-1 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 text-white font-black py-3.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow"
              >
                Proceed to Final Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {step === 4 && (
          <form onSubmit={handleConfirmBooking} className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-black text-slate-900">Customer Contact & Review Booking</h2>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Kiran Kumar"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-semibold outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1">Mobile Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98490 12345"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-semibold outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1">Email Address</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="kiran@gmail.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-semibold outline-none focus:border-teal-700"
                />
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-black text-slate-900 text-sm pb-2 border-b border-slate-200 flex items-center justify-between">
                <span>Booking Overview</span>
                <span className="text-amber-700 text-xs font-bold">Hyderabad Zone</span>
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <div className="text-slate-500">Selected Device:</div>
                  <div className="font-bold text-slate-900">{selectedBrand} {selectedModel}</div>
                </div>

                <div>
                  <div className="text-slate-500">Repair Issue:</div>
                  <div className="font-bold text-teal-800">{currentProblem.title}</div>
                </div>

                <div>
                  <div className="text-slate-500">Service Mode:</div>
                  <div className="font-bold text-amber-700 uppercase">{serviceType}</div>
                </div>

                <div>
                  <div className="text-slate-500">Address / Pincode:</div>
                  <div className="font-bold text-slate-900">{area}, Hyderabad ({pincode})</div>
                </div>

                <div>
                  <div className="text-slate-500">Scheduled Date & Time:</div>
                  <div className="font-bold text-slate-800">{preferredDate} | {preferredTimeSlot}</div>
                </div>

                <div>
                  <div className="text-slate-500">Warranty Coverage:</div>
                  <div className="font-bold text-emerald-700">{currentProblem.warranty}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-bold">Estimated Total Cost:</div>
                  <div className="text-2xl font-black text-slate-900">₹{currentProblem.estimatedPrice}</div>
                  <div className="text-[10px] text-slate-500">Pay after repair completion</div>
                </div>

                <div className="text-right text-[11px] text-teal-800 font-bold">
                  ✓ Includes Technician Visit <br />
                  ✓ Includes Original Spares
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold px-5 py-3 rounded-xl border border-slate-300 text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white font-black py-4 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <CheckCircle2 className="w-5 h-5" /> Confirm Repair Booking Now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
