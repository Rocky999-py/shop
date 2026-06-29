import React, { useState } from 'react';
import { Star, Eye, Layers, Check, ShoppingCart, Percent } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  isCompared: boolean;
  key?: string;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
  onToggleCompare,
  isCompared,
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Dynamic Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="px-3 py-1 text-[9px] font-mono font-semibold tracking-wider text-black bg-white rounded-full shadow-sm uppercase border border-gray-100">
              New Arrival
            </span>
          )}
          {product.isSale && (
            <span className="px-3 py-1 text-[9px] font-mono font-semibold tracking-wider text-white bg-red-500 rounded-full shadow-sm uppercase flex items-center gap-1">
              <Percent className="h-2.5 w-2.5" /> Special Offer
            </span>
          )}
          {product.isFeatured && !product.isNew && (
            <span className="px-3 py-1 text-[9px] font-mono font-semibold tracking-wider text-white bg-black rounded-full shadow-sm uppercase">
              Curated Picks
            </span>
          )}
        </div>

        {/* Quick Action Overlays (Slide-in) */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-2">
          {/* Toggle Compare Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            className={`p-3 rounded-full shadow-lg transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 ${
              isCompared
                ? 'bg-black text-white hover:bg-neutral-800'
                : 'bg-white text-gray-700 hover:text-black hover:bg-gray-50'
            }`}
            title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
          >
            <Layers className="h-4.5 w-4.5" />
          </button>

          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="p-3 bg-white text-gray-700 hover:text-black hover:bg-gray-50 rounded-full shadow-lg transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 delay-75"
            title="View Full Details"
          >
            <Eye className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Info details */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category & Vibe */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-mono font-medium tracking-widest text-gray-400 uppercase">
            {product.category}
          </span>
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-800">{product.rating}</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="font-sans font-medium text-gray-900 group-hover:text-black tracking-tight text-sm mb-1 leading-tight line-clamp-1">
          {product.name}
        </h3>

        {/* Tagline snippet */}
        <p className="text-xs text-gray-400 font-sans tracking-wide italic mb-3 line-clamp-1">
          {product.tagline}
        </p>

        {/* Bottom Line: Price & Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-black font-mono">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through font-mono">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isAdded
                ? 'bg-green-500 text-white shadow-sm'
                : 'bg-black text-white hover:bg-neutral-800 hover:scale-102'
            }`}
          >
            {product.stock === 0 ? (
              'Sold Out'
            ) : isAdded ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
