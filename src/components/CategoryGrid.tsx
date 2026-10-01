import { formatMoney } from "@/lib/format";
import type { CategoryTotal } from "@/lib/summary";

// "By category": one card per category with spending, biggest first.
export function CategoryGrid({ totals }: { totals: CategoryTotal[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="px-1 text-lg font-bold">By category</h2>
      <div className="grid grid-cols-2 gap-2.5">
        {totals.map((c) => (
          <div key={c.id} className="flex flex-col gap-2.5 rounded-[20px] bg-white p-4">
            <span className="text-sm font-semibold text-muted">{c.name}</span>
            <span className="text-[21px] font-extrabold tracking-[-.3px] tabular-nums">
              {formatMoney(c.total)}
            </span>
            <div className="h-1.5 overflow-hidden rounded-[3px] bg-track">
              <div className="h-full rounded-[3px] bg-brand" style={{ width: `${c.barPercent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
