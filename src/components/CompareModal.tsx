import React from 'react';
import { X, Layers, Star, Check, Trash2, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProducts: Product[];
  onRemove: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function CompareModal({
  isOpen,
  onClose,
  comparedProducts,
  onRemove,
  onAddToCart,
}: CompareModalProps) {
  if (!isOpen) return null;

  // Compile a list of all unique spec keys across the compared products
  const specKeys = Array.from(
    new Set(comparedProducts.flatMap((p) => Object.keys(p.specs || {})))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Main Drawer Panel */}
      <div className="relative w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-black text-white rounded-lg">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-black uppercase tracking-wider">Specs Comparison Board</h2>
              <p className="text-xs text-gray-400 mt-0.5">Evaluate up to 3 models side-by-side</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Comparison Content */}
        <div className="flex-grow p-6">
          {comparedProducts.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 border border-dashed border-gray-200 mb-4">
                <Layers className="h-6 w-6" />
              </div>
              <p className="text-sm text-gray-500 font-medium">Your comparison board is empty.</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Browse our curated boutique and toggle the compare button on product cards to stack their specs.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg tracking-wider uppercase transition-colors"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Labels - Left Column (Visible on Desktop) */}
              <div className="hidden md:block md:col-span-3 pt-64 space-y-12">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-semibold">Pricing Structure</span>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-semibold">Category</span>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-semibold">Rating</span>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-semibold">Stock Status</span>
                </div>
                {specKeys.map((key) => (
                  <div key={key} className="border-b border-gray-100 pb-3">
                    <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-semibold">{key}</span>
                  </div>
                ))}
              </div>

              {/* Compared Product Columns */}
              <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {comparedProducts.map((product) => (
                  <div key={product.id} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col relative h-full">
                    {/* Remove Action */}
                    <button
                      onClick={() => onRemove(product)}
                      className="absolute top-2 right-2 p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-sm hover:shadow transition-all"
                      title="Remove model"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    {/* Product Image & Info Card */}
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-white border border-gray-100 mb-4 shadow-sm">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase mb-1">
                        {product.category}
                      </span>
                      <h3 className="font-sans font-semibold text-gray-900 tracking-tight text-xs leading-tight min-h-[32px] line-clamp-2">
                        {product.name}
                      </h3>
                    </div>

                    {/* Comparison rows */}
                    <div className="space-y-6 flex-grow">
                      {/* Price row */}
                      <div className="border-b border-gray-100/80 pb-3 flex justify-between md:block">
                        <span className="md:hidden text-[9px] font-mono text-gray-400 uppercase">Price</span>
                        <div className="font-mono text-xs font-bold text-black">${product.price}</div>
                      </div>

                      {/* Category row */}
                      <div className="border-b border-gray-100/80 pb-3 flex justify-between md:block">
                        <span className="md:hidden text-[9px] font-mono text-gray-400 uppercase">Segment</span>
                        <div className="text-xs text-gray-600 font-medium">{product.category}</div>
                      </div>

                      {/* Rating row */}
                      <div className="border-b border-gray-100/80 pb-3 flex justify-between md:block">
                        <span className="md:hidden text-[9px] font-mono text-gray-400 uppercase">Reviews</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-gray-800">{product.rating}</span>
                          <span className="text-[10px] text-gray-400 font-mono">({product.reviewCount})</span>
                        </div>
                      </div>

                      {/* Stock row */}
                      <div className="border-b border-gray-100/80 pb-3 flex justify-between md:block">
                        <span className="md:hidden text-[9px] font-mono text-gray-400 uppercase">Availability</span>
                        <div className={`text-xs font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                        </div>
                      </div>

                      {/* Spec Fields */}
                      {specKeys.map((key) => (
                        <div key={key} className="border-b border-gray-100/80 pb-3 flex justify-between md:block">
                          <span className="md:hidden text-[9px] font-mono text-gray-400 uppercase">{key}</span>
                          <div className="text-xs text-gray-600 leading-relaxed font-sans font-medium">
                            {product.specs[key] || <span className="text-gray-300 font-mono text-[10px]">N/A</span>}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Block */}
                    <button
                      onClick={() => onAddToCart(product)}
                      disabled={product.stock === 0}
                      className="mt-6 w-full py-2.5 bg-black hover:bg-neutral-800 disabled:bg-gray-100 text-white disabled:text-gray-400 text-xs font-semibold rounded-lg tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>{product.stock > 0 ? 'Add To Cart' : 'Sold Out'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
