"use client";

import { useEffect, useState } from "react";
import { listExpenses } from "@/lib/storage";
import type { Expense } from "@/lib/types";

// Loads all expenses once. Returns null while loading.
export function useExpenses(): Expense[] | null {
  const [expenses, setExpenses] = useState<Expense[] | null>(null);

  useEffect(() => {
    let active = true;
    listExpenses()
      .catch(() => [])
      .then((list) => {
        if (active) setExpenses(list);
      });
    return () => {
      active = false;
    };
  }, []);

  return expenses;
}
