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

    // Process expenses with category lookup
    for (const expense of expenses) {
      console.log("Attempting to insert expense:", expense);

      // Look up category ID from categories table
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', expense.category)
        .single();

      if (categoryError) {
        console.error(`Error fetching category for ${expense.category}:`, categoryError);
        // If category doesn't exist, create it
        const { data: newCategory, error: createError } = await supabase
          .from('categories')
          .insert([{ name: expense.category }])
          .select('id')
          .single();

        if (createError) {
          console.error(`Error creating category ${expense.category}:`, createError);
          throw createError;
        }

        console.log(`Created new category: ${expense.category} with ID: ${newCategory.id}`);
        var categoryId = newCategory.id;
      } else {
        var categoryId = categoryData.id;
        console.log(`Found category ${expense.category} with ID: ${categoryId}`);
      }

      // Insert expense with categoryId
      const expenseData = {
        description: expense.description,
        amount: expense.amount,
        type: expense.type,
        date: expense.date,
        paidBy: expense.paidBy,
        categoryId: categoryId,
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
      .select(`
        *,
        categories (
          id,
          name
        )
      `);

    if (error) {
      console.error('Error fetching expenses:', error.message);
      return res.status(500).json({ error: error.message });
    }

    // Transform data to include category name directly
    const transformedData = data?.map(expense => ({
      ...expense,
      category: expense.categories?.name || 'Unknown'
    }));

    res.status(200).json(transformedData);
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
