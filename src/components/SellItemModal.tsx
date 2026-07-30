import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCategory, ItemCondition } from '../types';
import { X, PlusCircle, CheckCircle2, Sparkles, Video, AlertTriangle, ShieldCheck } from 'lucide-react';

export const SellItemModal: React.FC = () => {
  const { isSellModalOpen, setIsSellModalOpen, createListing, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Ethnic & Sarees');
  const [condition, setCondition] = useState<ItemCondition>('wearable_like_new');
  const [size, setSize] = useState('M');
  const [brand, setBrand] = useState('');
  const [ageYears, setAgeYears] = useState<number | ''>(1.0);
  const [wornTimesPerYear, setWornTimesPerYear] = useState<number | ''>(2);
  const [isColorFaded, setIsColorFaded] = useState(false);
  const [hasStainsOrDefects, setHasStainsOrDefects] = useState(false);
  const [hygieneRating, setHygieneRating] = useState(5);
  const [middlemanVerified, setMiddlemanVerified] = useState(true);
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isSellModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || !price || !brand.trim()) {
      setErrorMessage('Please fill in all mandatory fields (Title, Brand, Price).');
      return;
    }

    if (!ageYears || Number(ageYears) > 3) {
      setErrorMessage('VastraChakra policy strictly disallows clothes older than 3 years for Tier 1 reselling.');
      return;
    }

    if (!videoUrl.trim()) {
      setErrorMessage('A short video preview URL is mandatory for seller transparency.');
      return;
    }

    if (!imageUrl.trim()) {
      setErrorMessage('A photo image URL of your garment is required.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('You must accept VastraChakra Terms & Conditions regarding authenticity and dispute policies.');
      return;
    }

    const res = createListing({
      title: title.trim(),
      category,
      condition,
      size: size.trim() || 'M',
      brand: brand.trim(),
      ageYears: Number(ageYears),
      wornTimesPerYear: wornTimesPerYear ? Number(wornTimesPerYear) : 2,
      isColorFaded,
      hasStainsOrDefects,
      hygieneRating,
      videoUrl: videoUrl.trim(),
      middlemanVerified,
      termsAccepted: true,
      description: description.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      images: [imageUrl.trim()],
      tier: 1
    });

    if (res.success) {
      setIsSellModalOpen(false);
      alert('Listing submitted successfully! It is now under review by Admin for video & quality verification.');
    } else {
      setErrorMessage(res.message || 'Failed to submit listing.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FDFBF7] border border-forest-700/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-forest-700/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="h-11 w-11 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-all flex items-center justify-center shrink-0">
                <img src="/logo-emblem.jpg" alt="VastraChakra Circular Emblem" className="h-full w-full object-cover rounded-full" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-1.5 bg-forest-900/15 rounded-full blur-xs pointer-events-none"></div>
            </div>
            <div>
              <h2 className="font-poppins font-bold text-xl text-forest-900 flex items-center gap-1.5">
                <span>Tier 1 Reselling Screening Form</span>
                <img src="/chakra-icon.png" alt="Chakra" className="w-4 h-4 object-contain" />
              </h2>
              <p className="text-xs text-forest-900/60 font-medium">Strict quality control for premium pre-loved fashion (under 3 yrs old)</p>
            </div>
          </div>

          <button
            onClick={() => setIsSellModalOpen(false)}
            className="p-1.5 hover:bg-forest-900/10 text-forest-900 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Policy Guidelines Box */}
        <div className="p-3.5 bg-forest-50 border border-forest-700/15 rounded-2xl text-xs space-y-1 text-forest-900">
          <div className="font-bold flex items-center gap-1 text-forest-900">
            <ShieldCheck className="w-4 h-4 text-forest-700" />
            <span>Tier 1 Reselling Quality Criteria:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-forest-900/80 pl-1 text-[11px]">
            <li><strong>Selective Categories:</strong> Jeans, Sarees, Tops, Dresses, Jackets, Gowns & Kurtis only.</li>
            <li><strong>Age Rule:</strong> Must be 3 years old or less (Purchased &ge; 2023).</li>
            <li><strong>Brands:</strong> Recognized premium or well-known brands only (FabIndia, Levi's, Zara, Biba, H&M, etc.).</li>
            <li><strong>Video Transparency:</strong> Mandatory short video upload showing garment fit & condition.</li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          
          {/* Title & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-forest-900 mb-1">Item Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. FabIndia Handloom Silk Saree"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-forest-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-forest-900 mb-1">Brand Name (Premium / Well-known) *</label>
              <input
                type="text"
                required
                placeholder="e.g. FabIndia, Levi's, Zara, Biba, Raw Mango"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-forest-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/20"
              />
            </div>
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-forest-900 mb-1">Allowed Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2.5 bg-white border border-forest-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/20 font-medium text-xs"
              >
                <option value="Ethnic & Sarees">Ethnic & Sarees</option>
                <option value="Jeans & Bottoms">Jeans & Bottoms</option>
                <option value="Tops & Shirts">Tops & Shirts</option>
                <option value="Dresses & Gowns">Dresses & Gowns</option>
                <option value="Jackets & Outerwear">Jackets & Outerwear</option>
                <option value="Kurtis">Kurtis</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-forest-900 mb-1">Garment Size *</label>
              <input
                type="text"
                required
                placeholder="e.g. S, M, L, 32, Free Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-forest-700/20 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Age & Usage Screening */}
          <div className="p-4 bg-cream-200/50 rounded-2xl border border-forest-700/10 space-y-3">
            <span className="font-bold text-forest-900 block text-xs uppercase tracking-wider">
              Quality & Usage Screening Checkpoints
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-forest-900 mb-1">
                  Age of Garment (Years) * <span className="text-terracotta-500">(Max 3 Yrs)</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  max="3"
                  required
                  placeholder="e.g. 1.0"
                  value={ageYears}
                  onChange={(e) => setAgeYears(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl focus:outline-none font-bold text-forest-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-forest-900 mb-1">Times Worn Per Year *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2"
                  value={wornTimesPerYear}
                  onChange={(e) => setWornTimesPerYear(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl focus:outline-none font-bold"
                />
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isColorFaded}
                  onChange={(e) => setIsColorFaded(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-700 focus:ring-forest-700"
                />
                <span className="text-forest-900 font-medium">Color is faded</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasStainsOrDefects}
                  onChange={(e) => setHasStainsOrDefects(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-700 focus:ring-forest-700"
                />
                <span className="text-forest-900 font-medium">Has minor stains/defects</span>
              </label>
            </div>

            {/* Hygiene Rating */}
            <div>
              <label className="block font-semibold text-forest-900 mb-1">Cleanliness & Hygiene Score (1 to 5) *</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(score => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setHygieneRating(score)}
                    className={`w-9 h-9 rounded-xl font-bold transition-all text-xs ${
                      hygieneRating === score
                        ? 'bg-forest-900 text-cream-100 ring-2 ring-forest-700'
                        : 'bg-white text-forest-900 border border-forest-700/20'
                    }`}
                  >
                    {score}★
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mandatory Short Video Preview */}
          <div className="p-4 bg-terracotta-500/5 rounded-2xl border border-terracotta-500/20 space-y-2">
            <label className="font-bold text-forest-900 flex items-center gap-1.5 text-xs">
              <Video className="w-4 h-4 text-terracotta-500" />
              <span>Mandatory Short Video Preview URL *</span>
            </label>
            <p className="text-[11px] text-forest-900/70">
              Upload or link a short video clip showing full garment fit and fabric transparency for buyer trust.
            </p>
            <input
              type="url"
              required
              placeholder="Paste video MP4/link URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-forest-700/20 rounded-xl focus:outline-none text-xs font-mono"
            />
          </div>

          {/* Image & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-forest-900 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min="100"
                placeholder="e.g. 1800"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2.5 bg-white border border-forest-700/20 rounded-xl focus:outline-none font-bold text-forest-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-forest-900 mb-1">Original MRP (₹)</label>
              <input
                type="number"
                placeholder="e.g. 4500"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2.5 bg-white border border-forest-700/20 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Photo Image URL */}
          <div>
            <label className="block font-semibold text-forest-900 mb-1">Garment Photo Image URL *</label>
            <input
              type="url"
              required
              placeholder="Paste high-res image URL of the garment"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-forest-700/20 rounded-xl focus:outline-none text-xs font-mono"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-forest-900 mb-1">Item Description</label>
            <textarea
              rows={2}
              placeholder="Describe weave, fabric quality, fit, or why you are selling..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl focus:outline-none text-xs"
            ></textarea>
          </div>

          {/* Collaborator Badge & T&C */}
          <div className="space-y-2 pt-2 border-t border-forest-700/10">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={middlemanVerified}
                onChange={(e) => setMiddlemanVerified(e.target.checked)}
                className="w-4 h-4 rounded text-forest-700 focus:ring-forest-700"
              />
              <span className="text-xs text-forest-900 font-semibold">
                Verified Collaborator / Reseller Inspection Option Enabled
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 rounded text-terracotta-500 focus:ring-terracotta-500 mt-0.5"
              />
              <span className="text-[11px] text-forest-900/80">
                I accept VastraChakra's Terms & Conditions regarding authentic listings, non-misleading information, and anti-fraud policies. *
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-poppins font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <img src="/chakra-icon.png" alt="Chakra" className="w-4 h-4 object-contain inline" />
              <span>Submit Listing For Admin Review</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};


