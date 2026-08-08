import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { calculateAiRecommendedPrice } from '../utils/aiPriceCalculator';
import { X, Heart, ShoppingBag, ShieldCheck, Star, Sparkles, Leaf, CheckCircle2 } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductModal, setSelectedProductModal, addToCart, wishlist, toggleWishlist, currentUser, setIsAuthModalOpen } = useApp();
  const { showToast } = useToast();
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!selectedProductModal) return null;

  const item = selectedProductModal;
  const isLiked = wishlist.includes(item.id);
  const aiEst = calculateAiRecommendedPrice(item);
  const platformFee = Math.round(item.price * 0.05);
  const totalPrice = item.price + platformFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cream-100 border border-cream-300 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductModal(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-forest-900 rounded-full shadow transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Preview Gallery */}
        <div className="md:w-1/2 bg-cream-200 p-6 flex flex-col justify-between space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-inner">
            <img
              src={item.images[activeImgIndex] || item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => {
                toggleWishlist(item.id);
                showToast(
                  isLiked ? 'Removed from Wishlist' : 'Added to Wishlist',
                  isLiked ? `${item.title} removed from your wishlist.` : `${item.title} saved to your wishlist.`,
                  'info'
                );
              }}
              className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all ${
                isLiked ? 'bg-terracotta-500 text-white' : 'bg-white/80 text-forest-900'
              }`}
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Thumbnails */}
          {item.images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImgIndex === idx ? 'border-forest-700 ring-2 ring-forest-700/30' : 'border-cream-300 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-forest-700/10 text-forest-700 text-xs font-bold uppercase tracking-wider">
                {item.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-warmgold-500/20 text-warmgold-600 text-xs font-bold uppercase tracking-wider">
                {item.condition === 'wearable_like_new' ? 'Like New' : 'Gently Used'}
              </span>
            </div>

            <div>
              <h2 className="font-poppins font-bold text-xl sm:text-2xl text-forest-900">
                {item.title}
              </h2>
              <div className="text-xs text-forest-900/60 font-medium mt-1 flex items-center gap-3">
                <span>Size: <strong className="text-forest-900">{item.size}</strong></span>
                <span>•</span>
                <span>Category: <strong className="text-forest-900">{item.category}</strong></span>
              </div>
            </div>

            {/* Expected Selling Price & Platform Fee Breakdown */}
            <div className="p-4 bg-white rounded-2xl border border-cream-300 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-forest-900/70">Seller Asking Price:</span>
                <span className="font-poppins font-bold text-lg text-forest-900">₹{item.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline text-xs text-forest-900/60">
                <span>VastraChakra Platform & Curation Fee (5%):</span>
                <span>+ ₹{platformFee.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-cream-200 flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-wider font-bold text-forest-900">Total Payable:</span>
                <span className="font-poppins font-bold text-2xl text-terracotta-600">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Description & Specs Box */}
            <div className="p-4 bg-white rounded-2xl border border-cream-300 space-y-2">
              <span className="font-bold text-xs text-forest-900 uppercase tracking-wider block">Product Description & Specs</span>
              <p className="text-xs sm:text-sm text-forest-900/80 leading-relaxed font-sans">
                {item.description || 'Pre-loved garment in excellent condition, inspected for quality & cleanliness.'}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] border-t border-cream-200 text-forest-900/70">
                <div>Age: <strong className="text-forest-900">{item.ageYears || 1} Year(s)</strong></div>
                <div>Worn/Yr: <strong className="text-forest-900">{item.wornTimesPerYear || 2} Times</strong></div>
                <div>Color Faded: <strong className="text-forest-900">{item.isColorFaded ? 'Yes' : 'No'}</strong></div>
                <div>Defects: <strong className="text-forest-900">{item.hasStainsOrDefects ? 'Yes' : 'None'}</strong></div>
              </div>
            </div>

            {/* Environmental Impact Note */}
            <div className="bg-forest-50 p-3.5 rounded-2xl border border-forest-700/10 flex items-center gap-3 text-xs text-forest-900">
              <Leaf className="w-5 h-5 text-earthteal-500 shrink-0" />
              <div>
                <span className="font-bold text-earthteal-600">Eco Impact:</span> Buying this pre-loved item saves approx <strong className="text-forest-900">2,700 liters of water</strong> and prevents landfill waste.
              </div>
            </div>

            {/* Seller Info Card */}
            <div className="bg-white p-3.5 rounded-2xl border border-cream-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={item.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={item.ownerName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-forest-900">{item.ownerName}</div>
                  <div className="text-[10px] text-forest-900/60 flex items-center gap-1">
                    <Star className="w-3 h-3 text-warmgold-500 fill-current" />
                    <span>{item.ownerRating} Rating • Verified Seller</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] bg-cream-200 px-2.5 py-1 rounded-full text-forest-900/70 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-earthteal-500" />
                <span>Buyer Protected</span>
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-cream-300">
            <button
              onClick={() => {
                addToCart(item);
                showToast('Added to Cart', `${item.title} has been added to your shopping bag.`, 'success');
                setSelectedProductModal(null);
              }}
              className="w-full py-3.5 rounded-full bg-forest-900 hover:bg-forest-800 text-cream-100 font-poppins font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-warmgold-400" />
              <span>Add to Cart & Checkout (₹{totalPrice.toLocaleString()})</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

