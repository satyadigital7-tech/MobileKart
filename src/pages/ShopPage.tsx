import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Star, 
  ShoppingBag, 
  Heart, 
  Smartphone, 
  Check, 
  X, 
  Eye, 
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BRANDS } from '../data/mockData';
import type { Product } from '../types';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, addToCart, wishlist, toggleWishlist, selectedBrand, setSelectedBrand, selectedModel, setSelectedModel } = useApp();

  const urlCategory = searchParams.get('category') || '';
  const urlSearch = searchParams.get('search') || '';

  const [categoryFilter, setCategoryFilter] = useState<string>(urlCategory);
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('popular');

  // Quick View Modal
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  const categories = [
    { name: 'All Categories', slug: '' },
    { name: 'Mobile Covers', slug: 'mobile-covers' },
    { name: 'Tempered Glass', slug: 'tempered-glass' },
    { name: 'Chargers', slug: 'chargers' },
    { name: 'Cables', slug: 'cables' },
    { name: 'Power Banks', slug: 'power-banks' },
    { name: 'Earbuds', slug: 'earbuds' },
    { name: 'Holders', slug: 'holders' },
  ];

  // Available models based on selected brand
  const filteredModels = useMemo(() => {
    if (!selectedBrand) return [];
    const brandObj = BRANDS.find((b) => b.name.toLowerCase() === selectedBrand.toLowerCase());
    return brandObj ? brandObj.popularModels : [];
  }, [selectedBrand]);

  // Main Product Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      if (categoryFilter && p.category !== categoryFilter) return false;

      // Brand match
      if (selectedBrand && p.brand.toLowerCase() !== selectedBrand.toLowerCase() && p.brand !== 'Universal') return false;

      // Model compatibility match
      if (selectedModel) {
        const isCompatible = p.compatibleModels.some(m => m.toLowerCase().includes(selectedModel.toLowerCase()));
        if (!isCompatible && p.brand !== 'Universal') return false;
      }

      // Search match
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCategory = p.categoryName.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesBrand) return false;
      }

      // Max price
      if (p.discountPrice > maxPrice) return false;

      // In stock
      if (inStockOnly && !p.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.discountPrice - b.discountPrice;
      if (sortBy === 'price-high') return b.discountPrice - a.discountPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return b.reviewCount - a.reviewCount; // popular
    });
  }, [products, categoryFilter, selectedBrand, selectedModel, searchQuery, maxPrice, inStockOnly, sortBy]);

  const resetFilters = () => {
    setCategoryFilter('');
    setSearchQuery('');
    setSelectedBrand('');
    setSelectedModel('');
    setMaxPrice(5000);
    setInStockOnly(false);
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 bg-slate-50 text-slate-900">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-amber-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-amber-300 text-xs font-black uppercase tracking-wider">Hyderabad Accessories Store</div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Genuine Mobile Accessories Catalog</h1>
          <p className="text-slate-100 text-xs max-w-xl font-medium">
            Filter by your brand and exact phone model to guarantee 100% precision fitment. Express delivery across Hyderabad.
          </p>
        </div>

        {/* Selected Phone Pill Indicator */}
        {(selectedBrand || selectedModel) && (
          <div className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-xl flex items-center gap-3 text-xs">
            <Smartphone className="w-4 h-4 text-amber-300" />
            <div>
              <div className="text-[10px] text-slate-100 font-semibold">Filtering Accessories For:</div>
              <div className="font-extrabold text-white">{selectedBrand} {selectedModel ? `• ${selectedModel}` : ''}</div>
            </div>
            <button 
              onClick={() => { setSelectedBrand(''); setSelectedModel(''); }}
              className="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-5 rounded-3xl border border-slate-200 bg-white space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-teal-700" />
                <span>Filters & Compatibility</span>
              </div>
              <button onClick={resetFilters} className="text-[11px] text-amber-700 hover:underline font-extrabold">
                Reset All
              </button>
            </div>

            {/* Brand -> Model Cascading Filter */}
            <div className="space-y-3">
              <label className="block text-xs font-extrabold text-slate-800">1. Select Phone Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedModel('');
                }}
                className="w-full bg-slate-50 border border-slate-300 text-xs text-slate-900 font-semibold rounded-xl p-3 outline-none focus:border-teal-700"
              >
                <option value="">All Brands</option>
                {BRANDS.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>

              {/* Model Dropdown */}
              {selectedBrand && (
                <div className="pt-1">
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">2. Select Phone Model</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-xs text-slate-900 font-semibold rounded-xl p-3 outline-none focus:border-teal-700"
                  >
                    <option value="">All {selectedBrand} Models</option>
                    {filteredModels.map((m, idx) => (
                      <option key={idx} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Categories List */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-800">Category</label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setCategoryFilter(c.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex justify-between items-center ${
                      categoryFilter === c.slug
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{c.name}</span>
                    {categoryFilter === c.slug && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-800">Max Price</span>
                <span className="text-blue-600 font-black">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Stock filter */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="instock"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-blue-600"
              />
              <label htmlFor="instock" className="text-xs font-bold text-slate-700 cursor-pointer">
                In Stock Items Only
              </label>
            </div>
          </div>
        </div>

        {/* Product Listing Main */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="glass-card p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-slate-600 font-semibold">
              Showing <span className="font-black text-blue-600">{filteredProducts.length}</span> items
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-bold shrink-0">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold rounded-xl px-3.5 py-2 outline-none focus:border-blue-600 w-full sm:w-auto"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-slate-200 bg-white">
              <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">No accessories matched your filter</h3>
              <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto">
                Try selecting "All Brands" or adjusting your max price range slider.
              </p>
              <button
                onClick={resetFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-5 py-2.5 rounded-xl transition shadow"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((p) => {
                const isWishlisted = wishlist.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className="glass-card rounded-2xl overflow-hidden border border-slate-200 bg-white flex flex-col justify-between group hover:border-blue-500 transition relative shadow-sm hover:shadow-md"
                  >
                    <div>
                      {/* Image container */}
                      <div className="h-36 sm:h-52 bg-slate-100 relative overflow-hidden">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />

                        {/* Wishlist button */}
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
                            isWishlisted
                              ? 'bg-amber-500 text-white shadow'
                              : 'bg-white/80 text-slate-700 hover:text-slate-900 shadow-sm'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                        </button>

                        {/* Quick view */}
                        <button
                          onClick={() => setActiveModalProduct(p)}
                          className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-black gap-2"
                        >
                          <Eye className="w-4 h-4" /> Quick Details
                        </button>

                        <span className="absolute bottom-3 left-3 bg-white/90 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200 shadow-sm">
                          {p.brand}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
                          <span className="font-semibold truncate max-w-[80px] sm:max-w-none">{p.categoryName}</span>
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-amber-500" />
                            <span>{p.rating} ({p.reviewCount})</span>
                          </div>
                        </div>

                        <h3 className="font-black text-slate-900 text-xs sm:text-sm line-clamp-2 group-hover:text-blue-600 transition">
                          {p.name}
                        </h3>

                        {/* Compatibility pill */}
                        <div className="text-[10px] sm:text-[11px] text-slate-600 bg-slate-100 p-1.5 sm:p-2 rounded-xl border border-slate-200">
                          <span className="text-slate-500 font-semibold hidden sm:inline">Fits: </span>
                          <span className="text-blue-900 font-bold truncate block">
                            {p.compatibleModels.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Cart */}
                    <div className="p-2.5 sm:p-4 pt-0 space-y-2 sm:space-y-3">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-base sm:text-xl font-black text-slate-900">₹{p.discountPrice}</span>
                        <span className="text-[10px] sm:text-xs text-slate-400 line-through">₹{p.originalPrice}</span>
                      </div>

                      <button
                        onClick={() => addToCart(p, 1, selectedModel || p.compatibleModels[0])}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-[11px] sm:text-xs py-2 sm:py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick View Product Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src={activeModalProduct.images[0]}
                  alt={activeModalProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">{activeModalProduct.categoryName}</div>
                <h2 className="text-xl font-black text-slate-900">{activeModalProduct.name}</h2>
                <div className="text-2xl font-black text-amber-700">₹{activeModalProduct.discountPrice}</div>
                <p className="text-slate-600 text-xs leading-relaxed font-medium">{activeModalProduct.description}</p>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="text-slate-500 font-bold">Compatible Models:</div>
                  <div className="text-teal-800 font-bold">{activeModalProduct.compatibleModels.join(' • ')}</div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      addToCart(activeModalProduct, 1);
                      setActiveModalProduct(null);
                    }}
                    className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
