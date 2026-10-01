"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const ToastContext = createContext<(message: string) => void>(() => {});

// Shows a short message ("Expense added") at the top of the screen for 1.8 seconds.
// It lives in the root layout, so it stays visible while moving between pages.
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback((text: string) => {
    clearTimeout(timer.current);
    setMessage(text);
    setVisible(true);
    timer.current = setTimeout(() => setVisible(false), 1800);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed top-2 left-1/2 z-20 -translate-x-1/2 rounded-full bg-ink px-[18px] py-3 text-sm font-semibold whitespace-nowrap text-paper transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
      >
        {message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
