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

    // Let's try inserting one expense first to see the exact error
    for (const expense of expenses) {
      console.log("Attempting to insert expense:", expense);

      // Insert only fields that exist in the table (excluding category)
      const expenseData = {
        description: expense.description,
        amount: expense.amount,
        type: expense.type,
        date: expense.date,
        paidBy: expense.paidBy,
        subCategory: expense.subCategory || null,
        source: expense.source || null,
        notes: expense.notes || null,
      };

      console.log("Inserting expense data:", expenseData);

      const { data, error: insertError } = await supabase
        .from('expenses')
        .insert([expenseData])
        .select();

      if (insertError) {
        console.error("Supabase insert error for expense:", expense.description);
        console.error("Full error details:", JSON.stringify(insertError, null, 2));
        throw insertError;
      }

      console.log("Successfully inserted expense:", data);
    }

    console.log("All expenses written successfully");
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
