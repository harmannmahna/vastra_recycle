import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Package, Recycle as Recycling, ShoppingBag, MapPin, Wallet, Star, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { currentUser, items, pickups, orders } = useApp();
  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'recycling' | 'addresses'>('listings');

  if (!currentUser) return null;

  const myItems = items.filter(i => i.ownerId === currentUser.id);
  const myPickups = pickups.filter(p => p.userId === currentUser.id);
  const myOrders = orders.filter(o => o.buyerId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={currentUser.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-forest-700/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-poppins font-bold text-2xl text-forest-900">{currentUser.name}</h1>
              <span className="bg-forest-700/10 text-forest-700 text-xs px-3 py-0.5 rounded-full font-bold capitalize">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-forest-900/60 mt-0.5">{currentUser.email} • {currentUser.phone}</p>
            <div className="flex items-center gap-3 text-xs mt-2 font-medium text-forest-900/70">
              <span className="flex items-center gap-1 text-warmgold-600">
                <Star className="w-3.5 h-3.5 fill-current" /> {currentUser.rating} ({currentUser.ratingCount} Reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-earthteal-600">
                <ShieldCheck className="w-3.5 h-3.5" /> Eco Member
              </span>
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

      {/* Tabs */}
      <div className="flex border-b border-cream-300 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'listings' ? 'border-forest-900 text-forest-900' : 'border-transparent text-forest-900/60'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Listings ({myItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'orders' ? 'border-forest-900 text-forest-900' : 'border-transparent text-forest-900/60'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Purchases ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recycling')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'recycling' ? 'border-forest-900 text-forest-900' : 'border-transparent text-forest-900/60'
          }`}
        >
          <Recycling className="w-4 h-4" />
          <span>Recycling Requests ({myPickups.length})</span>
        </button>
      </div>

      {/* Tab Content 1: My Listings */}
      {activeTab === 'listings' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myItems.length > 0 ? (
            myItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-cream-300 flex gap-4">
                <img src={item.images[0]} alt="" className="w-20 h-20 rounded-xl object-cover bg-cream-200" />
                <div className="flex-1 space-y-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    item.status === 'listed' ? 'bg-earthteal-500 text-white' : 'bg-warmgold-500 text-forest-900'
                  }`}>
                    {item.status}
                  </span>
                  <h3 className="font-bold text-sm text-forest-900 line-clamp-1">{item.title}</h3>
                  <div className="font-poppins font-bold text-base text-forest-900">₹{item.price}</div>
                  <div className="text-[10px] text-forest-900/60">Listed on {item.createdAt}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white p-8 rounded-3xl text-center border border-cream-300 text-xs text-forest-900/60">
              You haven't listed any clothing items for sale yet.
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: My Purchases */}
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

                <div className="flex items-center gap-2">
                  <span className="bg-earthteal-500/10 text-earthteal-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Order Shipped
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-3xl text-center border border-cream-300 text-xs text-forest-900/60">
              No purchases found. Browse our marketplace to find pre-loved clothing.
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Recycling Requests Timeline */}
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
    </div>
  );
};
