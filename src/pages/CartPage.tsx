import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, coupons, isCustomerAuthenticated, openCustomerAuthModal } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.product.discountPrice * item.quantity, 0);
  const deliveryCharge = subtotal > 499 || cart.length === 0 ? 0 : 49;

  let discount = 0;
  if (appliedCoupon) {
    discount = appliedCoupon.discount;
  }

  const grandTotal = Math.max(0, subtotal - discount + deliveryCharge);

  const handleProceedToCheckout = () => {
    if (!isCustomerAuthenticated) {
      openCustomerAuthModal('checkout');
      return;
    }
    navigate('/checkout', { state: { appliedCoupon, discount, grandTotal } });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const clean = couponInput.trim().toUpperCase();
    const found = coupons.find((c) => c.code === clean && c.isActive);

    if (!found) {
      setCouponError('Invalid coupon code. Try WELCOME100');
      return;
    }

    if (subtotal < found.minOrderAmount) {
      setCouponError(`Min order value for ${clean} is ₹${found.minOrderAmount}`);
      return;
    }

    let calculatedDiscount = 0;
    if (found.discountType === 'fixed') {
      calculatedDiscount = found.discountValue;
    } else {
      calculatedDiscount = Math.round((subtotal * found.discountValue) / 100);
    }

    setAppliedCoupon({ code: found.code, discount: calculatedDiscount });
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 bg-slate-50 text-slate-900">
        <div className="w-20 h-20 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Your Shopping Cart is Empty</h1>
        <p className="text-xs text-slate-600 font-semibold">
          Explore genuine mobile covers, tempered glass, fast chargers, and MagSafe power banks.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-700 to-teal-800 text-white font-black px-6 py-3 rounded-xl text-xs transition shadow"
        >
          Explore Accessories Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-slate-600 font-semibold">{cart.length} item(s) in your cart</p>
        </div>
        <Link to="/shop" className="text-xs font-bold text-teal-800 hover:underline">
          ← Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedModel}`}
              className="glass-card p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-teal-800 font-bold">{item.product.categoryName}</div>
                  <h3 className="font-black text-slate-900 text-sm line-clamp-1">{item.product.name}</h3>
                  {item.selectedModel && (
                    <div className="text-[11px] text-slate-500 font-semibold">
                      Model: <span className="text-amber-700 font-bold">{item.selectedModel}</span>
                    </div>
                  )}
                  <div className="text-sm font-black text-slate-900 sm:hidden">
                    ₹{item.product.discountPrice * item.quantity}
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-200">
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl p-1">
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="p-1 text-slate-600 hover:text-slate-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-black text-slate-900 px-2">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 text-slate-600 hover:text-slate-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="hidden sm:block text-right">
                  <div className="text-base font-black text-slate-900">₹{item.product.discountPrice * item.quantity}</div>
                  <div className="text-[10px] text-slate-500 font-medium">₹{item.product.discountPrice} each</div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 text-slate-400 hover:text-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-md space-y-6">
            <h2 className="font-black text-slate-900 text-base pb-3 border-b border-slate-200">Order Summary</h2>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-800">Have a Coupon?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. WELCOME100"
                  className="flex-1 bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold rounded-xl px-3 py-2 outline-none uppercase font-mono"
                />
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-bold">
                  <Check className="w-3.5 h-3.5" /> Coupon {appliedCoupon.code} applied! Saved ₹{appliedCoupon.discount}
                </div>
              )}
              {couponError && <div className="text-[11px] text-red-600 font-bold">{couponError}</div>}
            </form>

            <div className="space-y-2.5 text-xs pt-2 border-t border-slate-200 font-semibold">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-700">
                <span>Delivery Charge (Hyderabad)</span>
                <span className="font-bold text-slate-900">
                  {deliveryCharge === 0 ? <span className="text-emerald-700 font-black">FREE</span> : `₹${deliveryCharge}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="text-amber-700">₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 text-white font-black py-3.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
