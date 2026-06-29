import React, { useState } from 'react';
import { ShoppingBag, Search, Sparkles, Layers, User, Menu, X, History, SlidersHorizontal } from 'lucide-react';
import { ViewType, CartItem, Product } from '../types';

interface HeaderProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  cart: CartItem[];
  comparedProducts: Product[];
  setIsCompareOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export default function Header({
  currentView,
  setView,
  cart,
  comparedProducts,
  setIsCompareOpen,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigationItems = [
    { id: 'home', label: 'Curated' },
    { id: 'shop', label: 'Boutique' },
    { id: 'orders', label: 'Orders' },
  ];

  const categories = ['All', 'Electronics', 'Fashion', 'Home Decor', 'Wellness'];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setView('home'); setIsMobileMenuOpen(false); }}>
            <div className="h-10 w-10 bg-black flex items-center justify-center rounded-xl transition-all duration-300 hover:rotate-12 hover:scale-105">
              <span className="text-white font-sans text-xl font-bold tracking-widest">A</span>
            </div>
            <span className="text-xl font-sans font-semibold tracking-wider text-black">AURA <span className="text-xs font-mono tracking-widest font-light text-gray-400">LUXE</span></span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-10">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewType)}
                className={`text-sm font-medium tracking-wide transition-colors relative py-2 ${
                  currentView === item.id || (item.id === 'shop' && currentView === 'product')
                    ? 'text-black'
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                {item.label}
                {(currentView === item.id || (item.id === 'shop' && currentView === 'product')) && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Icons & Actions */}
          <div className="flex items-center space-x-4">
            {/* Live Search bar (Visible on Shop view or general) */}
            <div className="relative hidden lg:block w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'shop') setView('shop');
                }}
                placeholder="Search our catalog..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-100 rounded-full focus:outline-none focus:border-gray-300 focus:bg-white transition-all duration-200 text-black placeholder-gray-400"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Compare Board Trigger */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="p-2.5 text-gray-500 hover:text-black hover:bg-gray-50 rounded-full transition-all duration-200 relative"
              title="Compare Products"
            >
              <Layers className="h-5 w-5" />
              {comparedProducts.length > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 bg-black text-[9px] font-mono font-medium text-white rounded-full flex items-center justify-center border border-white">
                  {comparedProducts.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setView('cart')}
              className="p-2.5 text-gray-500 hover:text-black hover:bg-gray-50 rounded-full transition-all duration-200 relative"
              title="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 bg-red-500 text-[9px] font-mono font-medium text-white rounded-full flex items-center justify-center border border-white">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Profile/Orders Trigger */}
            <button
              onClick={() => setView('orders')}
              className="p-2.5 text-gray-500 hover:text-black hover:bg-gray-50 rounded-full transition-all duration-200"
              title="Order History"
            >
              <History className="h-5 w-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-gray-500 hover:text-black md:hidden rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md transition-all duration-300">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'shop') setView('shop');
                }}
                placeholder="Search catalog..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-full focus:outline-none focus:border-gray-200 focus:bg-white text-black"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id as ViewType);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2.5 text-sm font-medium tracking-wide rounded-xl transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-black text-white'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Categories Filter Fast-Access */}
            <div className="pt-4 border-t border-gray-100">
              <span className="px-4 text-[10px] font-mono tracking-widest text-gray-400 uppercase font-medium">Boutique Segments</span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setView('shop');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left px-4 py-2 text-xs rounded-lg border transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'border-black bg-black text-white'
                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
