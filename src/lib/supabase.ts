import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set up your Supabase project.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  tickets: number;
  total_amount: number;
  payment_status: 'pending' | 'completed' | 'failed';
  ticket_id: string;
  stripe_payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}