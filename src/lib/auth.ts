// Sign-in layer, backed by Firebase Authentication (Google and Email/Password).
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { firebaseAuth } from "./firebase";
import type { User } from "./types";

function toUser(u: FirebaseUser): User {
  // Google accounts have a display name. Email accounts get the name typed at sign-up.
  const name = u.displayName?.trim() || u.email?.split("@")[0] || "there";
  return { uid: u.uid, name, email: u.email ?? "" };
}

// Calls `callback` with the signed-in user (or null) now and whenever it changes.
// Returns a function that stops listening.
export function watchUser(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(firebaseAuth(), (u) => callback(u ? toUser(u) : null));
}

export async function signInWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithPopup(firebaseAuth(), provider);
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(firebaseAuth(), email.trim(), password);
}

export async function signUpWithEmail(name: string, email: string, password: string): Promise<void> {
  const { user } = await createUserWithEmailAndPassword(firebaseAuth(), email.trim(), password);
  await updateProfile(user, { displayName: name.trim() });
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(firebaseAuth(), email.trim());
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(firebaseAuth());
}

// Turns a Firebase error into a sentence we can show on screen.
// Returns "" when there is nothing to show (e.g. the user closed the Google popup).
export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "That email and password don't match. Try again or reset your password.";
    case "auth/invalid-email":
    case "auth/missing-email":
      return "Enter a valid email address.";
    case "auth/missing-password":
      return "Enter your password.";
    case "auth/email-already-in-use":
      return "There's already an account with this email. Try signing in instead.";
    case "auth/weak-password":
    case "auth/password-does-not-meet-requirements":
      return "Use a password with at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "You seem to be offline. Check your connection and try again.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in window. Allow pop-ups and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}
