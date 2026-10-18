// Connects the app to the Firebase project.
//
// This config is NOT a secret: it ships inside every Firebase web app.
// What keeps each user's data private is the Firestore security rules in /firestore.rules.
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfO_eLqrR0ewWabTfy77E5CyyqYBib15w",
  authDomain: "pocketbook-38ba5.firebaseapp.com",
  projectId: "pocketbook-38ba5",
  storageBucket: "pocketbook-38ba5.firebasestorage.app",
  messagingSenderId: "500873756999",
  appId: "1:500873756999:web:44574d6a6b80a947d9cc62",
};

// Set NEXT_PUBLIC_USE_EMULATORS=1 to talk to the local Firebase emulators instead of the
// real project (see "Testing with the emulators" in CLAUDE.md).
const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === "1";

let auth: Auth | undefined;
let db: Firestore | undefined;

function app(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

// Created on first use, so nothing runs while Next.js pre-builds the pages.
export function firebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(app());
    if (useEmulators) connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  }
  return auth;
}

export function firestore(): Firestore {
  if (!db) {
    db = getFirestore(app());
    if (useEmulators) connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }
  return db;
}
