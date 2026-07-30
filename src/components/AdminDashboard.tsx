import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Users, ShoppingBag, Recycle as Recycling, DollarSign, CheckCircle2, XCircle, PackagePlus, AlertTriangle, Video, Award, Crown, Eye } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    users, approveIndustryUser, items, moderateListing, 
    pickups, createBatchFromPickups, orders, analytics 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'moderation' | 'pickups' | 'verifications' | 'governance'>('moderation');
  const [selectedPickups, setSelectedPickups] = useState<string[]>([]);
  const [batchLocation, setBatchLocation] = useState('Delhi NCR Central Sorting Warehouse, Okhla Phase-III');

  const pendingListings = items.filter(i => i.status === 'under_review' || i.status === 'submitted');
  const liveListings = items.filter(i => i.status === 'listed');
  const pendingUsers = users.filter(u => u.role === 'industry_partner' && !u.isVerified);
  const pendingPickups = pickups.filter(p => p.status === 'requested' || p.status === 'scheduled');

  const toggleSelectPickup = (id: string) => {
    setSelectedPickups(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCreateBatch = () => {
    if (selectedPickups.length === 0) return;
    createBatchFromPickups(selectedPickups, batchLocation);
    setSelectedPickups([]);
    alert('Recycling Batch generated and assigned to Delhi NCR Recycling Hub!');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-800 py-8 px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      
      {/* Executive Light Header */}
      <div className="max-w-7xl mx-auto bg-white border border-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-800 text-xs font-mono font-bold uppercase tracking-wider border border-amber-500/30">
            <Crown className="w-4 h-4 text-amber-700" />
            <span>Executive Control Portal • Admin Only</span>
          </div>
          <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight flex items-center gap-3">
            <span>VastraChakra Governance Hub</span>
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Authenticated Admin: <strong className="text-amber-800">sanyam0902@gmail.com</strong> (Contact: 8708288911)
          </p>
        </div>

        {/* Executive Quick Counters */}
        <div className="flex items-center gap-4 text-center relative z-10">
          <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-amber-500/30 shadow-md min-w-[120px]">
            <div className="text-[10px] uppercase text-amber-800 font-mono font-bold">Pending Review</div>
            <div className="text-2xl font-poppins font-extrabold text-amber-900">{pendingListings.length}</div>
          </div>

          <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-slate-200 shadow-md min-w-[120px]">
            <div className="text-[10px] uppercase text-slate-500 font-mono font-bold">Delhi NCR Recycled</div>
            <div className="text-2xl font-poppins font-extrabold text-amber-800">{analytics.tier2RecyclingWeightKg} kg</div>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="max-w-7xl mx-auto flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'moderation' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Tier 1 Video Moderation ({pendingListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pickups')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pickups' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Recycling className="w-4 h-4" />
          <span>Tier 2 Recycling Pickups ({pendingPickups.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'verifications' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Industry Approvals ({pendingUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('governance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'governance' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Live Catalog & Governance ({liveListings.length})</span>
        </button>
      </div>

      {/* TAB 1: Tier 1 Video Moderation Queue */}
      {activeTab === 'moderation' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h2 className="font-poppins font-bold text-xl text-slate-900 flex items-center gap-2">
              <span>Tier 1 Quality & Seller Video Moderation Queue</span>
            </h2>
            <p className="text-xs text-slate-600">
              Inspect video proof, verify usage age (&le; 3 yrs), brand authenticity & hygiene ratings before approving live
            </p>
          </div>

          {items.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {items.map(item => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-amber-700 tracking-wider">
                        Brand: {item.brand} • Category: {item.category}
                      </span>
                      <h3 className="font-poppins font-bold text-lg text-slate-900 mt-0.5">
                        {item.title}
                      </h3>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                      item.status === 'listed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Seller Video Preview Section */}
                  <div className="p-3.5 bg-[#FFFDF9] rounded-2xl border border-amber-200 space-y-2 text-xs">
                    <div className="font-bold text-amber-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-amber-700" /> Seller Video Clip Proof:
                      </span>
                      {item.videoUrl && (
                        <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:underline flex items-center gap-1 font-semibold">
                          <span>Open Clip</span> <Eye className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-slate-600 text-[11px] font-mono truncate">
                      {item.videoUrl || 'No video link attached'}
                    </p>
                  </div>

                  {/* Screening Checkpoints grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-mono">Usage Age</div>
                      <div className="font-bold text-amber-800">{item.ageYears} Years</div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-mono">Hygiene Score</div>
                      <div className="font-bold text-slate-900">{item.hygieneRating || 5} / 5 ★</div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-mono">Color Faded</div>
                      <div className="font-bold text-slate-900">{item.isColorFaded ? 'Yes' : 'No'}</div>
                    </div>
                  </div>

                  {/* Moderation Controls */}
                  <div className="flex gap-3 pt-2">
                    {item.status !== 'listed' && (
                      <button
                        onClick={() => moderateListing(item.id, 'listed')}
                        className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-poppins font-bold text-xs transition-all shadow flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve to Marketplace</span>
                      </button>
                    )}

                    {item.status !== 'rejected' && (
                      <button
                        onClick={() => moderateListing(item.id, 'rejected')}
                        className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-red-700 font-poppins font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-red-200"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl text-center border border-slate-200 text-slate-500 text-xs">
              No pending listings in moderation queue.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Tier 2 Recycling Pickups */}
      {activeTab === 'pickups' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-poppins font-bold text-xl text-slate-900">
                Tier 2 Household Recycling Requests ({pendingPickups.length})
              </h2>
              <p className="text-xs text-slate-600">
                Inspect user packed box photos & generate consolidated industrial recycling batches
              </p>
            </div>

            <button
              onClick={handleCreateBatch}
              disabled={selectedPickups.length === 0}
              className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-poppins font-bold text-xs transition-all shadow flex items-center gap-2"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Generate Batch ({selectedPickups.length} Pickups)</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {pendingPickups.map(req => {
              const isSelected = selectedPickups.includes(req.id);
              return (
                <div 
                  key={req.id}
                  onClick={() => toggleSelectPickup(req.id)}
                  className={`bg-white border rounded-3xl p-6 cursor-pointer transition-all space-y-4 shadow-sm ${
                    isSelected ? 'border-amber-600 ring-2 ring-amber-500/30 bg-[#FFFDF9]' : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-700">{req.requestNumber}</span>
                      <h3 className="font-bold text-base text-slate-900">{req.userName} ({req.userPhone})</h3>
                    </div>

                    <span className="bg-amber-100 px-3 py-1 rounded-full text-xs font-bold text-amber-900 border border-amber-300">
                      {req.estimatedWeightKg} kg
                    </span>
                  </div>

                  {/* Packed Box Photo Verification */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <img 
                      src={req.packedBagImageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'} 
                      alt="Packed Bag" 
                      className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                    />
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-amber-900">Packed Box Photo Verified</div>
                      <div className="text-slate-600 text-[11px] truncate max-w-xs">{req.clothingTypes}</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 border-t border-slate-100 pt-2 flex justify-between">
                    <span>Address: {req.fullAddress}</span>
                    <span className="font-mono text-amber-800 font-bold">{req.scheduledDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Industry Approvals */}
      {activeTab === 'verifications' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h2 className="font-poppins font-bold text-xl text-slate-900">
              Pending Industry Partner Registrations ({pendingUsers.length})
            </h2>
            <p className="text-xs text-slate-600">
              Verify GST certificates and business identities before granting B2B batch access
            </p>
          </div>

          {pendingUsers.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {pendingUsers.map(u => (
                <div key={u.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-md">
                  <div>
                    <h3 className="font-poppins font-bold text-lg text-slate-900">{u.businessName || u.name}</h3>
                    <p className="text-xs text-slate-600">Email: {u.email} • GST: {u.gstNumber || 'Pending'}</p>
                  </div>

                  <button
                    onClick={() => approveIndustryUser(u.id)}
                    className="w-full py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-poppins font-bold text-xs transition-all shadow flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Industry Account</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl text-center border border-slate-200 text-xs text-slate-500">
              All industry partners in Delhi NCR have been verified and activated.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Live Catalog Governance */}
      {activeTab === 'governance' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h2 className="font-poppins font-bold text-xl text-slate-900">
              Active Marketplace Catalog ({liveListings.length})
            </h2>
            <p className="text-xs text-slate-600">
              Live reselling products passing Tier 1 screening
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-4">Item Title</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Age</th>
                  <th className="p-4">Hygiene</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {liveListings.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{item.title}</td>
                    <td className="p-4">{item.brand}</td>
                    <td className="p-4 text-amber-800">{item.ageYears} Yrs</td>
                    <td className="p-4">{item.hygieneRating || 5} / 5 ★</td>
                    <td className="p-4 font-bold text-slate-900">₹{item.price}</td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-emerald-300">
                        LIVE MARKETPLACE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};


