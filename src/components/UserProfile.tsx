import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Package, Recycle as Recycling, ShoppingBag, MapPin, Wallet, Star, ShieldCheck, CheckCircle2, Clock, Edit2, Camera, X, Check, Tag, Sparkles, Send, AlertTriangle } from 'lucide-react';
import { getUserAvatar, getDefaultAvatar } from '../utils/avatarUtils';

export const UserProfile: React.FC = () => {
  const { 
    currentUser, items, pickups, orders, offers, 
    updateUserProfile, acceptOffer, rejectOffer, counterOffer, buyAtNegotiatedPrice, submitOrderFeedback 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'offers' | 'orders' | 'recycling'>('listings');

  // Profile Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGender, setEditGender] = useState<'female' | 'male' | 'other'>('female');
  const [editAvatar, setEditAvatar] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Feedback Modal State
  const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('Excellent quality pre-loved garment! Received as described.');

  // Counter Offer UI State
  const [counteringOfferId, setCounteringOfferId] = useState<string | null>(null);
  const [counterVal, setCounterVal] = useState<number | ''>('');

  if (!currentUser) return null;

  const myItems = items.filter(i => i.ownerId === currentUser.id);
  const myPickups = pickups.filter(p => p.userId === currentUser.id);
  const myOrders = orders.filter(o => o.buyerId === currentUser.id);

  // Offers received as Seller
  const receivedOffers = offers.filter(o => o.sellerId === currentUser.id);
  // Offers sent as Buyer
  const sentOffers = offers.filter(o => o.buyerId === currentUser.id);

  const openEditModal = () => {
    setEditName(currentUser.name || '');
    setEditPhone(currentUser.phone || '');
    setEditGender(currentUser.gender || 'female');
    setEditAvatar(currentUser.avatar || '');
    setSaveSuccessMsg('');
    setIsEditing(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      gender: editGender,
      avatar: editAvatar.trim() || undefined
    });
    setSaveSuccessMsg('Profile updated successfully!');
    setTimeout(() => {
      setIsEditing(false);
      setSaveSuccessMsg('');
    }, 1000);
  };

  const handleAcceptOffer = (id: string) => {
    acceptOffer(id);
    alert('Offer accepted! The buyer can now proceed to checkout at your agreed price.');
  };

  const handleRejectOffer = (id: string) => {
    rejectOffer(id);
  };

  const handleSendCounter = (id: string) => {
    if (!counterVal || Number(counterVal) <= 0) return;
    counterOffer(id, Number(counterVal));
    setCounteringOfferId(null);
    setCounterVal('');
    alert(`Counter offer of ₹${Number(counterVal).toLocaleString()} sent to buyer!`);
  };

  const handleBuyNegotiated = (offerId: string) => {
    const defaultAddr = currentUser.address || {
      id: 'addr_temp',
      userId: currentUser.id,
      line1: 'C-14, Hauz Khas Enclave',
      city: 'New Delhi',
      state: 'Delhi NCR',
      pincode: '110016',
      isDefault: true
    };
    const res = buyAtNegotiatedPrice(offerId, 'upi', defaultAddr);
    if (res.success) {
      alert('Order placed successfully at negotiated price!');
      setActiveTab('orders');
    } else {
      alert(res.message || 'Failed to complete transaction.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative group">
            <img
              src={getUserAvatar(currentUser)}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-forest-700/20 shadow-md"
            />
            <button
              onClick={openEditModal}
              className="absolute bottom-0 right-0 p-1.5 bg-forest-900 text-white rounded-full shadow-md hover:bg-forest-800 transition-colors"
              title="Edit Profile Photograph"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-poppins font-bold text-2xl text-forest-900">{currentUser.name}</h1>
              <span className="bg-forest-700/10 text-forest-700 text-xs px-3 py-0.5 rounded-full font-bold capitalize">
                {currentUser.role.replace('_', ' ')}
              </span>
              {currentUser.gender && (
                <span className="bg-cream-200 text-forest-900/70 text-xs px-2.5 py-0.5 rounded-full font-medium capitalize">
                  {currentUser.gender === 'other' ? 'Third Gender' : currentUser.gender}
                </span>
              )}
            </div>
            
            <p className="text-xs text-forest-900/60 mt-1 font-mono">
              {currentUser.email} {currentUser.phone ? `• +91 ${currentUser.phone}` : ''}
            </p>

            <div className="flex items-center gap-4 text-xs mt-2.5 font-medium text-forest-900/70">
              <span className="flex items-center gap-1 text-warmgold-600">
                <Star className="w-3.5 h-3.5 fill-current" /> {currentUser.rating} ({currentUser.ratingCount} Reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-earthteal-600">
                <ShieldCheck className="w-3.5 h-3.5" /> Eco Member
              </span>

              <button
                onClick={openEditModal}
                className="ml-2 inline-flex items-center gap-1 text-terracotta-600 hover:text-terracotta-700 font-bold hover:underline"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-cream-200 p-4 rounded-2xl border border-cream-300 text-right space-y-1 self-stretch md:self-auto flex flex-col justify-center">
          <div className="text-xs text-forest-900/60 font-medium flex items-center justify-end gap-1">
            <Wallet className="w-4 h-4 text-forest-700" />
            <span>Seller Wallet Balance</span>
          </div>
          <div className="font-poppins font-bold text-2xl text-forest-900">
            ₹{currentUser.walletBalance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#FDFBF7] border border-forest-700/15 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-forest-700/10 pb-3">
              <h2 className="font-poppins font-bold text-lg text-forest-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-terracotta-500" />
                <span>Edit Profile & Photograph</span>
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 hover:bg-forest-900/10 text-forest-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
              {/* Avatar section */}
              <div>
                <label className="block font-semibold text-forest-900 mb-1.5">Profile Photograph</label>
                <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-forest-700/20">
                  <img
                    src={editAvatar || getDefaultAvatar(editGender)}
                    alt="Profile Preview"
                    className="w-14 h-14 rounded-full object-cover border border-forest-700/20 shrink-0 shadow-xs"
                  />
                  <div className="flex-1 space-y-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 text-xs font-semibold border border-forest-700/20 transition-colors">
                      <Camera className="w-3.5 h-3.5 text-forest-700" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {editAvatar && (
                      <button
                        type="button"
                        onClick={() => setEditAvatar('')}
                        className="block text-[11px] text-red-600 hover:underline"
                      >
                        Reset to default SVG avatar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block font-semibold text-forest-900 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block font-semibold text-forest-900 mb-1">Mobile Phone Number (10 Digits)</label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/20 font-mono"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block font-semibold text-forest-900 mb-1">Gender</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditGender('female')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border text-center ${
                      editGender === 'female'
                        ? 'bg-terracotta-500 text-white border-terracotta-600 shadow-xs'
                        : 'bg-white text-forest-900/70 border-forest-700/20 hover:border-forest-700/40'
                    }`}
                  >
                    Female
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditGender('male')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border text-center ${
                      editGender === 'male'
                        ? 'bg-forest-800 text-white border-forest-900 shadow-xs'
                        : 'bg-white text-forest-900/70 border-forest-700/20 hover:border-forest-700/40'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditGender('other')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border text-center ${
                      editGender === 'other'
                        ? 'bg-earthteal-600 text-white border-earthteal-700 shadow-xs'
                        : 'bg-white text-forest-900/70 border-forest-700/20 hover:border-forest-700/40'
                    }`}
                  >
                    Third Gender
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-forest-700/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-forest-900/70 hover:bg-forest-900/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-forest-900 text-cream-100 hover:bg-forest-800 flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-cream-300 gap-6 text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'listings' ? 'border-forest-900 text-forest-900 font-bold' : 'border-transparent text-forest-900/60'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-terracotta-500" />
          <span>My Listings ({myItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'offers' ? 'border-forest-900 text-forest-900 font-bold' : 'border-transparent text-forest-900/60'
          }`}
        >
          <Tag className="w-4 h-4 text-purple-600" />
          <span>Offers & Bargains ({receivedOffers.length + sentOffers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders' ? 'border-forest-900 text-forest-900 font-bold' : 'border-transparent text-forest-900/60'
          }`}
        >
          <Package className="w-4 h-4 text-earthteal-600" />
          <span>My Purchases ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recycling')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'recycling' ? 'border-forest-900 text-forest-900 font-bold' : 'border-transparent text-forest-900/60'
          }`}
        >
          <Recycling className="w-4 h-4 text-forest-700" />
          <span>Recycling Requests ({myPickups.length})</span>
        </button>
      </div>

      {/* Tab Content 1: My Listings with Pending Verification Badge */}
      {activeTab === 'listings' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myItems.length > 0 ? (
            myItems.map(item => {
              const isPending = item.status === 'under_review' || item.status === 'submitted';
              const isLive = item.status === 'listed';
              const isRejected = item.status === 'rejected';

              return (
                <div key={item.id} className="bg-white p-5 rounded-3xl border border-cream-300 flex flex-col justify-between space-y-3 shadow-sm">
                  <div className="flex gap-4">
                    <img src={item.images[0]} alt={item.title} className="w-20 h-20 rounded-2xl object-cover bg-cream-200 shrink-0" />
                    <div className="flex-1 space-y-1">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        isLive 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : isPending 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {isLive ? 'LIVE MARKETPLACE' : isPending ? 'PENDING ADMIN APPROVAL' : 'REJECTED'}
                      </span>
                      <h3 className="font-bold text-sm text-forest-900 line-clamp-1">{item.title}</h3>
                      <div className="font-poppins font-extrabold text-base text-forest-900">₹{item.price}</div>
                    </div>
                  </div>

                  {/* Status Explanation Note */}
                  <div className="p-2.5 bg-cream-100 rounded-2xl text-[11px] text-forest-900/70 border border-cream-300 font-medium">
                    {isPending ? (
                      <span className="flex items-center gap-1.5 text-amber-800 font-bold">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>Pending Admin Verification: Quality & video preview under review before going live.</span>
                      </span>
                    ) : isLive ? (
                      <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Verified & Live on Marketplace</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-red-800 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Listing rejected: Quality criteria or video clip requirement not met.</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white p-8 rounded-3xl text-center border border-cream-300 text-xs text-forest-900/60">
              You haven't listed any clothing items for sale yet.
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Offers & Bargains (Disha's Feature Request) */}
      {activeTab === 'offers' && (
        <div className="space-y-8">
          {/* Section A: Offers Received on My Listings (As Seller) */}
          <div className="space-y-4">
            <h2 className="font-poppins font-bold text-lg text-forest-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-terracotta-500" />
              <span>Offers Received on Your Items ({receivedOffers.length})</span>
            </h2>

            {receivedOffers.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {receivedOffers.map(off => (
                  <div key={off.id} className="bg-white p-5 rounded-3xl border border-cream-300 space-y-4 shadow-sm">
                    <div className="flex gap-4 items-center">
                      <img src={off.itemImage} alt="" className="w-16 h-16 rounded-xl object-cover bg-cream-200 shrink-0" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-purple-700 uppercase">From Buyer: {off.buyerName}</span>
                        <h3 className="font-bold text-sm text-forest-900">{off.itemTitle}</h3>
                        <div className="text-xs text-forest-900/60">Asking: ₹{off.askingPrice} • AI Fair: ₹{off.aiRecommendedPrice}</div>
                      </div>
                    </div>

                    {/* Offered Price Callout */}
                    <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-purple-800">Offered Price</span>
                        <div className="font-poppins font-extrabold text-xl text-purple-900">₹{off.offerAmount.toLocaleString()}</div>
                      </div>
                      {off.counterAmount && (
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-amber-800">Your Counter</span>
                          <div className="font-poppins font-bold text-base text-amber-900">₹{off.counterAmount.toLocaleString()}</div>
                        </div>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        off.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : off.status === 'rejected' ? 'bg-red-100 text-red-800' : off.status === 'countered' ? 'bg-amber-100 text-amber-900' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {off.status}
                      </span>
                    </div>

                    {/* Action Buttons for Seller */}
                    {off.status === 'pending' && (
                      <div className="space-y-2">
                        {counteringOfferId === off.id ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="Enter counter price ₹"
                              value={counterVal}
                              onChange={(e) => setCounterVal(e.target.value ? Number(e.target.value) : '')}
                              className="w-full px-3 py-2 text-xs bg-cream-100 border border-forest-700/20 rounded-xl font-bold"
                            />
                            <button
                              onClick={() => handleSendCounter(off.id)}
                              className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold whitespace-nowrap"
                            >
                              Send Counter
                            </button>
                            <button
                              onClick={() => setCounteringOfferId(null)}
                              className="px-2 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAcceptOffer(off.id)}
                              className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" /> Accept ₹{off.offerAmount}
                            </button>

                            <button
                              onClick={() => {
                                setCounteringOfferId(off.id);
                                setCounterVal(Math.round((off.askingPrice + off.offerAmount) / 2));
                              }}
                              className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs"
                            >
                              Counter Offer
                            </button>

                            <button
                              onClick={() => handleRejectOffer(off.id)}
                              className="py-2 px-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold transition-all border border-red-200"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl text-center border border-cream-300 text-xs text-forest-900/60">
                No bargain offers received on your listings yet.
              </div>
            )}
          </div>

          {/* Section B: Offers Sent by Me (As Buyer) */}
          <div className="space-y-4">
            <h2 className="font-poppins font-bold text-lg text-forest-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-purple-600" />
              <span>Offers You Sent to Sellers ({sentOffers.length})</span>
            </h2>

            {sentOffers.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {sentOffers.map(off => (
                  <div key={off.id} className="bg-white p-5 rounded-3xl border border-cream-300 space-y-3 shadow-sm">
                    <div className="flex gap-4 items-center">
                      <img src={off.itemImage} alt="" className="w-16 h-16 rounded-xl object-cover bg-cream-200 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-forest-900/60 uppercase">Seller: {off.sellerName}</span>
                        <h3 className="font-bold text-sm text-forest-900">{off.itemTitle}</h3>
                        <div className="text-xs text-forest-900/60">Your Offer: ₹{off.offerAmount} • Asking: ₹{off.askingPrice}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-cream-200">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        off.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : off.status === 'countered' ? 'bg-amber-100 text-amber-900' : off.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        Status: {off.status === 'accepted' ? 'Offer Accepted!' : off.status === 'countered' ? `Seller Countered: ₹${off.counterAmount}` : off.status}
                      </span>

                      {(off.status === 'accepted' || off.status === 'countered') && (
                        <button
                          onClick={() => handleBuyNegotiated(off.id)}
                          className="px-4 py-2 bg-forest-900 hover:bg-forest-800 text-cream-100 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-warmgold-400" />
                          <span>Buy for ₹{off.status === 'countered' && off.counterAmount ? off.counterAmount : off.offerAmount}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl text-center border border-cream-300 text-xs text-forest-900/60">
                You haven't sent any bargain offers yet. Click "Make an Offer" on marketplace products!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 3: My Purchases */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {myOrders.length > 0 ? (
            myOrders.map(ord => (
              <div key={ord.id} className="bg-white p-5 rounded-2xl border border-cream-300 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <img src={ord.item.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover bg-cream-200" />
                  <div>
                    <div className="text-[11px] font-bold text-earthteal-600">{ord.orderNumber}</div>
                    <h3 className="font-bold text-sm text-forest-900">{ord.item.title}</h3>
                    <div className="text-xs text-forest-900/60">Paid via {ord.paymentMethod.toUpperCase()} • ₹{ord.amount}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <span className="bg-earthteal-500/10 text-earthteal-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Order Shipped & Delivered
                  </span>

                  {ord.feedbackGiven ? (
                    <div className="text-[11px] bg-purple-50 text-purple-900 border border-purple-200 px-3 py-1 rounded-xl font-bold">
                      Feedback Given ({ord.feedbackRating || 5} ★) • Auto-Archival in 5 days
                    </div>
                  ) : (
                    <button
                      onClick={() => setFeedbackOrderId(ord.id)}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Confirm Receipt & Give Feedback</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-3xl text-center border border-cream-300 text-xs text-forest-900/60">
              No purchases made yet.
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: Recycling Requests Timeline */}
      {activeTab === 'recycling' && (
        <div className="space-y-4">
          {myPickups.length > 0 ? (
            myPickups.map(req => (
              <div key={req.id} className="bg-white p-6 rounded-3xl border border-cream-300 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-earthteal-600">{req.requestNumber}</span>
                    <h3 className="font-poppins font-bold text-base text-forest-900">
                      {req.estimatedWeightKg} kg Textile Recycling Pickup
                    </h3>
                    <div className="text-xs text-forest-900/60">{req.fullAddress}</div>
                  </div>

                  <span className="bg-forest-900 text-cream-100 text-xs px-3 py-1 rounded-full font-bold uppercase">
                    {req.status}
                  </span>
                </div>

                {/* Progress Timeline */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-cream-200 text-center text-xs">
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-forest-900 text-cream-100 text-[10px] font-bold flex items-center justify-center mx-auto">1</div>
                    <div className="font-semibold text-forest-900">Requested</div>
                  </div>

                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-forest-900 text-cream-100 text-[10px] font-bold flex items-center justify-center mx-auto">2</div>
                    <div className="font-semibold text-forest-900">Scheduled Slot</div>
                    <div className="text-[10px] text-forest-900/60">{req.scheduledDate}</div>
                  </div>

                  <div className="space-y-1 opacity-60">
                    <div className="w-6 h-6 rounded-full bg-cream-300 text-forest-900 text-[10px] font-bold flex items-center justify-center mx-auto">3</div>
                    <div className="font-semibold">Sorting Hub</div>
                  </div>

                  <div className="space-y-1 opacity-60">
                    <div className="w-6 h-6 rounded-full bg-cream-300 text-forest-900 text-[10px] font-bold flex items-center justify-center mx-auto">4</div>
                    <div className="font-semibold">Factory Fiber</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-3xl text-center border border-cream-300 text-xs text-forest-900/60">
              No recycling pickup requests scheduled.
            </div>
          )}
        </div>
      )}
      {/* Buyer Feedback Submission Modal */}
      {feedbackOrderId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-forest-700/20 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider">ORDER RECEIPT & FEEDBACK</span>
                <h3 className="font-poppins font-bold text-xl text-forest-900">
                  Rate Garment & Confirm Receipt
                </h3>
                <p className="text-xs text-forest-900/60">Your feedback helps maintain high pre-loved fashion quality.</p>
              </div>

              <button onClick={() => setFeedbackOrderId(null)} className="p-1 rounded-full hover:bg-cream-200 text-forest-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-forest-900 mb-1">Satisfaction Rating (1 to 5 Stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className={`p-2.5 rounded-xl border text-base font-bold transition-all flex items-center gap-1 ${
                        feedbackRating >= star ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${feedbackRating >= star ? 'fill-current text-amber-500' : ''}`} />
                      <span>{star}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-forest-900 mb-1">Product & Seller Feedback Comments</label>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share your thoughts on garment quality, packaging, cleanliness..."
                  className="w-full p-3 bg-cream-50 border border-forest-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900">
                <strong>Notice:</strong> Once feedback is submitted, the item starts a 5-day auto-removal countdown, after which it is automatically archived from the platform.
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setFeedbackOrderId(null)}
                className="flex-1 py-2.5 rounded-full border border-forest-700/20 text-forest-900 font-bold text-xs hover:bg-cream-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  submitOrderFeedback(feedbackOrderId, feedbackRating, feedbackComment);
                  alert('Thank you! Your feedback has been recorded. Auto-removal timeline initialized (5 days).');
                  setFeedbackOrderId(null);
                }}
                className="flex-1 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-cream-100 font-bold text-xs shadow flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 text-warmgold-400" />
                <span>Submit Feedback</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

