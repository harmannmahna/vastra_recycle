import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { X, User, Factory, ShieldCheck, Instagram, AlertCircle, CheckCircle2, Building2, Camera, Upload } from 'lucide-react';
import { getDefaultAvatar } from '../utils/avatarUtils';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, registerUser, initialAuthRole } = useApp();
  const [isRegister, setIsRegister] = useState(false);

  // Selected Role Tab for Login / Register
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('customer');

  useEffect(() => {
    if (initialAuthRole) {
      setSelectedRoleTab(initialAuthRole);
    }
  }, [initialAuthRole, isAuthModalOpen]);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'female' | 'male' | 'other'>('female');
  const [avatar, setAvatar] = useState<string>('');
  const [businessName, setBusinessName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  // Handle Tab Switch
  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRoleTab(role);
    setErrorMessage('');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size should be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }

      if (!phone.trim() || !/^[0-9]{10}$/.test(phone.trim())) {
        setErrorMessage('Please enter a valid 10-digit mobile phone number.');
        return;
      }

      // SECURITY CHECK 1: Admin accounts cannot be created via frontend signup
      if (selectedRoleTab === 'admin') {
        setErrorMessage('Admin accounts cannot be self-registered. Access is provisioned strictly via system administrator authorization.');
        return;
      }

      // SECURITY CHECK 2: GSTIN required for Industry Partner
      if (selectedRoleTab === 'industry_partner') {
        if (!gstNumber.trim()) {
          setErrorMessage('Functional GSTIN number is strictly required for Industry Partners.');
          return;
        }
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
        if (!gstRegex.test(gstNumber.trim())) {
          setErrorMessage('Invalid GSTIN format! Please enter a valid 15-character GSTIN.');
          return;
        }
      }

      const res = registerUser({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        phone: phone.trim(),
        gender,
        avatar: avatar.trim() || undefined,
        role: selectedRoleTab,
        businessName: selectedRoleTab === 'industry_partner' ? businessName : undefined,
        gstNumber: selectedRoleTab === 'industry_partner' ? gstNumber.trim() : undefined
      });

      if (res.success) {
        setIsAuthModalOpen(false);
      } else {
        setErrorMessage(res.message || 'Registration failed.');
      }
    } else {
      // Login Flow
      if (selectedRoleTab === 'industry_partner' && gstNumber.trim()) {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
        if (!gstRegex.test(gstNumber.trim())) {
          setErrorMessage('Invalid GSTIN format! Please enter a valid 15-character GSTIN.');
          return;
        }
      }

      const res = login(email, password, selectedRoleTab, gstNumber);
      if (res.success) {
        setIsAuthModalOpen(false);
      } else {
        setErrorMessage(res.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FDFBF7] border border-forest-700/15 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header with Circular Emblem Logo */}
        <div className="flex items-center justify-between border-b border-forest-700/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="h-12 w-12 rounded-full overflow-hidden shadow-md hover:shadow-xl transition-shadow flex items-center justify-center shrink-0">
                <img src="/logo-emblem.jpg" alt="VastraChakra Circular Emblem" className="h-full w-full object-cover rounded-full" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-forest-900/15 rounded-full blur-xs pointer-events-none"></div>
            </div>
            <div>
              <h2 className="font-poppins font-bold text-xl text-forest-900 flex items-center gap-1.5">
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                <img src="/chakra-icon.png" alt="Chakra" className="w-4 h-4 object-contain" />
              </h2>
              <p className="text-xs text-forest-900/60 font-medium">
                VastraChakra Ecosystem
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 hover:bg-forest-900/10 text-forest-900 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selection Tabs */}
        <div>
          <label className="block text-[11px] font-bold text-forest-900 mb-1.5 uppercase tracking-wider">
            Portal Role Selection:
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-cream-200/60 rounded-2xl border border-forest-700/10">
            <button
              type="button"
              onClick={() => handleRoleTabChange('customer')}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                selectedRoleTab === 'customer'
                  ? 'bg-forest-900 text-cream-100 shadow-md'
                  : 'text-forest-900/70 hover:text-forest-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('industry_partner')}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                selectedRoleTab === 'industry_partner'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'text-forest-900/70 hover:text-forest-900'
              }`}
            >
              <Factory className="w-3.5 h-3.5" />
              <span>Industry</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isRegister) {
                  setErrorMessage('Admin accounts cannot be self-registered. Only pre-assigned system admins can log in.');
                } else {
                  handleRoleTabChange('admin');
                }
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                selectedRoleTab === 'admin'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-forest-900/70 hover:text-forest-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
          {isRegister && (
            <>
              <div>
                <label className="block font-semibold text-forest-900 mb-1">Full Name / Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-forest-900 mb-1">Mobile Phone Number (10 Digits) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/20 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-forest-900 mb-1">Gender *</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border text-center ${
                      gender === 'female'
                        ? 'bg-terracotta-500 text-white border-terracotta-600 shadow-xs'
                        : 'bg-white text-forest-900/70 border-forest-700/20 hover:border-forest-700/40'
                    }`}
                  >
                    Female
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border text-center ${
                      gender === 'male'
                        ? 'bg-forest-800 text-white border-forest-900 shadow-xs'
                        : 'bg-white text-forest-900/70 border-forest-700/20 hover:border-forest-700/40'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('other')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border text-center ${
                      gender === 'other'
                        ? 'bg-earthteal-600 text-white border-earthteal-700 shadow-xs'
                        : 'bg-white text-forest-900/70 border-forest-700/20 hover:border-forest-700/40'
                    }`}
                  >
                    Third Gender
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-forest-900 mb-1">Photograph (Optional)</label>
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-forest-700/20">
                  <img
                    src={avatar || getDefaultAvatar(gender)}
                    alt="Avatar Preview"
                    className="w-12 h-12 rounded-full object-cover border border-forest-700/20 shrink-0 shadow-xs"
                  />
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 text-xs font-semibold border border-forest-700/20 transition-colors">
                      <Camera className="w-3.5 h-3.5 text-forest-700" />
                      <span>Upload Custom Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {avatar && (
                      <button
                        type="button"
                        onClick={() => setAvatar('')}
                        className="ml-2 text-[11px] text-red-600 hover:underline"
                      >
                        Remove photo
                      </button>
                    )}
                    <p className="text-[10px] text-forest-900/60 mt-1">
                      If left blank, a default faceless avatar for your selected gender will be used. You can change this anytime from your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-semibold text-forest-900 mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-forest-900 mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/20"
            />
          </div>

          {/* Industry Partner GSTIN Requirements */}
          {selectedRoleTab === 'industry_partner' && (
            <>
              {isRegister && (
                <div>
                  <label className="block font-semibold text-forest-900 mb-1">Registered Company / Mill Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Panipat Fiber Recyclers Pvt Ltd"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-forest-900 mb-1 flex items-center justify-between">
                  <span>GSTIN Number (15 Digits) *</span>
                  <span className="text-[10px] text-terracotta-500 font-bold">Mandatory</span>
                </label>
                <input
                  type="text"
                  required={selectedRoleTab === 'industry_partner'}
                  placeholder="Enter 15-character GSTIN"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 bg-white border border-forest-700/20 rounded-xl focus:outline-none font-mono tracking-wider"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-full font-poppins font-bold text-sm transition-all shadow-md mt-2 flex items-center justify-center gap-2 ${
              selectedRoleTab === 'admin' 
                ? 'bg-amber-600 text-white hover:bg-amber-700' 
                : selectedRoleTab === 'industry_partner'
                ? 'bg-teal-700 text-white hover:bg-teal-800'
                : 'bg-forest-900 text-cream-100 hover:bg-forest-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isRegister ? 'Register Account' : `Sign In as ${selectedRoleTab.replace('_', ' ').toUpperCase()}`}</span>
          </button>
        </form>

        {/* Footer Instagram & Toggle */}
        <div className="pt-2 border-t border-forest-700/10 flex items-center justify-between text-xs text-forest-900/70">
          <a
            href="https://www.instagram.com/vastrachakra_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-pink-600 hover:underline font-bold"
          >
            <Instagram className="w-4 h-4" />
            <span>@vastrachakra_</span>
          </a>

          <button 
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMessage('');
              if (!isRegister && selectedRoleTab === 'admin') {
                setSelectedRoleTab('customer');
              }
            }}
            className="font-bold text-terracotta-500 hover:underline"
          >
            {isRegister ? 'Already have an account? Sign In' : 'New to VastraChakra? Create Account'}
          </button>
        </div>

      </div>
    </div>
  );
};
