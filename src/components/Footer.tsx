import React from 'react';
import { Home, ShoppingBag, Tag, Recycle as Recycling, Factory, ShieldCheck, Heart, Leaf } from 'lucide-react';

export const Footer: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  return (
    <footer className="bg-forest-900 text-cream-200 border-t border-forest-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info with Circular Emblem & Rectangular Banner Logo */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-md shrink-0">
                <img src="/logo-emblem.jpg" alt="VastraChakra Circular Emblem" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="font-poppins font-bold text-lg text-cream-100 flex items-center gap-1.5">
                <span>VastraChakra</span>
                <img src="/chakra-icon.png" alt="Chakra" className="w-4 h-4 object-contain inline" />
              </span>
            </div>
            <p className="text-xs text-cream-300/80 leading-relaxed">
              Delhi NCR Sustainable Startup. Extending garment lifecycle through pre-loved clothing resale and industrial textile recycling.
            </p>
          </div>

          {/* Navigation Quick Links with SVG Icons */}
          <div className="space-y-2 text-xs">
            <h4 className="font-poppins font-bold text-cream-100 uppercase tracking-wider text-[11px] text-warmgold-400">Platform Navigation</h4>
            <ul className="space-y-2 text-cream-300">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-warmgold-400" />
                  <span>Home Page</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('marketplace')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-terracotta-500" />
                  <span>Buy Pre-loved Clothes</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('marketplace')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-earthteal-400" />
                  <span>Sell Garments</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Circular Services */}
          <div className="space-y-2 text-xs">
            <h4 className="font-poppins font-bold text-cream-100 uppercase tracking-wider text-[11px] text-warmgold-400">Circular Ecosystem</h4>
            <ul className="space-y-2 text-cream-300">
              <li className="flex items-center gap-1.5">
                <Recycling className="w-3.5 h-3.5 text-earthteal-400" />
                <span>Doorstep Textile Recycling</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-teal-300" />
                <span>Industry Feedstock Procurement</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Quality Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Sustainability Mission */}
          <div className="space-y-2 text-xs">
            <h4 className="font-poppins font-bold text-cream-100 uppercase tracking-wider text-[11px] text-warmgold-400">Startup Mission</h4>
            <p className="text-cream-300/80 leading-relaxed">
              Every garment receives a second life. Building India's zero landfill circular fashion ecosystem.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-forest-800 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400/60 gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo-emblem.jpg" alt="VastraChakra Trademark" className="w-4 h-4 rounded-full object-cover" />
            <span>© 2026 VastraChakra Circular Fashion Platform. Registered Delhi NCR Startup.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('admin')}
              className="text-[11px] text-cream-300/60 hover:text-cream-200 transition-colors underline flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Portal Access</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

