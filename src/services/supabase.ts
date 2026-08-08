import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zwjspiewnkfyvnuizwtp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3anNwaWV3bmtmeXZudWl6d3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NjMwNzQsImV4cCI6MjEwMTIzOTA3NH0.Pdmwl8Q_aYI2bTuJ087nypInJsEjFSju6P-ND8H5LYk';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

