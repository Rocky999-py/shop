import React, { useState } from 'react';
import { Star, ArrowLeft, Plus, Minus, Layers, Check, ShoppingCart, MessageSquare, ShieldCheck, Truck } from 'lucide-react';
import { Product, CartItem, Review } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  onToggleCompare: (product: Product) => void;
  isCompared: boolean;
}

export default function ProductDetail({
  product,
  onBack,
  onAddToCart,
  onToggleCompare,
  isCompared,
}: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(product.gallery[0] || product.image);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.category === 'Fashion' ? 'Charcoal' : product.category === 'Electronics' ? 'Anodized Silver' : 'Natural'
  );
  const [selectedSize, setSelectedSize] = useState(product.category === 'Fashion' ? 'Medium' : 'Standard');
  const [isAdded, setIsAdded] = useState(false);

  // Live reviews state (initialized with product reviews)
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  const colors = product.category === 'Fashion' 
    ? ['Charcoal', 'Oatmeal', 'Sage'] 
    : product.category === 'Electronics' 
    ? ['Anodized Silver', 'Cosmic Slate'] 
    : ['Natural', 'Sienna'];

  const sizes = product.category === 'Fashion' ? ['Small', 'Medium', 'Large'] : ['Standard'];

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userName: newReviewName,
      rating: newReviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: newReviewComment,
    };

    setReviewsList([newReview, ...reviewsList]);
    setNewReviewName('');
    setNewReviewRating(5);
    setNewReviewComment('');
    setReviewSuccessMsg('Thank you! Your review has been published.');
    setTimeout(() => setReviewSuccessMsg(''), 4000);
  };

  // Recalculating rating summary
  const averageRating = reviewsList.length > 0 
    ? (reviewsList.reduce((sum, rev) => sum + rev.rating, 0) / reviewsList.length).toFixed(1)
    : product.rating.toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Return to Catalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative shadow-sm">
            <img
              src={activeImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
          </div>

          {/* Thumbnail row */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square w-20 rounded-xl overflow-hidden border bg-gray-50 flex-shrink-0 transition-all duration-200 ${
                    activeImage === img ? 'border-black ring-2 ring-black/5' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`Gallery view ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Order Configuration */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <span className="text-xs font-mono tracking-widest text-gray-400 uppercase mb-2">
            {product.category}
          </span>
          <h1 className="text-3xl font-sans font-semibold text-black tracking-tight mb-2 leading-tight">
            {product.name}
          </h1>
          <p className="text-base text-gray-500 italic mb-6">
            {product.tagline}
          </p>

          {/* Pricing & Rating banner */}
          <div className="flex items-center justify-between py-4 px-5 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Premium Rate</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono text-black">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through font-mono">${product.originalPrice}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Customer Rating</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-black">{averageRating}</span>
                <span className="text-xs text-gray-400 font-mono">({reviewsList.length})</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Color & Variant picker */}
          <div className="space-y-6 mb-8">
            {/* Colors */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-gray-400 block mb-3">
                Color Way: <span className="text-black font-semibold font-sans">{selectedColor}</span>
              </span>
              <div className="flex items-center gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            {sizes.length > 1 && (
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-gray-400 block mb-3">
                  Select Fit: <span className="text-black font-semibold font-sans">{selectedSize}</span>
                </span>
                <div className="flex items-center gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-gray-400 block mb-3">
                Quantity Selector
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 hover:bg-gray-50 rounded text-gray-500 hover:text-black transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center font-mono text-sm font-semibold text-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-1.5 hover:bg-gray-50 rounded text-gray-500 hover:text-black transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Stock Alert */}
                <div className="text-xs">
                  {product.stock <= 5 ? (
                    <span className="text-red-500 font-semibold flex items-center gap-1">
                      ● Only {product.stock} units left in stock!
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      ● Ready to Ship ({product.stock} units in stock)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`sm:col-span-3 w-full py-4 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isAdded
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-black text-white hover:bg-neutral-800 hover:shadow-lg hover:scale-[1.01]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="h-4.5 w-4.5 stroke-[2.5]" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4.5 w-4.5" />
                  <span>Secure Checkout Add</span>
                </>
              )}
            </button>

            <button
              onClick={() => onToggleCompare(product)}
              className={`w-full py-4 border rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                isCompared
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white hover:text-black'
              }`}
              title={isCompared ? 'Remove from comparison' : 'Compare specifications'}
            >
              <Layers className="h-4.5 w-4.5" />
              <span className="sm:hidden">Compare</span>
            </button>
          </div>

          {/* Security & shipping guarantees */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
            <div className="flex items-start gap-2.5">
              <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <span className="text-xs font-medium text-gray-900 block">Complimentary Shipping</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">Dispatched within 24 hours.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <span className="text-xs font-medium text-gray-900 block">Aura Secure Guarantee</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">30-day elegant returns.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="border-t border-gray-100 pt-10">
        {/* Navigation */}
        <div className="flex border-b border-gray-100 mb-8 overflow-x-auto gap-8">
          {(['description', 'specs', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-mono uppercase tracking-widest font-semibold transition-all relative ${
                activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab === 'description' ? 'Detailed Story' : tab === 'specs' ? 'Specifications' : `Reviews (${reviewsList.length})`}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black rounded-full" />}
            </button>
          ))}
        </div>

        {/* Tab contents */}
        <div className="min-h-[250px]">
          {activeTab === 'description' && (
            <div className="max-w-3xl space-y-6 text-sm text-gray-600 leading-relaxed">
              <p className="text-base font-medium text-black">A Closer Look At The Fine Craftsmanship:</p>
              <ul className="list-disc pl-5 space-y-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="marker:text-black">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
              <table className="w-full text-sm text-left border-collapse">
                <tbody>
                  {Object.entries(product.specs).map(([key, value], idx) => (
                    <tr key={key} className={idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                      <td className="px-6 py-4 font-mono text-xs text-gray-400 uppercase font-medium border-b border-gray-100/50 w-1/3">
                        {key}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800 border-b border-gray-100/50">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Review Lists */}
              <div className="lg:col-span-7 space-y-6">
                {reviewsList.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No reviews yet. Be the first to share your experience!</p>
                ) : (
                  reviewsList.map((review) => (
                    <div key={review.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-sm font-semibold text-gray-900 block">{review.userName}</span>
                          <span className="text-[10px] font-mono text-gray-400 block mt-0.5">{review.date}</span>
                        </div>
                        <div className="flex gap-0.5 bg-white py-1 px-2 border border-gray-100 rounded-lg">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add a Review Column */}
              <div className="lg:col-span-5 bg-white border border-gray-100 p-8 rounded-2xl shadow-sm h-fit">
                <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-6 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Share Your Experience
                </h3>

                {reviewSuccessMsg && (
                  <div className="mb-6 p-4 bg-green-50 text-green-700 text-xs font-medium rounded-xl border border-green-100 flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>{reviewSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">
                      Product Rating
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">
                      Your Comments
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Describe the aesthetic, sound profile, or material quality..."
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-black hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-200 shadow-sm"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
