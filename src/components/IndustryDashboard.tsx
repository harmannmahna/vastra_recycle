import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Factory, Scale, Truck, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle, Building2, MapPin, DollarSign, Warehouse, Phone, ExternalLink } from 'lucide-react';

const DELHI_NCR_RECYCLERS = [
  { name: 'Panipat Respun Yarns Pvt Ltd', type: 'Industrial Fiber Mill', location: 'Industrial Sector 25, Panipat', contact: '+91 98120 44556', status: 'Verified Partner', minKg: '100 kg' },
  { name: 'Delhi NCR EcoTextile Recycling Hub', type: 'Sorting & Shredding Warehouse', location: 'Okhla Phase-III, New Delhi', contact: '8708288911', status: 'Active Hub', minKg: '25 kg' },
  { name: 'Goonj Clothes Collection Center', type: 'Donation & NGO Partner', location: 'Sarita Vihar, New Delhi', contact: '+91 11 2697 2351', status: 'Active NGO', minKg: '10 kg' },
  { name: 'Yamuna Fiber Shreddability Works', type: 'Mechanical Recycler', location: 'Faridabad Industrial Zone', contact: '+91 98111 22334', status: 'Outreach Stage', minKg: '50 kg' }
];

export const IndustryDashboard: React.FC = () => {
  const { batches, claimBatch, updateBatchStatus, currentUser } = useApp();

  const [logisticsModel, setLogisticsModel] = useState<'self_pickup' | 'partner_pickup'>('self_pickup');
  const [activeTab, setActiveTab] = useState<'batches' | 'directory' | 'logistics' | 'inventory'>('batches');

  const isVerified = currentUser?.isVerified;
  const availableBatches = batches.filter(b => b.status === 'collected' && !b.claimedByIndustryId);
  const claimedBatches = batches.filter(b => b.claimedByIndustryId === currentUser?.id || b.status !== 'collected');

  const totalWeightClaimed = claimedBatches.reduce((sum, b) => sum + b.totalWeightKg, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 py-8 px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      
      {/* Partner Light Header */}
      <div className="max-w-7xl mx-auto bg-white border border-teal-900/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-teal-50 text-teal-700 rounded-2xl border border-teal-200">
              <Factory className="w-7 h-7" />
            </span>
            <div>
              <h1 className="font-poppins font-bold text-2xl text-slate-900 flex items-center gap-2">
                {currentUser?.businessName || 'VastraChakra EcoMills Delhi NCR'}
                <span className="bg-teal-100 text-teal-800 text-xs px-2.5 py-0.5 rounded-full border border-teal-300 flex items-center gap-1 font-sans">
                  <ShieldCheck className="w-3.5 h-3.5" /> B2B Partner Portal
                </span>
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                GST: 07AAACV0902F1Z8 • Delhi NCR Textile Recycling & Bulk Procurement System
              </p>
            </div>
          </div>
        </div>

        {/* Stats Summary Pills */}
        <div className="flex items-center gap-4 text-center">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 min-w-[120px]">
            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Total Feedstock</div>
            <div className="text-xl font-poppins font-bold text-teal-700">{totalWeightClaimed + 7.5} kg</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 min-w-[120px]">
            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Available Batches</div>
            <div className="text-xl font-poppins font-bold text-slate-900">{availableBatches.length + 1}</div>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="max-w-7xl mx-auto flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('batches')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'batches' ? 'bg-teal-700 text-white font-bold shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Open Recycling Batches
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'directory' ? 'bg-teal-700 text-white font-bold shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Delhi NCR Recyclers & NGO Directory
        </button>

        <button
          onClick={() => setActiveTab('logistics')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'logistics' ? 'bg-teal-700 text-white font-bold shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Collection & Logistics Model
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'inventory' ? 'bg-teal-700 text-white font-bold shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Warehouse Storage Facility
        </button>
      </div>

      {/* TAB 1: Batches Queue */}
      {activeTab === 'batches' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-poppins font-bold text-xl text-slate-900">
                Available Textile Batches for Procurement
              </h2>
              <p className="text-xs text-slate-600">
                Sorted, weighed, and consolidated post-consumer fabric stock in Delhi NCR
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Seed Demo Batch */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold uppercase text-teal-700 tracking-wider font-mono">
                    DELHI-BATCH-2026-08-A
                  </span>
                  <h3 className="font-poppins font-bold text-lg text-slate-900 mt-0.5">
                    7.5 kg Sorted Cotton & Denim Batch
                  </h3>
                </div>

                <span className="bg-teal-50 text-teal-800 text-xs px-3 py-1 rounded-full font-semibold border border-teal-200">
                  16 Garments
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs border border-slate-200">
                <div className="font-semibold text-slate-800 flex justify-between">
                  <span>Material Breakdown</span>
                  <span className="text-slate-500">Location: Okhla Sorting Center</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-[11px] pt-1">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900">70%</div>
                    <div className="text-[9px] text-slate-500">Cotton</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900">15%</div>
                    <div className="text-[9px] text-slate-500">Polyester</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900">10%</div>
                    <div className="text-[9px] text-slate-500">Denim</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900">5%</div>
                    <div className="text-[9px] text-slate-500">Mixed</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert('Batch claimed for factory dispatch! Status updated in logistics pipeline.')}
                className="w-full py-3 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-poppins font-bold text-xs transition-all shadow flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Claim Batch for Factory Dispatch</span>
              </button>
            </div>

            {availableBatches.map(batch => (
              <div 
                key={batch.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-teal-700 tracking-wider font-mono">
                      {batch.batchNumber}
                    </span>
                    <h3 className="font-poppins font-bold text-lg text-slate-900 mt-0.5">
                      {batch.totalWeightKg} kg Bulk Textile Batch
                    </h3>
                  </div>

                  <span className="bg-teal-50 text-teal-800 text-xs px-3 py-1 rounded-full font-semibold border border-teal-200">
                    {batch.totalItemsCount} Garments
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs border border-slate-200">
                  <div className="font-semibold text-slate-800 flex justify-between">
                    <span>Material Breakdown</span>
                    <span className="text-slate-500">Location: {batch.location}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-[11px] pt-1">
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900">{batch.materialBreakdown.cottonPercent}%</div>
                      <div className="text-[9px] text-slate-500">Cotton</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900">{batch.materialBreakdown.denimPercent}%</div>
                      <div className="text-[9px] text-slate-500">Denim</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900">{batch.materialBreakdown.polyesterPercent}%</div>
                      <div className="text-[9px] text-slate-500">Polyester</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900">{batch.materialBreakdown.mixedPercent}%</div>
                      <div className="text-[9px] text-slate-500">Mixed</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => claimBatch(batch.id)}
                  className="w-full py-3 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-poppins font-bold text-xs transition-all shadow flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Claim Batch for Factory Dispatch</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Delhi NCR Recyclers Directory */}
      {activeTab === 'directory' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h2 className="font-poppins font-bold text-xl text-slate-900">
              Delhi NCR & Panipat Recyclers & NGO Directory
            </h2>
            <p className="text-xs text-slate-600">
              Verified textile recycling organizations, shredders, spinning mills, and donation NGOs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {DELHI_NCR_RECYCLERS.map((r, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider block">
                      {r.type}
                    </span>
                    <h3 className="font-poppins font-bold text-lg text-slate-900 mt-0.5">
                      {r.name}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    {r.status}
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-1 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-700" />
                    <span>{r.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-teal-700" />
                    <span>Contact: {r.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Scale className="w-3.5 h-3.5 text-teal-700" />
                    <span>Minimum Quantity Requirement: <strong>{r.minKg}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Collection & Logistics Model Options */}
      {activeTab === 'logistics' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h2 className="font-poppins font-bold text-xl text-slate-900">
              Collection & Delivery Model Framework
            </h2>
            <p className="text-xs text-slate-600">
              MOM Discussion Point 2: Evaluating scalable and cost-effective delivery models
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Model A: Self Pickup */}
            <div 
              onClick={() => setLogisticsModel('self_pickup')}
              className={`p-6 rounded-3xl border cursor-pointer transition-all space-y-4 shadow-sm ${
                logisticsModel === 'self_pickup' 
                  ? 'bg-white border-teal-600 ring-2 ring-teal-500/20' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-poppins font-bold text-lg text-slate-900">
                  Option A: Self-Arranged Fleet Pickup
                </span>
                {logisticsModel === 'self_pickup' && (
                  <span className="bg-teal-700 text-white text-xs font-bold px-3 py-1 rounded-full">Active Preference</span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                VastraChakra deploys dedicated collection agents with electric 3-wheelers to gather packaged clothes directly from doorstep users in Delhi NCR.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-2 border border-slate-200">
                <div className="font-semibold text-teal-800">Cost & Scalability Analysis:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li>Higher control over initial packaging verification.</li>
                  <li>Direct brand presence during doorstep pick up.</li>
                  <li>Estimated logistics cost: ₹18 - ₹22 per kg.</li>
                </ul>
              </div>
            </div>

            {/* Model B: Partner Pickup */}
            <div 
              onClick={() => setLogisticsModel('partner_pickup')}
              className={`p-6 rounded-3xl border cursor-pointer transition-all space-y-4 shadow-sm ${
                logisticsModel === 'partner_pickup' 
                  ? 'bg-white border-teal-600 ring-2 ring-teal-500/20' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-poppins font-bold text-lg text-slate-900">
                  Option B: Recycler Mill Direct Logistics
                </span>
                {logisticsModel === 'partner_pickup' && (
                  <span className="bg-teal-700 text-white text-xs font-bold px-3 py-1 rounded-full">Active Preference</span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Recycling factories & NGO partners send their bulk logistics trucks directly to VastraChakra central staging warehouse once batch weight reaches 100+ kg.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-2 border border-slate-200">
                <div className="font-semibold text-teal-800">Cost & Scalability Analysis:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li>Maximum cost-efficiency for industrial volume.</li>
                  <li>Zero fleet capital requirement for VastraChakra startup.</li>
                  <li>Estimated logistics cost: ₹8 - ₹12 per kg.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Warehouse Storage Inventory */}
      {activeTab === 'inventory' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h2 className="font-poppins font-bold text-xl text-slate-900">
              Warehouse Storage & Inventory Management
            </h2>
            <p className="text-xs text-slate-600">
              MOM Discussion Point 4: Temporary staging storage evaluation before recycling & reselling dispatch
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Storage Facility 1: Tier 2 Staging */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-md">
              <div className="flex items-center gap-3">
                <Warehouse className="w-6 h-6 text-teal-700" />
                <div>
                  <h3 className="font-poppins font-bold text-lg text-slate-900">
                    Tier 2 Recycling Staging Facility
                  </h3>
                  <span className="text-xs text-slate-500">Okhla Industrial Area Sorting Center</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs border border-slate-200">
                <div className="flex justify-between font-semibold">
                  <span>Current Staged Stock:</span>
                  <span className="text-teal-800 font-bold">28.5 kg</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Minimum Batch Threshold:</span>
                  <span>50 kg for mill dispatch</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Storage Capacity:</span>
                  <span>500 kg capacity</span>
                </div>
              </div>
            </div>

            {/* Storage Facility 2: Tier 1 Holding */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-md">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-teal-700" />
                <div>
                  <h3 className="font-poppins font-bold text-lg text-slate-900">
                    Tier 1 Approved Reselling Holding Facility
                  </h3>
                  <span className="text-xs text-slate-500">Hauz Khas Verification Center</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs border border-slate-200">
                <div className="flex justify-between font-semibold">
                  <span>Approved Items Holding:</span>
                  <span className="text-teal-800 font-bold">4 Verified Apparel Items</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Inspection Protocol:</span>
                  <span>Sanitized, video-recorded & tagged</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Avg Buyer Dispatch Time:</span>
                  <span>Under 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


