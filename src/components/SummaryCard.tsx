import { formatMoney, monthLabel } from "@/lib/format";

type Props = {
  month: string;
  isCurrentMonth: boolean;
  total: number;
  count: number;
  onPrev: () => void;
  onNext: () => void;
};

const arrowClass =
  "size-12 cursor-pointer rounded-full bg-white/16 text-[22px] leading-none font-bold text-white transition-transform active:scale-[.94] disabled:cursor-default disabled:opacity-35 disabled:active:scale-100";

// The big green card: month switcher and the month's total.
export function SummaryCard({ month, isCurrentMonth, total, count, onPrev, onNext }: Props) {
  return (
    <section className="flex flex-col items-center gap-1 rounded-[28px] bg-brand px-4 pt-4 pb-[26px] text-center text-white">
      <div className="flex w-full items-center justify-between">
        <button type="button" onClick={onPrev} aria-label="Previous month" className={arrowClass}>
          ‹
        </button>
        <span className="text-base font-bold">{monthLabel(month)}</span>
        <button
          type="button"
          onClick={onNext}
          disabled={isCurrentMonth}
          aria-label="Next month"
          className={arrowClass}
        >
          ›
        </button>
      </div>
      <span className="mt-2.5 text-[15px] font-semibold">
        {isCurrentMonth ? "Spent this month" : "Spent"}
      </span>
      <span className="text-[62px] leading-[1.02] font-extrabold tracking-[-2.5px] tabular-nums">
        {formatMoney(total)}
      </span>
      <span className="text-[15px] font-medium">
        {count === 1 ? "1 expense" : `${count} expenses`}
      </span>
    </section>
  );
}
