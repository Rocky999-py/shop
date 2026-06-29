import React from 'react';
import { Package, Truck, Calendar, ShoppingBag, ArrowLeft, RefreshCw, ChevronRight } from 'lucide-react';
import { Order, CartItem } from '../types';

interface OrdersListProps {
  orders: Order[];
  onSetView: (view: 'shop') => void;
  onReorder: (items: CartItem[]) => void;
}

export default function OrdersList({
  orders,
  onSetView,
  onReorder,
}: OrdersListProps) {
  
  // Custom Status Color Picker
  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Shipped':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'In Transit':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Delivered':
        return 'bg-green-50 text-green-700 border-green-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-sans font-semibold tracking-tight text-black flex items-center gap-2">
            <Package className="h-6 w-6 text-black" /> Personal Order Ledger
          </h1>
          <p className="text-xs text-gray-400 mt-1">Review, track, and re-order prior collections</p>
        </div>

        <button
          onClick={() => onSetView('shop')}
          className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg tracking-wider uppercase transition-colors"
        >
          Explore Boutique
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-xs">
          <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 border border-dashed border-gray-200 mx-auto mb-6">
            <Package className="h-6 w-6" />
          </div>
          <p className="text-base font-semibold text-gray-800">No active purchases found</p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
            You haven’t completed any luxury acquisitions yet. Complete a checkout to populate this ledger!
          </p>
          <button
            onClick={() => onSetView('shop')}
            className="mt-6 px-5 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-black text-xs font-semibold rounded-xl uppercase tracking-wider transition-colors"
          >
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs hover:border-gray-200 transition-all"
            >
              {/* Order Header bar */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 font-mono uppercase tracking-widest block text-[9px]">Invoice Number</span>
                    <span className="font-semibold text-black font-mono">{order.id}</span>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div>
                    <span className="text-gray-400 font-mono uppercase tracking-widest block text-[9px]">Settled On</span>
                    <span className="font-semibold text-gray-700 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" /> {order.date}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-gray-200 hidden sm:block" />
                  <div className="hidden sm:block">
                    <span className="text-gray-400 font-mono uppercase tracking-widest block text-[9px]">Grand Total</span>
                    <span className="font-bold text-black font-mono">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status badge */}
                  <span className={`px-2.5 py-1 text-[10px] font-semibold border rounded-full font-mono uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>

                  {/* Reorder Button */}
                  <button
                    onClick={() => onReorder(order.items)}
                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-200/50 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold"
                    title="Re-order Invoice Items"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden sm:inline">Repurchase</span>
                  </button>
                </div>
              </div>

              {/* Order content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Item list - Left side */}
                <div className="md:col-span-8 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="aspect-square w-14 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-sans font-semibold text-xs text-gray-900 truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {item.selectedColor || 'Natural'} · {item.selectedSize !== 'Standard' ? item.selectedSize : 'Universal'} · Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-semibold text-black">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Shipping summary - Right side */}
                <div className="md:col-span-4 bg-gray-50/50 border border-gray-100/80 p-4 rounded-xl space-y-4 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <span>Estimated Arrival</span>
                  </div>
                  <p className="font-sans font-medium text-black text-sm">{order.estimatedDelivery}</p>

                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase font-semibold">Delivery Target</span>
                    <p className="font-medium text-gray-700 mt-1">{order.address.fullName}</p>
                    <p className="text-gray-400 text-[11px] leading-tight mt-0.5">
                      {order.address.addressLine1}, {order.address.city}, {order.address.state} {order.address.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
