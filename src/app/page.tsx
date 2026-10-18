"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CategoryGrid } from "@/components/CategoryGrid";
import { EmptyState } from "@/components/EmptyState";
import { ExpenseList } from "@/components/ExpenseList";
import { SummaryCard } from "@/components/SummaryCard";
import { BottomBar, primaryButtonClass } from "@/components/ui";
import { useExpenses } from "@/hooks/useExpenses";
import { useRequiredUser } from "@/hooks/useRequiredUser";
import { signOut } from "@/lib/auth";
import { currentMonth, monthLabel, shiftMonth } from "@/lib/format";
import { categoryTotals, expensesInMonth, groupByDay, sumAmounts } from "@/lib/summary";

export default function HomePage() {
  const router = useRouter();
  const user = useRequiredUser();
  const { expenses, failed } = useExpenses(user);
  const [month, setMonth] = useState(currentMonth);

  if (!user) return null;
  if (failed) return <LoadError />;
  if (!expenses) return null;

  const isCurrentMonth = month >= currentMonth();
  const inMonth = expensesInMonth(expenses, month);

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <>
      <main className="flex flex-col gap-5 px-5 pt-2 pb-[120px]">
        <header className="flex items-center justify-between px-1 pt-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-muted">Pocketbook</span>
            <span className="text-[26px] font-extrabold tracking-[-.5px]">Hi, {user.name}</span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign out"
            aria-label="Sign out"
            className="size-12 cursor-pointer rounded-full bg-brand-tint text-[17px] font-bold text-brand-dark"
          >
            {user.name[0]}
          </button>
        </header>

        <SummaryCard
          month={month}
          isCurrentMonth={isCurrentMonth}
          total={sumAmounts(inMonth)}
          count={inMonth.length}
          onPrev={() => setMonth(shiftMonth(month, -1))}
          onNext={() => setMonth(shiftMonth(month, 1))}
        />

        {expenses.length === 0 ? (
          <EmptyState />
        ) : inMonth.length === 0 ? (
          <div className="rounded-[22px] bg-white p-6 text-center text-base leading-[1.45] font-medium text-muted">
            Nothing logged in {monthLabel(month)}.
          </div>
        ) : (
          <>
            <CategoryGrid totals={categoryTotals(inMonth)} />
            <ExpenseList groups={groupByDay(inMonth)} />
          </>
        )}
      </main>

      {expenses.length > 0 && (
        <BottomBar>
          <Link href="/add" className={primaryButtonClass()}>
            <span className="text-[26px] leading-none font-semibold">+</span>
            Add expense
          </Link>
        </BottomBar>
      )}
    </>
  );
}

function LoadError() {
  return (
    <main className="flex flex-1 flex-col justify-center gap-4 px-5">
      <div role="alert" className="flex flex-col gap-1 rounded-[20px] border-[1.5px] border-danger-line bg-danger-bg p-4 text-danger-text">
        <span className="text-base font-bold">Couldn&apos;t load your expenses</span>
        <span className="text-sm leading-[1.4] font-medium">Check your connection and try again.</span>
      </div>
      <button type="button" onClick={() => window.location.reload()} className={`${primaryButtonClass({ raised: false })} cursor-pointer`}>
        Try again
      </button>
    </main>
  );
}
