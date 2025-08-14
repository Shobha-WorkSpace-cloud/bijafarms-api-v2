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

    const expn = await Promise.all(
      expenses.map(async (expense) => {
        // Fetch category from Supabase
        const { data: cat, error } = await supabase
          .from('categories')
          .select("id")
          .eq('name', expense.category);

        if (error) {
          console.error(`Error fetching category for ${expense.category}:`, error);
        }

        // You can use cat[0] if you expect a single category, or handle as needed
        return {
          id: expense.id,
          date: expense.date,
          type: expense.type,
          description: expense.description,
          amount: expense.amount,
          paidBy: expense.paidBy,
          category: cat && cat.length > 0 ? cat[0].id : expense.category,
          subCategory: expense.subCategory,
          source: expense.source,
          notes: expense.notes,
        };
      })
    );

    const { data, error } = await supabase
      .from('expenses')
      .insert(expn)
      .select();

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
