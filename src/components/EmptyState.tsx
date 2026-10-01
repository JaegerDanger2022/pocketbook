import Link from "next/link";
import { primaryButtonClass } from "./ui";

// Shown when the user has never logged an expense.
export function EmptyState() {
  return (
    <section className="flex flex-col items-center gap-4 rounded-[28px] bg-white px-6 py-8 text-center">
      {/* Placeholder until a real illustration is designed. */}
      <div className="flex h-[150px] w-full items-center justify-center rounded-[20px] bg-[repeating-linear-gradient(135deg,#F1EFE8_0_10px,#F6F5F0_10px_20px)]">
        <svg width="72" height="56" viewBox="0 0 72 56" fill="none" aria-hidden>
          <rect x="2" y="8" width="68" height="46" rx="10" fill="#E3EFE6" stroke="#2F7D4F" strokeWidth="3" />
          <path d="M2 18h68" stroke="#2F7D4F" strokeWidth="3" />
          <rect x="46" y="27" width="24" height="14" rx="5" fill="#fff" stroke="#2F7D4F" strokeWidth="3" />
          <circle cx="55" cy="34" r="2.5" fill="#2F7D4F" />
        </svg>
      </div>
      <h2 className="mt-2 text-2xl font-extrabold tracking-[-.4px]">No expenses yet</h2>
      <p className="max-w-[260px] text-base leading-[1.45] font-medium text-pretty text-muted">
        Add your first one and Pocketbook will start sorting your month by category.
      </p>
      <Link href="/add" className={`mt-2 ${primaryButtonClass({ raised: false })}`}>
        Add your first expense
      </Link>
    </section>
  );
}
