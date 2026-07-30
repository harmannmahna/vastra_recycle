export type UserRole = 'customer' | 'industry_partner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  businessName?: string;
  gstNumber?: string;
  isVerified?: boolean; // for industry accounts
  rating: number;
  ratingCount: number;
  walletBalance: number;
  avatar?: string;
  address?: Address;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export type ItemCondition = 'wearable_like_new' | 'wearable_good' | 'worn_out';
export type ItemCategory = 'Jeans & Bottoms' | 'Ethnic & Sarees' | 'Tops & Shirts' | 'Dresses & Gowns' | 'Jackets & Outerwear' | 'Kurtis';

export interface Item {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  ownerRating: number;
  title: string;
  description: string;
  category: ItemCategory;
  images: string[];
  videoUrl?: string; // Mandatory short seller video link/file
  condition: ItemCondition;
  tier: 1 | 2;
  status: 'submitted' | 'under_review' | 'listed' | 'sold' | 'collected' | 'shipped' | 'processed' | 'rejected';
  price: number;
  originalPrice?: number;
  commissionPercent: number; // default 10%
  size: string;
  brand: string; // Mandatory premium/recognized brand
  ageYears: number; // Max 3 years allowed
  wornTimesPerYear?: number;
  isColorFaded?: boolean;
  hasStainsOrDefects?: boolean;
  hygieneRating?: number; // 1 to 5 rating
  middlemanVerified?: boolean; // Social media reseller / partner verified
  termsAccepted?: boolean;
  createdAt: string;
}

export type PickupType = 'donation' | 'sell_by_weight';
export type PickupStatus = 'requested' | 'scheduled' | 'picked_up' | 'batched' | 'completed' | 'cancelled';

export interface PickupRequest {
  id: string;
  requestNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  itemIds?: string[];
  clothingCount: number;
  estimatedWeightKg: number;
  clothingTypes: string; // e.g. "Mixed cottons, linens & denim scraps"
  packedBagImageUrl: string; // Mandatory photo of fully packed & sealed bag/box
  pickupType: PickupType;
  fullAddress: string;
  scheduledDate: string;
  scheduledSlot: string;
  status: PickupStatus;
  notes?: string;
  createdAt: string;
}

export type BatchStatus = 'collected' | 'shipped' | 'processed' | 'closed';

export interface RecyclingBatch {
  id: string;
  batchNumber: string;
  factoryId?: string;
  factoryName?: string;
  pickupRequestIds: string[];
  totalItemsCount: number;
  totalWeightKg: number;
  materialBreakdown: {
    cottonPercent: number;
    polyesterPercent: number;
    denimPercent: number;
    mixedPercent: number;
  };
  status: BatchStatus;
  claimedByIndustryId?: string;
  claimedByIndustryName?: string;
  location: string;
  shippedAt?: string;
  processedAt?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  item: Item;
  amount: number;
  commissionAmount: number;
  sellerPayout: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  paymentMethod: 'upi' | 'card' | 'cod';
  transactionId: string;
  shippingAddress: Address;
  createdAt: string;
}

export interface AnalyticsData {
  pilotStage: string;
  totalUsers: number;
  activeListingsCount: number;
  delhiNcrPartners: number;
  pendingPickupRequests: number;
  pendingIndustryVerifications: number;
  tier1ApprovedCount: number;
  tier2RecyclingWeightKg: number;
}
