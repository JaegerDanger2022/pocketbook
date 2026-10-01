// Expenses data layer.
//
// Today: saved in this browser's localStorage.
// Later: replace the bodies of these functions with Firestore calls (users/{uid}/expenses).
// Keep the function names and signatures the same so no screen needs to change.
import type { Expense, ExpenseInput } from "./types";

const KEY = "pocketbook.expenses";

function readAll(): Expense[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Throws if the browser refuses to store data (e.g. storage full or blocked).
function writeAll(expenses: Expense[]): void {
  localStorage.setItem(KEY, JSON.stringify(expenses));
}

export async function listExpenses(): Promise<Expense[]> {
  return readAll();
}

export async function getExpense(id: string): Promise<Expense | null> {
  return readAll().find((e) => e.id === id) ?? null;
}

export async function addExpense(input: ExpenseInput): Promise<Expense> {
  const expense: Expense = { ...input, id: crypto.randomUUID(), createdAt: Date.now() };
  writeAll([expense, ...readAll()]);
  return expense;
}

export async function updateExpense(id: string, input: ExpenseInput): Promise<void> {
  writeAll(readAll().map((e) => (e.id === id ? { ...e, ...input } : e)));
}

export async function deleteExpense(id: string): Promise<void> {
  writeAll(readAll().filter((e) => e.id !== id));
}
