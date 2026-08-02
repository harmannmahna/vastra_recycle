import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../utils/csvExporter';
import { AdminPermissions, User } from '../types';
import { 
  ShieldCheck, Users, ShoppingBag, Recycle as Recycling, DollarSign, 
  CheckCircle2, XCircle, PackagePlus, AlertTriangle, Video, Award, Crown, Eye, 
  Download, Search, Filter, Key, Activity, Sparkles, Tag, TrendingUp, Wallet,
  UserPlus, UserMinus, ShieldAlert, Lock, Trash2, Clock, Check
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, users, approveIndustryUser, items, moderateListing, 
    pickups, createBatchFromPickups, orders, analytics, offers,
    promoteToAdmin, revokeAdminRights, updateAdminPermissions,
    removeUserAccount, removeIndustryMember, removeProduct, cleanupSoldProducts5Days
  } = useApp();

  const [activeTab, setActiveTab] = useState<'insights' | 'users_db' | 'admin_team' | 'moderation' | 'industry_mgmt' | 'catalog_mgmt' | 'pickups'>('insights');
  
  // User Database Filter & Search State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'All' | 'customer' | 'industry_partner' | 'admin'>('All');
  const [userStatusFilter, setUserStatusFilter] = useState<'All' | 'active' | 'logged_out'>('All');

  // Admin Rights Modal State
  const [selectedUserForAdmin, setSelectedUserForAdmin] = useState<User | null>(null);
  const [permissionForm, setPermissionForm] = useState<AdminPermissions>({
    canViewInsights: true,
    canViewOrders: true,
    canViewPasswords: false,
    canManageCatalog: true,
    canManageIndustry: true
  });

  // Pickup Selection State
  const [selectedPickups, setSelectedPickups] = useState<string[]>([]);
  const [batchLocation, setBatchLocation] = useState('Delhi NCR Central Sorting Warehouse, Okhla Phase-III');

  // Founder & Permissions Check
  const isFounder = currentUser?.isFounder || currentUser?.email === 'sanyam0902@gmail.com';
  const perms = currentUser?.adminPermissions || {
    canViewInsights: isFounder,
    canViewOrders: isFounder,
    canViewPasswords: isFounder,
    canManageCatalog: isFounder,
    canManageIndustry: isFounder,
    isFounder
  };

  const pendingListings = items.filter(i => i.status === 'under_review' || i.status === 'submitted');
  const liveListings = items.filter(i => i.status === 'listed');
  const soldListings = items.filter(i => i.status === 'sold');
  const archivedListings = items.filter(i => i.status === 'archived');
  const industryUsers = users.filter(u => u.role === 'industry_partner');
  const adminUsers = users.filter(u => u.role === 'admin');
  const pendingUsers = users.filter(u => u.role === 'industry_partner' && !u.isVerified);
  const pendingPickups = pickups.filter(p => p.status === 'requested' || p.status === 'scheduled');

  // Financial Metrics Calculations
  const totalGMV = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalCommissions = orders.reduce((sum, o) => sum + o.commissionAmount, 0);
  const totalPayouts = orders.reduce((sum, o) => sum + o.sellerPayout, 0);
  const acceptedOffersCount = offers.filter(o => o.status === 'accepted').length;
  const bargainSuccessRate = offers.length > 0 ? Math.round((acceptedOffersCount / offers.length) * 100) : 100;

  // Filtered Users Database
  const filteredUsers = users.filter(u => {
    if (userRoleFilter !== 'All' && u.role !== userRoleFilter) return false;
    if (userStatusFilter === 'active' && !u.isOnline) return false;
    if (userStatusFilter === 'logged_out' && u.isOnline) return false;

    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = u.phone?.toLowerCase().includes(q) || false;
      const matchBiz = u.businessName?.toLowerCase().includes(q) || false;
      const matchGst = u.gstNumber?.toLowerCase().includes(q) || false;
      return matchName || matchEmail || matchPhone || matchBiz || matchGst;
    }

    return true;
  });

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

  const handleSaveAdminRights = () => {
    if (!selectedUserForAdmin) return;
    promoteToAdmin(selectedUserForAdmin.id, permissionForm);
    alert(`Admin rights successfully assigned to ${selectedUserForAdmin.name}!`);
    setSelectedUserForAdmin(null);
  };

  // CSV Export Handlers
  const handleExportUsersCSV = () => {
    const data = users.map(u => ({
      User_ID: u.id,
      Full_Name: u.name,
      Email: u.email,
      Phone: u.phone || 'N/A',
      Password: perms.canViewPasswords ? (u.password || 'User@123') : '[PROTECTED]',
      Role: u.role,
      Business_Name: u.businessName || 'N/A',
      GSTIN: u.gstNumber || 'N/A',
      Active_Status: u.isOnline ? 'Active Online' : 'Logged Out',
      Verification_Status: u.isVerified !== false ? 'Verified' : 'Pending',
      Registered_Date: u.createdAt
    }));
    exportToCSV('VastraChakra_Master_Users_Database.csv', data);
  };

  const handleExportListingsCSV = () => {
    const data = items.map(i => ({
      Item_ID: i.id,
      Title: i.title,
      Brand: i.brand,
      Category: i.category,
      Expected_Selling_Price: i.price,
      Age_Years: i.ageYears,
      Hygiene_Rating: i.hygieneRating || 5,
      Status: i.status,
      Seller_ID: i.ownerId,
      Seller_Name: i.ownerName,
      Video_Proof_URL: i.videoUrl || 'N/A',
      Created_At: i.createdAt
    }));
    exportToCSV('VastraChakra_Listings_Database.csv', data);
  };

  const handleExportTransactionsCSV = () => {
    const data = orders.map(o => ({
      Order_Number: o.orderNumber,
      Buyer_ID: o.buyerId,
      Buyer_Name: o.buyerName,
      Item_Title: o.item.title,
      Brand: o.item.brand,
      Transaction_Amount: o.amount,
      Platform_Commission_10pct: o.commissionAmount,
      Seller_Payout: o.sellerPayout,
      Payment_Method: o.paymentMethod.toUpperCase(),
      Transaction_Ref: o.transactionId,
      Order_Date: o.createdAt
    }));
    exportToCSV('VastraChakra_Transactions_Ledger.csv', data);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-800 py-8 px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      
      {/* Executive Light Header */}
      <div className="max-w-7xl mx-auto bg-white border border-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-800 text-xs font-mono font-bold uppercase tracking-wider border border-amber-500/30">
            <Crown className="w-4 h-4 text-amber-700" />
            <span>Executive Governance & Admin Rights Portal</span>
          </div>
          <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight flex items-center gap-3">
            <span>VastraChakra Governance Hub</span>
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Authenticated Admin: <strong className="text-amber-800">{currentUser?.email || 'sanyam0902@gmail.com'}</strong> 
            {isFounder && <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold border border-purple-300">FOUNDER / SUPER ADMIN</span>}
          </p>
        </div>

        {/* Executive Quick Counters */}
        <div className="flex items-center gap-4 text-center relative z-10 flex-wrap">
          {perms.canViewInsights && (
            <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-amber-500/30 shadow-md min-w-[120px]">
              <div className="text-[10px] uppercase text-amber-800 font-mono font-bold">Total Platform GMV</div>
              <div className="text-2xl font-poppins font-extrabold text-amber-900">₹{totalGMV.toLocaleString()}</div>
            </div>
          )}

          <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-amber-500/30 shadow-md min-w-[120px]">
            <div className="text-[10px] uppercase text-amber-800 font-mono font-bold">Pending Review</div>
            <div className="text-2xl font-poppins font-extrabold text-amber-900">{pendingListings.length}</div>
          </div>

          <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-slate-200 shadow-md min-w-[120px]">
            <div className="text-[10px] uppercase text-slate-500 font-mono font-bold">Active Admins</div>
            <div className="text-2xl font-poppins font-extrabold text-amber-800">{adminUsers.length}</div>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="max-w-7xl mx-auto flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {perms.canViewInsights && (
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'insights' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard & Insights</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('users_db')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'users_db' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Master User DB ({users.length})</span>
        </button>

        {isFounder && (
          <button
            onClick={() => setActiveTab('admin_team')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'admin_team' ? 'bg-purple-700 text-white shadow-md ring-2 ring-purple-400/40' : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Admin Rights & Team ({adminUsers.length})</span>
          </button>
        )}

        {perms.canManageCatalog && (
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'moderation' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Moderation ({pendingListings.length})</span>
          </button>
        )}

        {perms.canManageIndustry && (
          <button
            onClick={() => setActiveTab('industry_mgmt')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'industry_mgmt' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Industry Members ({industryUsers.length})</span>
          </button>
        )}

        {perms.canManageCatalog && (
          <button
            onClick={() => setActiveTab('catalog_mgmt')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'catalog_mgmt' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Catalog & Products ({items.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('pickups')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pickups' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Recycling className="w-4 h-4" />
          <span>Textile Recycling ({pendingPickups.length})</span>
        </button>
      </div>

      {/* TAB 1: Dashboard & Transaction Insights */}
      {activeTab === 'insights' && perms.canViewInsights && (
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h2 className="font-poppins font-bold text-xl text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <span>Platform Transaction Insights & Financial Ledger</span>
            </h2>
            <p className="text-xs text-slate-600">
              Live financial overview including GMV, 10% platform commission earnings, seller payouts, and bargain offer statistics.
            </p>
          </div>

          {/* Key Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-2">
              <div className="flex justify-between items-center text-slate-500 text-xs font-mono font-bold uppercase">
                <span>Total GMV</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-poppins font-extrabold text-slate-900">₹{totalGMV.toLocaleString()}</div>
              <p className="text-[11px] text-slate-500 font-medium">Gross Merchandise Value across completed sales</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-200 bg-amber-50/30 shadow-md space-y-2">
              <div className="flex justify-between items-center text-amber-800 text-xs font-mono font-bold uppercase">
                <span>Platform Earnings (10%)</span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-poppins font-extrabold text-amber-900">₹{totalCommissions.toLocaleString()}</div>
              <p className="text-[11px] text-amber-900/70 font-medium">VastraChakra net platform revenue</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-2">
              <div className="flex justify-between items-center text-slate-500 text-xs font-mono font-bold uppercase">
                <span>Seller Payouts</span>
                <Wallet className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-3xl font-poppins font-extrabold text-slate-900">₹{totalPayouts.toLocaleString()}</div>
              <p className="text-[11px] text-slate-500 font-medium">Distributed directly to verified sellers</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-purple-200 bg-purple-50/30 shadow-md space-y-2">
              <div className="flex justify-between items-center text-purple-900 text-xs font-mono font-bold uppercase">
                <span>Bargain Success Rate</span>
                <Tag className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-poppins font-extrabold text-purple-900">{bargainSuccessRate}%</div>
              <p className="text-[11px] text-purple-900/70 font-medium">{offers.length} total negotiation offers submitted</p>
            </div>
          </div>

          {/* Detailed Transaction Ledger Table */}
          {perms.canViewOrders && (
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg space-y-4 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-poppins font-bold text-lg text-slate-900">Completed Orders & Financial Ledger ({orders.length})</h3>
                  <p className="text-xs text-slate-500">Real-time payment records, payment gateway receipts, and commission allocations</p>
                </div>

                <button
                  onClick={handleExportTransactionsCSV}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold transition-all shadow flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Transactions CSV</span>
                </button>
              </div>

              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Order Ref</th>
                        <th className="p-3.5">Buyer</th>
                        <th className="p-3.5">Item Title</th>
                        <th className="p-3.5">Final Price</th>
                        <th className="p-3.5">Commission (10%)</th>
                        <th className="p-3.5">Seller Payout</th>
                        <th className="p-3.5">Payment Method</th>
                        <th className="p-3.5">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {orders.map(ord => (
                        <tr key={ord.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-amber-800">{ord.orderNumber}</td>
                          <td className="p-3.5 font-sans font-bold text-slate-900">{ord.buyerName}</td>
                          <td className="p-3.5 font-sans truncate max-w-xs">{ord.item.title}</td>
                          <td className="p-3.5 font-bold text-slate-900">₹{ord.amount.toLocaleString()}</td>
                          <td className="p-3.5 font-bold text-amber-700">₹{ord.commissionAmount.toLocaleString()}</td>
                          <td className="p-3.5 font-bold text-emerald-700">₹{ord.sellerPayout.toLocaleString()}</td>
                          <td className="p-3.5 uppercase">{ord.paymentMethod}</td>
                          <td className="p-3.5 text-slate-500">{ord.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 border border-slate-100 rounded-2xl">
                  No transactions completed yet. Orders placed by consumers will appear here in real-time.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Master Database & User/Industry Profiles */}
      {activeTab === 'users_db' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-poppins font-bold text-xl text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-600" />
                <span>Master User & Industry Partner Database ({filteredUsers.length} / {users.length})</span>
              </h2>
              <p className="text-xs text-slate-600">
                Audit log of registered accounts, emails, contacts, passwords, and live Active/Logged-Out status.
              </p>
            </div>

            {/* CSV Toolbar */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportUsersCSV}
                className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs transition-all shadow flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export Users DB (CSV)</span>
              </button>

              <button
                onClick={handleExportListingsCSV}
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-mono font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export Listings (CSV)</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search name, email, phone, GST..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
                <Filter className="w-3 h-3 text-slate-400" />
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value as any)}
                  className="bg-transparent focus:outline-none font-bold text-slate-700 cursor-pointer"
                >
                  <option value="All">All User Roles</option>
                  <option value="customer">Consumers / Sellers</option>
                  <option value="industry_partner">Industry Partners</option>
                  <option value="admin">System Admins</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
                <Activity className="w-3 h-3 text-slate-400" />
                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value as any)}
                  className="bg-transparent focus:outline-none font-bold text-slate-700 cursor-pointer"
                >
                  <option value="All">All Activity Statuses</option>
                  <option value="active">Active Online Now 🟢</option>
                  <option value="logged_out">Logged Out 🔴</option>
                </select>
              </div>
            </div>
          </div>

          {/* Master User & Company Database Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-4">User / Contact Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Phone Number</th>
                    <th className="p-4">Password (Admin Audit)</th>
                    <th className="p-4">Role & Org</th>
                    <th className="p-4">Active Status</th>
                    <th className="p-4">Account Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-amber-50/40">
                      <td className="p-4 font-sans font-bold text-slate-900">{u.name}</td>
                      <td className="p-4 font-bold text-slate-800">{u.email}</td>
                      <td className="p-4 text-slate-600">{u.phone || 'Not Provided'}</td>
                      <td className="p-4 font-bold text-purple-700 bg-purple-50/50 rounded-lg">
                        {perms.canViewPasswords ? (u.password || '(No Password Set)') : '•••••••• (Protected)'}
                      </td>
                      <td className="p-4 font-sans">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-900 border border-purple-300' : u.role === 'industry_partner' ? 'bg-teal-100 text-teal-900 border border-teal-300' : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}>
                          {u.isFounder ? 'FOUNDER' : u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isOnline ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${u.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                          <span>{u.isOnline ? 'Active Online' : 'Logged Out'}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        {u.isFounder ? (
                          <span className="text-[10px] text-purple-800 font-bold">SUPER ADMIN (PROTECTED)</span>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            {isFounder && (
                              u.role === 'admin' ? (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedUserForAdmin(u);
                                      setPermissionForm(u.adminPermissions || { canViewInsights: true, canViewOrders: true, canViewPasswords: false, canManageCatalog: true, canManageIndustry: true });
                                    }}
                                    className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg text-[10px] font-bold"
                                  >
                                    Edit Rights
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Revoke admin rights for ${u.name}?`)) revokeAdminRights(u.id);
                                    }}
                                    className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[10px] font-bold"
                                  >
                                    Revoke Admin
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedUserForAdmin(u);
                                    setPermissionForm({ canViewInsights: true, canViewOrders: true, canViewPasswords: false, canManageCatalog: true, canManageIndustry: true });
                                  }}
                                  className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-[10px] font-bold shadow flex items-center gap-1"
                                >
                                  <UserPlus className="w-3 h-3 text-amber-300" /> Make Admin
                                </button>
                              )
                            )}

                            <button
                              onClick={() => {
                                if (confirm(`Permanently remove user account "${u.name}" (${u.email}) from VastraChakra?`)) {
                                  removeUserAccount(u.id);
                                  alert(`Account for ${u.name} removed successfully.`);
                                }
                              }}
                              className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-[10px] font-bold flex items-center gap-1"
                            >
                              <UserMinus className="w-3 h-3 text-red-600" /> Remove Account
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Admin Rights & Team Governance (Founder Super Admin Control) */}
      {activeTab === 'admin_team' && isFounder && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h2 className="font-poppins font-bold text-xl text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-700" />
              <span>Admin Rights & Granular Permission Governance</span>
            </h2>
            <p className="text-xs text-slate-600">
              Founder Sanyam Control Portal: Promote trusted members to Admin and govern exact permission rights (Insights, Orders, Passwords, Catalog, Industry).
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {adminUsers.map(adm => (
              <div key={adm.id} className="bg-white border border-purple-200 rounded-3xl p-6 space-y-4 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-purple-700 tracking-wider">
                      {adm.isFounder ? 'SUPER ADMIN (FOUNDER)' : 'PROMOTED SUB-ADMIN'}
                    </span>
                    <h3 className="font-poppins font-bold text-lg text-slate-900 mt-0.5">
                      {adm.name}
                    </h3>
                    <p className="text-xs text-slate-600">Email: {adm.email} • Phone: {adm.phone || 'N/A'}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                    adm.isOnline ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {adm.isOnline ? 'ACTIVE ONLINE' : 'LOGGED OUT'}
                  </span>
                </div>

                {/* Permissions Breakdown Badges */}
                <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2 text-xs">
                  <div className="font-bold text-purple-900">Governed Admin Permissions:</div>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                    <span className={`px-2 py-0.5 rounded-full ${adm.adminPermissions?.canViewInsights !== false ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-400 line-through'}`}>
                      [Insights & GMV]
                    </span>
                    <span className={`px-2 py-0.5 rounded-full ${adm.adminPermissions?.canViewOrders !== false ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-400 line-through'}`}>
                      [Orders Ledger]
                    </span>
                    <span className={`px-2 py-0.5 rounded-full ${adm.adminPermissions?.canViewPasswords ? 'bg-purple-100 text-purple-900 font-bold' : 'bg-slate-100 text-slate-400 line-through'}`}>
                      [Passwords View]
                    </span>
                    <span className={`px-2 py-0.5 rounded-full ${adm.adminPermissions?.canManageCatalog !== false ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-400 line-through'}`}>
                      [Catalog & Products]
                    </span>
                    <span className={`px-2 py-0.5 rounded-full ${adm.adminPermissions?.canManageIndustry !== false ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-400 line-through'}`}>
                      [Industry Members]
                    </span>
                  </div>
                </div>

                {!adm.isFounder && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => {
                        setSelectedUserForAdmin(adm);
                        setPermissionForm(adm.adminPermissions || { canViewInsights: true, canViewOrders: true, canViewPasswords: false, canManageCatalog: true, canManageIndustry: true });
                      }}
                      className="flex-1 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-all shadow"
                    >
                      Configure Permissions
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Revoke admin privileges for ${adm.name}?`)) revokeAdminRights(adm.id);
                      }}
                      className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200"
                    >
                      Revoke Admin
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Permanently remove admin account "${adm.name}" (${adm.email}) from VastraChakra?`)) {
                          removeUserAccount(adm.id);
                          alert(`Admin account for ${adm.name} removed.`);
                        }
                      }}
                      className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 flex items-center gap-1"
                    >
                      <UserMinus className="w-3.5 h-3.5 text-red-600" /> Remove Account
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Video Moderation Queue */}
      {activeTab === 'moderation' && perms.canManageCatalog && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h2 className="font-poppins font-bold text-xl text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-amber-600" />
              <span>Pending Item Verification & Video Moderation Queue ({pendingListings.length})</span>
            </h2>
            <p className="text-xs text-slate-600">
              Inspect video proof, verify usage age (&le; 3 yrs), brand authenticity & hygiene ratings before approving live to the public marketplace.
            </p>
          </div>

          {pendingListings.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {pendingListings.map(item => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-amber-700 tracking-wider">
                        Brand: {item.brand} • Category: {item.category}
                      </span>
                      <h3 className="font-poppins font-bold text-lg text-slate-900 mt-0.5">{item.title}</h3>
                      <div className="text-xs text-slate-500 font-mono">Seller: {item.ownerName}</div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                      PENDING VERIFICATION
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
                    <p className="text-slate-600 text-[11px] font-mono truncate">{item.videoUrl || 'No video link attached'}</p>
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
                      <div className="text-[10px] text-slate-500 font-mono">Asking Price</div>
                      <div className="font-bold text-emerald-800">₹{item.price}</div>
                    </div>
                  </div>

                  {/* Moderation Controls */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        moderateListing(item.id, 'listed');
                        alert('Listing verified & approved to live marketplace!');
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-poppins font-bold text-xs transition-all shadow flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Publish Live</span>
                    </button>

                    <button
                      onClick={() => moderateListing(item.id, 'rejected')}
                      className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-red-700 font-poppins font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-red-200"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
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

      {/* TAB 5: Industry Partners Management (Approve / Remove Industry Member) */}
      {activeTab === 'industry_mgmt' && perms.canManageIndustry && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-poppins font-bold text-xl text-slate-900">
                Industry Partner Accounts & Access ({industryUsers.length})
              </h2>
              <p className="text-xs text-slate-600">
                Approve verified recyclers/mills or remove industry partner accounts from platform.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {industryUsers.map(u => (
              <div key={u.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-poppins font-bold text-lg text-slate-900">{u.businessName || u.name}</h3>
                    <p className="text-xs text-slate-600">Email: {u.email} • GST: {u.gstNumber || 'N/A'}</p>
                    <p className="text-[11px] text-slate-500 font-mono">Contact: {u.phone || '8708288911'}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    u.isVerified !== false ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {u.isVerified !== false ? 'VERIFIED' : 'PENDING'}
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  {!u.isVerified && (
                    <button
                      onClick={() => approveIndustryUser(u.id)}
                      className="flex-1 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Account</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm(`Remove industry partner "${u.businessName || u.name}" from VastraChakra?`)) {
                        removeIndustryMember(u.id);
                      }
                    }}
                    className="py-2.5 px-4 rounded-full bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span>Remove Member</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Product & Catalog Governance (Add/Remove Products & 5-Day Auto Cleanup) */}
      {activeTab === 'catalog_mgmt' && perms.canManageCatalog && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-poppins font-bold text-xl text-slate-900">
                Live Catalog & Product Governance ({items.length})
              </h2>
              <p className="text-xs text-slate-600">
                Manually remove products from website or run 5-day sold product auto-cleanup.
              </p>
            </div>

            <button
              onClick={() => {
                cleanupSoldProducts5Days();
                alert('Auto-cleanup executed! Sold items older than 5 days with feedback have been archived.');
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all shadow flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Run 5-Day Sold Items Auto-Cleanup</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-4">Item Title</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Expected Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{item.title}</td>
                    <td className="p-4">{item.brand}</td>
                    <td className="p-4 text-slate-600">{item.ownerName}</td>
                    <td className="p-4 font-bold text-slate-900">₹{item.price}</td>
                    <td className="p-4">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        item.status === 'listed' ? 'bg-emerald-100 text-emerald-800' : item.status === 'sold' ? 'bg-purple-100 text-purple-900' : item.status === 'archived' ? 'bg-slate-200 text-slate-600' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          if (confirm(`Remove product "${item.title}" from website?`)) {
                            removeProduct(item.id);
                          }
                        }}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-[10px] font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: Tier 2 Recycling Pickups */}
      {activeTab === 'pickups' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-poppins font-bold text-xl text-slate-900">
                Household Recycling Requests ({pendingPickups.length})
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

      {/* FOUNDER MODAL: Configure Admin Rights */}
      {selectedUserForAdmin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-purple-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider">FOUNDER GOVERNANCE PORTAL</span>
                <h3 className="font-poppins font-bold text-xl text-slate-900">
                  Assign Admin Rights
                </h3>
                <p className="text-xs text-slate-500">User: <strong className="text-purple-900">{selectedUserForAdmin.name}</strong> ({selectedUserForAdmin.email})</p>
              </div>

              <button onClick={() => setSelectedUserForAdmin(null)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
              <div className="font-bold text-purple-900 text-xs mb-2">Configure Governed Permissions:</div>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={permissionForm.canViewInsights}
                  onChange={(e) => setPermissionForm(prev => ({ ...prev, canViewInsights: e.target.checked }))}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>View Dashboard Insights & GMV Revenue</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={permissionForm.canViewOrders}
                  onChange={(e) => setPermissionForm(prev => ({ ...prev, canViewOrders: e.target.checked }))}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>View Completed Orders & Financial Ledger</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={permissionForm.canViewPasswords}
                  onChange={(e) => setPermissionForm(prev => ({ ...prev, canViewPasswords: e.target.checked }))}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>View User Passwords & Sensitive Security Credentials</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={permissionForm.canManageCatalog}
                  onChange={(e) => setPermissionForm(prev => ({ ...prev, canManageCatalog: e.target.checked }))}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>Moderate, Add & Remove Marketplace Products</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={permissionForm.canManageIndustry}
                  onChange={(e) => setPermissionForm(prev => ({ ...prev, canManageIndustry: e.target.checked }))}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>Approve & Remove Industry Partners</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedUserForAdmin(null)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAdminRights}
                className="flex-1 py-2.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Admin Rights</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
