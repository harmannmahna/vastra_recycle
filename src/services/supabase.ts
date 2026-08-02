import { createClient } from '@supabase/supabase-js';

// Supabase project credentials — hardcoded for guaranteed connection on all environments
const supabaseUrl = 'https://zwjspiewnkfyvnuizwtp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3anNwaWV3bmtmeXZudWl6d3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NjMwNzQsImV4cCI6MjEwMTIzOTA3NH0.Pdmwl8Q_aYI2bTuJ087nypInJsEjFSju6P-ND8H5LYk';

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
