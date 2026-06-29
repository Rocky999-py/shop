import React, { useState } from 'react';
import { CreditCard, Truck, CheckCircle2, ShoppingBag, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { CartItem, ShippingAddress, PaymentDetails, Order, PromoCode } from '../types';

interface CheckoutFormProps {
  cart: CartItem[];
  appliedPromo: PromoCode | null;
  onOrderCompleted: (order: Order) => void;
  onSetView: (view: 'cart' | 'orders' | 'shop') => void;
}

export default function CheckoutForm({
  cart,
  appliedPromo,
  onOrderCompleted,
  onSetView,
}: CheckoutFormProps) {
  const [step, setStep] = useState<1 | 2>(1); // 1: Shipping, 2: Payment
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionPhase, setSubmissionPhase] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form State
  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [payment, setPayment] = useState<PaymentDetails>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  // Calculate pricing values
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 150;
  
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discount = subtotal * (appliedPromo.discountValue / 100);
    } else {
      discount = appliedPromo.discountValue;
    }
  }

  const shippingFee = isFreeShipping ? 0 : 15;
  const tax = Math.max(0, subtotal - discount) * 0.08;
  const total = Math.max(0, subtotal - discount) + shippingFee + tax;

  // Form handlers
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  // Card formatting helpers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 16); // Limit 16 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setPayment({ ...payment, cardNumber: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 4); // MMYY
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setPayment({ ...payment, expiryDate: value });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPayment({ ...payment, cvv: value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Multi-phase simulation for high-end feel
    const phases = [
      'Establishing 256-Bit SSL Encryption...',
      'Verifying Card Authenticity...',
      'Securing Vault Authorizations...',
      'Packaging Curated Invoice Details...',
    ];

    for (let i = 0; i < phases.length; i++) {
      setSubmissionPhase(phases[i]);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // Generate Order Details
    const deliveryDays = 3;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const formattedDelivery = estimatedDate.toLocaleDateString('en-US', options);

    const generatedOrder: Order = {
      id: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotal,
      discount,
      shipping: shippingFee,
      tax,
      total,
      address: shipping,
      status: 'Processing',
      estimatedDelivery: formattedDelivery,
      promoApplied: appliedPromo?.code,
    };

    onOrderCompleted(generatedOrder);
    setCompletedOrder(generatedOrder);
    setIsSubmitting(false);
  };

  // SUCCESS RECEIPT VIEW
  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-16 w-16 text-green-500 stroke-[1.5] animate-bounce" />
        </div>
        <h1 className="text-3xl font-sans font-semibold tracking-tight text-black mb-2 leading-tight">
          Purchase Finalized
        </h1>
        <p className="text-sm text-gray-400 font-mono uppercase tracking-widest">
          Reference Code: {completedOrder.id}
        </p>
        <p className="text-sm text-gray-500 mt-4 leading-relaxed max-w-md mx-auto">
          Thank you for shopping with Aura. We’ve charged your card and began wrapping your selections in our signature minimalist linen packaging.
        </p>

        {/* Invoice Summary Card */}
        <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl text-left my-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-200/50 pb-3">
            <Truck className="h-4.5 w-4.5 text-gray-400" />
            <span className="text-xs font-semibold text-gray-900">Delivery Est: {completedOrder.estimatedDelivery}</span>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">Deliver to:</span>
            <span className="text-xs text-gray-700 block font-medium">{completedOrder.address.fullName}</span>
            <span className="text-xs text-gray-400 block leading-tight">
              {completedOrder.address.addressLine1}, {completedOrder.address.city}, {completedOrder.address.state} {completedOrder.address.zipCode}
            </span>
          </div>

          <div className="border-t border-gray-200/50 pt-3 flex justify-between items-center text-xs">
            <span className="font-medium text-gray-500">Amount Charged:</span>
            <span className="font-mono font-bold text-black text-sm">${completedOrder.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => onSetView('orders')}
            className="px-6 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all"
          >
            Track Shipment Progress
          </button>
          <button
            onClick={() => onSetView('shop')}
            className="px-6 py-3.5 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-black text-xs font-semibold uppercase tracking-wider rounded-xl transition-all"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <button
        onClick={() => onSetView('cart')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-black mb-8 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Return to Shopping Bag</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step progress (Visual) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex gap-4 items-center bg-gray-50 border border-gray-100 p-4 rounded-xl mb-6">
            <div className={`h-8 w-8 rounded-full font-mono text-xs font-semibold flex items-center justify-center ${step === 1 ? 'bg-black text-white' : 'bg-green-500 text-white'}`}>
              {step === 1 ? '1' : '✓'}
            </div>
            <span className="text-xs font-semibold text-gray-800 uppercase tracking-wider">Shipping Address</span>
            <div className="flex-grow h-px bg-gray-200 mx-2" />
            <div className={`h-8 w-8 rounded-full font-mono text-xs font-semibold flex items-center justify-center ${step === 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'}`}>
              2
            </div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Secure Payment</span>
          </div>

          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 ? (
            <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-xs">
              <h2 className="text-base font-semibold text-black uppercase tracking-wider mb-6 flex items-center gap-2">
                <Truck className="h-5 w-5 text-gray-400" /> Delivery Target Details
              </h2>

              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={shipping.fullName}
                      onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">Telephone</label>
                    <input
                      type="tel"
                      required
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">Country / Territory</label>
                    <input
                      type="text"
                      required
                      value={shipping.country}
                      onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">Street Address</label>
                  <input
                    type="text"
                    required
                    value={shipping.addressLine1}
                    onChange={(e) => setShipping({ ...shipping, addressLine1: e.target.value })}
                    placeholder="120 Luxury Suite Way"
                    className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black mb-3"
                  />
                  <input
                    type="text"
                    value={shipping.addressLine2}
                    onChange={(e) => setShipping({ ...shipping, addressLine2: e.target.value })}
                    placeholder="Apartment, unit, suite (optional)"
                    className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      placeholder="New York"
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">State</label>
                    <input
                      type="text"
                      required
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      placeholder="NY"
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">Zip Code</label>
                    <input
                      type="text"
                      required
                      value={shipping.zipCode}
                      onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                      placeholder="10001"
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 mt-8 bg-black hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-all"
                >
                  Continue to Secure Payment
                </button>
              </form>
            </div>
          ) : (
            /* STEP 2: PAYMENT METHOD */
            <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-xs">
              <h2 className="text-base font-semibold text-black uppercase tracking-wider mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-400" /> Secure Card Settlement
              </h2>

              {isSubmitting ? (
                <div className="py-16 text-center space-y-4 flex flex-col items-center">
                  <Loader2 className="h-10 w-10 text-black animate-spin" />
                  <p className="text-xs font-mono tracking-widest text-gray-400 uppercase font-semibold">
                    {submissionPhase}
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={payment.cardholderName}
                      onChange={(e) => setPayment({ ...payment, cardholderName: e.target.value })}
                      placeholder="JANE DOE"
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={payment.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000"
                        className="w-full pl-12 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black font-mono"
                      />
                      <CreditCard className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={payment.expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">CVV Code</label>
                      <input
                        type="password"
                        required
                        value={payment.cvv}
                        onChange={handleCvvChange}
                        placeholder="***"
                        className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-4 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-black text-xs font-semibold uppercase tracking-wider rounded-xl transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-grow py-4 bg-black hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Place Order — ${total.toFixed(2)}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Summary Column */}
        <div className="lg:col-span-5 bg-white border border-gray-100 p-6 rounded-2xl shadow-xs space-y-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 font-semibold mb-4 flex items-center gap-1.5">
            <ShoppingBag className="h-3.5 w-3.5" /> Order Summary
          </h3>

          {/* List of items */}
          <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
            {cart.map((item, index) => (
              <div key={index} className="flex gap-3 text-xs border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div className="aspect-square w-12 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-sans font-medium text-gray-900 truncate">{item.product.name}</h4>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                    Qty: {item.quantity} · {item.selectedColor || 'Natural'}
                  </p>
                </div>
                <span className="font-mono font-medium text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Pricing breakdowns */}
          <div className="space-y-3 font-sans text-xs border-t border-gray-100 pt-5">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="font-mono text-gray-900">${subtotal.toFixed(2)}</span>
            </div>

            {appliedPromo && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Coupon ({appliedPromo.code})</span>
                <span className="font-mono">-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-500">
              <span>Premium Insured Delivery</span>
              <span className="font-mono text-gray-900">
                {shippingFee === 0 ? (
                  <span className="text-green-600 uppercase font-mono text-[9px] font-semibold">Complimentary</span>
                ) : (
                  `$${shippingFee.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-gray-500">
              <span>Estimated Tax (8%)</span>
              <span className="font-mono text-gray-900">${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm font-semibold text-gray-900 pt-3 border-t border-gray-100">
              <span>Total Due</span>
              <span className="font-mono text-black">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
