import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Wrench, 
  Heart, 
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'repairs';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const { orders, repairBookings, wishlist, products } = useApp();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 bg-slate-50 text-slate-900">
      {/* Account Profile Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-md flex flex-col sm:flex-row items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-700 to-amber-500 p-0.5 flex items-center justify-center shadow">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-teal-800 font-black text-xl">
            HYD
          </div>
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <h1 className="text-xl font-black text-slate-900">Hyderabad Customer Account</h1>
          <div className="text-xs text-slate-600 font-semibold">Hyderabad, Telangana • Active Customer</div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto text-xs font-black">
        <button
          onClick={() => setActiveTab('repairs')}
          className={`pb-3 px-2 flex items-center gap-2 transition border-b-2 ${
            activeTab === 'repairs'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-4 h-4" /> My Repair Bookings ({repairBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-2 flex items-center gap-2 transition border-b-2 ${
            activeTab === 'orders'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Accessories Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 px-2 flex items-center gap-2 transition border-b-2 ${
            activeTab === 'wishlist'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" /> Wishlist ({wishlistedProducts.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'repairs' && (
        <div className="space-y-4">
          {repairBookings.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center space-y-3 border border-slate-200 bg-white">
              <p className="text-slate-600 text-xs font-semibold">No active repair bookings found.</p>
              <Link to="/repair-booking" className="inline-block bg-teal-700 text-white font-black text-xs px-4 py-2 rounded-xl">
                Book Mobile Repair
              </Link>
            </div>
          ) : (
            repairBookings.map((b) => (
              <div key={b.id} className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <div className="text-xs font-black text-teal-800 font-mono">{b.id}</div>
                    <div className="text-base font-black text-slate-900">{b.brand} {b.model}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-1 rounded-lg border border-amber-300">
                      {b.status}
                    </span>
                    <Link
                      to={`/track-repair?id=${b.id}`}
                      className="bg-slate-100 hover:bg-slate-200 text-teal-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1"
                    >
                      Track <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-700 font-medium">
                  <div>
                    <div className="text-slate-500 font-semibold">Issue:</div>
                    <div className="font-bold">{b.problemTitle}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 font-semibold">Scheduled Date:</div>
                    <div className="font-bold">{b.preferredDate}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 font-semibold">Location:</div>
                    <div className="font-bold">{b.address.area}, HYD</div>
                  </div>
                  <div>
                    <div className="text-slate-500 font-semibold">Price Quote:</div>
                    <div className="font-black text-amber-700">₹{b.finalPrice || b.initialEstimatedPrice}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center space-y-3 border border-slate-200 bg-white">
              <p className="text-slate-600 text-xs font-semibold">No orders placed yet.</p>
              <Link to="/shop" className="inline-block bg-teal-700 text-white font-black text-xs px-4 py-2 rounded-xl">
                Browse Shop
              </Link>
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-xs font-semibold">
                  <div>
                    <span className="font-black text-slate-900 font-mono">{o.id}</span>
                    <span className="text-slate-500 ml-2">({new Date(o.createdAt).toLocaleDateString()})</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-lg font-black">
                    {o.orderStatus}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-medium">
                  {o.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-700">
                      <span>{item.product.name} ({item.quantity}x)</span>
                      <span className="font-extrabold text-slate-900">₹{item.product.discountPrice * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Total Paid: <strong className="text-amber-700 font-black">₹{o.total}</strong> ({o.paymentMethod})</span>
                  <span className="text-teal-800 font-bold">{o.shippingAddress.area}, Hyderabad</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {wishlistedProducts.length === 0 ? (
            <div className="col-span-3 glass-panel p-8 rounded-2xl text-center text-xs text-slate-500 font-semibold bg-white">
              Your wishlist is empty.
            </div>
          ) : (
            wishlistedProducts.map((p) => (
              <div key={p.id} className="glass-card p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">{p.name}</h4>
                <div className="text-amber-700 font-black text-sm">₹{p.discountPrice}</div>
                <Link to="/shop" className="block text-center bg-teal-700 text-white font-black text-xs py-1.5 rounded-lg">
                  View Product
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
