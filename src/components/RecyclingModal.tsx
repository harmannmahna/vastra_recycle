import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PickupType } from '../types';
import { X, Recycle as Recycling, Calendar, MapPin, Scale, HeartHandshake, DollarSign, Camera, AlertCircle, CheckCircle2, PackageCheck } from 'lucide-react';

export const RecyclingModal: React.FC = () => {
  const { isRecycleModalOpen, setIsRecycleModalOpen, createPickupRequest, currentUser } = useApp();

  const [clothingTypes, setClothingTypes] = useState('');
  const [estimatedWeightKg, setEstimatedWeightKg] = useState<number>(5.0);
  const [clothingCount, setClothingCount] = useState<number>(10);
  const [packedBagImageUrl, setPackedBagImageUrl] = useState('');
  const [pickupType, setPickupType] = useState<PickupType>('sell_by_weight');
  const [address, setAddress] = useState(currentUser?.address?.line1 ? `${currentUser.address.line1}, ${currentUser.address.city} ${currentUser.address.pincode}` : '');
  const [scheduledDate, setScheduledDate] = useState('2026-08-02');
  const [scheduledSlot, setScheduledSlot] = useState('10:00 AM - 01:00 PM');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isRecycleModalOpen) return null;

  const estimatedPayout = Math.round(estimatedWeightKg * 15); // ₹15/kg

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!clothingTypes.trim()) {
      setErrorMessage('Please specify the type of clothing or fabric scraps being recycled.');
      return;
    }

    if (!estimatedWeightKg || estimatedWeightKg <= 0) {
      setErrorMessage('Please specify a valid estimated weight in kg.');
      return;
    }

    if (!packedBagImageUrl.trim()) {
      setErrorMessage('A photo URL of your completely packed and sealed bag/box is mandatory prior to scheduling pickup.');
      return;
    }

    if (!address.trim()) {
      setErrorMessage('Doorstep pickup address in Delhi NCR is required.');
      return;
    }

    const res = createPickupRequest({
      clothingCount: clothingCount || 10,
      estimatedWeightKg,
      clothingTypes,
      packedBagImageUrl,
      pickupType,
      fullAddress: address,
      scheduledDate,
      scheduledSlot,
      notes: notes || undefined
    });

    if (res.success) {
      setIsRecycleModalOpen(false);
      alert('Recycling Pickup Requested! Your pickup agent will verify the sealed bag/box upon arrival.');
    } else {
      setErrorMessage(res.message || 'Failed to schedule pickup.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FDFBF7] border border-forest-700/15 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
        
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
                <span>Textile Recycling Pickup Request</span>
                <img src="/chakra-icon.png" alt="Chakra" className="w-4 h-4 object-contain" />
              </h2>
              <p className="text-xs text-forest-900/60 font-medium">Textile Waste Collection & Weight Processing (Delhi NCR)</p>
            </div>
          </div>

          <button
            onClick={() => setIsRecycleModalOpen(false)}
            className="p-1.5 hover:bg-forest-900/10 text-forest-900 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Packaging Rule Banner */}
        <div className="p-3.5 bg-earthteal-50 border border-earthteal-500/20 rounded-2xl text-xs space-y-1 text-earthteal-900">
          <div className="font-bold flex items-center gap-1.5 text-earthteal-800">
            <PackageCheck className="w-4 h-4 text-earthteal-600" />
            <span>Mandatory Packing Requirement:</span>
          </div>
          <p className="text-[11px] text-earthteal-900/80">
            All clothes must be completely washed, folded, and securely sealed inside a bag or box before scheduling the pickup. You must provide a photo URL of your sealed parcel below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          
          {/* Clothing Type */}
          <div>
            <label className="block font-semibold text-forest-900 mb-1">Type of Clothing / Fabrics *</label>
            <input
              type="text"
              required
              placeholder="e.g. Worn t-shirts, cotton kurtas, torn denim scraps, old bedsheets"
              value={clothingTypes}
              onChange={(e) => setClothingTypes(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-forest-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/20"
            />
          </div>

          {/* Weight in KG */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-forest-900 mb-1 flex items-center gap-1">
                <Scale className="w-4 h-4 text-earthteal-600" />
                <span>Estimated Weight (kg) *</span>
              </label>
              <select
                value={estimatedWeightKg}
                onChange={(e) => setEstimatedWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-white border border-forest-700/20 rounded-xl focus:outline-none font-bold text-forest-900"
              >
                <option value={3.0}>3.0 kg (Small Bag)</option>
                <option value={5.0}>5.0 kg (Medium Box)</option>
                <option value={8.0}>8.0 kg (Large Bag)</option>
                <option value={12.0}>12.0 kg (Heavy Box)</option>
                <option value={20.0}>20.0+ kg (Bulk Industrial Parcel)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-forest-900 mb-1">Approx Garment Count</label>
              <input
                type="number"
                placeholder="e.g. 15 items"
                value={clothingCount}
                onChange={(e) => setClothingCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-white border border-forest-700/20 rounded-xl focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Mandatory Packed Bag Photo Upload */}
          <div className="p-4 bg-white rounded-2xl border border-forest-700/15 space-y-2">
            <label className="font-bold text-forest-900 flex items-center gap-1.5 text-xs">
              <Camera className="w-4 h-4 text-earthteal-600" />
              <span>Mandatory Photo URL of Sealed Box/Bag *</span>
            </label>
            <p className="text-[11px] text-forest-900/70">
              Provide an image link showing your clothes fully packed and ready for dispatch.
            </p>
            <input
              type="url"
              required
              placeholder="Paste image URL of your packed & sealed box/bag"
              value={packedBagImageUrl}
              onChange={(e) => setPackedBagImageUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-forest-700/20 rounded-xl focus:outline-none text-xs font-mono"
            />
          </div>

          {/* Recycling Option Choice */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPickupType('sell_by_weight')}
              className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                pickupType === 'sell_by_weight'
                  ? 'bg-earthteal-50 border-earthteal-500 ring-2 ring-earthteal-500/20'
                  : 'bg-white border-forest-700/15 opacity-70'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-earthteal-600 text-white shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-forest-900">Sell by Weight</div>
                <div className="text-[11px] text-forest-900/70">
                  ₹15/kg (Est. payout ₹{estimatedPayout})
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPickupType('donation')}
              className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                pickupType === 'donation'
                  ? 'bg-warmgold-50 border-warmgold-500 ring-2 ring-warmgold-500/20'
                  : 'bg-white border-forest-700/15 opacity-70'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-warmgold-500 text-forest-900 shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-forest-900">Pure Donation</div>
                <div className="text-[11px] text-forest-900/70">
                  Support Delhi NCR NGO partners
                </div>
              </div>
            </button>
          </div>

          {/* Doorstep Pickup Address */}
          <div>
            <label className="block font-semibold text-forest-900 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-earthteal-500" />
              <span>Doorstep Pickup Address (Delhi NCR Only) *</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. C-14, Hauz Khas Enclave, New Delhi 110016"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-forest-700/20 rounded-xl focus:outline-none"
            />
          </div>

          {/* Date & Slot */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-forest-900 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-earthteal-500" />
                <span>Preferred Date *</span>
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-forest-700/20 rounded-xl focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-forest-900 mb-1">Time Slot *</label>
              <select
                value={scheduledSlot}
                onChange={(e) => setScheduledSlot(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-forest-700/20 rounded-xl focus:outline-none font-medium"
              >
                <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM</option>
                <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM</option>
                <option value="05:00 PM - 08:00 PM">05:00 PM - 08:00 PM</option>
              </select>
            </div>
          </div>

          {/* Pickup Notes */}
          <div>
            <label className="block font-semibold text-forest-900 mb-1">Packaging & Location Notes</label>
            <input
              type="text"
              placeholder="e.g. Leave with security guard, or call before arrival"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl focus:outline-none text-xs"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-earthteal-600 hover:bg-earthteal-700 text-white font-poppins font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Book Recycling Pickup</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};


