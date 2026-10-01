// Turns a list of expenses into the numbers the Home screen shows.
import { CATEGORIES, type CategoryId } from "./categories";
import { dayLabel } from "./format";
import type { Expense } from "./types";

export function expensesInMonth(expenses: Expense[], month: string): Expense[] {
  return expenses.filter((e) => e.date.startsWith(month));
}

export function sumAmounts(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export type CategoryTotal = {
  id: CategoryId;
  name: string;
  total: number;
  barPercent: number; // bar width, relative to the biggest category
};

// Categories with spending, biggest first.
export function categoryTotals(expenses: Expense[]): CategoryTotal[] {
  const totals = CATEGORIES.map((c) => ({
    id: c.id,
    name: c.name,
    total: sumAmounts(expenses.filter((e) => e.category === c.id)),
  }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const max = totals[0]?.total || 1;
  return totals.map((c) => ({ ...c, barPercent: Math.max(4, (c.total / max) * 100) }));
}

export type DayGroup = {
  date: string;
  label: string;
  total: number;
  items: Expense[];
};

// One group per day, newest day first. Within a day, the most recently logged comes first.
export function groupByDay(expenses: Expense[]): DayGroup[] {
  const dates = [...new Set(expenses.map((e) => e.date))].sort().reverse();
  return dates.map((date) => {
    const items = expenses
      .filter((e) => e.date === date)
      .sort((a, b) => b.createdAt - a.createdAt);
    return { date, label: dayLabel(date), total: sumAmounts(items), items };
  });
}
