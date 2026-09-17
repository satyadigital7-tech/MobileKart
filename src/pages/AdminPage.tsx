import React, { useState } from 'react';
import { 
  Wrench, 
  ShoppingBag, 
  DollarSign, 
  MapPin, 
  Plus, 
  Trash2,
  Edit,
  Megaphone,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdminLayout } from '../admin/layouts/AdminLayout';
import type { Product, RepairStatus, RepairBooking, Coupon, ProductCategory } from '../types';

export const AdminPage: React.FC = () => {
  const { 
    products, 
    repairBookings, 
    orders, 
    serviceAreas, 
    coupons,
    announcementBanner,
    setAnnouncementBanner,
    updateRepairStatus, 
    updateRepairBooking,
    addProduct, 
    updateProduct, 
    deleteProduct,
    updateOrderStatus,
    toggleServiceArea,
    addServiceArea,
    addCoupon,
    deleteCoupon
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'repairs' | 'products' | 'orders' | 'areas' | 'coupons' | 'banner'>('overview');

  // Selected Repair Editing Modal/Inline
  const [selectedRepair, setSelectedRepair] = useState<RepairBooking | null>(null);
  const [newStatus, setNewStatus] = useState<RepairStatus>('Booking Confirmed');
  const [diagnosticNote, setDiagnosticNote] = useState('');
  const [finalPriceInput, setFinalPriceInput] = useState<number>(0);
  const [techNameInput, setTechNameInput] = useState('');

  // Add Product Modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('mobile-covers');
  const [newProdBrand, setNewProdBrand] = useState('Apple');
  const [newProdPrice, setNewProdPrice] = useState(999);
  const [newProdDisc, setNewProdDisc] = useState(599);
  const [newProdStock, setNewProdStock] = useState(25);
  const [newProdModels, setNewProdModels] = useState('iPhone 15, iPhone 15 Pro');
  const [newProdImg, setNewProdImg] = useState('https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=400&auto=format&fit=crop&q=80');

  // Edit Product Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Add Service Area Modal
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaPincode, setNewAreaPincode] = useState('');

  // Add Coupon Modal
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponVal, setNewCouponVal] = useState(10);
  const [newCouponMin, setNewCouponMin] = useState(499);
  const [newCouponDesc, setNewCouponDesc] = useState('Special Discount for Hyderabad Users');

  // Banner Editor State
  const [bannerInput, setBannerInput] = useState(announcementBanner);
  const [bannerSavedAlert, setBannerSavedAlert] = useState(false);

  // Stats Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + repairBookings.reduce((sum, b) => sum + (b.finalPrice || b.initialEstimatedPrice), 0);
  const activeRepairsCount = repairBookings.filter((b) => b.status !== 'Delivered' && b.status !== 'Completed' && b.status !== 'Cancelled').length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus !== 'Delivered').length;

  const handleUpdateRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepair) return;

    if (techNameInput) {
      updateRepairBooking(selectedRepair.id, { technicianName: techNameInput });
    }
    if (diagnosticNote) {
      updateRepairBooking(selectedRepair.id, { diagnosisNotes: diagnosticNote });
    }

    updateRepairStatus(selectedRepair.id, newStatus, diagnosticNote, finalPriceInput || selectedRepair.initialEstimatedPrice);
    setSelectedRepair(null);
    alert(`Repair ${selectedRepair.id} status updated to ${newStatus}`);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: newProdName,
      slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newProdCategory,
      categoryName: newProdCategory.replace('-', ' ').toUpperCase(),
      brand: newProdBrand,
      compatibleModels: newProdModels.split(',').map(s => s.trim()),
      originalPrice: Number(newProdPrice),
      discountPrice: Number(newProdDisc),
      rating: 4.8,
      reviewCount: 1,
      images: [newProdImg],
      inStock: newProdStock > 0,
      stockCount: Number(newProdStock),
      sku: `HMC-MAN-${Date.now().toString().slice(-4)}`,
      description: 'Handcrafted premium accessory with guaranteed model precision.',
      features: ['High durability', 'Precision cutouts', 'Hyderabad lab tested'],
      warranty: '6 Months Warranty'
    });
    setShowAddProductModal(false);
    alert('Product published successfully to shop!');
  };

  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      originalPrice: Number(editingProduct.originalPrice),
      discountPrice: Number(editingProduct.discountPrice),
      stockCount: Number(editingProduct.stockCount),
      inStock: Number(editingProduct.stockCount) > 0,
      brand: editingProduct.brand,
      images: editingProduct.images,
      description: editingProduct.description
    });
    setEditingProduct(null);
    alert('Product details updated successfully!');
  };

  const handleCreateServiceArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName || !newAreaPincode) return;
    addServiceArea({
      pincode: newAreaPincode.trim(),
      areaName: newAreaName.trim(),
      isSupported: true,
      doorstepAvailable: true,
      doorstepFee: 0
    });
    setShowAddAreaModal(false);
    setNewAreaName('');
    setNewAreaPincode('');
    alert(`Service area ${newAreaName} (${newAreaPincode}) added!`);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const couponObj: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponVal),
      minOrderAmount: Number(newCouponMin),
      description: newCouponDesc,
      isActive: true,
      expiryDate: '2026-12-31'
    };
    addCoupon(couponObj);
    setShowAddCouponModal(false);
    setNewCouponCode('');
    alert(`Coupon ${couponObj.code} added successfully!`);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    setAnnouncementBanner(bannerInput);
    setBannerSavedAlert(true);
    setTimeout(() => setBannerSavedAlert(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 font-sans">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 text-xs font-extrabold bg-white p-2 rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 ${activeTab === 'overview' ? 'bg-blue-600 text-white font-black shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            Overview Metrics
          </button>
          <button
            onClick={() => setActiveTab('repairs')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 ${activeTab === 'repairs' ? 'bg-blue-600 text-white font-black shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            Repair Bookings ({repairBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 ${activeTab === 'products' ? 'bg-blue-600 text-white font-black shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            Product Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 ${activeTab === 'orders' ? 'bg-blue-600 text-white font-black shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('areas')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 ${activeTab === 'areas' ? 'bg-blue-600 text-white font-black shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            Service Pincodes ({serviceAreas.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 ${activeTab === 'coupons' ? 'bg-blue-600 text-white font-black shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            Coupons ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('banner')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 ${activeTab === 'banner' ? 'bg-blue-600 text-white font-black shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            Site Announcement UI
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-slate-500 text-xs font-extrabold">
                  <span>Total Combined Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-700 font-extrabold">Orders + Repairs Completed</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-slate-500 text-xs font-extrabold">
                  <span>Active Repair Jobs</span>
                  <Wrench className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-amber-600">{activeRepairsCount}</div>
                <div className="text-[10px] text-slate-500 font-semibold">In lab / Doorstep technicians</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-slate-500 text-xs font-extrabold">
                  <span>Pending Accessory Orders</span>
                  <ShoppingBag className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-3xl font-black text-teal-800">{pendingOrdersCount}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Processing & Out for delivery</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-slate-500 text-xs font-extrabold">
                  <span>Active Service Areas</span>
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {serviceAreas.filter(a => a.isSupported).length} / {serviceAreas.length}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">Hyderabad Pincodes Enabled</div>
              </div>
            </div>

            {/* Active Repair Quick Table */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-base">Recent Repair Jobs Overview</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-extrabold">
                      <th className="pb-3">Repair ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Device & Problem</th>
                      <th className="pb-3">Stage Status</th>
                      <th className="pb-3">Price Quote</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {repairBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 font-mono font-bold text-teal-700">{b.id}</td>
                        <td className="py-3 font-medium text-slate-900">
                          <span className="font-bold">{b.customerName}</span><br />
                          <span className="text-[10px] text-slate-500 font-semibold">{b.address.area}</span>
                        </td>
                        <td className="py-3 text-slate-700">
                          <span className="font-bold text-slate-900">{b.brand} {b.model}</span><br />
                          <span className="text-[11px] text-amber-700 font-bold">{b.problemTitle}</span>
                        </td>
                        <td className="py-3">
                          <span className="bg-amber-50 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded border border-amber-200">
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 font-black text-slate-900">₹{b.finalPrice || b.initialEstimatedPrice}</td>
                        <td className="py-3">
                          <button
                            onClick={() => {
                              setSelectedRepair(b);
                              setNewStatus(b.status);
                              setDiagnosticNote(b.diagnosisNotes || '');
                              setFinalPriceInput(b.finalPrice || b.initialEstimatedPrice);
                              setTechNameInput(b.technicianName || '');
                              setActiveTab('repairs');
                            }}
                            className="bg-teal-50 hover:bg-teal-700 hover:text-white text-teal-800 font-black px-3 py-1 rounded-lg text-[11px] transition border border-teal-200 shadow-sm"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* REPAIRS MANAGEMENT TAB */}
        {activeTab === 'repairs' && (
          <div className="space-y-6">
            {selectedRepair && (
              <form onSubmit={handleUpdateRepair} className="bg-white p-6 rounded-3xl border border-teal-300 shadow-md space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <h3 className="font-black text-slate-900 text-base">Managing Repair: <span className="text-teal-700 font-mono">{selectedRepair.id}</span></h3>
                  <button type="button" onClick={() => setSelectedRepair(null)} className="text-xs text-slate-500 hover:text-slate-900 font-bold">Close Editor</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Update Status Stage</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as RepairStatus)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold outline-none focus:border-teal-700 focus:bg-white"
                    >
                      <option value="Booking Confirmed">Booking Confirmed</option>
                      <option value="Pickup Scheduled">Pickup Scheduled</option>
                      <option value="Device Received">Device Received</option>
                      <option value="Diagnosis">Diagnosis</option>
                      <option value="Awaiting Customer Approval">Awaiting Customer Approval</option>
                      <option value="Repair in Progress">Repair in Progress</option>
                      <option value="Quality Check">Quality Check</option>
                      <option value="Ready">Ready</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Final Price Quote (₹)</label>
                    <input
                      type="number"
                      value={finalPriceInput}
                      onChange={(e) => setFinalPriceInput(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-amber-800 outline-none focus:border-teal-700 focus:bg-white font-black"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Assign Technician Name</label>
                    <input
                      type="text"
                      value={techNameInput}
                      onChange={(e) => setTechNameInput(e.target.value)}
                      placeholder="Srikanth / Ramesh"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold outline-none focus:border-teal-700 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-slate-800 font-extrabold mb-1">Diagnostic Report / Technical Note</label>
                    <textarea
                      rows={2}
                      value={diagnosticNote}
                      onChange={(e) => setDiagnosticNote(e.target.value)}
                      placeholder="Battery health degraded to 70%. Motherboard clean. Replacement approved."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium outline-none focus:border-teal-700 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white font-black text-xs px-5 py-2.5 rounded-xl transition shadow-md">
                    Save Repair Status & Notify Customer
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {repairBookings.map((b) => (
                <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-mono font-bold text-teal-700 text-sm">{b.id}</span>
                      <span className="text-slate-900 font-black ml-3">{b.brand} {b.model}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedRepair(b);
                        setNewStatus(b.status);
                        setDiagnosticNote(b.diagnosisNotes || '');
                        setFinalPriceInput(b.finalPrice || b.initialEstimatedPrice);
                        setTechNameInput(b.technicianName || '');
                      }}
                      className="bg-teal-50 text-teal-800 font-black text-xs px-3 py-1 rounded-lg border border-teal-200 hover:bg-teal-700 hover:text-white transition shadow-sm"
                    >
                      Edit & Update Status
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 font-medium">
                    <div>Customer: <strong className="text-slate-900 font-extrabold">{b.customerName}</strong> ({b.customerPhone})</div>
                    <div>Area: <strong className="text-slate-900 font-extrabold">{b.address.area}</strong></div>
                    <div>Issue: <strong className="text-amber-700 font-bold">{b.problemTitle}</strong></div>
                    <div>Status: <strong className="text-emerald-700 font-black">{b.status}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS MANAGEMENT TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Manage Product Inventory</h3>
                <p className="text-xs text-slate-500 font-medium">Control all accessory listings, pricing, and stock visible to customers on /shop</p>
              </div>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="bg-teal-700 hover:bg-teal-800 text-white font-black text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="h-40 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white text-teal-800 p-1.5 rounded-lg border border-slate-200 shadow-sm transition"
                      title="Edit Product Details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm truncate">{p.name}</h4>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-700 font-black text-base">₹{p.discountPrice}</span>
                      <span className="text-slate-400 line-through font-semibold text-xs">₹{p.originalPrice}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold">Stock:</span>
                      <input
                        type="number"
                        value={p.stockCount}
                        onChange={(e) => updateProduct(p.id, { stockCount: Number(e.target.value), inStock: Number(e.target.value) > 0 })}
                        className="w-16 bg-slate-50 border border-slate-300 text-center text-slate-900 text-xs py-1 rounded font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs font-semibold">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="text-teal-700 hover:underline font-bold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Info
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete product ${p.name}?`)) deleteProduct(p.id);
                      }}
                      className="text-red-600 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Product Modal */}
            {showAddProductModal && (
              <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                <form onSubmit={handleCreateProduct} className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-900">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h3 className="font-black text-slate-900 text-base">Add New Accessory Product</h3>
                    <button type="button" onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-slate-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="MagSafe Crystal Case"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold focus:border-teal-700 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-800 font-extrabold mb-1">Category</label>
                        <select
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold focus:border-teal-700 focus:bg-white"
                        >
                          <option value="mobile-covers">Mobile Covers</option>
                          <option value="tempered-glass">Tempered Glass</option>
                          <option value="chargers">Chargers</option>
                          <option value="cables">Cables</option>
                          <option value="power-banks">Power Banks</option>
                          <option value="earbuds">Earbuds</option>
                          <option value="smartwatches">Smartwatches</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-800 font-extrabold mb-1">Brand</label>
                        <input
                          type="text"
                          value={newProdBrand}
                          onChange={(e) => setNewProdBrand(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold focus:border-teal-700 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-800 font-extrabold mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold focus:border-teal-700 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-800 font-extrabold mb-1">Discount Price (₹)</label>
                        <input
                          type="number"
                          value={newProdDisc}
                          onChange={(e) => setNewProdDisc(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-amber-800 font-bold focus:border-teal-700 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-800 font-extrabold mb-1">Initial Stock</label>
                        <input
                          type="number"
                          value={newProdStock}
                          onChange={(e) => setNewProdStock(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold focus:border-teal-700 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Image URL</label>
                      <input
                        type="text"
                        value={newProdImg}
                        onChange={(e) => setNewProdImg(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono text-[11px] focus:border-teal-700 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Compatible Models (Comma separated)</label>
                      <input
                        type="text"
                        value={newProdModels}
                        onChange={(e) => setNewProdModels(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold focus:border-teal-700 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="button" onClick={() => setShowAddProductModal(false)} className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-200">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-black px-4 py-2 rounded-xl text-xs shadow-sm">
                      Publish Product
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                <form onSubmit={handleSaveEditedProduct} className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-900">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h3 className="font-black text-slate-900 text-base">Edit Product Details</h3>
                    <button type="button" onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold outline-none focus:border-teal-700 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-800 font-extrabold mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          value={editingProduct.originalPrice}
                          onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold focus:border-teal-700 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-800 font-extrabold mb-1">Discount Price (₹)</label>
                        <input
                          type="number"
                          value={editingProduct.discountPrice}
                          onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-amber-800 font-black focus:border-teal-700 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-800 font-extrabold mb-1">Stock Quantity</label>
                        <input
                          type="number"
                          value={editingProduct.stockCount}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold focus:border-teal-700 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-800 font-extrabold mb-1">Brand</label>
                        <input
                          type="text"
                          value={editingProduct.brand}
                          onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold focus:border-teal-700 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Image URL</label>
                      <input
                        type="text"
                        value={editingProduct.images[0] || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono text-[11px] focus:border-teal-700 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="button" onClick={() => setEditingProduct(null)} className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-200">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-black px-4 py-2 rounded-xl text-xs shadow-sm">
                      Save Product Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ORDERS MANAGEMENT TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 text-lg">Orders Management</h3>
            {orders.map((o) => (
              <div key={o.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-teal-700">{o.id}</span>
                  <select
                    value={o.orderStatus}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                    className="bg-slate-50 border border-slate-300 text-teal-800 font-black rounded-xl px-3 py-1 outline-none focus:border-teal-700"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="text-slate-900 font-black">{o.customerDetails.name} ({o.customerDetails.phone}) - {o.shippingAddress.area}, Hyderabad</div>
                <div className="text-slate-500 font-medium">Total: <strong className="text-amber-700 font-black">₹{o.total}</strong> ({o.paymentMethod})</div>
              </div>
            ))}
          </div>
        )}

        {/* PINCODES TAB */}
        {activeTab === 'areas' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Hyderabad Pincodes & Service Zones</h3>
                <p className="text-xs text-slate-500 font-medium">Control active doorstep service locations for customer checkout & repair booking</p>
              </div>
              <button
                onClick={() => setShowAddAreaModal(true)}
                className="bg-teal-700 hover:bg-teal-800 text-white font-black text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Pincode
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {serviceAreas.map((sa) => (
                <div key={sa.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{sa.areaName}</div>
                    <div className="text-slate-500 font-mono">Pincode: {sa.pincode} • Doorstep: {sa.doorstepAvailable ? 'Available' : 'Disabled'}</div>
                  </div>
                  <button
                    onClick={() => toggleServiceArea(sa.id)}
                    className={`px-3 py-1 rounded-lg font-black text-xs transition ${
                      sa.isSupported ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {sa.isSupported ? 'Active' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>

            {/* Add Area Modal */}
            {showAddAreaModal && (
              <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                <form onSubmit={handleCreateServiceArea} className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h3 className="font-black text-slate-900 text-base">Add New Hyderabad Pincode Zone</h3>
                    <button type="button" onClick={() => setShowAddAreaModal(false)} className="text-slate-400 hover:text-slate-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Area Name (e.g. Kondapur)</label>
                      <input
                        type="text"
                        required
                        value={newAreaName}
                        onChange={(e) => setNewAreaName(e.target.value)}
                        placeholder="Kondapur / Hitech City"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold outline-none focus:border-teal-700 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Pincode (e.g. 500084)</label>
                      <input
                        type="text"
                        required
                        value={newAreaPincode}
                        onChange={(e) => setNewAreaPincode(e.target.value)}
                        placeholder="500084"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono font-bold outline-none focus:border-teal-700 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="button" onClick={() => setShowAddAreaModal(false)} className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-200">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-black px-4 py-2 rounded-xl text-xs shadow-sm">
                      Enable Pincode
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* COUPONS TAB */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Manage Checkout Discount Coupons</h3>
                <p className="text-xs text-slate-500 font-medium">Create promotional codes for customers to apply on accessories & repair checkout</p>
              </div>
              <button
                onClick={() => setShowAddCouponModal(true)}
                className="bg-teal-700 hover:bg-teal-800 text-white font-black text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Coupon
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-black text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-lg text-sm">{c.code}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete coupon ${c.code}?`)) deleteCoupon(c.code);
                      }}
                      className="text-red-600 hover:underline text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                  <div className="font-extrabold text-slate-900">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                  </div>
                  <p className="text-slate-500">{c.description}</p>
                  <div className="text-[10px] text-slate-400 font-semibold">Min order spend: ₹{c.minOrderAmount}</div>
                </div>
              ))}
            </div>

            {/* Add Coupon Modal */}
            {showAddCouponModal && (
              <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                <form onSubmit={handleCreateCoupon} className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h3 className="font-black text-slate-900 text-base">Create Promo Coupon Code</h3>
                    <button type="button" onClick={() => setShowAddCouponModal(false)} className="text-slate-400 hover:text-slate-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Coupon Code (e.g. HYD50)</label>
                      <input
                        type="text"
                        required
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value)}
                        placeholder="HYD50 / FESTIVE100"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 uppercase font-mono font-bold outline-none focus:border-teal-700 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-800 font-extrabold mb-1">Type</label>
                        <select
                          value={newCouponType}
                          onChange={(e) => setNewCouponType(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold outline-none focus:border-teal-700"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (₹)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-800 font-extrabold mb-1">Discount Value</label>
                        <input
                          type="number"
                          value={newCouponVal}
                          onChange={(e) => setNewCouponVal(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold outline-none focus:border-teal-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Min Order Spend (₹)</label>
                      <input
                        type="number"
                        value={newCouponMin}
                        onChange={(e) => setNewCouponMin(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold outline-none focus:border-teal-700"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Coupon Description</label>
                      <input
                        type="text"
                        value={newCouponDesc}
                        onChange={(e) => setNewCouponDesc(e.target.value)}
                        placeholder="Special Discount for Hyderabad Users"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold outline-none focus:border-teal-700"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="button" onClick={() => setShowAddCouponModal(false)} className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-200">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-black px-4 py-2 rounded-xl text-xs shadow-sm">
                      Create Coupon
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* SITE ANNOUNCEMENT BANNER CONTROL TAB */}
        {activeTab === 'banner' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-teal-700" />
                Customer Website Announcement Banner
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Update the live promotional message displayed at the very top of all public customer website pages.
              </p>
            </div>

            {bannerSavedAlert && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Live customer header announcement updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1.5">Top Banner Message Text</label>
                <textarea
                  rows={2}
                  required
                  value={bannerInput}
                  onChange={(e) => setBannerInput(e.target.value)}
                  placeholder="⚡ Doorstep Mobile Repair in 60 Mins across Hyderabad & Cyberabad"
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-slate-900 font-bold text-xs outline-none focus:border-teal-700 focus:bg-white transition"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-[11px] text-slate-500 font-extrabold uppercase">Live Preview</div>
                <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-amber-900 text-white text-xs py-2 px-4 rounded-xl flex items-center gap-2 font-medium">
                  <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold">
                    HYDERABAD SPECIALIST
                  </span>
                  <span>{bannerInput}</span>
                </div>
              </div>

              <button
                type="submit"
                className="bg-teal-700 hover:bg-teal-800 text-white font-black text-xs px-6 py-3 rounded-xl transition shadow-md"
              >
                Publish Live Banner Text
              </button>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
