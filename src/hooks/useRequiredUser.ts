"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import type { User } from "@/lib/types";

// Returns the signed-in user. Sends signed-out visitors to /login.
// Returns null while checking, so pages can render nothing until it's known.
export function useRequiredUser(): User | null {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let active = true;
    getUser().then((u) => {
      if (!active) return;
      if (u) setUser(u);
      else router.replace("/login");
    });
    return () => {
      active = false;
    };
  }, [router]);

  return user;
}
