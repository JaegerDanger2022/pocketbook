import type { CategoryId } from "./categories";

export type Expense = {
  id: string;
  amount: number; // e.g. 14.5, always rounded to 2 decimals
  category: CategoryId;
  note: string; // optional, max 40 characters ("" when empty)
  date: string; // the day it was spent, "YYYY-MM-DD"
  createdAt: number; // when it was logged, in milliseconds
};

// What the form sends when adding or editing. The id and createdAt are filled in by storage.
export type ExpenseInput = Omit<Expense, "id" | "createdAt">;

export type User = {
  name: string;
};
