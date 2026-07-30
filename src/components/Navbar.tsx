import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Heart, Search, User as UserIcon, PlusCircle, Recycle as Recycling, ShieldCheck, Factory, LogOut, Instagram, Sparkles, Home, Tag } from 'lucide-react';

export const Navbar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const { 
    currentUser, logout,
    cart, wishlist, 
    searchQuery, setSearchQuery, 
    setIsAuthModalOpen, setIsSellModalOpen, setIsRecycleModalOpen, setIsCartOpen 
  } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Role Theme Indicator Helper
  const getRoleBadgeStyle = () => {
    if (currentUser?.role === 'admin') {
      return 'bg-slate-900 text-amber-400 border border-amber-500/40 shadow-sm font-mono';
    }
    if (currentUser?.role === 'industry_partner') {
      return 'bg-slate-800 text-teal-300 border border-teal-500/30 font-sans';
    }
    return 'bg-forest-700 text-cream-100 font-sans';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-forest-700/10 shadow-sm transition-all">
      {/* Top Banner with Instagram Link & Startup Status */}
      <div className="bg-forest-900 text-cream-100 text-xs py-1.5 px-4 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com/vastrachakra_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-semibold hover:opacity-90 transition-opacity text-[11px]"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@vastrachakra_</span>
          </a>
          <span className="text-cream-300 hidden sm:inline">•</span>
          <span className="text-cream-200 hidden sm:inline font-medium">
            Delhi NCR Pilot Stage (Pre-Launch Beta)
          </span>
        </div>

        <div className="text-cream-300 flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <img src="/chakra-icon.png" alt="Chakra" className="w-4 h-4 object-contain" />
            <span>2-Tier Ecosystem: Tier 1 Reselling & Tier 2 Recycling</span>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 py-2">
        {/* Brand Logo Section: Clean Circular Logo Only (No outline, no cream box) + Brand Text */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Circular Cut Emblem Logo with soft shadow and reflection effect */}
          <div className="h-12 w-12 rounded-full overflow-hidden shadow-md hover:shadow-lg group-hover:scale-105 transition-all duration-300 flex items-center justify-center shrink-0">
            <img
              src="/logo-emblem.jpg"
              alt="VastraChakra Circular Emblem"
              className="h-full w-full object-cover rounded-full"
            />
          </div>

          {/* Clean Brand Text */}
          <div className="block">
            <span className="font-poppins font-bold text-xl tracking-tight text-forest-900 flex items-center gap-1.5">
              <span>Vastra</span><span className="text-terracotta-500">Chakra</span>
              <img src="/chakra-icon.png" alt="Chakra" className="w-4 h-4 object-contain inline" />
            </span>
            <span className="block text-[10px] tracking-widest uppercase font-bold text-earthteal-600 -mt-1">
              Delhi NCR Sustainable Startup
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search jeans, sarees, jackets, kurtis..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'marketplace') setActiveTab('marketplace');
            }}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white/90 border border-forest-700/15 rounded-full focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition-all placeholder:text-forest-900/40"
          />
          <Search className="w-4 h-4 text-forest-900/50 absolute left-3.5 top-3" />
        </div>

        {/* Navigation Tabs with Chhotu SVG Icons */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'home' ? 'text-forest-700 bg-forest-50 font-semibold' : 'text-forest-900/70 hover:text-forest-900 hover:bg-forest-50/50'
            }`}
          >
            <Home className="w-4 h-4 text-forest-700" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'marketplace' ? 'text-forest-700 bg-forest-50 font-semibold' : 'text-forest-900/70 hover:text-forest-900 hover:bg-forest-50/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-terracotta-500" />
            <span>Buy Pre-loved</span>
          </button>

          <button
            onClick={() => {
              if (!currentUser) setIsAuthModalOpen(true);
              else setIsRecycleModalOpen(true);
            }}
            className="px-3 py-2 text-sm font-medium text-earthteal-600 hover:text-earthteal-700 hover:bg-earthteal-50/60 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Recycling className="w-4 h-4 text-earthteal-600" />
            <span>Recycle Pickup</span>
          </button>

          <button
            onClick={() => {
              if (!currentUser) {
                setIsAuthModalOpen(true);
              } else if (currentUser.role === 'industry_partner') {
                setActiveTab('industry');
              } else {
                alert('Industry Partner access required! Please log in with your Industry account.');
                setIsAuthModalOpen(true);
              }
            }}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'industry' ? 'text-earthteal-600 bg-earthteal-50 font-semibold' : 'text-forest-900/70 hover:text-forest-900'
            }`}
          >
            <Factory className="w-4 h-4 text-teal-700" />
            <span>Industry Portal</span>
          </button>

          <button
            onClick={() => {
              if (!currentUser) {
                setIsAuthModalOpen(true);
              } else if (currentUser.role === 'admin') {
                setActiveTab('admin');
              } else {
                alert('Admin credentials required! Please log in as Admin panel member.');
                setIsAuthModalOpen(true);
              }
            }}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'admin' ? 'text-amber-700 bg-amber-50 font-semibold' : 'text-forest-900/70 hover:text-forest-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Admin Panel</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Sell Button with Chhotu SVG Icon */}
          <button
            onClick={() => {
              if (!currentUser) setIsAuthModalOpen(true);
              else setIsSellModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-1.5 bg-terracotta-500 hover:bg-terracotta-600 text-white px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-95"
          >
            <Tag className="w-4 h-4" />
            <span>Sell Item</span>
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => {
              if (!currentUser) setIsAuthModalOpen(true);
              else setActiveTab('marketplace');
            }}
            className="relative p-2 text-forest-900/70 hover:text-terracotta-500 hover:bg-cream-200 rounded-full transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-terracotta-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => {
              if (!currentUser) setIsAuthModalOpen(true);
              else setIsCartOpen(true);
            }}
            className="relative p-2 text-forest-900/70 hover:text-forest-700 hover:bg-cream-200 rounded-full transition-colors"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-forest-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth with Circular Emblem Logo */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-forest-700/15 shrink-0">
              <button
                onClick={() => {
                  if (currentUser.role === 'admin') setActiveTab('admin');
                  else if (currentUser.role === 'industry_partner') setActiveTab('industry');
                  else setActiveTab('profile');
                }}
                className="flex items-center gap-2 group text-left shrink-0"
              >
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${getRoleBadgeStyle()} inline-flex items-center gap-2 shrink-0 whitespace-nowrap shadow-sm`}>
                  <img src="/logo-emblem.jpg" alt="User Avatar Emblem" className="w-4 h-4 rounded-full object-cover shrink-0" />
                  <span className="capitalize">{currentUser.role === 'customer' ? 'Consumer' : currentUser.role === 'industry_partner' ? 'Industry' : 'Admin'}</span>
                </div>
              </button>

              <button
                onClick={() => {
                  logout();
                  setActiveTab('home');
                }}
                className="p-2 text-forest-900/60 hover:text-terracotta-500 rounded-lg transition-colors shrink-0"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-forest-700 hover:bg-forest-800 px-4 py-1.5 rounded-full shadow-sm transition-all"
            >
              <UserIcon className="w-4 h-4" />
              <span>Login / Account</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


