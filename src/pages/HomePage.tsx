import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wrench, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Sparkles, 
  Star, 
  ChevronRight, 
  ArrowRight,
  CheckCircle2,
  Plus,
  Minus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BRANDS, SAMPLE_REVIEWS } from '../data/mockData';
import { VistaShieldSection } from '../components/VistaShieldSection';
import { PersonalCarePassSection } from '../components/PersonalCarePassSection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { products, addToCart, setSelectedBrand, setSelectedModel, repairProblems } = useApp();

  // Quick Repair Estimator State
  const [estBrand, setEstBrand] = useState('Apple');
  const [estModel, setEstModel] = useState('iPhone 15');
  const [estProblemId, setEstProblemId] = useState('p-scr-1');

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const selectedProblem = (repairProblems && repairProblems.length > 0)
    ? (repairProblems.find((p) => p.id === estProblemId) || repairProblems[0])
    : { title: 'Screen Repair', estimatedPrice: 1999, estimatedTime: '45 mins', warranty: '90 Days' };

  const categories = [
    { name: 'Mobile Covers', slug: 'mobile-covers', count: '140+ Items', icon: '📱', img: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=400&auto=format&fit=crop&q=80' },
    { name: 'Tempered Glass', slug: 'tempered-glass', count: '90+ Items', icon: '🛡️', img: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&auto=format&fit=crop&q=80' },
    { name: 'Chargers', slug: 'chargers', count: '45+ Items', icon: '⚡', img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80' },
    { name: 'USB Cables', slug: 'cables', count: '60+ Items', icon: '🔌', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80' },
    { name: 'Power Banks', slug: 'power-banks', count: '30+ Items', icon: '🔋', img: 'https://images.unsplash.com/photo-1609592424089-980753d3d63b?w=400&auto=format&fit=crop&q=80' },
    { name: 'TWS Earbuds', slug: 'earbuds', count: '50+ Items', icon: '🎧', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80' }
  ];

  const faqs = [
    {
      q: 'Is doorstep repair really done right in front of me in Hyderabad?',
      a: 'Yes! Our certified technician arrives at your home, office, or cafe with a mobile toolkit. Most screen, battery, and port repairs are completed within 30 to 60 minutes in front of your eyes.'
    },
    {
      q: 'What warranty do I get on mobile repair parts?',
      a: 'We provide up to 90 to 180 Days warranty on all original spare parts used for display, battery, and port repairs. You will receive a digital warranty certificate.'
    },
    {
      q: 'Which areas in Hyderabad do you cover for doorstep service?',
      a: 'We cover Madhapur, Gachibowli, Hitech City, Kondapur, Kukatpally, KPHB Colony, Jubilee Hills, Banjara Hills, Secunderabad, Miyapur, and nearby zones.'
    },
    {
      q: 'What if my phone problem cost changes after technician diagnosis?',
      a: 'We practice 100% transparent pricing. If our technician finds an additional issue during diagnosis, we notify you immediately. No extra work is done without your explicit approval!'
    }
  ];

  return (
    <div className="space-y-16 pb-16 bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white border border-blue-300 px-4 py-1.5 rounded-full text-xs font-bold text-blue-900 shadow-sm">
              <Sparkles className="w-4 h-4 text-sky-500 animate-pulse" />
              <span>Hyderabad’s #1 Mobile Care & Accessories Store</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Your Mobile. <br />
              <span className="text-gradient">Our Care.</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              Shop genuine-quality mobile accessories crafted for your model or book a fast, transparent mobile repair service right at your doorstep in Hyderabad.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/repair-booking"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:to-blue-600 text-white font-black px-7 py-4 rounded-xl shadow-lg text-sm transition transform hover:-translate-y-0.5"
              >
                <Wrench className="w-4 h-4" /> Book a Doorstep Repair
              </Link>

              <Link
                to="/shop"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-7 py-4 rounded-xl border border-slate-300 shadow-sm text-sm transition"
              >
                <ShoppingBag className="w-4 h-4 text-blue-600" /> Shop Accessories
              </Link>
            </div>

            {/* Key Value Props */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>60-Min Service</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>90-Day Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Original Parts</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Hyderabad Lab</span>
              </div>
            </div>
          </div>

          {/* Right Card: Quick Repair Estimator Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-xl border border-slate-200 relative">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600 animate-ping"></div>
                  <h3 className="font-black text-slate-900 text-base">Instant Repair Price Estimator</h3>
                </div>
                <span className="text-[11px] font-black text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  Hyderabad Zone
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Brand */}
                <div>
                  <label className="block text-slate-700 mb-1 font-extrabold">Select Phone Brand</label>
                  <select
                    value={estBrand}
                    onChange={(e) => setEstBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:border-blue-600"
                  >
                    {BRANDS.map((b) => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div>
                  <label className="block text-slate-700 mb-1 font-extrabold">Select Model</label>
                  <select
                    value={estModel}
                    onChange={(e) => setEstModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:border-blue-600"
                  >
                    <option value="iPhone 15">iPhone 15</option>
                    <option value="iPhone 15 Pro Max">iPhone 15 Pro Max</option>
                    <option value="iPhone 14">iPhone 14</option>
                    <option value="iPhone 13">iPhone 13</option>
                    <option value="Galaxy S24 Ultra">Galaxy S24 Ultra</option>
                    <option value="Galaxy S23 FE">Galaxy S23 FE</option>
                    <option value="OnePlus 12">OnePlus 12</option>
                    <option value="Pixel 8 Pro">Pixel 8 Pro</option>
                  </select>
                </div>

                {/* Problem */}
                <div>
                  <label className="block text-slate-700 mb-1 font-extrabold">Select Issue</label>
                  <select
                    value={estProblemId}
                    onChange={(e) => setEstProblemId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:border-blue-600"
                  >
                    {repairProblems.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                {/* Estimated Output Box */}
                <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-center space-y-1">
                  <div className="text-slate-600 text-[11px] font-bold">Estimated Service Price:</div>
                  <div className="text-3xl font-black text-blue-600">₹{selectedProblem.estimatedPrice.toLocaleString()}</div>
                  <div className="text-[11px] text-blue-900 font-bold flex items-center justify-center gap-2">
                    <span>⏱️ {selectedProblem.estimatedTime}</span> • <span>🛡️ {selectedProblem.warranty}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/repair-booking?brand=${encodeURIComponent(estBrand)}&model=${encodeURIComponent(estModel)}&problem=${estProblemId}`)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2"
                >
                  Book Repair for ₹{selectedProblem.estimatedPrice} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MobileKart Vista Shield - Powered by OneAssist */}
      <VistaShieldSection />

      {/* Personal Care Pass */}
      <PersonalCarePassSection />

      {/* Brand Selector Bar */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-black text-slate-900">Select Your Phone Brand</h2>
          <p className="text-slate-600 text-xs font-semibold">Filter accessories and repairs specifically engineered for your smartphone model</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3">
          {BRANDS.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setSelectedBrand(b.name);
                setSelectedModel('');
                navigate('/shop');
              }}
              className="glass-card p-3 rounded-2xl flex flex-col items-center justify-center gap-2 group border border-slate-200 hover:border-teal-500"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 p-1.5 flex items-center justify-center overflow-hidden group-hover:scale-110 transition">
                <img src={b.logo} alt={b.name} className="w-full h-full object-contain rounded-full" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 group-hover:text-teal-700 truncate w-full text-center">
                {b.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Shop by Category</h2>
            <p className="text-slate-600 text-xs font-semibold">Premium accessories with guaranteed model compatibility</p>
          </div>
          <Link to="/shop" className="text-xs font-extrabold text-teal-700 hover:text-teal-800 flex items-center gap-1">
            View All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/shop?category=${c.slug}`}
              className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full border border-slate-200 hover:border-teal-500"
            >
              <div className="h-32 overflow-hidden relative bg-slate-100">
                <img 
                  src={c.img} 
                  alt={c.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                />
                <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300 shadow-sm">
                  {c.count}
                </span>
              </div>
              <div className="p-3 text-center flex-1 flex flex-col justify-center bg-white">
                <div className="font-black text-slate-900 text-xs group-hover:text-teal-700 transition">{c.name}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Explore Collection →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Accessories Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-amber-700 text-xs font-extrabold uppercase tracking-wider">Top Rated Accessories</div>
            <h2 className="text-2xl font-black text-slate-900">Featured Hyderabad Products</h2>
          </div>
          <Link to="/shop" className="text-xs font-extrabold text-teal-700 hover:text-teal-800 flex items-center gap-1">
            Browse All ({products.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((p) => (
            <div 
              key={p.id}
              className="glass-card rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between group hover:border-teal-500 bg-white"
            >
              <div>
                {/* Image */}
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  <img 
                    src={p.images[0]} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                  {p.isBestSeller && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-sm">
                      Best Seller
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 bg-white/90 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200 shadow-sm">
                    {p.brand}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold">{p.categoryName}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span>{p.rating} ({p.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="font-black text-slate-900 text-sm line-clamp-2 group-hover:text-teal-700 transition">
                    {p.name}
                  </h3>

                  <div className="text-[11px] text-slate-600 bg-slate-100 p-2 rounded-lg border border-slate-200 truncate">
                    Fits: <span className="text-slate-900 font-semibold">{p.compatibleModels.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-4 pt-0 space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-900">₹{p.discountPrice}</span>
                  <span className="text-xs text-slate-400 line-through">₹{p.originalPrice}</span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Save ₹{p.originalPrice - p.discountPrice}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(p, 1)}
                  className="w-full bg-slate-100 hover:bg-teal-700 hover:text-white text-teal-800 font-extrabold text-xs py-2.5 rounded-xl border border-teal-200 transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Doorstep Repair Workflow */}
      <section className="bg-gradient-to-r from-teal-900 via-teal-850 to-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider">How Doorstep Repair Works</span>
            <h2 className="text-3xl font-black text-white">4 Easy Steps to Fix Your Smartphone</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg">
                1
              </div>
              <h3 className="font-black text-white text-base">Select Issue & Model</h3>
              <p className="text-slate-200 text-xs">Choose your phone brand, model, and the issue (screen, battery, port, camera).</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg">
                2
              </div>
              <h3 className="font-black text-white text-base">Choose Date & Time Slot</h3>
              <p className="text-slate-200 text-xs">Pick a convenient time slot and enter your Hyderabad address or pincode.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg">
                3
              </div>
              <h3 className="font-black text-white text-base">Technician Visit</h3>
              <p className="text-slate-200 text-xs">Certified technician arrives with genuine spare parts & tools right at your location.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg">
                4
              </div>
              <h3 className="font-black text-white text-base">Pay Post-Repair & Warranty</h3>
              <p className="text-slate-200 text-xs">Test your phone completely, pay via UPI/Cash, and get 90-Day digital warranty card!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-2 mb-10">
          <div className="flex justify-center items-center gap-1 text-amber-500">
            <Star className="w-5 h-5 fill-amber-500" />
            <Star className="w-5 h-5 fill-amber-500" />
            <Star className="w-5 h-5 fill-amber-500" />
            <Star className="w-5 h-5 fill-amber-500" />
            <Star className="w-5 h-5 fill-amber-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Loved by Hyderabad Customers</h2>
          <p className="text-slate-600 text-xs font-semibold">Real reviews from Madhapur, Gachibowli, Kukatpally, and Jubilee Hills customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_REVIEWS.map((rev) => (
            <div key={rev.id} className="glass-card p-6 rounded-2xl space-y-4 border border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="font-black text-slate-900 text-sm">{rev.authorName}</div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  Verified Customer
                </span>
              </div>
              <p className="text-slate-700 text-xs italic leading-relaxed">"{rev.comment}"</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-teal-700 font-bold">{rev.itemName}</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-xs font-semibold">Everything you need to know about MobileKart™ repair & delivery</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="glass-card rounded-xl border border-slate-200 overflow-hidden bg-white transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left font-bold text-slate-900 text-sm flex justify-between items-center gap-4 hover:text-teal-700 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <Minus className="w-4 h-4 text-amber-600 shrink-0" /> : <Plus className="w-4 h-4 text-teal-700 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 border-t border-slate-100 pt-3 leading-relaxed font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
