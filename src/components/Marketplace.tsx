import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCategory, ItemCondition } from '../types';
import { calculateAiRecommendedPrice } from '../utils/aiPriceCalculator';
import { Search, SlidersHorizontal, Heart, ShoppingBag, PlusCircle, Filter, Video, ShieldCheck, Sparkles, Star, Tag } from 'lucide-react';

const CATEGORIES: (ItemCategory | 'All')[] = [
  'All',
  'Ethnic & Sarees',
  'Jeans & Bottoms',
  'Tops & Shirts',
  'Dresses & Gowns',
  'Jackets & Outerwear',
  'Kurtis'
];

export const Marketplace: React.FC = () => {
  const { 
    items, wishlist, toggleWishlist, addToCart, 
    setSelectedProductModal, setIsSellModalOpen, setIsAuthModalOpen, currentUser,
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, selectedCondition, setSelectedCondition
  } = useApp();

  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  // Filter items
  const filteredItems = items.filter(item => {
    if (item.status !== 'listed') return false;
    
    // Category check
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

    // Condition check
    if (selectedCondition !== 'All' && item.condition !== selectedCondition) return false;

    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchBrand = item.brand?.toLowerCase().includes(q) || false;
      const matchDesc = item.description.toLowerCase().includes(q);
      return matchTitle || matchBrand || matchDesc;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-forest-700/15 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-forest-700" />
            <span>Buy Pre-Loved Clothes (&le; 3 Yrs Old)</span>
          </div>
          <h1 className="font-poppins font-extrabold text-3xl text-forest-900">
            Delhi NCR Pre-Loved Wardrobe
          </h1>
          <p className="text-sm text-forest-900/70 mt-1">
            Hand-inspected, video-verified premium garments under 3 years of age with AI-powered fair bargaining.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser) setIsAuthModalOpen(true);
            else setIsSellModalOpen(true);
          }}
          className="self-start md:self-auto px-5 py-2.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-poppins font-semibold text-sm transition-all shadow-md flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List an Item for Resale</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="space-y-4">
        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search FabIndia, Zara, Sarees, Jeans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-forest-700/20 rounded-full focus:outline-none focus:ring-2 focus:ring-forest-700/20"
            />
            <Search className="w-4 h-4 text-forest-900/50 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1 bg-white border border-forest-700/20 rounded-full px-3 py-1.5 text-xs text-forest-900">
              <Filter className="w-3.5 h-3.5 text-forest-900/60" />
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value as ItemCondition | 'All')}
                className="bg-transparent focus:outline-none font-medium cursor-pointer"
              >
                <option value="All">All Garment Conditions</option>
                <option value="wearable_like_new">Like New Only</option>
                <option value="wearable_good">Gently Used</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-white border border-forest-700/20 rounded-full px-3 py-1.5 text-xs text-forest-900">
              <SlidersHorizontal className="w-3.5 h-3.5 text-forest-900/60" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none font-medium cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-forest-900 text-cream-100 shadow-sm'
                  : 'bg-white border border-forest-700/15 text-forest-900/70 hover:border-forest-700/40 hover:text-forest-900'
              }`}
            >
              <Tag className="w-3 h-3 text-terracotta-500" />
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Item Count Indicator */}
      <div className="text-xs text-forest-900/60 font-medium">
        Showing <span className="font-bold text-forest-900">{filteredItems.length}</span> screened listings
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => {
            const isLiked = wishlist.includes(item.id);
            const aiEst = calculateAiRecommendedPrice(item);

            return (
              <div 
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-forest-700/15 hover:border-forest-700/40 shadow-sm hover:shadow-md transition-all group flex flex-col"
              >
                {/* Image & Overlay */}
                <div 
                  onClick={() => setSelectedProductModal(item)}
                  className="relative aspect-square overflow-hidden bg-cream-200 cursor-pointer"
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Age & Video Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-forest-900/90 backdrop-blur-md text-cream-100 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                      {item.ageYears ? `${item.ageYears} Yr Old` : '< 2 Yrs'}
                    </span>
                    {item.videoUrl && (
                      <span className="bg-terracotta-500/90 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Video className="w-3 h-3" /> Video Preview
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
                      isLiked ? 'bg-terracotta-500 text-white' : 'bg-white/80 text-forest-900 hover:text-terracotta-500'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start text-xs text-forest-900/60 font-semibold">
                      <span className="text-terracotta-500 font-bold">{item.brand || 'FabIndia'}</span>
                      <span className="bg-cream-200 px-2 py-0.5 rounded-md text-[10px] font-bold">{item.size}</span>
                    </div>

                    <h3 
                      onClick={() => setSelectedProductModal(item)}
                      className="font-poppins font-bold text-sm text-forest-900 group-hover:text-terracotta-500 transition-colors line-clamp-1 cursor-pointer mt-1"
                    >
                      {item.title}
                    </h3>

                    {/* Hygiene & AI Recommended Price Tag */}
                    <div className="flex items-center justify-between gap-1 mt-1 text-[10px] font-medium">
                      <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-current" /> {item.hygieneRating || 5}/5 Hygiene
                      </span>
                      
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-900 font-bold rounded-full text-[10px]">
                        <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                        <span>AI Fair: ₹{aiEst.recommendedPrice}</span>
                      </span>
                    </div>
                  </div>

                  {/* Seller & Price & Bargain Trigger */}
                  <div className="pt-2 border-t border-forest-700/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-forest-900/60 font-semibold block uppercase">Expected</span>
                      <div className="font-poppins font-extrabold text-base text-forest-900">
                        ₹{item.price.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedProductModal(item)}
                        className="px-2.5 py-1.5 bg-cream-200 hover:bg-cream-300 text-forest-900 text-[11px] font-bold rounded-xl transition-all border border-forest-700/15 flex items-center gap-1"
                        title="Bargain / Make Offer"
                      >
                        <Tag className="w-3 h-3 text-terracotta-500" />
                        <span>Offer</span>
                      </button>

                      <button
                        onClick={() => {
                          if (!currentUser) setIsAuthModalOpen(true);
                          else addToCart(item);
                        }}
                        className="p-2 bg-forest-900 hover:bg-forest-800 text-cream-100 rounded-xl transition-colors shadow-sm"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4 h-4 text-warmgold-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-forest-700/15 space-y-3">
          <div className="w-12 h-12 rounded-full bg-cream-200 text-forest-900 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6 text-forest-900/50" />
          </div>
          <h3 className="font-poppins font-bold text-lg text-forest-900">No Clothing Found</h3>
          <p className="text-xs text-forest-900/60">
            Try adjusting your search query or filters to find available pre-loved fashion.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedCondition('All');
            }}
            className="px-4 py-2 bg-forest-900 text-cream-100 text-xs font-semibold rounded-full hover:bg-forest-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

