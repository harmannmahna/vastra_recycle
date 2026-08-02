import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateAiRecommendedPrice } from '../utils/aiPriceCalculator';
import { X, Heart, ShoppingBag, ShieldCheck, Star, Sparkles, Leaf, Tag, Send, AlertCircle } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductModal, setSelectedProductModal, addToCart, wishlist, toggleWishlist, makeOffer, currentUser, setIsAuthModalOpen } = useApp();
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Bargain / Offer State
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number | ''>('');
  const [offerStatusMsg, setOfferStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!selectedProductModal) return null;

  const item = selectedProductModal;
  const isLiked = wishlist.includes(item.id);
  const aiEst = calculateAiRecommendedPrice(item);

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setOfferStatusMsg(null);

    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!offerAmount || Number(offerAmount) <= 0) {
      setOfferStatusMsg({ type: 'error', text: 'Please enter a valid offer amount.' });
      return;
    }

    const res = makeOffer(item, Number(offerAmount));
    if (res.success) {
      setOfferStatusMsg({ type: 'success', text: res.message || 'Offer submitted to seller!' });
      setTimeout(() => {
        setShowOfferForm(false);
        setOfferStatusMsg(null);
      }, 1800);
    } else {
      setOfferStatusMsg({ type: 'error', text: res.message || 'Failed to submit offer.' });
    }
  };

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
              onClick={() => toggleWishlist(item.id)}
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
                <span>Brand: <strong className="text-forest-900">{item.brand || 'Handmade'}</strong></span>
                <span>•</span>
                <span>Size: <strong className="text-forest-900">{item.size}</strong></span>
              </div>
            </div>

            {/* Expected Selling Price Tag */}
            <div className="flex items-baseline gap-3 pt-2 border-t border-cream-300">
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider font-bold text-forest-900/60 block">Expected Selling Price</span>
                <span className="font-poppins font-bold text-3xl text-forest-900">
                  ₹{item.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* AI Recommended Price Badge (Disha's Feature Request) */}
            <div className="p-3 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-2xl border border-purple-200/60 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                  <span>AI Recommended Fair Price:</span>
                </span>
                <span className="text-sm font-extrabold text-purple-800">
                  ₹{aiEst.recommendedPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-purple-900/70 font-medium leading-snug">
                {aiEst.reasoning} Fair negotiation window: ₹{aiEst.minFairPrice.toLocaleString()} – ₹{aiEst.maxFairPrice.toLocaleString()}.
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-forest-900/80 leading-relaxed">
              {item.description}
            </p>

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

            {/* Interactive Bargaining Offer Form */}
            {showOfferForm && (
              <form onSubmit={handleSendOffer} className="p-4 bg-white rounded-2xl border border-terracotta-500/30 space-y-3 animate-fadeIn">
                <div className="flex justify-between items-center text-xs font-bold text-forest-900">
                  <span className="flex items-center gap-1.5 text-terracotta-600">
                    <Tag className="w-4 h-4" /> Send Price Offer to {item.ownerName}
                  </span>
                  <button type="button" onClick={() => setShowOfferForm(false)} className="text-forest-900/50 hover:text-forest-900">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {offerStatusMsg && (
                  <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                    offerStatusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{offerStatusMsg.text}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-[11px] text-forest-900/70 font-medium">Your Offered Price (₹)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      required
                      min="100"
                      max={item.price}
                      placeholder={`e.g. ${aiEst.recommendedPrice}`}
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value ? Number(e.target.value) : '')}
                      className="flex-1 px-3 py-2 bg-cream-100 border border-forest-700/20 rounded-xl focus:outline-none font-bold text-forest-900 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setOfferAmount(aiEst.recommendedPrice)}
                      className="px-2.5 py-2 bg-purple-100 text-purple-800 text-[11px] font-bold rounded-xl hover:bg-purple-200 whitespace-nowrap"
                    >
                      Use AI Price (₹{aiEst.recommendedPrice})
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-poppins font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Bargain Offer</span>
                </button>
              </form>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-cream-300 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                } else {
                  setShowOfferForm(!showOfferForm);
                  setOfferAmount(aiEst.recommendedPrice);
                }
              }}
              className="flex-1 py-3.5 rounded-full bg-cream-200 hover:bg-cream-300 text-forest-900 border border-forest-700/20 font-poppins font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Tag className="w-4 h-4 text-terracotta-500" />
              <span>Make an Offer / Bargain</span>
            </button>

            <button
              onClick={() => {
                addToCart(item);
                setSelectedProductModal(null);
              }}
              className="flex-1 py-3.5 rounded-full bg-forest-900 hover:bg-forest-800 text-cream-100 font-poppins font-semibold text-xs transition-all shadow flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-warmgold-400" />
              <span>Buy at Asking Price (₹{item.price})</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

