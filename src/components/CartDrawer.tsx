import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, Tag, Percent, Sparkles, ChevronRight } from 'lucide-react';
import { CartItem, PromoCode } from '../types';
import { PROMO_CODES } from '../data/products';

interface CartDrawerProps {
  cart: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onSetView: (view: 'shop' | 'checkout') => void;
  appliedPromo: PromoCode | null;
  onApplyPromo: (promo: PromoCode | null) => void;
}

export default function CartDrawer({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onSetView,
  appliedPromo,
  onApplyPromo,
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccessMsg, setPromoSuccessMsg] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Free shipping threshold ($150)
  const shippingThreshold = 150;
  const isFreeShipping = subtotal >= shippingThreshold;
  const progressToFreeShipping = Math.min(100, (subtotal / shippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, shippingThreshold - subtotal);

  // Discount calculation
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.code === 'LUXE50' && subtotal < (appliedPromo.minSubtotal || 0)) {
      // Auto revoke if cart value falls below min requirement
      onApplyPromo(null);
      setPromoError('Promo revoked: subtotal fell below $250 requirement.');
    } else {
      if (appliedPromo.discountType === 'percentage') {
        discount = subtotal * (appliedPromo.discountValue / 100);
      } else {
        discount = appliedPromo.discountValue;
      }
    }
  }

  // Final fees
  const shipping = cart.length === 0 ? 0 : isFreeShipping ? 0 : 15;
  const taxRate = 0.08; // 8% tax
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + shipping + tax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccessMsg('');

    const trimmedCode = promoInput.trim().toUpperCase();
    if (!trimmedCode) return;

    const matchedPromo = PROMO_CODES[trimmedCode];
    if (!matchedPromo) {
      setPromoError('Invalid coupon code. Try WELCOME10, AURA15, or LUXE50.');
      return;
    }

    if (matchedPromo.minSubtotal && subtotal < matchedPromo.minSubtotal) {
      setPromoError(`Code requires a minimum subtotal of $${matchedPromo.minSubtotal}.`);
      return;
    }

    onApplyPromo(matchedPromo);
    setPromoInput('');
    setPromoSuccessMsg(`Coupon "${matchedPromo.code}" applied successfully!`);
  };

  const handleRemovePromo = () => {
    onApplyPromo(null);
    setPromoSuccessMsg('');
    setPromoError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-sans font-semibold tracking-tight text-black mb-8 flex items-center gap-2">
        <ShoppingBag className="h-6 w-6 text-black" /> Your Shopping Bag
      </h1>

      {cart.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-dashed border-gray-200 mx-auto mb-6">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <p className="text-base font-semibold text-gray-800">Your bag is empty</p>
          <p className="text-xs text-gray-400 mt-2 max-w-xs mx-auto">
            It looks like you haven’t added any of our curated pieces to your collection yet.
          </p>
          <button
            onClick={() => onSetView('shop')}
            className="mt-8 px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-colors"
          >
            Explore the Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Free Shipping Tracker */}
            <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
              <div className="flex justify-between text-xs font-medium text-gray-900 mb-2">
                <span>
                  {isFreeShipping 
                    ? "Congratulations! You've unlocked Complimentary Premium Delivery."
                    : `Add $${remainingForFreeShipping.toFixed(2)} more for Complimentary Shipping`}
                </span>
                <span className="font-mono text-[10px] text-gray-400">Threshold: $150.00</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${isFreeShipping ? 'bg-green-500' : 'bg-black'}`}
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* List of Cart Items */}
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="p-5 bg-white border border-gray-100 rounded-2xl flex gap-5 shadow-xs transition-all duration-200 hover:border-gray-200"
                >
                  {/* Thumbnail */}
                  <div className="aspect-square w-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-sans font-semibold text-gray-900 tracking-tight text-sm">
                            {item.product.name}
                          </h3>
                          <p className="text-[10px] font-mono tracking-widest text-gray-400 uppercase mt-0.5">
                            {item.product.category}
                          </p>
                        </div>
                        <span className="font-mono text-sm font-semibold text-black">${item.product.price}</span>
                      </div>

                      {/* Variants chosen */}
                      <div className="flex gap-4 mt-2">
                        {item.selectedColor && (
                          <span className="text-[11px] text-gray-500 font-medium">
                            Color: <span className="text-gray-900 font-semibold">{item.selectedColor}</span>
                          </span>
                        )}
                        {item.selectedSize && item.selectedSize !== 'Standard' && (
                          <span className="text-[11px] text-gray-500 font-medium">
                            Fit: <span className="text-gray-900 font-semibold">{item.selectedSize}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Selector & Remove Item */}
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-50">
                      <div className="flex items-center border border-gray-100 rounded-lg p-0.5 bg-gray-50">
                        <button
                          onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-white rounded text-gray-500 hover:text-black transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs font-semibold text-black">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(idx, Math.min(item.product.stock, item.quantity + 1))}
                          className="p-1 hover:bg-white rounded text-gray-500 hover:text-black transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50/50 transition-colors"
                        title="Remove piece"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Breakdown Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Promo Codes Panel */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs">
              <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 font-semibold mb-4 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-gray-400" /> Apply Corporate Coupons
              </h3>

              {appliedPromo ? (
                <div className="p-3.5 bg-green-50 text-green-800 text-xs font-medium rounded-xl border border-green-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-green-600" />
                    <span>
                      Promo <strong>{appliedPromo.code}</strong> active! (
                      {appliedPromo.discountType === 'percentage' 
                        ? `${appliedPromo.discountValue}% off` 
                        : `$${appliedPromo.discountValue} off`}
                      )
                    </span>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold uppercase font-mono tracking-wider ml-4"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value);
                      setPromoError('');
                    }}
                    placeholder="Enter AURA15 or LUXE50"
                    className="flex-grow px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black uppercase"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl uppercase tracking-wider transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoError && (
                <p className="text-[11px] text-red-500 font-medium mt-2 pl-1">⚠ {promoError}</p>
              )}
              {promoSuccessMsg && (
                <p className="text-[11px] text-green-600 font-medium mt-2 pl-1">✓ {promoSuccessMsg}</p>
              )}

              {/* Show promo clues for good ux */}
              {!appliedPromo && (
                <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-2 text-[10px] text-gray-400 font-mono">
                  <div>🎁 Coupon: <strong className="text-gray-600">AURA15</strong> (15% Off)</div>
                  <div>💎 Coupon: <strong className="text-gray-600">LUXE50</strong> ($50 Off)</div>
                </div>
              )}
            </div>

            {/* Receipt Summary */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs">
              <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 font-semibold mb-6">
                Collection Summary
              </h3>

              <div className="space-y-4 font-sans text-xs">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-500">
                  <span>Bag Subtotal</span>
                  <span className="font-mono text-gray-900">${subtotal.toFixed(2)}</span>
                </div>

                {/* Discounts */}
                {appliedPromo && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Percent className="h-3 w-3" /> Coupon Reduction ({appliedPromo.code})
                    </span>
                    <span className="font-mono">-${discount.toFixed(2)}</span>
                  </div>
                )}

                {/* Delivery */}
                <div className="flex justify-between text-gray-500">
                  <span>Premium Insured Delivery</span>
                  <span className="font-mono text-gray-900">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium uppercase font-mono text-[10px]">Complimentary</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {/* Estimated Tax */}
                <div className="flex justify-between text-gray-500">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono text-gray-900">${tax.toFixed(2)}</span>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between text-base font-semibold text-gray-900 pt-4 border-t border-gray-100">
                  <span>Total Due</span>
                  <span className="font-mono text-lg text-black">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="space-y-3 mt-8">
                <button
                  onClick={() => onSetView('checkout')}
                  className="w-full py-4 bg-black hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-200 flex items-center justify-center gap-1 shadow-sm hover:shadow group"
                >
                  <span>Proceed to Shipping & Checkout</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                <button
                  onClick={() => onSetView('shop')}
                  className="w-full py-3.5 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-black text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Return to Curated Boutique</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
