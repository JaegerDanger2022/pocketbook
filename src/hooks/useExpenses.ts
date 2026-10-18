"use client";

import { useEffect, useState } from "react";
import { listExpenses } from "@/lib/storage";
import type { Expense, User } from "@/lib/types";

type State = { expenses: Expense[] | null; failed: boolean };

// Loads the user's expenses once they're known.
// `expenses` is null while loading. `failed` is true if they couldn't be loaded.
export function useExpenses(user: User | null): State {
  const uid = user?.uid;
  const [state, setState] = useState<State & { uid?: string }>({ expenses: null, failed: false });

  useEffect(() => {
    if (!uid) return;
    let active = true;
    listExpenses(uid).then(
      (expenses) => active && setState({ uid, expenses, failed: false }),
      () => active && setState({ uid, expenses: null, failed: true }),
    );
    return () => {
      active = false;
    };
  }, [uid]);

  // Ignore results that belong to a different (earlier) user.
  return state.uid === uid ? state : { expenses: null, failed: false };
}
