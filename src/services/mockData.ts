import { Item, User, PickupRequest, RecyclingBatch, Order, AnalyticsData, Offer } from '../types';

export const initialUsers: User[] = [
  {
    id: 'usr_admin_1',
    name: 'Sanyam (Founder & Admin)',
    email: 'sanyam0902@gmail.com',
    password: 'Gamma@12',
    phone: '8708288911',
    gender: 'male',
    role: 'admin',
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
    createdAt: '2026-07-01'
  },
  {
    id: 'usr_customer_1',
    name: 'Sanyam (Consumer & Seller)',
    email: 'sanyam0902@gmail.com',
    password: 'User@123',
    phone: '8708288911',
    gender: 'male',
    role: 'customer',
    isOnline: false,
    rating: 5.0,
    ratingCount: 2,
    walletBalance: 0,
    address: {
      id: 'addr_1',
      userId: 'usr_customer_1',
      line1: 'C-14, Hauz Khas Enclave',
      city: 'New Delhi',
      state: 'Delhi NCR',
      pincode: '110016',
      isDefault: true
    },
    createdAt: '2026-07-10'
  },
  {
    id: 'usr_industry_1',
    name: 'Delhi NCR EcoTextile Recycling Hub',
    email: 'sanyam0902@gmail.com',
    password: 'Ind@12345',
    phone: '8708288911',
    gender: 'other',
    role: 'industry_partner',
    businessName: 'VastraChakra EcoMills Delhi NCR',
    gstNumber: '07AAACV0902F1Z8',
    isVerified: true,
    isOnline: false,
    rating: 5.0,
    ratingCount: 1,
    walletBalance: 0,
    createdAt: '2026-07-15'
  }
];

// Clean Production State - 0 dummy sample clothes
export const initialItems: Item[] = [];

export const initialOffers: Offer[] = [];

// Clean initial requests & batches
export const initialPickups: PickupRequest[] = [];

export const initialBatches: RecyclingBatch[] = [];

export const initialOrders: Order[] = [];

export const initialAnalytics: AnalyticsData = {
  pilotStage: 'Delhi NCR Startup Operating System',
  totalUsers: 3,
  activeListingsCount: 0,
  delhiNcrPartners: 4,
  pendingPickupRequests: 0,
  pendingIndustryVerifications: 0,
  tier1ApprovedCount: 0,
  tier2RecyclingWeightKg: 0
};
