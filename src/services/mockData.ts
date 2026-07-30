import { Item, User, PickupRequest, RecyclingBatch, Order, AnalyticsData } from '../types';

export const initialUsers: User[] = [
  {
    id: 'usr_admin_1',
    name: 'Sanyam (Founder & Admin)',
    email: 'sanyam0902@gmail.com',
    phone: '8708288911',
    role: 'admin',
    rating: 5.0,
    ratingCount: 1,
    walletBalance: 0,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-07-01'
  },
  {
    id: 'usr_customer_1',
    name: 'Sanyam (Consumer & Seller)',
    email: 'sanyam0902@gmail.com',
    phone: '8708288911',
    role: 'customer',
    rating: 5.0,
    ratingCount: 2,
    walletBalance: 0,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
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
    phone: '8708288911',
    role: 'industry_partner',
    businessName: 'VastraChakra EcoMills Delhi NCR',
    gstNumber: '07AAACV0902F1Z8',
    isVerified: true,
    rating: 5.0,
    ratingCount: 1,
    walletBalance: 0,
    avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-07-15'
  }
];

// Clean Production State - 0 dummy sample clothes
export const initialItems: Item[] = [];

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
