// Small building blocks reused across screens.

// The big green button. Used on <button> and <Link> elements.
// `raised` adds the soft shadow used on buttons pinned to the bottom of the screen.
export function primaryButtonClass({ busy = false, raised = true } = {}) {
  return `flex h-[62px] w-full items-center justify-center gap-2.5 rounded-[18px] text-lg font-bold text-white no-underline transition-transform active:scale-[.98] ${
    busy ? "bg-saving" : "bg-brand"
  } ${raised ? "shadow-[0_8px_20px_-8px_rgba(47,125,79,.6)]" : ""}`;
}

// Pins its children to the bottom of the screen, with a fade so content scrolls under it.
export function BottomBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[430px] bg-linear-to-t from-paper from-60% to-paper/0 px-5 pt-6 pb-[calc(30px+env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}

export function Spinner() {
  return (
    <span
      aria-hidden
      className="size-5 animate-[spin_.8s_linear_infinite] rounded-full border-[2.5px] border-white/40 border-t-white"
    />
  );
}

// A selectable option button (categories, Today/Yesterday).
export function Chip({
  selected,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { selected: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`h-[54px] cursor-pointer rounded-2xl border-[1.5px] text-[15px] font-semibold ${
        selected ? "border-brand bg-brand-tint text-brand-dark" : "border-line bg-white text-ink"
      } ${className}`}
      {...props}
    />
  );
}
