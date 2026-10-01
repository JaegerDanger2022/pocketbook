"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { useRequiredUser } from "@/hooks/useRequiredUser";
import { getExpense } from "@/lib/storage";
import type { Expense } from "@/lib/types";

// The URL looks like /edit?id=abc. Reading `?id=` needs a Suspense boundary in a static export.
export default function EditPage() {
  return (
    <Suspense fallback={null}>
      <EditExpense />
    </Suspense>
  );
}

function EditExpense() {
  const router = useRouter();
  const id = useSearchParams().get("id");
  const user = useRequiredUser();
  const [expense, setExpense] = useState<Expense | null>(null);

  useEffect(() => {
    if (!user) return;
    if (!id) {
      router.replace("/");
      return;
    }
    getExpense(id).then((found) => {
      if (found) setExpense(found);
      else router.replace("/"); // deleted or unknown id
    });
  }, [id, user, router]);

  if (!user || !expense) return null;
  return <ExpenseForm expense={expense} />;
}
