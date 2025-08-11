import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl: string = 'https://dbmthxrbrlgkuhiznsul.supabase.co';
const supabaseKey: string | undefined = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error('SUPABASE_KEY is not defined in environment variables');
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabase;