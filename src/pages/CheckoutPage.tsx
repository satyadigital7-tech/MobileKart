import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  CreditCard, 
  CheckCircle2, 
  MapPin, 
  User, 
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SERVICE_AREAS } from '../data/mockData';

export const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const { cart, placeOrder, customerUser, isCustomerAuthenticated, openCustomerAuthModal } = useApp();

  const extraState = location.state || {};
  const discount = extraState.discount || 0;

  // Form State
  const [name, setName] = useState(customerUser?.name || '');
  const [phone, setPhone] = useState(customerUser?.phone || '');
  const [email, setEmail] = useState(customerUser?.email || '');
  const [street, setStreet] = useState(customerUser?.address?.street || '');
  const [area, setArea] = useState(customerUser?.address?.area || 'Madhapur');
  const [pincode, setPincode] = useState(customerUser?.address?.pincode || '500081');
  const [landmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'UPI' | 'Card' | 'COD'>('Razorpay');

  React.useEffect(() => {
    if (customerUser) {
      if (customerUser.name) setName(customerUser.name);
      if (customerUser.phone) setPhone(customerUser.phone);
      if (customerUser.email) setEmail(customerUser.email);
      if (customerUser.address?.street) setStreet(customerUser.address.street);
      if (customerUser.address?.area) setArea(customerUser.address.area);
      if (customerUser.address?.pincode) setPincode(customerUser.address.pincode);
    }
  }, [customerUser]);

  // Success Order State
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.discountPrice * item.quantity, 0);
  const deliveryCharge = subtotal > 499 || cart.length === 0 ? 0 : 49;
  const total = Math.max(0, subtotal - discount + deliveryCharge);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !pincode) {
      alert('Please fill out all required fields.');
      return;
    }

    const order = placeOrder({
      items: cart,
      subtotal,
      discount,
      deliveryCharge,
      total,
      customerDetails: { name, phone, email: email || 'customer@hyderabad.in' },
      shippingAddress: { street, area, city: 'Hyderabad', pincode, landmark },
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Success',
      paymentId: `pay_${Date.now()}`,
      orderStatus: 'Processing'
    });

    setConfirmedOrderId(order.id);
  };

  if (confirmedOrderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 bg-slate-50 text-slate-900">
        <div className="glass-panel p-8 rounded-3xl border border-emerald-300 bg-white shadow-xl space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-amber-700 font-black text-xs uppercase tracking-wider">Payment Success</span>
            <h1 className="text-3xl font-black text-slate-900">Order Confirmed!</h1>
            <p className="text-slate-600 text-xs font-semibold max-w-md mx-auto">
              Thank you for shopping with MobileKart™. Your items are being packed for express delivery.
            </p>
          </div>

          <div className="bg-slate-50 border border-teal-300 p-4 rounded-2xl max-w-sm mx-auto space-y-1">
            <div className="text-slate-500 text-xs font-bold">Your Order ID:</div>
            <div className="text-2xl font-black text-teal-800 font-mono tracking-wider">{confirmedOrderId}</div>
            <div className="text-[11px] text-emerald-700 font-extrabold">Estimated Delivery: 1 - 2 Days</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/account"
              className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-black py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow"
            >
              View Order History in Account
            </Link>
            <Link
              to="/shop"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold px-6 py-3 rounded-xl border border-slate-300 transition text-xs"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 bg-slate-50 text-slate-900">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <h1 className="text-2xl font-black text-slate-900">Express Checkout</h1>
        {!isCustomerAuthenticated && (
          <button
            type="button"
            onClick={() => openCustomerAuthModal('checkout')}
            className="text-xs font-bold text-teal-800 hover:underline flex items-center gap-1"
          >
            <User className="w-3.5 h-3.5" /> Have an account? Sign In
          </button>
        )}
      </div>

      {!isCustomerAuthenticated && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs text-amber-900 shadow-sm">
          <div className="font-semibold">
            Sign in to auto-fill saved Hyderabad delivery address & track your order status in your account.
          </div>
          <button
            type="button"
            onClick={() => openCustomerAuthModal('checkout')}
            className="bg-teal-700 hover:bg-teal-800 text-white font-black px-4 py-2 rounded-xl text-xs transition shrink-0 shadow-sm"
          >
            Sign In / Register
          </button>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Customer & Address Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer info */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
            <h2 className="font-black text-slate-900 text-base flex items-center gap-2">
              <User className="w-4 h-4 text-teal-700" />
              <span>1. Contact Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <label className="block text-slate-800 font-extrabold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kiran Kumar"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold mb-1">Phone Number (For WhatsApp Updates) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98490 12345"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 outline-none focus:border-teal-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-800 font-extrabold mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kiran@gmail.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 outline-none focus:border-teal-700"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
            <h2 className="font-black text-slate-900 text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>2. Hyderabad Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="sm:col-span-2">
                <label className="block text-slate-800 font-extrabold mb-1">House No. / Street Address *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Flat 402, Road No 36"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold mb-1">Area / Locality *</label>
                <select
                  value={area}
                  onChange={(e) => {
                    const match = SERVICE_AREAS.find(a => a.areaName.includes(e.target.value));
                    setArea(e.target.value);
                    if (match) setPincode(match.pincode);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-bold outline-none focus:border-teal-700"
                >
                  {SERVICE_AREAS.map((sa) => (
                    <option key={sa.id} value={sa.areaName.split('/')[0]}>
                      {sa.areaName} ({sa.pincode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono font-bold outline-none focus:border-teal-700"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
            <h2 className="font-black text-slate-900 text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-700" />
              <span>3. Payment Gateway</span>
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('Razorpay')}
                className={`p-3 rounded-xl border font-bold text-left transition ${
                  paymentMethod === 'Razorpay'
                    ? 'bg-teal-100 border-teal-600 text-teal-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div>💳 Razorpay</div>
                <div className="text-[10px] text-slate-500 font-medium">Instant UPI / NetBanking</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-xl border font-bold text-left transition ${
                  paymentMethod === 'UPI'
                    ? 'bg-teal-100 border-teal-600 text-teal-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div>📱 UPI / PhonePe / GPay</div>
                <div className="text-[10px] text-slate-500 font-medium">Scan QR Code</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-3 rounded-xl border font-bold text-left transition ${
                  paymentMethod === 'Card'
                    ? 'bg-teal-100 border-teal-600 text-teal-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div>💳 Credit / Debit Card</div>
                <div className="text-[10px] text-slate-500 font-medium">Visa / Mastercard / RuPay</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-xl border font-bold text-left transition ${
                  paymentMethod === 'COD'
                    ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div>💵 Cash on Delivery</div>
                <div className="text-[10px] text-slate-500 font-medium">Pay upon doorstep arrival</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-md space-y-4">
            <h2 className="font-black text-slate-900 text-base pb-3 border-b border-slate-200">Review Items ({cart.length})</h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-black text-slate-900 line-clamp-1">{item.product.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Qty: {item.quantity} • {item.selectedModel}</div>
                  </div>
                  <div className="font-extrabold text-amber-700">₹{item.product.discountPrice * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs pt-4 border-t border-slate-200 font-semibold">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-700">
                <span>Hyderabad Express Delivery</span>
                <span>{deliveryCharge === 0 ? <span className="text-emerald-700 font-black">FREE</span> : `₹${deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-amber-700">₹{total}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 text-white font-black py-4 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow"
            >
              <Lock className="w-4 h-4" /> Pay ₹{total} & Place Order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
