"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { watchUser } from "@/lib/auth";
import type { User } from "@/lib/types";

// Returns the signed-in user. Sends signed-out visitors to /login.
// Returns null while Firebase is still checking, so pages can render nothing until it's known.
export function useRequiredUser(): User | null {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(
    () =>
      watchUser((u) => {
        setUser(u);
        if (!u) router.replace("/login");
      }),
    [router],
  );

  return user;
}
