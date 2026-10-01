"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUser, signIn } from "@/lib/auth";

const PITCH = [
  "Monthly total at a glance",
  "Automatic category totals",
  "Private — synced to your account",
];

export default function LoginPage() {
  const router = useRouter();

  // Already signed in? Skip straight to Home.
  useEffect(() => {
    getUser().then((user) => {
      if (user) router.replace("/");
    });
  }, [router]);

  async function handleSignIn() {
    await signIn();
    router.replace("/");
  }

  return (
    <main className="flex flex-1 flex-col px-6 pt-6 pb-10">
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
        <button
          type="button"
          onClick={handleSignIn}
          className="flex h-[62px] cursor-pointer items-center justify-center gap-3 rounded-[18px] border-[1.5px] border-ink bg-white text-lg font-bold text-ink transition-transform active:scale-[.98]"
        >
          <span className="flex size-[26px] items-center justify-center rounded-full border-2 border-ink text-sm font-extrabold">
            G
          </span>
          Continue with Google
        </button>
        <p className="text-center text-[13px] leading-[1.4] text-muted">
          By continuing you agree to the Terms and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
