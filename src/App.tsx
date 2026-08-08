import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Marketplace } from './components/Marketplace';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SellItemModal } from './components/SellItemModal';
import { RecyclingModal } from './components/RecyclingModal';
import { CartDrawer } from './components/CartDrawer';
import { IndustryDashboard } from './components/IndustryDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { IndustryAccessModal } from './components/IndustryAccessModal';
import { UserProfile } from './components/UserProfile';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const { currentUser } = useApp();

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-between font-inter">
      <div>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main>
          {activeTab === 'home' && <LandingPage setActiveTab={setActiveTab} />}
          {activeTab === 'marketplace' && <Marketplace />}
          {activeTab === 'industry' && <IndustryDashboard />}
          {activeTab === 'admin' && <AdminDashboard />}
          {activeTab === 'profile' && <UserProfile />}
        </main>
      </div>

      <Footer setActiveTab={setActiveTab} />

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <SellItemModal />
      <RecyclingModal />
      <CartDrawer />
      <AuthModal />
      <IndustryAccessModal />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ToastProvider>
  );
}

