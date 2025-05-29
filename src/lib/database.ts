import type { Database } from "../types/supabase";
import { supabase } from "./supabase";
import type { WaitlistFormData } from "../components/landing/WaitlistSurvey";

// User related functions
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

// Category related functions
export async function getCategories(userId: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

export async function createCategory(
  userId: string,
  name: string,
  color: string,
) {
  const { data, error } = await supabase
    .from("categories")
    .insert([{ user_id: userId, name, color }])
    .select();

  if (error) throw error;
  return data[0];
}

// Transaction related functions
export async function getTransactions(
  userId: string,
  options: {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
  } = {},
) {
  let query = supabase
    .from("transactions")
    .select("*, categories(name, color)")
    .eq("user_id", userId);

  if (options.startDate) {
    query = query.gte("transaction_date", options.startDate);
  }

  if (options.endDate) {
    query = query.lte("transaction_date", options.endDate);
  }

  if (options.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }

  const { data, error } = await query.order("transaction_date", {
    ascending: false,
  });

  if (error) throw error;
  return data;
}

export async function createTransaction(transaction: {
  user_id: string;
  category_id: string;
  amount: number;
  description: string;
  transaction_date: string;
}) {
  const { data, error } = await supabase
    .from("transactions")
    .insert([transaction])
    .select();

  if (error) throw error;
  return data[0];
}

// Budget related functions
export async function getBudgets(userId: string) {
  const { data, error } = await supabase
    .from("budgets")
    .select("*, categories(name, color)")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

export async function createBudget(budget: {
  user_id: string;
  category_id: string;
  amount: number;
  period: string;
  start_date: string;
  end_date?: string;
}) {
  const { data, error } = await supabase
    .from("budgets")
    .insert([budget])
    .select();

  if (error) throw error;
  return data[0];
}

// Goal related functions
export async function getGoals(userId: string) {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

// Waitlist related functions
export async function submitWaitlistForm(formData: WaitlistFormData) {
  const { data, error } = await supabase
    .from("waitlist_submissions")
    .insert([
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        finance_tracking_method: formData.finance_tracking_method,
        custom_tracking_method: formData.custom_tracking_method || null,
        finance_app_name: formData.finance_app_name || null,
        money_frustration: formData.money_frustration,
        desired_features: formData.desired_features,
        early_access_interest: formData.early_access_interest,
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
}

export async function createGoal(goal: {
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  category: string;
  priority: string;
  monthly_contribution?: number;
  notes?: string;
}) {
  const { data, error } = await supabase.from("goals").insert([goal]).select();

  if (error) throw error;
  return data[0];
}

// Analytics functions
export async function getIncomeVsExpenses(
  userId: string,
  period: {
    startDate: string;
    endDate: string;
  },
) {
  const { data, error } = await supabase
    .from("transactions")
    .select("amount, transaction_date")
    .eq("user_id", userId)
    .gte("transaction_date", period.startDate)
    .lte("transaction_date", period.endDate);

  if (error) throw error;

  const income = data
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = data
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return { income, expenses };
}

export async function getCategoryBreakdown(
  userId: string,
  period: {
    startDate: string;
    endDate: string;
  },
) {
  const { data, error } = await supabase
    .from("transactions")
    .select("amount, categories(id, name, color)")
    .eq("user_id", userId)
    .lt("amount", 0) // Only expenses
    .gte("transaction_date", period.startDate)
    .lte("transaction_date", period.endDate);

  if (error) throw error;

  const categoryMap = new Map();

  data.forEach((transaction) => {
    const category = transaction.categories;
    if (!category) return;

    const categoryId = category.id;
    const amount = Math.abs(transaction.amount);

    if (categoryMap.has(categoryId)) {
      const existing = categoryMap.get(categoryId);
      existing.amount += amount;
      categoryMap.set(categoryId, existing);
    } else {
      categoryMap.set(categoryId, {
        id: categoryId,
        name: category.name,
        color: category.color,
        amount: amount,
      });
    }
  });

  return Array.from(categoryMap.values());
}
