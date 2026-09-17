import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Heart,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { SERVICE_AREAS } from '../../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 text-xs mt-12">
      {/* Guarantees Bar */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">60-Min Doorstep</div>
              <div className="text-[11px] text-slate-400">On-site repair at home/office</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">90-Day Warranty</div>
              <div className="text-[11px] text-slate-400">100% Genuine spare parts</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Transparent Cost</div>
              <div className="text-[11px] text-slate-400">No approval, no extra charge</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Hyderabad Wide</div>
              <div className="text-[11px] text-slate-400">Madhapur, Gachibowli & more</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/mobilekart-logo.png" 
              alt="MobileKart™ Logo" 
              className="h-10 w-auto object-contain bg-white/90 p-1 rounded-lg" 
            />
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            MobileKart™ is Hyderabad’s premier local-first phone accessories store and doorstep mobile repair platform. Original parts, certified technicians, and express doorstep service across Cyberabad and Greater Hyderabad.
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Plot 42, Hitech City Main Rd, Opp. Cyber Towers, Madhapur, Hyderabad, TS 500081</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>+91 98765 43210 / +91 040 4958 3321</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Mon – Sun: 9:00 AM – 9:00 PM IST</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-3">Quick Services</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/repair-booking?category=screen" className="hover:text-teal-300 transition">Screen Repair Hyderabad</Link></li>
            <li><Link to="/repair-booking?category=battery" className="hover:text-teal-300 transition">Battery Replacement</Link></li>
            <li><Link to="/repair-booking?category=charging" className="hover:text-teal-300 transition">Charging Port Repair</Link></li>
            <li><Link to="/repair-booking?category=water" className="hover:text-teal-300 transition">Water Damage Treatment</Link></li>
            <li><Link to="/doorstep-service" className="hover:text-teal-300 transition">Doorstep Service Locations</Link></li>
            <li><Link to="/track-repair" className="hover:text-teal-300 transition">Track Repair Status</Link></li>
          </ul>
        </div>

        {/* Shop Categories */}
        <div>
          <h4 className="text-white font-bold text-sm mb-3">Shop Accessories</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/shop?category=mobile-covers" className="hover:text-teal-300 transition">Mobile Covers & Cases</Link></li>
            <li><Link to="/shop?category=tempered-glass" className="hover:text-teal-300 transition">Privacy Tempered Glass</Link></li>
            <li><Link to="/shop?category=chargers" className="hover:text-teal-300 transition">Fast GaN Chargers</Link></li>
            <li><Link to="/shop?category=cables" className="hover:text-teal-300 transition">100W Type-C Cables</Link></li>
            <li><Link to="/shop?category=power-banks" className="hover:text-teal-300 transition">MagSafe Power Banks</Link></li>
            <li><Link to="/shop?category=earbuds" className="hover:text-teal-300 transition">ANC TWS Earbuds</Link></li>
          </ul>
        </div>

        {/* Hyderabad Locations SEO */}
        <div>
          <h4 className="text-white font-bold text-sm mb-3">Active Service Zones</h4>
          <div className="flex flex-wrap gap-1.5">
            {SERVICE_AREAS.slice(0, 8).map((area) => (
              <span 
                key={area.id}
                className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded-lg"
              >
                {area.areaName.split('/')[0]} ({area.pincode})
              </span>
            ))}
          </div>
          <div className="mt-4">
            <Link 
              to="/seo-locations"
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              View all Hyderabad Service Areas <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1 text-slate-400">
            <span>© {new Date().getFullYear()} MobileKart™. Built for Hyderabad with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/about" className="hover:text-white">About Us</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white">Contact</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
