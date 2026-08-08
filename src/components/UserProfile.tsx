import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { User, Package, Recycle as Recycling, ShoppingBag, MapPin, Wallet, Star, ShieldCheck, CheckCircle2, Clock, Edit2, Camera, X, Check, Tag, Sparkles, Send, AlertTriangle } from 'lucide-react';
import { getUserAvatar, getDefaultAvatar } from '../utils/avatarUtils';

export const UserProfile: React.FC = () => {
  const { 
    currentUser, items, pickups, orders, 
    updateUserProfile, submitOrderFeedback, submitSellerRating 
  } = useApp();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'recycling'>('listings');

  // Profile Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGender, setEditGender] = useState<'female' | 'male' | 'other'>('female');
  const [editAvatar, setEditAvatar] = useState('');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passErrorMsg, setPassErrorMsg] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Buyer Feedback Modal State (Buyer rates Seller & Item)
  const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('Excellent quality pre-loved garment! Received as described.');

  // Seller Feedback Modal State (Seller rates Buyer)
  const [sellerRatingOrderId, setSellerRatingOrderId] = useState<string | null>(null);
  const [sellerRatingVal, setSellerRatingVal] = useState<number>(5);
  const [sellerCommentVal, setSellerCommentVal] = useState<string>('Great buyer! Quick payment and smooth communication.');

  if (!currentUser) return null;

  const myItems = items.filter(i => i.ownerId === currentUser.id);
  const myPickups = pickups.filter(p => p.userId === currentUser.id);
  const myOrders = orders.filter(o => o.buyerId === currentUser.id);
  const mySalesOrders = orders.filter(o => o.item.ownerId === currentUser.id);

  const openEditModal = () => {
    setEditName(currentUser.name || '');
    setEditPhone(currentUser.phone || '');
    setEditGender(currentUser.gender || 'female');
    setEditAvatar(currentUser.avatar || '');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setPassErrorMsg('');
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
    setPassErrorMsg('');

    if (newPass.trim()) {
      if (currentUser.password && currentPass.trim() !== currentUser.password) {
        setPassErrorMsg('Current password is incorrect.');
        return;
      }
      if (newPass.trim() !== confirmPass.trim()) {
        setPassErrorMsg('New passwords do not match.');
        return;
      }
      if (newPass.trim().length < 4) {
        setPassErrorMsg('New password must be at least 4 characters long.');
        return;
      }
    }

    updateUserProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      gender: editGender,
      avatar: editAvatar.trim() || undefined,
      ...(newPass.trim() ? { password: newPass.trim() } : {})
    });
    setSaveSuccessMsg('Profile and Security Credentials updated successfully!');
    showToast('Profile Updated! ✨', 'Your account profile has been saved successfully.', 'success');
    setTimeout(() => {
      setIsEditing(false);
      setSaveSuccessMsg('');
    }, 1200);
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

              {/* Password Update Section */}
              <div className="pt-2 border-t border-forest-700/10 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-forest-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Account Security & Password Update</span>
                </div>

                {passErrorMsg && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                    {passErrorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">Current Password (if changing)</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/20 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-forest-900 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/20 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-forest-900 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/20 text-xs"
                    />
                  </div>
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

          {/* Section: Items Sold & Mutual Buyer Rating */}
          {mySalesOrders.length > 0 && (
            <div className="pt-6 space-y-4 border-t border-cream-300 col-span-full">
              <h3 className="font-poppins font-bold text-base text-forest-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-terracotta-500" />
                <span>Items Sold & Buyer Ratings ({mySalesOrders.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mySalesOrders.map(sale => (
                  <div key={sale.id} className="bg-white p-4 rounded-2xl border border-cream-300 flex justify-between items-center text-xs shadow-xs">
                    <div>
                      <span className="font-bold text-forest-900 block">{sale.item.title}</span>
                      <span className="text-[11px] text-forest-900/60">Buyer: {sale.buyerName} • Sold for ₹{sale.amount}</span>
                    </div>
                    {sale.sellerRatingGiven ? (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold">
                        Rated Buyer ({sale.sellerRating || 5} ★)
                      </span>
                    ) : (
                      <button
                        onClick={() => setSellerRatingOrderId(sale.id)}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs transition-all"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Rate Buyer</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: My Purchases */}
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
                  if (feedbackOrderId) {
                    submitOrderFeedback(feedbackOrderId, feedbackRating, feedbackComment);
                    showToast('Feedback Submitted! ⭐', 'Thank you! Auto-archival timeline initialized (5 days).', 'success');
                    setFeedbackOrderId(null);
                  }
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

      {/* Seller Rating Modal (Seller rates Buyer) */}
      {sellerRatingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-cream-100 border border-cream-300 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-cream-300 pb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-current" />
                <h3 className="font-poppins font-bold text-lg text-forest-900">Rate Buyer Experience</h3>
              </div>
              <button onClick={() => setSellerRatingOrderId(null)} className="p-1 text-forest-900/60 hover:text-forest-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-forest-900 mb-1">Buyer Rating Score (1 to 5 Stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSellerRatingVal(star)}
                      className={`flex-1 py-2 rounded-xl font-bold border transition-all flex items-center justify-center gap-1 ${
                        sellerRatingVal >= star ? 'bg-amber-100 text-amber-900 border-amber-400' : 'bg-white text-forest-900 border-cream-300'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${sellerRatingVal >= star ? 'fill-current text-amber-500' : ''}`} />
                      <span>{star}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-forest-900 mb-1">Buyer Feedback Comments</label>
                <textarea
                  rows={3}
                  value={sellerCommentVal}
                  onChange={(e) => setSellerCommentVal(e.target.value)}
                  placeholder="Rate buyer payment speed and communication..."
                  className="w-full p-3 bg-cream-50 border border-forest-700/20 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSellerRatingOrderId(null)}
                className="flex-1 py-2.5 rounded-full border border-forest-700/20 text-forest-900 font-bold text-xs hover:bg-cream-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  submitSellerRating(sellerRatingOrderId, sellerRatingVal, sellerCommentVal);
                  showToast('Buyer Rating Submitted! ⭐', 'Mutual rating recorded for buyer profile.', 'success');
                  setSellerRatingOrderId(null);
                }}
                className="flex-1 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-cream-100 font-bold text-xs shadow flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 text-warmgold-400" />
                <span>Submit Buyer Rating</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

