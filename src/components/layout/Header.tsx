import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Wrench, 
  ShoppingBag, 
  Search, 
  MapPin, 
  Heart, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  Smartphone,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BRANDS } from '../../data/mockData';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    cart, 
    wishlist, 
    searchQuery, 
    setSearchQuery, 
    selectedBrand, 
    setSelectedBrand,
    selectedModel,
    setSelectedModel,
    isCustomerAuthenticated,
    customerUser,
    announcementBanner,
    openCustomerAuthModal,
    customerLogout
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Accessories', path: '/shop' },
    { name: 'Mobile Repair', path: '/repair-booking' },
    { name: 'Doorstep Service', path: '/doorstep-service' },
    { name: 'Track Repair', path: '/track-repair' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-blue-500/30 text-sky-200 border border-sky-400/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-sky-300 animate-pulse" /> HYDERABAD SPECIALIST
            </span>
            <span>{announcementBanner}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-100 text-[11px]">
            <span className="flex items-center gap-1 text-sky-300">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> 90-Day Warranty
            </span>
            <span className="hidden md:inline text-white/30">|</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" /> Madhapur Lab & Doorstep
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* MobileKart™ Logo */}
        <Link to="/" className="flex items-center gap-3 group py-1">
          <img 
            src="/mobilekart-logo.png" 
            alt="MobileKart™ Logo" 
            className="h-11 sm:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </Link>

        {/* Brand/Model Filter Selector Quick Pill */}
        <div className="hidden lg:flex items-center relative">
          <button
            onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold transition"
          >
            <Smartphone className="w-4 h-4 text-teal-700" />
            <span>
              {selectedBrand 
                ? `${selectedBrand} ${selectedModel ? `(${selectedModel})` : ''}`
                : 'Select Phone Model'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {isBrandDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50">
              <div className="text-xs font-bold text-teal-700 mb-2 uppercase tracking-wider">
                Filter Accessories by Brand
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    setSelectedBrand('');
                    setSelectedModel('');
                    setIsBrandDropdownOpen(false);
                  }}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    !selectedBrand ? 'bg-teal-100 text-teal-900 font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  All Brands
                </button>
                {BRANDS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBrand(b.name);
                      setSelectedModel('');
                      setIsBrandDropdownOpen(false);
                      navigate('/shop');
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedBrand === b.name ? 'bg-teal-100 text-teal-900 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-sm relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search iPhone case, battery, screen repair..."
            className="w-full bg-slate-100 border border-slate-300 focus:border-teal-600 focus:bg-white text-slate-900 text-xs rounded-full py-2.5 pl-9 pr-4 outline-none transition placeholder-slate-500 shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </form>

        {/* Action Icons */}
        <div className="flex items-center gap-3">
          {/* User Account / Sign In Pill */}
          {isCustomerAuthenticated ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold transition"
              >
                <User className="w-4 h-4 text-teal-700" />
                <span className="max-w-[100px] truncate">{customerUser?.name?.split(' ')[0] || 'Account'}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-xs space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100 font-bold text-slate-900">
                    <div>{customerUser?.name}</div>
                    <div className="text-[10px] text-slate-500 font-semibold truncate">{customerUser?.email}</div>
                  </div>
                  <Link
                    to="/account?tab=repairs"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
                  >
                    🔧 My Repair Bookings
                  </Link>
                  <Link
                    to="/account?tab=orders"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
                  >
                    🛍️ My Orders
                  </Link>
                  <Link
                    to="/account?tab=wishlist"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
                  >
                    ❤️ Wishlist ({wishlist.length})
                  </Link>
                  <button
                    onClick={() => {
                      customerLogout();
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-bold border-t border-slate-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openCustomerAuthModal('account')}
              className="p-2 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-xl transition relative hidden sm:flex items-center gap-1 text-xs font-extrabold"
              title="Sign In"
            >
              <User className="w-5 h-5" />
              <span className="hidden md:inline">Sign In</span>
            </button>
          )}

          <Link
            to="/account?tab=wishlist"
            className="p-2 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded-xl transition relative hidden sm:flex"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-md transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-sky-300 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-blue-600 lg:hidden"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Links Bar */}
      <div className="hidden lg:block bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2.5 text-xs font-bold transition rounded-lg ${
                    isActive 
                      ? 'text-blue-700 bg-blue-50 font-black' 
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/repair-booking"
              className="text-xs font-extrabold text-blue-700 hover:text-blue-800 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg border border-blue-200 transition shadow-sm"
            >
              <Wrench className="w-3.5 h-3.5 text-blue-600" /> Book Doorstep Repair
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          {/* Customer Profile / Sign In Banner in Mobile Drawer */}
          {isCustomerAuthenticated ? (
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-extrabold flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{customerUser?.name}</div>
                  <div className="text-[10px] text-slate-500 font-semibold">{customerUser?.phone}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  customerLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-red-600 hover:bg-red-50 font-extrabold px-2.5 py-1 rounded-lg border border-red-200 text-[11px]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openCustomerAuthModal('account');
              }}
              className="w-full bg-teal-50 hover:bg-teal-100 text-teal-900 font-extrabold p-3 rounded-2xl border border-teal-200 text-xs flex items-center justify-center gap-2 transition"
            >
              <User className="w-4 h-4 text-teal-700" />
              <span>Sign In / Create MobileKart Account</span>
            </button>
          )}

          {/* Search Bar in Mobile */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search iPhone case, battery, repair..."
              className="w-full bg-slate-100 border border-slate-300 text-slate-900 text-xs rounded-xl py-2.5 pl-9 pr-4 outline-none focus:border-teal-700 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition flex items-center justify-between"
              >
                <span>{link.name}</span>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </Link>
            ))}

            {isCustomerAuthenticated && (
              <>
                <Link
                  to="/account?tab=repairs"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition"
                >
                  🔧 My Repair Bookings
                </Link>
                <Link
                  to="/account?tab=orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition"
                >
                  🛍️ My Orders
                </Link>
              </>
            )}

            <Link
              to="/account?tab=wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition flex justify-between"
            >
              <span>❤️ My Wishlist</span>
              {wishlist.length > 0 && (
                <span className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/repair-booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-3 text-xs font-black text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl border border-amber-300 transition text-center shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              <Wrench className="w-4 h-4 text-amber-800" /> Book Doorstep Repair Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
