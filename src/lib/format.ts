// Money and date helpers shared across the app.

export const CURRENCY = "$";

export function formatMoney(amount: number): string {
  return (
    CURRENCY +
    amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

// A Date as "YYYY-MM-DD" in the user's local time zone.
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toISODate(d);
}

// Months are "YYYY-MM" strings, e.g. "2026-10".
export function currentMonth(): string {
  return todayISO().slice(0, 7);
}

export function shiftMonth(month: string, by: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + by, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

// "2026-10" -> "October 2026"
export function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// "2026-10-21" -> "Today", "Yesterday" or "Wed, Oct 21"
export function dayLabel(date: string): string {
  if (date === todayISO()) return "Today";
  if (date === yesterdayISO()) return "Yesterday";
  return new Date(date + "T12:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Keeps only digits and one dot, with at most 2 decimals: "1a2.345" -> "12.34"
export function sanitizeAmount(raw: string): string {
  let v = raw.replace(/[^0-9.]/g, "");
  const parts = v.split(".");
  if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
  const [whole, decimals] = v.split(".");
  if (decimals !== undefined && decimals.length > 2) v = whole + "." + decimals.slice(0, 2);
  return v;
}
