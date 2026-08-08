/**
 * VastraChakra Hybrid Persistent Storage & Supabase Database Service
 * Provides seamless integration with Supabase (Cloud PostgreSQL + Realtime)
 * with graceful fallback to browser localStorage.
 */

import { Item, PickupRequest, Order, User, Offer } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  USERS: 'vastrachakra_db_users',
  ITEMS: 'vastrachakra_db_items',
  PICKUPS: 'vastrachakra_db_pickups',
  ORDERS: 'vastrachakra_db_orders',
  CURRENT_USER: 'vastrachakra_db_current_user',
  WISHLIST: 'vastrachakra_db_wishlist',
  OFFERS: 'vastrachakra_db_offers',
};

// Helper: Convert User model to Supabase DB Row
const mapUserToRow = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  password: user.password || null,
  phone: user.phone,
  gender: user.gender || 'other',
  role: user.role,
  business_name: user.businessName || null,
  gst_number: user.gstNumber || null,
  is_verified: user.isVerified || false,
  is_online: user.isOnline || false,
  is_founder: user.isFounder || false,
  admin_permissions: user.adminPermissions || null,
  rating: user.rating,
  rating_count: user.ratingCount,
  wallet_balance: user.walletBalance,
  address: user.address || null,
  created_at: user.createdAt
});

// Helper: Convert Supabase DB Row to User model
const mapRowToUser = (row: any): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  password: row.password || undefined,
  phone: row.phone,
  gender: row.gender,
  role: row.role,
  businessName: row.business_name || undefined,
  gstNumber: row.gst_number || undefined,
  isVerified: row.is_verified,
  isOnline: row.is_online,
  isFounder: row.is_founder,
  adminPermissions: row.admin_permissions,
  rating: Number(row.rating || 5.0),
  ratingCount: Number(row.rating_count || 0),
  walletBalance: Number(row.wallet_balance || 0),
  address: row.address,
  createdAt: row.created_at
});

export const db = {
  // Sync Local Storage Getters & Setters (Instant Cache)
  getUsers: (): User[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveUsers: (users: User[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      // Note: individual user upserts are handled explicitly in registerUser / updateUserProfile
    } catch (e) {
      console.error('Failed to persist users locally:', e);
    }
  },

  getItems: (): Item[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (!data) return null;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    } catch {
      return null;
    }
  },

  saveItems: (items: Item[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist items locally:', e);
    }
  },

  getOffers: (): Offer[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OFFERS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveOffers: (offers: Offer[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
    } catch (e) {
      console.error('Failed to persist offers locally:', e);
    }
  },

  getPickups: (): PickupRequest[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PICKUPS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  savePickups: (pickups: PickupRequest[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(pickups));
    } catch (e) {
      console.error('Failed to persist pickups locally:', e);
    }
  },

  getOrders: (): Order[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveOrders: (orders: Order[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist orders locally:', e);
    }
  },

  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveCurrentUser: (user: User | null) => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.error('Failed to persist current user:', e);
    }
  },

  getWishlist: (): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveWishlist: (wishlist: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to persist wishlist:', e);
    }
  },

  // -------------------------------------------------------------
  // SUPABASE ASYNC CLOUD METHODS
  // -------------------------------------------------------------
  fetchUsersSupabase: async (): Promise<User[] | null> => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error || !data) return null;
      return data.map(mapRowToUser);
    } catch (err) {
      console.warn('Supabase fetchUsers error:', err);
      return null;
    }
  },

  upsertUserSupabase: async (user: User): Promise<boolean> => {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('users').upsert(mapUserToRow(user));
      if (error) {
        console.error('Supabase user upsert error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to upsert user to Supabase:', err);
      return false;
    }
  },

  deleteUserSupabase: async (userId: string): Promise<boolean> => {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) {
        console.error('Supabase user delete error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to delete user from Supabase:', err);
      return false;
    }
  },

  fetchItemsSupabase: async (): Promise<Item[] | null> => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('items').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((row: any) => ({
        id: row.id,
        ownerId: row.owner_id || row.ownerId,
        ownerName: row.owner_name || row.ownerName,
        ownerAvatar: row.owner_avatar || row.ownerAvatar,
        ownerRating: Number(row.owner_rating || row.ownerRating || 5.0),
        title: row.title,
        description: row.description,
        category: row.category,
        images: Array.isArray(row.images) ? row.images : [row.images],
        videoUrl: row.video_url || row.videoUrl,
        condition: row.condition,
        tier: row.tier || 1,
        status: row.status || 'listed',
        price: Number(row.price),
        commissionPercent: Number(row.commission_percent || 10),
        size: row.size,
        brand: row.brand || 'Local Trader / Vintage',
        ageYears: Number(row.age_years || row.ageYears || 1),
        wornTimesPerYear: Number(row.worn_times_per_year || row.wornTimesPerYear || 2),
        isColorFaded: row.is_color_faded || row.isColorFaded || false,
        hasStainsOrDefects: row.has_stains_or_defects || row.hasStainsOrDefects || false,
        hygieneRating: Number(row.hygiene_rating || row.hygieneRating || 5),
        middlemanVerified: row.middleman_verified || row.middlemanVerified || true,
        termsAccepted: row.terms_accepted || row.termsAccepted || true,
        createdAt: row.created_at || row.createdAt || new Date().toISOString().split('T')[0]
      }));
    } catch (err) {
      console.warn('Supabase fetchItems error:', err);
      return null;
    }
  },

  upsertItemSupabase: async (item: Item): Promise<boolean> => {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('items').upsert({
        id: item.id,
        owner_id: item.ownerId,
        owner_name: item.ownerName,
        owner_avatar: item.ownerAvatar,
        owner_rating: item.ownerRating,
        title: item.title,
        description: item.description,
        category: item.category,
        images: item.images,
        video_url: item.videoUrl,
        condition: item.condition,
        tier: item.tier,
        status: item.status,
        price: item.price,
        commission_percent: item.commissionPercent,
        size: item.size,
        brand: item.brand,
        age_years: item.ageYears,
        worn_times_per_year: item.wornTimesPerYear,
        is_color_faded: item.isColorFaded,
        has_stains_or_defects: item.hasStainsOrDefects,
        hygiene_rating: item.hygieneRating,
        middleman_verified: item.middlemanVerified,
        terms_accepted: item.termsAccepted,
        created_at: item.createdAt
      });
      if (error) {
        console.error('Supabase item upsert error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to upsert item to Supabase:', err);
      return false;
    }
  }
};
