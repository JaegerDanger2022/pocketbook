// Expenses data layer, backed by Cloud Firestore.
//
// Each user's expenses live at users/{uid}/expenses/{expenseId}.
// The rules in /firestore.rules make sure only that user can read or change them.
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import type { Expense, ExpenseInput } from "./types";

// Thrown when a save can't reach Firebase. The form shows the "you seem to be offline" message.
export class OfflineError extends Error {
  constructor() {
    super("offline");
  }
}

const expensesOf = (uid: string) => collection(firestore(), "users", uid, "expenses");

// Firestore waits (forever) for a connection before finishing a save. We'd rather tell the
// user, so give up after a few seconds. Saves use fixed ids, so trying again never makes duplicates.
async function whenOnline<T>(work: () => Promise<T>): Promise<T> {
  if (typeof navigator !== "undefined" && !navigator.onLine) throw new OfflineError();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new OfflineError()), 10_000);
  });
  try {
    return await Promise.race([work(), timeout]);
  } finally {
    clearTimeout(timer);
  }
}

// A new, unique id for an expense that hasn't been saved yet.
export function newExpenseId(uid: string): string {
  return doc(expensesOf(uid)).id;
}

export async function listExpenses(uid: string): Promise<Expense[]> {
  const snapshot = await getDocs(expensesOf(uid));
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Expense, "id">) }));
}

export async function getExpense(uid: string, id: string): Promise<Expense | null> {
  const snapshot = await getDoc(doc(expensesOf(uid), id));
  return snapshot.exists() ? { id: snapshot.id, ...(snapshot.data() as Omit<Expense, "id">) } : null;
}

export async function addExpense(uid: string, id: string, input: ExpenseInput): Promise<void> {
  await whenOnline(() => setDoc(doc(expensesOf(uid), id), { ...input, createdAt: Date.now() }));
}

export async function updateExpense(uid: string, id: string, input: ExpenseInput): Promise<void> {
  await whenOnline(() => updateDoc(doc(expensesOf(uid), id), { ...input }));
}

export async function deleteExpense(uid: string, id: string): Promise<void> {
  await whenOnline(() => deleteDoc(doc(expensesOf(uid), id)));
}
