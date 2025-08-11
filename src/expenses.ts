import { Request, Response } from 'express';
import express from 'express';
import supabase from './supabaseClient';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
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
});

// Export the router so it can be used in other files
export default router;