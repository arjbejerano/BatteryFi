import { createClient } from '@supabase/supabase-js'

// Use environment variables with fallback to default values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zgbkpdhlrppcwdnxzwdz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnYmtwZGhscnBwY3dkbnh6d2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzg1MzUsImV4cCI6MjA3NjcxNDUzNX0.CnrSArfDWkKex4Z_ym4piGl55djNflnDcq4p4CruzOg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
