"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Spinner, primaryButtonClass } from "@/components/ui";
import {
  authErrorMessage,
  sendPasswordReset,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  watchUser,
} from "@/lib/auth";

const PITCH = [
  "Monthly total at a glance",
  "Automatic category totals",
  "Private — synced to your account",
];

type Mode = "signin" | "signup" | "reset";

const SUBMIT_LABEL: Record<Mode, string> = {
  signin: "Sign in",
  signup: "Create account",
  reset: "Send reset link",
};

const inputClass =
  "h-[58px] w-full rounded-2xl border-[1.5px] border-line bg-white px-4 text-[17px] font-medium outline-none focus:border-brand disabled:opacity-60";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  // While signing up we wait for the name to be saved before leaving this page.
  const working = useRef(false);

  // Already signed in? Skip straight to Home.
  useEffect(
    () =>
      watchUser((user) => {
        if (user && !working.current) router.replace("/");
      }),
    [router],
  );

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setInfo("");
  }

  async function run(action: () => Promise<void>, goHome: boolean) {
    working.current = true;
    setBusy(true);
    setError("");
    setInfo("");
    try {
      await action();
      if (goHome) router.replace("/");
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      working.current = false;
      setBusy(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "signup" && !name.trim()) return setError("Enter your name.");
    if (!email.trim()) return setError("Enter your email address.");
    if (mode !== "reset" && !password) return setError("Enter your password.");

    if (mode === "signin") run(() => signInWithEmail(email, password), true);
    if (mode === "signup") run(() => signUpWithEmail(name, email, password), true);
    if (mode === "reset")
      run(async () => {
        await sendPasswordReset(email);
        setInfo(`If there's an account for ${email.trim()}, we've sent it a link to reset your password. Check your inbox.`);
      }, false);
  }

  return (
    <main className="flex flex-1 flex-col gap-7 px-6 pt-6 pb-10">
      <div className="flex flex-1 flex-col justify-center gap-7">
        <div className="flex size-16 items-center justify-center rounded-[20px] bg-brand text-[30px] font-extrabold text-white">
          P
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-[44px] leading-[1.02] font-extrabold tracking-[-1.5px]">Pocketbook</h1>
          <p className="max-w-[290px] text-[19px] leading-[1.4] font-medium text-pretty text-muted">
            Know where every coin goes. Log an expense in five seconds.
          </p>
        </div>

        <ul className="mt-2 flex flex-col gap-2.5">
          {PITCH.map((line) => (
            <li key={line} className="flex items-center gap-3 text-base font-medium">
              <span className="flex size-[22px] items-center justify-center rounded-full bg-brand-tint">
                <span className="size-2 rounded-full bg-brand" />
              </span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3.5">
        {mode === "reset" && (
          <div>
            <h2 className="text-xl font-extrabold">Reset your password</h2>
            <p className="mt-1 text-[15px] leading-[1.4] font-medium text-muted">
              Enter your email and we&apos;ll send you a link to choose a new password.
            </p>
          </div>
        )}

        {error && (
          <div role="alert" className="rounded-2xl border-[1.5px] border-danger-line bg-danger-bg px-4 py-3 text-[15px] leading-[1.4] font-semibold text-danger-text">
            {error}
          </div>
        )}
        {info && (
          <div role="status" className="rounded-2xl bg-brand-tint px-4 py-3 text-[15px] leading-[1.4] font-semibold text-brand-dark">
            {info}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2.5">
          {mode === "signup" && (
            <>
              <label htmlFor="name" className="sr-only">Your name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                autoComplete="name" disabled={busy} className={inputClass} />
            </>
          )}
          <label htmlFor="email" className="sr-only">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            autoComplete="email" inputMode="email" disabled={busy} className={inputClass} />
          {mode !== "reset" && (
            <>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "Password (at least 6 characters)" : "Password"}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                disabled={busy} className={inputClass} />
            </>
          )}
          {mode === "signin" && (
            <button type="button" onClick={() => switchMode("reset")}
              className="h-9 cursor-pointer self-end px-1 text-[15px] font-semibold text-brand">
              Forgot password?
            </button>
          )}
          <button type="submit" disabled={busy} aria-busy={busy}
            className={`${primaryButtonClass({ busy, raised: false })} mt-1 cursor-pointer disabled:cursor-default`}>
            {busy && <Spinner />}
            {SUBMIT_LABEL[mode]}
          </button>
        </form>

        <p className="text-center text-[15px] font-medium text-muted">
          {mode === "signin" && (
            <>New to Pocketbook?{" "}
              <button type="button" onClick={() => switchMode("signup")} className="cursor-pointer font-bold text-brand">Create an account</button>
            </>
          )}
          {mode === "signup" && (
            <>Already have an account?{" "}
              <button type="button" onClick={() => switchMode("signin")} className="cursor-pointer font-bold text-brand">Sign in</button>
            </>
          )}
          {mode === "reset" && (
            <button type="button" onClick={() => switchMode("signin")} className="cursor-pointer font-bold text-brand">Back to sign in</button>
          )}
        </p>

        {mode !== "reset" && (
          <>
            <div className="flex items-center gap-3 text-[13px] font-semibold text-muted" aria-hidden>
              <span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" />
            </div>
            <button
              type="button"
              onClick={() => run(signInWithGoogle, true)}
              disabled={busy}
              className="flex h-[62px] cursor-pointer items-center justify-center gap-3 rounded-[18px] border-[1.5px] border-ink bg-white text-lg font-bold text-ink transition-transform active:scale-[.98] disabled:cursor-default disabled:opacity-60"
            >
              <span className="flex size-[26px] items-center justify-center rounded-full border-2 border-ink text-sm font-extrabold">
                G
              </span>
              Continue with Google
            </button>
          </>
        )}
        <p className="text-center text-[13px] leading-[1.4] text-muted">
          By continuing you agree to the Terms and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
