// The 8 expense categories, in the order they appear on the form.
export const CATEGORIES = [
  { id: "food", name: "Food & drink" },
  { id: "groceries", name: "Groceries" },
  { id: "transport", name: "Transport" },
  { id: "bills", name: "Bills" },
  { id: "shopping", name: "Shopping" },
  { id: "fun", name: "Fun" },
  { id: "health", name: "Health" },
  { id: "other", name: "Other" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function categoryName(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? "Other";
}
