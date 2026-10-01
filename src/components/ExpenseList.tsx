import Link from "next/link";
import { categoryName } from "@/lib/categories";
import { formatMoney } from "@/lib/format";
import type { DayGroup } from "@/lib/summary";

// "Expenses": one white card per day. Tapping a row opens it for editing.
export function ExpenseList({ groups }: { groups: DayGroup[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="px-1 text-lg font-bold">Expenses</h2>
      {groups.map((group) => (
        <div key={group.date} className="flex flex-col gap-2">
          <div className="flex justify-between px-1 text-sm font-semibold text-muted">
            <span>{group.label}</span>
            <span className="tabular-nums">{formatMoney(group.total)}</span>
          </div>
          <ul className="flex flex-col divide-y divide-track overflow-hidden rounded-[22px] bg-white">
            {group.items.map((e) => {
              const category = categoryName(e.category);
              return (
                <li key={e.id}>
                  <Link
                    href={`/edit?id=${e.id}`}
                    className="flex min-h-[68px] items-center gap-3.5 px-4 py-3 text-ink no-underline hover:bg-[#FAFAF6]"
                  >
                    <span className="flex size-[42px] flex-none items-center justify-center rounded-[14px] bg-brand-tint text-base font-bold text-brand-dark">
                      {category[0]}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-base font-semibold">{e.note || category}</span>
                      <span className="text-[13px] font-medium text-muted">{category}</span>
                    </span>
                    <span className="text-[17px] font-bold tabular-nums">{formatMoney(e.amount)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
