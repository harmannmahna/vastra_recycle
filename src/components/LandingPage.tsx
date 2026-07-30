import React from 'react';
import { useApp } from '../context/AppContext';
import { RefreshCw, ShoppingBag, Recycle as Recycling, ArrowRight, ShieldCheck, Heart, Sparkles, Truck, CheckCircle2, Factory, Instagram, Award, Sparkle, AlertTriangle } from 'lucide-react';
import { Item } from '../types';

export const LandingPage: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { 
    items, analytics, wishlist, toggleWishlist, addToCart, 
    setSelectedProductModal, setIsRecycleModalOpen, setIsSellModalOpen, setIsAuthModalOpen, currentUser 
  } = useApp();

  const featuredItems = items.filter(i => i.status === 'listed').slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-[#FDFBF7] via-[#F8F5ED] to-[#FDFBF7]">
        {/* Subtle background decorative shapes */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-forest-700/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-terracotta-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Startup Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-700/10 text-forest-800 text-xs font-bold uppercase tracking-wider">
                <img src="/chakra-icon.png" alt="Chakra" className="w-4 h-4 object-contain animate-spin-slow" />
                <span>Delhi NCR Early-Stage Startup Pilot</span>
              </div>

              <h1 className="font-poppins font-extrabold text-4xl sm:text-5xl lg:text-6xl text-forest-900 leading-[1.15] tracking-tight">
                Redefining Fashion, <span className="text-terracotta-500 relative underline decoration-warmgold-500/40 decoration-wavy">One Garment At A Time.</span>
              </h1>

              <p className="font-inter text-base sm:text-lg text-forest-900/80 max-w-2xl leading-relaxed">
                VastraChakra is building Delhi NCR’s premier 2-tier circular fashion ecosystem. Resell curated, pre-loved garments (under 3 years old) or send worn-out textiles for certified recycling.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => {
                    if (!currentUser) setIsAuthModalOpen(true);
                    else setIsSellModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-poppins font-semibold text-base shadow-lg shadow-terracotta-500/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
                >
                  <span>Sell Pre-Loved Apparel</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    if (!currentUser) setIsAuthModalOpen(true);
                    else setIsRecycleModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-forest-700 hover:bg-forest-800 text-cream-100 font-poppins font-semibold text-base shadow-lg shadow-forest-700/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5"
                >
                  <Recycling className="w-5 h-5 text-warmgold-400" />
                  <span>Book Recycle Pickup</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-forest-700/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-forest-900/70 font-medium">
                <a
                  href="https://www.instagram.com/vastrachakra_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-pink-600 hover:underline font-bold"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Official Instagram: @vastrachakra_</span>
                </a>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-earthteal-500" />
                  <span>Verified Screening Checkpoints</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-earthteal-500" />
                  <span>Zero Fake Inflated Metrics</span>
                </div>
              </div>
            </div>

            {/* Right Visual Brand Card - Full Width Rectangular Logo Banner with Faded Text */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
                {/* Outer Glow Ring */}
                <div className="absolute -inset-4 bg-gradient-to-r from-warmgold-500/30 via-terracotta-500/30 to-earthteal-500/30 rounded-3xl blur-2xl opacity-70 animate-pulse-subtle"></div>

                <div className="relative bg-white/95 backdrop-blur-md border border-forest-700/15 rounded-3xl p-6 shadow-2xl space-y-6 text-center overflow-hidden">
                  
                  {/* Full-width Expanded Rectangular Banner Box filling the entire upper frame */}
                  <div className="relative w-full rounded-2xl overflow-hidden shadow-sm flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#FDFBF7] via-white to-[#FDFBF7] border border-forest-700/10 min-h-[200px] sm:min-h-[240px]">
                    <div className="w-full flex-1 flex items-center justify-center py-2">
                      <img 
                        src="/logo-banner.png" 
                        alt="VastraChakra Official Banner Logo" 
                        className="w-full h-auto max-h-44 object-contain transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="text-xs text-forest-900/90 font-extrabold tracking-wide flex items-center justify-center gap-2 pt-3 border-t border-forest-700/10 w-full bg-white/80 backdrop-blur-xs rounded-xl mt-2">
                      <img src="/chakra-icon.png" alt="Chakra" className="w-4 h-4 object-contain" />
                      <span>Official Startup Identity & Registered Brand</span>
                    </div>
                  </div>

                  {/* Real Startup Metrics (No inflated claims!) */}
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="bg-forest-50 p-3.5 rounded-2xl border border-forest-700/10">
                      <div className="text-[11px] text-forest-900/60 font-semibold">Stage</div>
                      <div className="text-sm font-poppins font-bold text-forest-900">
                        Delhi NCR Beta Pilot
                      </div>
                    </div>

                    <div className="bg-forest-50 p-3.5 rounded-2xl border border-forest-700/10">
                      <div className="text-[11px] text-forest-900/60 font-semibold">Resell Rule</div>
                      <div className="text-sm font-poppins font-bold text-terracotta-600">
                        Max 3 Years Usage
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-earthteal-50 rounded-2xl border border-earthteal-500/20 text-xs text-earthteal-800 text-left flex items-start gap-2">
                    <Award className="w-5 h-5 shrink-0 text-earthteal-600 mt-0.5" />
                    <span>
                      <strong>Strict Quality Protocol:</strong> Mandatory seller video uploads, hygiene ratings & brand verification for Tier 1 apparel.
                    </span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Startup Real Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 text-cream-100 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-forest-700/50 rounded-full blur-2xl"></div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-forest-700/40">
            <div className="pt-4 md:pt-0">
              <div className="flex justify-center mb-2 text-warmgold-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="font-poppins font-bold text-xl text-cream-100">
                Tier 1: Reselling
              </div>
              <div className="text-xs text-cream-300 mt-1 max-w-xs mx-auto">
                Jeans, Sarees, Tops, Jackets, Gowns (under 3 yrs old) from premium brands.
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="flex justify-center mb-2 text-earthteal-400">
                <Recycling className="w-6 h-6" />
              </div>
              <div className="font-poppins font-bold text-xl text-cream-100">
                Tier 2: Recycling
              </div>
              <div className="text-xs text-cream-300 mt-1 max-w-xs mx-auto">
                Worn textiles picked up by weight with mandatory packed bag image proof.
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="flex justify-center mb-2 text-terracotta-400">
                <Factory className="w-6 h-6" />
              </div>
              <div className="font-poppins font-bold text-xl text-cream-100">
                Delhi NCR Recyclers Hub
              </div>
              <div className="text-xs text-cream-300 mt-1 max-w-xs mx-auto">
                Connecting Panipat recycling mills & Delhi NGOs for bulk yarn spinning.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-earthteal-600 tracking-widest uppercase">The Dual Circular Model</span>
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-forest-900">
            How VastraChakra Works
          </h2>
          <p className="text-sm text-forest-900/70">
            Clear guidelines for pre-loved reselling and zero-landfill textile recycling.
          </p>
        </div>

        {/* Two Columns: Resale vs Recycling */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Column 1: Resale */}
          <div className="bg-white border border-forest-700/15 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all space-y-6">
            <div className="flex items-center gap-3 border-b border-forest-700/10 pb-4">
              <div className="p-3 bg-terracotta-500/10 text-terracotta-500 rounded-2xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-xl text-forest-900">Tier 1 – Curated Resell Marketplace</h3>
                <p className="text-xs text-forest-900/60">For wearable clothes (under 3 yrs old)</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-forest-900 text-cream-100 text-xs font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <h4 className="font-semibold text-sm text-forest-900">Selective Categories & Brands</h4>
                  <p className="text-xs text-forest-900/70 mt-0.5">Jeans, Sarees, Tops, Dresses, Jackets & Kurtis from recognized premium brands only.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-forest-900 text-cream-100 text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <h4 className="font-semibold text-sm text-forest-900">Hygiene & Short Video Check</h4>
                  <p className="text-xs text-forest-900/70 mt-0.5">Sellers upload a short video preview & hygiene score for complete transparency.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-forest-900 text-cream-100 text-xs font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <h4 className="font-semibold text-sm text-forest-900">Admin Approval & Listing</h4>
                  <p className="text-xs text-forest-900/70 mt-0.5">Admin moderates video and condition before listing item live for buyers.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!currentUser) setIsAuthModalOpen(true);
                else setActiveTab('marketplace');
              }}
              className="w-full py-3 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-700 font-semibold text-xs tracking-wide uppercase transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Column 2: Recycling */}
          <div className="bg-white border border-forest-700/15 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all space-y-6">
            <div className="flex items-center gap-3 border-b border-forest-700/10 pb-4">
              <div className="p-3 bg-earthteal-500/10 text-earthteal-500 rounded-2xl">
                <Recycling className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-xl text-forest-900">Tier 2 – Textile Recycling Pickup</h3>
                <p className="text-xs text-forest-900/60">For torn, faded, or unwearable fabric waste</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-earthteal-600 text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <h4 className="font-semibold text-sm text-forest-900">Pack Clothes in Bag / Box</h4>
                  <p className="text-xs text-forest-900/70 mt-0.5">Collect your old clothes, seal them securely in a bag or box, and take a photo.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-earthteal-600 text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <h4 className="font-semibold text-sm text-forest-900">Submit Weight & Photo</h4>
                  <p className="text-xs text-forest-900/70 mt-0.5">Specify estimated weight (kg), clothing type, and upload the packed box photo.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-earthteal-600 text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <h4 className="font-semibold text-sm text-forest-900">Doorstep Collection & Mills Transfer</h4>
                  <p className="text-xs text-forest-900/70 mt-0.5">Consolidated at Delhi NCR sorting hub and transferred to recycling partners.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!currentUser) setIsAuthModalOpen(true);
                else setIsRecycleModalOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-earthteal-50 hover:bg-earthteal-100 text-earthteal-600 font-semibold text-xs tracking-wide uppercase transition-colors flex items-center justify-center gap-2"
            >
              <span>Book Recycle Pickup</span>
              <Recycling className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Pre-Loved Items Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-terracotta-500 uppercase tracking-widest">Screened & Verified</span>
            <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-forest-900">
              Curated Pre-Loved Finds
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('marketplace')}
            className="text-xs font-bold uppercase text-forest-700 hover:text-forest-900 flex items-center gap-1.5 underline"
          >
            <span>View Marketplace Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map(item => {
            const isLiked = wishlist.includes(item.id);
            return (
              <div 
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-forest-700/15 hover:border-forest-700/30 shadow-sm hover:shadow-lg transition-all group flex flex-col"
              >
                {/* Image */}
                <div 
                  onClick={() => {
                    if (!currentUser) setIsAuthModalOpen(true);
                    else setSelectedProductModal(item);
                  }}
                  className="relative aspect-square overflow-hidden bg-cream-200 cursor-pointer"
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Age Tag */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-forest-900 text-cream-100">
                    {item.ageYears} yrs old
                  </span>

                  {/* Video Badge */}
                  {item.videoUrl && (
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm flex items-center gap-1">
                      ▶ Video Available
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!currentUser) setIsAuthModalOpen(true);
                      else toggleWishlist(item.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
                      isLiked ? 'bg-terracotta-500 text-white' : 'bg-white/80 text-forest-900 hover:text-terracotta-500'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start text-xs text-forest-900/60 font-medium">
                      <span>Brand: {item.brand}</span>
                      <span>Size: {item.size}</span>
                    </div>
                    <h3 
                      onClick={() => {
                        if (!currentUser) setIsAuthModalOpen(true);
                        else setSelectedProductModal(item);
                      }}
                      className="font-poppins font-semibold text-sm text-forest-900 group-hover:text-terracotta-500 transition-colors line-clamp-1 cursor-pointer mt-0.5"
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between pt-2 border-t border-forest-700/10">
                    <div>
                      <div className="font-poppins font-bold text-base text-forest-900">
                        ₹{item.price.toLocaleString()}
                      </div>
                      {item.originalPrice && (
                        <div className="text-[10px] text-forest-900/50 line-through">
                          MRP ₹{item.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (!currentUser) setIsAuthModalOpen(true);
                        else addToCart(item);
                      }}
                      className="p-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl transition-colors shadow-sm"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* For Industry Partners Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-3xl p-8 lg:p-12 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Factory className="w-4 h-4" />
              <span>Delhi NCR Industry Partner Portal</span>
            </div>
            
            <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-white">
              Recycling Industry & NGO Collaborations
            </h2>

            <p className="text-sm text-slate-300 max-w-xl">
              We connect textile recyclers in Delhi NCR & Panipat with consolidated post-consumer fabric stock. Explore delivery models, commercial rate cards (₹/kg), and warehouse inventory staging.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <button
              onClick={() => {
                if (!currentUser) setIsAuthModalOpen(true);
                else setActiveTab('industry');
              }}
              className="px-6 py-3.5 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-poppins font-bold text-sm transition-all shadow-md flex items-center gap-2"
            >
              <span>Access Industry Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

