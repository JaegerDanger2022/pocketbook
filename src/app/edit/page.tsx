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
  const uid = user?.uid;
  const [expense, setExpense] = useState<Expense | null>(null);

  useEffect(() => {
    if (!uid) return;
    if (!id) {
      router.replace("/");
      return;
    }
    getExpense(uid, id).then(
      (found) => {
        if (found) setExpense(found);
        else router.replace("/"); // deleted or unknown id
      },
      () => router.replace("/"), // couldn't load it
    );
  }, [id, uid, router]);

  if (!user || !expense) return null;
  return <ExpenseForm user={user} expense={expense} />;
}
