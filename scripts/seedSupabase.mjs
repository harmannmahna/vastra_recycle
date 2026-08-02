import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zwjspiewnkfyvnuizwtp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3anNwaWV3bmtmeXZudWl6d3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NjMwNzQsImV4cCI6MjEwMTIzOTA3NH0.Pdmwl8Q_aYI2bTuJ087nypInJsEjFSju6P-ND8H5LYk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const initialUsers = [
  {
    id: 'usr_admin_1',
    name: 'Sanyam (Founder & Admin)',
    email: 'sanyam0902@gmail.com',
    password: 'Gamma@12',
    phone: '8708288911',
    gender: 'male',
    role: 'admin',
    is_online: true,
    is_founder: true,
    admin_permissions: {
      canViewInsights: true,
      canViewOrders: true,
      canViewPasswords: true,
      canManageCatalog: true,
      canManageIndustry: true,
      isFounder: true
    },
    rating: 5.0,
    rating_count: 1,
    wallet_balance: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 'usr_customer_1',
    name: 'Sanyam (Consumer & Seller)',
    email: 'sanyam0902@gmail.com',
    password: 'User@123',
    phone: '8708288911',
    gender: 'male',
    role: 'customer',
    is_online: false,
    rating: 5.0,
    rating_count: 2,
    wallet_balance: 0,
    address: {
      id: 'addr_1',
      userId: 'usr_customer_1',
      line1: 'C-14, Hauz Khas Enclave',
      city: 'New Delhi',
      state: 'Delhi NCR',
      pincode: '110016',
      isDefault: true
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'usr_industry_1',
    name: 'Delhi NCR EcoTextile Recycling Hub',
    email: 'sanyam0902@gmail.com',
    password: 'Ind@12345',
    phone: '8708288911',
    gender: 'other',
    role: 'industry_partner',
    business_name: 'VastraChakra EcoMills Delhi NCR',
    gst_number: '07AAACV0902F1Z8',
    is_verified: true,
    is_online: false,
    rating: 5.0,
    rating_count: 1,
    wallet_balance: 0,
    created_at: new Date().toISOString()
  }
];

async function seed() {
  console.log('Seeding initial users to Supabase...');
  const { data, error } = await supabase.from('users').upsert(initialUsers);
  if (error) {
    console.error('Error seeding users:', error);
  } else {
    console.log('Successfully seeded users into Supabase!');
  }
}

seed();
