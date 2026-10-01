"use client";

import { ExpenseForm } from "@/components/ExpenseForm";
import { useRequiredUser } from "@/hooks/useRequiredUser";

export default function AddPage() {
  const user = useRequiredUser();
  if (!user) return null;
  return <ExpenseForm />;
}
