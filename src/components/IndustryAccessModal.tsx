import React from 'react';
import { useApp } from './../context/AppContext';
import { X, Factory, ShieldCheck, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

export const IndustryAccessModal: React.FC = () => {
  const { 
    isIndustryAccessModalOpen, 
    setIsIndustryAccessModalOpen, 
    setIsAuthModalOpen, 
    setInitialAuthRole,
    currentUser 
  } = useApp();

  if (!isIndustryAccessModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4 relative">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 shadow-sm relative">
              <Factory className="w-6 h-6" />
              <span className="absolute -bottom-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-sm">
                <Lock className="w-3 h-3" />
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <span>Feature Locked</span>
              </div>
              <h2 className="font-poppins font-extrabold text-xl text-slate-900 leading-snug">
                Industry Access Required
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsIndustryAccessModalOpen(false)}
            className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Warning Message */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed font-medium flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-950 mb-0.5">
              {currentUser 
                ? `Logged in as Consumer (${currentUser.email})` 
                : 'Guest Visitor Access'}
            </p>
            <p className="text-amber-800">
              You must be logged in as an <strong>Industry Partner</strong> or <strong>System Admin</strong> to unlock and access B2B rate cards, bulk feedstock staging, and recycling mill directories.
            </p>
          </div>
        </div>

        {/* Hierarchical Role Access Guide (Concentric Levels) */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Platform Permission Hierarchy:
          </h3>

          <div className="space-y-2 text-xs">
            {/* Admin Level */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Admin Governance</span>
              </div>
              <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold">
                All Portals (Admin + Industry + Consumer)
              </span>
            </div>

            {/* Industry Level */}
            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-teal-900">
                <Factory className="w-4 h-4 text-teal-600" />
                <span>Industry Partner</span>
              </div>
              <span className="text-[10px] bg-teal-700 text-white px-2 py-0.5 rounded-full font-bold">
                Industry Hub + Consumer Marketplace
              </span>
            </div>

            {/* Consumer Level */}
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <User className="w-4 h-4 text-slate-500" />
                <span>Consumer / Seller</span>
              </div>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                Consumer Marketplace Only
              </span>
            </div>
          </div>
        </div>

        {/* Action CTA Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setIsIndustryAccessModalOpen(false);
              setInitialAuthRole('industry_partner');
              setIsAuthModalOpen(true);
            }}
            className="flex-1 py-3.5 px-5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-poppins font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Log In as Industry Partner</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsIndustryAccessModalOpen(false)}
            className="py-3.5 px-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-poppins font-semibold text-xs sm:text-sm transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
