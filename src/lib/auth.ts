// Sign-in layer.
//
// Today: a stand-in "sign-in" that just remembers a guest user in this browser.
// Later: replace with Firebase Auth (Google provider). Keep the function names the same.
import type { User } from "./types";

const KEY = "pocketbook.user";

export async function getUser(): Promise<User | null> {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function signIn(): Promise<User> {
  const user: User = { name: "Guest" };
  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(KEY);
}
