import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, AdminPermissions, Item, ItemCategory, ItemCondition, 
  PickupRequest, PickupType, RecyclingBatch, BatchStatus, Order, AnalyticsData, Address, Offer 
} from '../types';
import { initialUsers, initialItems, initialPickups, initialBatches, initialOrders, initialAnalytics, initialOffers } from '../services/mockData';
import { db } from '../services/db';
import { validateDelhiNCRLocation } from '../utils/locationValidation';
import { calculateAiRecommendedPrice } from '../utils/aiPriceCalculator';
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
  updateUserProfile: (updatedData: Partial<User>) => void;
  approveIndustryUser: (userId: string) => void;
  logout: () => void;

  // Granular Admin Permissions & Founder Management
  promoteToAdmin: (userId: string, permissions: AdminPermissions) => void;
  revokeAdminRights: (userId: string) => void;
  updateAdminPermissions: (userId: string, permissions: AdminPermissions) => void;
  removeUserAccount: (userId: string) => void;
  removeIndustryMember: (userId: string) => void;
  removeProduct: (itemId: string) => void;
  submitOrderFeedback: (orderId: string, rating: number, comment: string) => void;
  cleanupSoldProducts5Days: () => void;
  
  // Data lists
  users: User[];
  items: Item[];
  offers: Offer[];
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

  // Bargaining / Offer Feature Handlers
  makeOffer: (item: Item, offerAmount: number) => { success: boolean; message?: string };
  acceptOffer: (offerId: string) => void;
  rejectOffer: (offerId: string) => void;
  counterOffer: (offerId: string, counterAmount: number) => void;
  buyAtNegotiatedPrice: (offerId: string, paymentMethod: 'upi' | 'card' | 'cod', address: Address) => { success: boolean; message?: string };

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
  const [offers, setOffers] = useState<Offer[]>(() => db.getOffers() || initialOffers);
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
  useEffect(() => { db.saveOffers(offers); }, [offers]);
  useEffect(() => { db.savePickups(pickups); }, [pickups]);
  useEffect(() => { db.saveOrders(orders); }, [orders]);
  useEffect(() => { db.saveWishlist(wishlist); }, [wishlist]);

  // GSTIN Validator (15 alphanumeric standard Indian GSTIN format)
  const isValidGSTIN = (gst: string): boolean => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
    return gstRegex.test(gst.trim());
  };

  // Helper to update user online status
  const setUserOnlineStatus = (userId: string, isOnline: boolean) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isOnline } : u));
  };

  // Strict Login Authentication Handler
  const login = (email: string, password?: string, role?: UserRole, gstNumber?: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password ? password.trim() : '';

    if (!cleanEmail) {
      return { success: false, message: 'Please enter your registered email address.' };
    }

    // 1. Admin Login (Founder or Promoted Sub-Admins)
    if (role === 'admin' || (cleanEmail === 'sanyam0902@gmail.com' && cleanPass === 'Gamma@12')) {
      // Check Founder Credentials
      if (cleanEmail === 'sanyam0902@gmail.com') {
        if (cleanPass !== 'Gamma@12') {
          return { success: false, message: 'Invalid Founder Password! Founder access requires password Gamma@12.' };
        }
        const founderUser = users.find(u => u.email.toLowerCase() === 'sanyam0902@gmail.com' && u.role === 'admin') || {
          id: 'usr_admin_1',
          name: 'Sanyam (Founder & Admin)',
          email: 'sanyam0902@gmail.com',
          password: 'Gamma@12',
          phone: '8708288911',
          role: 'admin' as UserRole,
          isOnline: true,
          isFounder: true,
          adminPermissions: {
            canViewInsights: true,
            canViewOrders: true,
            canViewPasswords: true,
            canManageCatalog: true,
            canManageIndustry: true,
            isFounder: true
          },
          rating: 5.0,
          ratingCount: 1,
          walletBalance: 0,
          createdAt: new Date().toISOString()
        };
        const activeFounder = { ...founderUser, isOnline: true };
        setCurrentUser(activeFounder);
        setUserOnlineStatus(activeFounder.id, true);
        return { success: true };
      }

      // Promoted Sub-Admin Authentication
      const foundSubAdmin = users.find(u => u.email.toLowerCase() === cleanEmail && u.role === 'admin');
      if (foundSubAdmin) {
        if (foundSubAdmin.password && foundSubAdmin.password !== cleanPass) {
          return { success: false, message: 'Invalid Admin Password! Please check your credentials.' };
        }
        const activeSubAdmin = { ...foundSubAdmin, isOnline: true };
        setCurrentUser(activeSubAdmin);
        setUserOnlineStatus(activeSubAdmin.id, true);
        return { success: true };
      }

      return { success: false, message: 'Admin account not found! Admin rights must be granted by Founder.' };
    }

    // 2. Industry Partner Login
    if (role === 'industry_partner') {
      const checkGst = gstNumber || '07AAACV0902F1Z8';
      if (!isValidGSTIN(checkGst)) {
        return { success: false, message: 'Invalid or missing GSTIN! Valid 15-character GSTIN number is strictly required for Industry Partners.' };
      }

      const foundIndustry = users.find(u => u.email.toLowerCase() === cleanEmail && u.role === 'industry_partner');
      if (foundIndustry) {
        const activeUser = { ...foundIndustry, isOnline: true };
        setCurrentUser(activeUser);
        setUserOnlineStatus(activeUser.id, true);
        return { success: true };
      }

      const newIndustryUser: User = {
        id: `usr_ind_${Date.now()}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        password: cleanPass || 'Industry@123',
        phone: '8708288911',
        role: 'industry_partner',
        businessName: 'VastraChakra EcoMills Delhi NCR',
        gstNumber: checkGst,
        isVerified: true,
        isOnline: true,
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
      const activeCust = { ...foundCust, isOnline: true };
      setCurrentUser(activeCust);
      setUserOnlineStatus(activeCust.id, true);
      return { success: true };
    }

    const newCustomerUser: User = {
      id: `usr_cust_${Date.now()}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      password: cleanPass || 'User@123',
      phone: '',
      gender: 'other',
      role: 'customer',
      isOnline: true,
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
    if (userData.role === 'admin') {
      return {
        success: false,
        message: 'Admin accounts cannot be self-registered. Admin access is assigned strictly via backend authorization.'
      };
    }

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
      password: userData.password || 'User@123',
      phone: userData.phone || '',
      gender: userData.gender || 'other',
      role: userData.role || 'customer',
      avatar: userData.avatar,
      businessName: userData.businessName,
      gstNumber: userData.gstNumber,
      isVerified: userData.role === 'industry_partner' ? true : true,
      isOnline: true,
      rating: 5.0,
      ratingCount: 0,
      walletBalance: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const updateUserProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      ...updatedData
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const approveIndustryUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: true } : u));
  };

  const logout = () => {
    if (currentUser) {
      setUserOnlineStatus(currentUser.id, false);
    }
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

  // Bargaining / Offer Feature Implementation
  const makeOffer = (item: Item, offerAmount: number): { success: boolean; message?: string } => {
    if (!currentUser) {
      return { success: false, message: 'Please login to send a bargain offer.' };
    }

    if (currentUser.id === item.ownerId) {
      return { success: false, message: 'You cannot send an offer on your own item!' };
    }

    if (offerAmount <= 0) {
      return { success: false, message: 'Offer amount must be greater than zero.' };
    }

    const aiEst = calculateAiRecommendedPrice(item);

    const newOffer: Offer = {
      id: `off_${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemImage: item.images[0],
      askingPrice: item.price,
      aiRecommendedPrice: aiEst.recommendedPrice,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: item.ownerId,
      sellerName: item.ownerName,
      offerAmount,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setOffers(prev => [newOffer, ...prev]);
    confetti({ particleCount: 40, spread: 50 });
    return { success: true, message: `Offer of ₹${offerAmount.toLocaleString()} sent to seller ${item.ownerName}!` };
  };

  const acceptOffer = (offerId: string) => {
    setOffers(prev => prev.map(o => o.id === offerId ? {
      ...o,
      status: 'accepted',
      updatedAt: new Date().toISOString().split('T')[0]
    } : o));
  };

  const rejectOffer = (offerId: string) => {
    setOffers(prev => prev.map(o => o.id === offerId ? {
      ...o,
      status: 'rejected',
      updatedAt: new Date().toISOString().split('T')[0]
    } : o));
  };

  const counterOffer = (offerId: string, counterAmount: number) => {
    setOffers(prev => prev.map(o => o.id === offerId ? {
      ...o,
      status: 'countered',
      counterAmount,
      updatedAt: new Date().toISOString().split('T')[0]
    } : o));
  };

  const buyAtNegotiatedPrice = (offerId: string, paymentMethod: 'upi' | 'card' | 'cod', address: Address): { success: boolean; message?: string } => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return { success: false, message: 'Offer not found.' };

    const item = items.find(i => i.id === offer.itemId);
    if (!item) return { success: false, message: 'Item no longer available.' };

    const finalAmount = offer.status === 'countered' && offer.counterAmount ? offer.counterAmount : offer.offerAmount;
    const commission = Math.round(finalAmount * 0.1);
    const sellerPayout = finalAmount - commission;

    const newOrder: Order = {
      id: `ord_${Date.now()}_${item.id}`,
      orderNumber: `ORD-VC-OFFER-${Math.floor(100000 + Math.random() * 900000)}`,
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      item: { ...item, price: finalAmount },
      amount: finalAmount,
      commissionAmount: commission,
      sellerPayout,
      status: 'paid',
      paymentMethod,
      transactionId: `TXN_BARGAIN_${paymentMethod.toUpperCase()}_${Date.now()}`,
      shippingAddress: address,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setOrders(prev => [newOrder, ...prev]);
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'sold', soldAt: new Date().toISOString() } : i));
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'accepted' } : o));

    confetti({ particleCount: 100, spread: 80 });
    return { success: true };
  };

  const createPickupRequest = (data: { clothingCount: number; estimatedWeightKg: number; clothingTypes: string; packedBagImageUrl: string; pickupType: PickupType; fullAddress: string; scheduledDate: string; scheduledSlot: string; notes?: string }): { success: boolean; message?: string } => {
    if (!currentUser) {
      return { success: false, message: 'Please login to request a recycling pickup.' };
    }

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
  // Promote a user to Admin role with specific permissions
  const promoteToAdmin = (userId: string, permissions: AdminPermissions) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          role: 'admin' as UserRole,
          adminPermissions: { ...permissions }
        };
      }
      return u;
    }));
  };

  // Revoke Admin rights
  const revokeAdminRights = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId && !u.isFounder) {
        const { adminPermissions, isFounder, ...rest } = u;
        return {
          ...rest,
          role: 'customer' as UserRole
        };
      }
      return u;
    }));
  };

  // Update existing admin permissions
  const updateAdminPermissions = (userId: string, permissions: AdminPermissions) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          adminPermissions: { ...permissions }
        };
      }
      return u;
    }));
  };

  // Remove any user account (Consumer, Industry, or Admin)
  const removeUserAccount = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  // Remove industry member account
  const removeIndustryMember = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Remove product from catalog
  const removeProduct = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Submit buyer order feedback & trigger auto-archival timeline
  const submitOrderFeedback = (orderId: string, rating: number, comment: string) => {
    const now = new Date().toISOString();
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        // Mark item as feedback given
        setItems(itemPrev => itemPrev.map(it => {
          if (it.id === o.item.id) {
            return {
              ...it,
              feedbackGiven: true,
              feedbackDate: now
            };
          }
          return it;
        }));
        return {
          ...o,
          feedbackGiven: true,
          feedbackRating: rating,
          feedbackComment: comment,
          feedbackDate: now
        };
      }
      return o;
    }));
  };

  // Auto-remove / archive sold products after 5 days of feedback or sale
  const cleanupSoldProducts5Days = () => {
    const now = Date.now();
    const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;
    setItems(prev => prev.map(item => {
      if (item.status === 'sold') {
        const soldTime = item.soldAt ? new Date(item.soldAt).getTime() : now - (6 * 24 * 60 * 60 * 1000);
        const feedbackTime = item.feedbackDate ? new Date(item.feedbackDate).getTime() : soldTime;
        if (item.feedbackGiven || (now - feedbackTime >= FIVE_DAYS_MS)) {
          return { ...item, status: 'archived' };
        }
      }
      return item;
    }));
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, login, registerUser, updateUserProfile, approveIndustryUser, logout,
      promoteToAdmin, revokeAdminRights, updateAdminPermissions, removeUserAccount, removeIndustryMember, removeProduct, submitOrderFeedback, cleanupSoldProducts5Days,
      users, items, offers, pickups, batches, orders, analytics, wishlist,
      cart, addToCart, removeFromCart, clearCart, toggleWishlist,
      createListing, moderateListing, createPickupRequest, claimBatch, updateBatchStatus, createBatchFromPickups, completeCheckout,
      makeOffer, acceptOffer, rejectOffer, counterOffer, buyAtNegotiatedPrice,
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


