import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

// Assuming you have your Supabase URL and Anon Key stored in environment variables
const supabaseUrl = 'https://dbmthxrbrlgkuhiznsul.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibXRoeHJicmxna3VoaXpuc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NTU0ODEsImV4cCI6MjA3MDEzMTQ4MX0.b6gFaZcT5AdVPomr7U-5Y2S_slIqza_4zeCtkC5s8Kc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*');

    if (error) {
      console.error('Error fetching expenses:', error.message);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};