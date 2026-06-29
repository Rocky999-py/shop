import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Layers, Star, ShoppingBag, Mail, CheckCircle2, ChevronRight, SlidersHorizontal, Eye, ShieldCheck, Heart, ArrowUpRight, X } from 'lucide-react';
import { ViewType, Product, CartItem, Order, PromoCode } from './types';
import { PRODUCTS } from './data/products';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CompareModal from './components/CompareModal';
import CartDrawer from './components/CartDrawer';
import CheckoutForm from './components/CheckoutForm';
import OrdersList from './components/OrdersList';
import AIAssistant from './components/AIAssistant';

export default function App() {
  const [currentView, setView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // LocalStorage state syncing
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aura-luxe-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('aura-luxe-orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Interactive notifications state
  const [notifications, setNotifications] = useState<{ id: string; msg: string; type: 'success' | 'info' | 'warn' }[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    localStorage.setItem('aura-luxe-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura-luxe-orders', JSON.stringify(orders));
  }, [orders]);

  const addNotification = (msg: string, type: 'success' | 'info' | 'warn' = 'success') => {
    const id = `${Date.now()}`;
    setNotifications((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1, color?: string, size?: string) => {
    setCart((prev) => {
      const matchIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (matchIndex > -1) {
        const updated = [...prev];
        updated[matchIndex].quantity += quantity;
        addNotification(`Increased ${product.name} quantity in your cart.`);
        return updated;
      }

      addNotification(`Added ${product.name} to your cart.`);
      return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
    });
  };

  const handleUpdateCartQuantity = (index: number, qty: number) => {
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = qty;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    const item = cart[index];
    setCart((prev) => prev.filter((_, i) => i !== index));
    addNotification(`Removed ${item.product.name} from your cart.`, 'info');
  };

  // Compare toggling operations
  const handleToggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        addNotification(`Removed ${product.name} from comparison.`, 'info');
        return prev.filter((p) => p.id !== product.id);
      }

      if (prev.length >= 3) {
        addNotification('You can compare a maximum of 3 models at once.', 'warn');
        return prev;
      }

      addNotification(`Added ${product.name} to comparison board.`);
      return [...prev, product];
    });
  };

  const handleRemoveCompare = (product: Product) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== product.id));
    addNotification(`Removed ${product.name} from comparison.`, 'info');
  };

  // Purchase complete callbacks
  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart
    setAppliedPromo(null); // Clear promo
    addNotification(`Order placed successfully! Reference Code: ${newOrder.id}`);
  };

  const handleReorder = (items: CartItem[]) => {
    items.forEach((item) => {
      handleAddToCart(item.product, item.quantity, item.selectedColor, item.selectedSize);
    });
    setView('cart');
    addNotification('Re-populated shopping bag with past purchase items.');
  };

  // Filter & sort logic
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.isFeatured ? 1 : -1; // featured first
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsSubscribed(true);
    addNotification('Welcome to our inner circle. Exclusive seasonal lookbooks on their way.');
    setEmailInput('');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-black selection:text-white relative">
      {/* Absolute floating notifications toast system */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`px-5 py-3.5 rounded-xl shadow-2xl border text-xs font-semibold tracking-wide flex items-center gap-2.5 animate-in slide-in-from-right-10 pointer-events-auto bg-white ${
              n.type === 'warn'
                ? 'border-amber-200 text-amber-800'
                : n.type === 'info'
                ? 'border-gray-200 text-gray-700'
                : 'border-green-200 text-green-800'
            }`}
          >
            <div className={`h-2 w-2 rounded-full ${n.type === 'warn' ? 'bg-amber-500' : n.type === 'info' ? 'bg-gray-400' : 'bg-green-500'}`} />
            <span>{n.msg}</span>
          </div>
        ))}
      </div>

      {/* Main Top Header */}
      <Header
        currentView={currentView}
        setView={(v) => { setView(v); window.scrollTo(0, 0); }}
        cart={cart}
        comparedProducts={comparedProducts}
        setIsCompareOpen={setIsCompareOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Comparison Specifications Panel Overlay */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedProducts={comparedProducts}
        onRemove={handleRemoveCompare}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* Floating Smart Stylist AI Adviser Widget */}
      <AIAssistant
        onViewProduct={(p) => {
          setSelectedProduct(p);
          setView('product');
          window.scrollTo(0, 0);
        }}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* ROUTING BODY PAGES CONTAINER */}
      <main className="flex-grow">
        {/* VIEW 1: LANDING/CURATED PAGE */}
        {currentView === 'home' && (
          <div className="space-y-20 pb-20">
            {/* Minimalist Marquee Hero Panel */}
            <section className="relative overflow-hidden bg-gray-50/50 border-b border-gray-100 py-16 md:py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-150 shadow-xs">
                    <Sparkles className="h-3.5 w-3.5 text-black" />
                    <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-semibold">Seasonal Vernissage</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-semibold tracking-tight text-black leading-none">
                    Tailored Forms. <br />
                    <span className="font-light italic text-gray-400">Pure Utility.</span>
                  </h1>
                  <p className="text-sm sm:text-base text-gray-500 max-w-lg leading-relaxed font-sans">
                    Aura Luxe presents an architectural study in luxury lifestyle pieces. From Himalayan cashmere to milled silent tactile mechanical assemblies, every item is curated to redefine the daily experience.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      onClick={() => setView('shop')}
                      className="px-8 py-4 bg-black hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <span>Explore the Boutique</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedCategory('Electronics'); setView('shop'); }}
                      className="px-8 py-4 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:text-black font-semibold text-xs tracking-wider uppercase rounded-xl transition-all duration-300"
                    >
                      Tech Curations
                    </button>
                  </div>
                </div>

                {/* Hero Showcase Frame */}
                <div className="lg:col-span-5 relative">
                  <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-2xl relative">
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800"
                      alt="Luxury Overcoat Portrait"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-gray-150 shadow flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">Season Classic</span>
                        <h4 className="text-xs font-semibold text-gray-900 mt-0.5">Nordic Cashmere Overcoat</h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-black">$580</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Segment Links */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold block mb-4 text-center">Shop by segment</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Fashion', desc: 'Sartorial Tailoring', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=300' },
                  { name: 'Electronics', desc: 'Minimalist Engineering', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300' },
                  { name: 'Home Decor', desc: 'Atmospheric Clay', img: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=300' },
                  { name: 'Wellness', desc: 'Cellular Restoration', img: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=300' },
                ].map((seg) => (
                  <div
                    key={seg.name}
                    onClick={() => {
                      setSelectedCategory(seg.name);
                      setView('shop');
                      window.scrollTo(0,0);
                    }}
                    className="group relative aspect-[3/2] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100/50 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <img src={seg.img} alt={seg.name} referrerPolicy="no-referrer" className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col justify-end p-5 text-white">
                      <span className="text-[10px] font-mono tracking-widest text-white/75 uppercase font-medium">{seg.desc}</span>
                      <h3 className="text-sm font-semibold tracking-wide font-sans mt-0.5 flex items-center gap-1">
                        <span>{seg.name}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-white/50 group-hover:text-white transition-colors" />
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Curated featured items showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-semibold">The Core Grid</span>
                  <h2 className="text-2xl font-sans font-semibold text-black tracking-tight mt-1">Luxe Curations</h2>
                </div>
                <button
                  onClick={() => setView('shop')}
                  className="text-xs font-semibold uppercase tracking-wider text-black hover:text-gray-500 transition-colors flex items-center gap-1 group"
                >
                  <span>View All models</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {PRODUCTS.filter(p => p.isFeatured).slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={(p) => { setSelectedProduct(p); setView('product'); window.scrollTo(0,0); }}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onToggleCompare={handleToggleCompare}
                    isCompared={comparedProducts.some((cp) => cp.id === product.id)}
                  />
                ))}
              </div>
            </section>

            {/* Banner offer */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-black text-white rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 shadow-2xl relative">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 h-96 w-96 bg-gray-800 rounded-full blur-3xl opacity-20 pointer-events-none" />

                <div className="lg:col-span-8 space-y-4 relative z-10">
                  <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-semibold">Exclusive Promotion</span>
                  <h2 className="text-3xl font-sans font-semibold tracking-tight text-white leading-tight">
                    Inaugural Launch Reward. <br />
                    Enjoy <span className="font-light italic text-gray-300">15% off</span> sitewide.
                  </h2>
                  <p className="text-xs text-gray-400 max-w-md font-sans">
                    Use corporate validation coupon <strong className="text-white font-mono">AURA15</strong> at checkout to redeem. Complimentary premium carrier dispatches automatically unlocked on bags over $150.
                  </p>
                </div>

                <div className="lg:col-span-4 flex justify-start lg:justify-end relative z-10">
                  <button
                    onClick={() => { setSortBy('featured'); setView('shop'); }}
                    className="px-8 py-4 bg-white text-black hover:bg-gray-150 font-bold text-xs tracking-wider uppercase rounded-xl transition-colors shadow-lg"
                  >
                    Redeem Code Now
                  </button>
                </div>
              </div>
            </section>

            {/* Corporate/Brand values */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100 pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold block">Carbon Neutral dispatches</span>
                <p className="text-sm font-semibold text-gray-900">Insured Insulated Transport</p>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">
                  Every carrier packing is carbon offset, utilizing double-layer recycled linen liners and natural honeycomb board padding.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold block">Uncompromising Standard</span>
                <p className="text-sm font-semibold text-gray-900">Strict Craft Integrity</p>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">
                  All botanical nectars are raw cold-pressed in small batches, and leather is traceably tanned in certified Italian partner mills.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold block">Life Cycle Guarantee</span>
                <p className="text-sm font-semibold text-gray-900">30-Day Aesthetic Returns</p>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">
                  We stand securely behind our items. Return any model within 30 days for complimentary returns or instant exchanges.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: PRODUCT LISTINGS / SHOP PAGE */}
        {currentView === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
              <div>
                <h1 className="text-2xl font-sans font-semibold tracking-tight text-black">Curated Catalog</h1>
                <p className="text-xs text-gray-400 mt-1">Filtering {sortedProducts.length} premium models</p>
              </div>

              {/* Sorting & Segment Controls */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* Search summary state (if typed) */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:text-black rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <span>Search: "{searchQuery}"</span>
                    <X className="h-3 w-3" />
                  </button>
                )}

                {/* Sorting Select */}
                <div className="flex items-center gap-2 border border-gray-150 bg-white rounded-xl px-3 py-2 text-xs font-medium text-gray-700">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="focus:outline-none bg-transparent pr-2 font-semibold cursor-pointer text-black"
                  >
                    <option value="featured">Sort: Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating: Highest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shop layout: Sidebar Filters + Product Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Category selector left sidebar (visible on desktop) */}
              <div className="lg:col-span-3 space-y-6 hidden lg:block bg-gray-50 border border-gray-100 p-6 rounded-2xl">
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold mb-4">Boutique Segments</h3>
                  <div className="flex flex-col space-y-1">
                    {['All', 'Electronics', 'Fashion', 'Home Decor', 'Wellness'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all ${
                          selectedCategory === cat
                            ? 'bg-black text-white'
                            : 'text-gray-500 hover:text-black hover:bg-white/50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Segment clues */}
                <div className="border-t border-gray-200/50 pt-4 text-[11px] text-gray-400 font-sans space-y-2">
                  <p>✓ All items shipped with premium custom cases.</p>
                  <p>✓ 100% Secure authentication codes.</p>
                </div>
              </div>

              {/* Mobile segment horizontal scroll */}
              <div className="lg:hidden overflow-x-auto flex gap-2 pb-4 scrollbar-none">
                {['All', 'Electronics', 'Fashion', 'Home Decor', 'Wellness'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide shrink-0 transition-all ${
                      selectedCategory === cat
                        ? 'bg-black text-white'
                        : 'bg-gray-50 text-gray-500 border border-gray-150'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Product Grid - Right side */}
              <div className="lg:col-span-9">
                {sortedProducts.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">No models found</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                      There are no active catalog items matching your search or category requirements.
                    </p>
                    <button
                      onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                      className="mt-6 px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg tracking-wider uppercase transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onViewDetails={(p) => { setSelectedProduct(p); setView('product'); window.scrollTo(0,0); }}
                        onAddToCart={(p) => handleAddToCart(p, 1)}
                        onToggleCompare={handleToggleCompare}
                        isCompared={comparedProducts.some((cp) => cp.id === product.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: FULL PRODUCT DETAILS SPEC PAGE */}
        {currentView === 'product' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setView('shop')}
            onAddToCart={handleAddToCart}
            onToggleCompare={handleToggleCompare}
            isCompared={comparedProducts.some((p) => p.id === selectedProduct.id)}
          />
        )}

        {/* VIEW 4: DETAILED CART LIST PAGE */}
        {currentView === 'cart' && (
          <CartDrawer
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onSetView={(v) => { setView(v); window.scrollTo(0,0); }}
            appliedPromo={appliedPromo}
            onApplyPromo={setAppliedPromo}
          />
        )}

        {/* VIEW 5: SECURITY CHECKOUT FORM PAGE */}
        {currentView === 'checkout' && (
          <CheckoutForm
            cart={cart}
            appliedPromo={appliedPromo}
            onOrderCompleted={handleOrderCompleted}
            onSetView={(v) => { setView(v); window.scrollTo(0,0); }}
          />
        )}

        {/* VIEW 6: PERSONAL ACQUISITION LEDGER PAGE */}
        {currentView === 'orders' && (
          <OrdersList
            orders={orders}
            onSetView={(v) => { setView(v); window.scrollTo(0,0); }}
            onReorder={handleReorder}
          />
        )}
      </main>

      {/* Corporate Footnotes Footer */}
      <footer className="bg-black text-white border-t border-neutral-900 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-neutral-900">
          {/* Logo Brand info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 bg-neutral-800 flex items-center justify-center rounded-lg border border-neutral-700">
                <span className="text-white font-sans text-lg font-bold tracking-widest">A</span>
              </div>
              <span className="text-lg font-sans font-semibold tracking-wider text-white">AURA <span className="text-[10px] font-mono tracking-widest font-light text-gray-500">LUXE</span></span>
            </div>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              World-class bespoke curations for elite tech ensembles, custom tailoring, architectural ceramics, and high-bioactive wellness botanicals.
            </p>
          </div>

          {/* Customer Support Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase font-bold block mb-4">Store Navigation</span>
            <ul className="text-xs text-gray-400 space-y-2 font-sans">
              <li><button onClick={() => { setView('home'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">Home Highlights</button></li>
              <li><button onClick={() => { setSelectedCategory('All'); setView('shop'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">Boutique Catalog</button></li>
              <li><button onClick={() => { setView('orders'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">Shipment Ledger</button></li>
              <li><button onClick={() => setIsCompareOpen(true)} className="hover:text-white transition-colors">Comparison Board</button></li>
            </ul>
          </div>

          {/* Newsletter Input Box */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase font-bold block mb-4">Seasonal Lookbook</span>
            {isSubscribed ? (
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl text-green-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5" />
                <span>Subscribed successfully. Welcome.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter email address..."
                  className="flex-grow px-4 py-2.5 text-xs bg-neutral-900 border border-neutral-800 rounded-xl focus:outline-none focus:border-neutral-700 text-white placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-white text-black hover:bg-gray-200 text-xs font-semibold rounded-xl uppercase tracking-wider transition-colors"
                >
                  Join
                </button>
              </form>
            )}
            <p className="text-[10px] text-gray-500 leading-tight">
              We respects your privacy. Dispatches are rare, highly-curated, and beautiful.
            </p>
          </div>
        </div>

        {/* Marginal copyright info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center md:text-left md:flex justify-between items-center text-[10px] text-gray-500 font-mono uppercase tracking-widest">
          <span>© 2026 Aura Luxe Boutique Inc. All Rights Reserved.</span>
          <span className="mt-2 md:mt-0 block">Bespoke Design & Code Studio integration</span>
        </div>
      </footer>
    </div>
  );
}
