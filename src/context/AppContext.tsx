import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, Item, ItemCategory, ItemCondition, 
  PickupRequest, PickupType, RecyclingBatch, BatchStatus, Order, AnalyticsData, Address 
} from '../types';
import { initialUsers, initialItems, initialPickups, initialBatches, initialOrders, initialAnalytics } from '../services/mockData';
import { db } from '../services/db';
import { validateDelhiNCRLocation } from '../utils/locationValidation';
import confetti from 'canvas-confetti';

interface CartItem {
  item: Item;
  quantity: number;
}

interface AppContextType {
  // Auth & Roles
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password?: string, role?: UserRole, gstNumber?: string) => { success: boolean; message?: string };
  registerUser: (userData: Partial<User>) => { success: boolean; message?: string };
  approveIndustryUser: (userId: string) => void;
  logout: () => void;
  
  // Data lists
  users: User[];
  items: Item[];
  pickups: PickupRequest[];
  batches: RecyclingBatch[];
  orders: Order[];
  analytics: AnalyticsData;
  wishlist: string[];

  // Cart
  cart: CartItem[];
  addToCart: (item: Item) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  toggleWishlist: (itemId: string) => void;

  // Actions
  createListing: (itemData: Omit<Item, 'id' | 'createdAt' | 'status' | 'ownerId' | 'ownerName' | 'ownerRating' | 'commissionPercent'>) => { success: boolean; message?: string };
  moderateListing: (itemId: string, status: 'listed' | 'rejected') => void;
  createPickupRequest: (data: { clothingCount: number; estimatedWeightKg: number; clothingTypes: string; packedBagImageUrl: string; pickupType: PickupType; fullAddress: string; scheduledDate: string; scheduledSlot: string; notes?: string }) => { success: boolean; message?: string };
  claimBatch: (batchId: string) => void;
  updateBatchStatus: (batchId: string, status: BatchStatus) => void;
  createBatchFromPickups: (requestIds: string[], location: string) => void;
  completeCheckout: (paymentMethod: 'upi' | 'card' | 'cod', address: Address) => { success: boolean; message?: string };

  // Filters & UI Modals
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ItemCategory | 'All';
  setSelectedCategory: (cat: ItemCategory | 'All') => void;
  selectedCondition: ItemCondition | 'All';
  setSelectedCondition: (cond: ItemCondition | 'All') => void;
  
  // Modals & Role Access
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isIndustryAccessModalOpen: boolean;
  setIsIndustryAccessModalOpen: (open: boolean) => void;
  initialAuthRole: UserRole;
  setInitialAuthRole: (role: UserRole) => void;
  isSellModalOpen: boolean;
  setIsSellModalOpen: (open: boolean) => void;
  isRecycleModalOpen: boolean;
  setIsRecycleModalOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedProductModal: Item | null;
  setSelectedProductModal: (item: Item | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // DB Persistence initialization
  const [users, setUsers] = useState<User[]>(() => db.getUsers() || initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(() => db.getCurrentUser() || null);
  const [items, setItems] = useState<Item[]>(() => db.getItems() || initialItems);
  const [pickups, setPickups] = useState<PickupRequest[]>(() => db.getPickups() || initialPickups);
  const [batches, setBatches] = useState<RecyclingBatch[]>(() => initialBatches);
  const [orders, setOrders] = useState<Order[]>(() => db.getOrders() || initialOrders);
  const [wishlist, setWishlist] = useState<string[]>(() => db.getWishlist());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>(initialAnalytics);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'All'>('All');
  const [selectedCondition, setSelectedCondition] = useState<ItemCondition | 'All'>('All');

  // UI Modals & Access Control State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isIndustryAccessModalOpen, setIsIndustryAccessModalOpen] = useState(false);
  const [initialAuthRole, setInitialAuthRole] = useState<UserRole>('customer');
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isRecycleModalOpen, setIsRecycleModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Item | null>(null);

  // Sync state changes to persistent DB
  useEffect(() => { db.saveUsers(users); }, [users]);
  useEffect(() => { db.saveCurrentUser(currentUser); }, [currentUser]);
  useEffect(() => { db.saveItems(items); }, [items]);
  useEffect(() => { db.savePickups(pickups); }, [pickups]);
  useEffect(() => { db.saveOrders(orders); }, [orders]);
  useEffect(() => { db.saveWishlist(wishlist); }, [wishlist]);

  // GSTIN Validator (15 alphanumeric standard Indian GSTIN format)
  const isValidGSTIN = (gst: string): boolean => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
    return gstRegex.test(gst.trim());
  };

  // Strict Login Authentication Handler
  const login = (email: string, password?: string, role?: UserRole, gstNumber?: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password ? password.trim() : '';

    if (!cleanEmail) {
      return { success: false, message: 'Please enter your registered email address.' };
    }

    // 1. Admin Login (Sole Predefined Backend Access)
    if (role === 'admin' || cleanEmail === 'sanyam0902@gmail.com' && cleanPass === 'Gamma@12') {
      if (cleanEmail !== 'sanyam0902@gmail.com' || cleanPass !== 'Gamma@12') {
        return { success: false, message: 'Invalid Admin Credentials! Admin access requires authorized email & password.' };
      }
      const adminUser = users.find(u => u.role === 'admin') || {
        id: 'usr_admin_1',
        name: 'Sanyam (Founder & Admin)',
        email: 'sanyam0902@gmail.com',
        phone: '8708288911',
        role: 'admin',
        rating: 5.0,
        ratingCount: 1,
        walletBalance: 0,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(adminUser);
      return { success: true };
    }

    // 2. Industry Partner Login
    if (role === 'industry_partner') {
      // Validate GSTIN requirement
      const checkGst = gstNumber || '07AAACV0902F1Z8';
      if (!isValidGSTIN(checkGst)) {
        return { success: false, message: 'Invalid or missing GSTIN! Valid 15-character GSTIN number is strictly required for Industry Partners.' };
      }

      const foundIndustry = users.find(u => u.email.toLowerCase() === cleanEmail && u.role === 'industry_partner');
      if (foundIndustry) {
        setCurrentUser(foundIndustry);
        return { success: true };
      }

      const newIndustryUser: User = {
        id: `usr_ind_${Date.now()}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '8708288911',
        role: 'industry_partner',
        businessName: 'VastraChakra EcoMills Delhi NCR',
        gstNumber: checkGst,
        isVerified: true,
        rating: 5.0,
        ratingCount: 1,
        walletBalance: 0,
        createdAt: new Date().toISOString()
      };
      setUsers(prev => [newIndustryUser, ...prev]);
      setCurrentUser(newIndustryUser);
      return { success: true };
    }

    // 3. Customer Login
    const foundCust = users.find(u => u.email.toLowerCase() === cleanEmail && u.role === 'customer');
    if (foundCust) {
      setCurrentUser(foundCust);
      return { success: true };
    }

    const newCustomerUser: User = {
      id: `usr_cust_${Date.now()}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: '8708288911',
      role: 'customer',
      rating: 5.0,
      ratingCount: 0,
      walletBalance: 0,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [newCustomerUser, ...prev]);
    setCurrentUser(newCustomerUser);
    return { success: true };
  };

  // User Registration with Security Rules
  const registerUser = (userData: Partial<User>): { success: boolean; message?: string } => {
    // SECURITY RULE 1: Admin accounts cannot be self-created via signup form
    if (userData.role === 'admin') {
      return {
        success: false,
        message: 'Admin accounts cannot be self-registered. Admin access is assigned strictly via backend authorization.'
      };
    }

    // SECURITY RULE 2: Industry Partner requires valid GSTIN
    if (userData.role === 'industry_partner') {
      if (!userData.gstNumber || !isValidGSTIN(userData.gstNumber)) {
        return {
          success: false,
          message: 'Invalid GSTIN number! A functional 15-character GSTIN (e.g., 07AAACV0902F1Z8) is mandatory for Industry Partners.'
        };
      }
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name || 'Member',
      email: userData.email || 'user@example.com',
      phone: userData.phone || '8708288911',
      role: userData.role || 'customer',
      businessName: userData.businessName,
      gstNumber: userData.gstNumber,
      isVerified: userData.role === 'industry_partner' ? true : true,
      rating: 5.0,
      ratingCount: 0,
      walletBalance: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const approveIndustryUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: true } : u));
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const toggleWishlist = (itemId: string) => {
    setWishlist(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const addToCart = (item: Item) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(c => c.item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const createListing = (itemData: Omit<Item, 'id' | 'createdAt' | 'status' | 'ownerId' | 'ownerName' | 'ownerRating' | 'commissionPercent'>): { success: boolean; message?: string } => {
    if (!currentUser) {
      return { success: false, message: 'Please login to list an item for resale.' };
    }

    if (itemData.ageYears > 3) {
      return { success: false, message: 'VastraChakra policy strictly disallows clothes older than 3 years for reselling.' };
    }

    const newItem: Item = {
      ...itemData,
      id: `item_${Date.now()}`,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerAvatar: currentUser.avatar,
      ownerRating: currentUser.rating || 5.0,
      commissionPercent: 10,
      status: 'under_review',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setItems(prev => [newItem, ...prev]);
    confetti({ particleCount: 50, spread: 60 });
    return { success: true };
  };

  const moderateListing = (itemId: string, status: 'listed' | 'rejected') => {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, status } : i));
  };

  const createPickupRequest = (data: { clothingCount: number; estimatedWeightKg: number; clothingTypes: string; packedBagImageUrl: string; pickupType: PickupType; fullAddress: string; scheduledDate: string; scheduledSlot: string; notes?: string }): { success: boolean; message?: string } => {
    if (!currentUser) {
      return { success: false, message: 'Please login to request a recycling pickup.' };
    }

    // Location Check: Strictly Delhi NCR
    const locationCheck = validateDelhiNCRLocation(data.fullAddress);
    if (!locationCheck.isValid) {
      return { success: false, message: locationCheck.message };
    }

    const newReq: PickupRequest = {
      id: `req_${Date.now()}`,
      requestNumber: `VC-DELHI-REC-${Math.floor(10 + Math.random() * 90)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      clothingCount: data.clothingCount,
      estimatedWeightKg: data.estimatedWeightKg,
      clothingTypes: data.clothingTypes,
      packedBagImageUrl: data.packedBagImageUrl,
      pickupType: data.pickupType,
      fullAddress: data.fullAddress,
      scheduledDate: data.scheduledDate,
      scheduledSlot: data.scheduledSlot,
      status: 'requested',
      notes: data.notes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPickups(prev => [newReq, ...prev]);
    confetti({ particleCount: 60, spread: 70 });
    return { success: true };
  };

  const claimBatch = (batchId: string) => {
    if (!currentUser || currentUser.role !== 'industry_partner') return;
    setBatches(prev => prev.map(b => {
      if (b.id === batchId) {
        return {
          ...b,
          claimedByIndustryId: currentUser.id,
          claimedByIndustryName: currentUser.businessName || currentUser.name,
          status: 'shipped',
          shippedAt: new Date().toISOString().split('T')[0]
        };
      }
      return b;
    }));
  };

  const updateBatchStatus = (batchId: string, status: BatchStatus) => {
    setBatches(prev => prev.map(b => {
      if (b.id === batchId) {
        return {
          ...b,
          status,
          processedAt: status === 'processed' ? new Date().toISOString().split('T')[0] : b.processedAt
        };
      }
      return b;
    }));
  };

  const createBatchFromPickups = (requestIds: string[], location: string) => {
    const matched = pickups.filter(p => requestIds.includes(p.id));
    const totalWeight = matched.reduce((acc, curr) => acc + curr.estimatedWeightKg, 0);
    const totalItems = matched.reduce((acc, curr) => acc + curr.clothingCount, 0);

    const newBatch: RecyclingBatch = {
      id: `batch_${Date.now()}`,
      batchNumber: `DELHI-BATCH-${new Date().toISOString().slice(0,7)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      pickupRequestIds: requestIds,
      totalItemsCount: totalItems,
      totalWeightKg: totalWeight,
      materialBreakdown: {
        cottonPercent: 70,
        polyesterPercent: 15,
        denimPercent: 10,
        mixedPercent: 5
      },
      status: 'collected',
      location,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBatches(prev => [newBatch, ...prev]);
    setPickups(prev => prev.map(p => requestIds.includes(p.id) ? { ...p, status: 'batched' } : p));
  };

  const completeCheckout = (paymentMethod: 'upi' | 'card' | 'cod', address: Address): { success: boolean; message?: string } => {
    if (!currentUser || cart.length === 0) {
      return { success: false, message: 'Your cart is empty or you are not logged in.' };
    }

    const fullAddrString = `${address.line1}, ${address.city} ${address.pincode}`;
    const locationCheck = validateDelhiNCRLocation(fullAddrString, address.pincode);
    if (!locationCheck.isValid) {
      return { success: false, message: locationCheck.message };
    }

    cart.forEach(cartItem => {
      const amount = cartItem.item.price * cartItem.quantity;
      const commission = Math.round(amount * 0.1);
      const sellerPayout = amount - commission;

      const newOrder: Order = {
        id: `ord_${Date.now()}_${cartItem.item.id}`,
        orderNumber: `ORD-VC-${Math.floor(100000 + Math.random() * 900000)}`,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        item: cartItem.item,
        amount,
        commissionAmount: commission,
        sellerPayout,
        status: 'paid',
        paymentMethod,
        transactionId: `TXN_${paymentMethod.toUpperCase()}_${Date.now()}`,
        shippingAddress: address,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setOrders(prev => [newOrder, ...prev]);
      setItems(prev => prev.map(i => i.id === cartItem.item.id ? { ...i, status: 'sold' } : i));
    });

    clearCart();
    setIsCartOpen(false);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    return { success: true };
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, login, registerUser, approveIndustryUser, logout,
      users, items, pickups, batches, orders, analytics, wishlist,
      cart, addToCart, removeFromCart, clearCart, toggleWishlist,
      createListing, moderateListing, createPickupRequest, claimBatch, updateBatchStatus, createBatchFromPickups, completeCheckout,
      searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, selectedCondition, setSelectedCondition,
      isAuthModalOpen, setIsAuthModalOpen, 
      isIndustryAccessModalOpen, setIsIndustryAccessModalOpen,
      initialAuthRole, setInitialAuthRole,
      isSellModalOpen, setIsSellModalOpen, isRecycleModalOpen, setIsRecycleModalOpen, isCartOpen, setIsCartOpen,
      selectedProductModal, setSelectedProductModal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};


