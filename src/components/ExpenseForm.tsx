"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, type CategoryId } from "@/lib/categories";
import { CURRENCY, sanitizeAmount, todayISO, yesterdayISO } from "@/lib/format";
import { addExpense, deleteExpense, updateExpense } from "@/lib/storage";
import type { Expense } from "@/lib/types";
import { useToast } from "./Toast";
import { BottomBar, Chip, Spinner, primaryButtonClass } from "./ui";

type FormValues = {
  amount: string;
  category: CategoryId;
  note: string;
  date: string;
};

const SAVE_ERROR = "Something went wrong. Your details are still here — try again.";

// The add/edit screen. Pass an `expense` to edit it; leave it out to add a new one.
export function ExpenseForm({ expense }: { expense?: Expense }) {
  const router = useRouter();
  const toast = useToast();
  const isEdit = !!expense;

  const [values, setValues] = useState<FormValues>(() =>
    expense
      ? { amount: String(expense.amount), category: expense.category, note: expense.note, date: expense.date }
      : { amount: "", category: "food", note: "", date: todayISO() },
  );
  const [error, setError] = useState(""); // problem with what was typed
  const [saveError, setSaveError] = useState(""); // problem saving it
  const [saving, setSaving] = useState(false);

  function update(patch: Partial<FormValues>) {
    setValues((v) => ({ ...v, ...patch }));
    setError("");
  }

  async function handleSave() {
    const amount = parseFloat(values.amount);
    if (!(amount > 0)) return setError("Enter an amount above zero");
    if (!values.date) return setError("Pick a date");

    setSaving(true);
    setSaveError("");
    const input = {
      amount: Math.round(amount * 100) / 100,
      category: values.category,
      note: values.note.trim(),
      date: values.date,
    };
    try {
      if (expense) {
        await updateExpense(expense.id, input);
        toast("Changes saved");
      } else {
        await addExpense(input);
        toast("Expense added");
      }
      router.push("/");
    } catch {
      setSaving(false);
      setSaveError(SAVE_ERROR);
    }
  }

  async function handleDelete() {
    if (!expense) return;
    try {
      await deleteExpense(expense.id);
      toast("Expense deleted");
      router.push("/");
    } catch {
      setSaveError(SAVE_ERROR);
    }
  }

  const today = todayISO();
  const yesterday = yesterdayISO();
  const saveLabel = saving ? "Saving…" : saveError ? "Try again" : isEdit ? "Save changes" : "Add expense";

  return (
    <>
      {/* Stays pinned at the top while the form scrolls. */}
      <header className="sticky top-0 z-10 flex flex-none items-center justify-between bg-paper px-3 pt-1 pb-2">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="h-12 cursor-pointer px-3 text-base font-semibold text-brand"
        >
          Cancel
        </button>
        <h1 className="text-[17px] font-bold">{isEdit ? "Edit expense" : "New expense"}</h1>
        <div className="w-[72px]" />
      </header>

      <main
        className={`flex flex-col gap-[22px] px-5 pt-1 pb-[130px] transition-opacity duration-200 ${
          saving ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {saveError && (
          <div role="alert" className="flex items-start gap-3 rounded-[20px] border-[1.5px] border-danger-line bg-danger-bg p-4">
            <span className="flex size-7 flex-none items-center justify-center rounded-full bg-danger text-base font-extrabold text-white">
              !
            </span>
            <div className="flex flex-col gap-1 text-danger-text">
              <span className="text-base font-bold">Couldn&apos;t save this expense</span>
              <span className="text-sm leading-[1.4] font-medium text-pretty">{saveError}</span>
            </div>
          </div>
        )}

        <div
          className={`flex flex-col items-center gap-1.5 rounded-[28px] border-2 bg-white px-5 py-[22px] ${
            error ? "border-danger" : "border-transparent"
          }`}
        >
          <label htmlFor="amount" className="text-sm font-semibold text-muted">
            Amount
          </label>
          <div className="flex w-full items-baseline justify-center gap-1">
            <span className="text-[34px] font-bold text-muted">{CURRENCY}</span>
            <input
              id="amount"
              value={values.amount}
              onChange={(e) => update({ amount: sanitizeAmount(e.target.value) })}
              inputMode="decimal"
              placeholder="0.00"
              autoComplete="off"
              className="w-[220px] bg-transparent p-0 text-center text-[52px] font-extrabold tracking-[-1.5px] tabular-nums outline-none"
            />
          </div>
          {error && <span className="text-sm font-semibold text-danger">{error}</span>}
        </div>

        <fieldset className="flex min-w-0 flex-col gap-2.5">
          <legend className="mb-2.5 px-1 text-base font-bold">Category</legend>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => {
              const selected = values.category === c.id;
              return (
                <Chip
                  key={c.id}
                  selected={selected}
                  onClick={() => update({ category: c.id })}
                  className="flex items-center gap-2.5 px-3.5"
                >
                  <span className={`size-2.5 rounded-full ${selected ? "bg-brand" : "bg-chip-off"}`} />
                  {c.name}
                </Chip>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="note" className="px-1 text-base font-bold">
            Note
          </label>
          <input
            id="note"
            value={values.note}
            onChange={(e) => update({ note: e.target.value })}
            maxLength={40}
            placeholder="e.g. Lunch with Sam"
            className="h-[58px] rounded-2xl border-[1.5px] border-line bg-white px-4 text-[17px] font-medium outline-none focus:border-brand"
          />
          <span className="px-1 text-[13px] font-medium text-muted">{values.note.length}/40</span>
        </div>

        <fieldset className="flex min-w-0 flex-col gap-2.5">
          <legend className="mb-2.5 px-1 text-base font-bold">Date</legend>
          <div className="flex gap-2">
            <Chip selected={values.date === today} onClick={() => update({ date: today })} className="px-4">
              Today
            </Chip>
            <Chip selected={values.date === yesterday} onClick={() => update({ date: yesterday })} className="px-4">
              Yesterday
            </Chip>
            <input
              type="date"
              aria-label="Pick a date"
              value={values.date}
              onChange={(e) => update({ date: e.target.value })}
              className="h-[54px] min-w-0 flex-1 rounded-2xl border-[1.5px] border-line bg-white px-3 text-[15px] font-semibold outline-none focus:border-brand"
            />
          </div>
        </fieldset>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 cursor-pointer rounded-[18px] border-[1.5px] border-line text-base font-bold text-danger"
          >
            Delete expense
          </button>
        )}
      </main>

      <BottomBar>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          aria-busy={saving}
          className={`${primaryButtonClass({ busy: saving })} cursor-pointer disabled:cursor-default`}
        >
          {saving && <Spinner />}
          {saveLabel}
        </button>
      </BottomBar>
    </>
  );
}
