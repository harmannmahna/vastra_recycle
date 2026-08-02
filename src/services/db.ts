/**
 * VastraChakra Persistent Storage & Database Service
 * Provides client-side state persistence (localStorage / IndexedDB) for Users, Listings, Pickups, and Orders.
 */

import { Item, PickupRequest, Order, User, Offer } from '../types';

const STORAGE_KEYS = {
  USERS: 'vastrachakra_db_users',
  ITEMS: 'vastrachakra_db_items',
  PICKUPS: 'vastrachakra_db_pickups',
  ORDERS: 'vastrachakra_db_orders',
  CURRENT_USER: 'vastrachakra_db_current_user',
  WISHLIST: 'vastrachakra_db_wishlist',
  OFFERS: 'vastrachakra_db_offers',
};

export const db = {
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
    } catch (e) {
      console.error('Failed to persist users:', e);
    }
  },

  getItems: (): Item[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveItems: (items: Item[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist items:', e);
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
      console.error('Failed to persist offers:', e);
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
      console.error('Failed to persist pickups:', e);
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
      console.error('Failed to persist orders:', e);
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
  }
};
