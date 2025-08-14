import { Request, Response } from 'express';
import express from 'express';
import supabase from './supabaseClient';
const router = express.Router();

interface ExpenseRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  amount: number;
  paidBy: string;
  category: string;
  subCategory: string;
  source: string;
  notes: string;
}

const writeExpenses = async (expenses: ExpenseRecord[]): Promise<void> => {
  try {
    if (!expenses || expenses.length === 0) {
      console.warn("No expenses to write");
      return;
    }

    console.log("Processing expenses for insert:", expenses);

    // For now, let's directly insert expenses without category lookup
    // until we set up the categories table properly
    const expn = expenses.map((expense) => {
      return {
        id: expense.id,
        date: expense.date,
        type: expense.type,
        description: expense.description,
        amount: expense.amount,
        paidBy: expense.paidBy,
        category: expense.category, // Use the category name directly for now
        subCategory: expense.subCategory,
        source: expense.source,
        notes: expense.notes,
      };
    });

    console.log("Prepared expenses for Supabase:", expn);

    const { data, error } = await supabase
      .from('expenses')
      .insert(expn)
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    console.log("Expenses written to Supabase:", data);
  } catch (error) {
    console.error("Error writing expenses:", error);
    throw error;
  }
};

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

router.post('/write', async (req: Request, res: Response) => {
  try {
    const { expenses } = req.body;

    if (!expenses || !Array.isArray(expenses)) {
      return res.status(400).json({ error: 'Invalid request: expenses array is required' });
    }

    await writeExpenses(expenses);
    res.status(200).json({
      message: `Successfully wrote ${expenses.length} expenses to database`,
      count: expenses.length
    });
  } catch (error: any) {
    console.error('Error in POST /expenses/write:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Export the router so it can be used in other files
export default router;
export { writeExpenses };
