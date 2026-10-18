# Pocketbook

@AGENTS.md

A simple expense tracker: log an expense in five seconds and see where every coin goes.
Users sign in, add expenses (amount, category, note, date), and see a monthly total,
per-category totals and a day-by-day list.

## Who is working on this
The owner is a **beginner** with Next.js and Firebase. When making changes:
- Explain what you changed and why, in plain language.
- Prefer small, focused changes over big rewrites.
- Tell the user any command they need to run themselves (e.g. Firebase login/deploy).

## Stack
- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Static export** (`output: 'export'` in `next.config.ts`) → `npm run build` writes plain files to `out/`
- **Firebase Hosting** serves `out/` (config in `firebase.json`)
- **Firebase Auth**: Google and Email/Password sign-in (incl. sign up and password reset)
- **Cloud Firestore**: each user's expenses at `users/{uid}/expenses/{expenseId}`
- Firebase project: **`pocketbook-38ba5`** (set in `.firebaserc`)

## Static export rules (important)
Everything runs in the browser. There is no server. So:
- No API routes (`app/api`), server actions, middleware, `cookies()` or `headers()`.
- No dynamic route segments like `app/edit/[id]`. Use query strings instead (`/edit?id=abc`).
- Any component that uses `useSearchParams()` must be inside a `<Suspense>` boundary.
- Components with state, effects or event handlers need `"use client"` at the top.
- `next/image` runs with `images.unoptimized: true`.

## Data rule
Components **never** call Firebase directly. They go through:
- `src/lib/auth.ts`: `watchUser`, sign in/up with Google or email, password reset, sign out,
  and `authErrorMessage` (turns Firebase error codes into friendly sentences).
- `src/lib/storage.ts`: list/get/add/update/delete expenses. Every function takes the user's `uid`.
- `src/lib/firebase.ts`: the Firebase config and lazy `firebaseAuth()` / `firestore()` getters.
  They are created on first use so nothing Firebase runs while Next.js pre-builds pages.

The Firebase web config in `firebase.ts` is **not secret** (it ships in every Firebase web app).
Privacy comes from **`firestore.rules`**: users can only read/write their own
`users/{uid}/expenses`, and saved expenses must have valid fields. If you change the shape of an
expense, update the rules too, test them on the emulators, then deploy them
(`firebase deploy --only firestore:rules`).

Saving while offline: Firestore would wait forever, so `storage.ts` gives up after 10s (or right
away if the browser knows it's offline) and throws `OfflineError`. The form then shows the design's
"You seem to be offline" banner. New expenses get their id up front (`newExpenseId`), so "Try
again" can never create a duplicate.

## Design
The source of truth is the Claude Design project **`Pocketbook.dc.html`**
(claude.ai/design project `4aaa6ba6-11e5-437b-8b4a-9e625ece397a`). Its `support.js` is only the
design tool's preview engine, not app code.

Prototype-only parts we do NOT build: the "JUMP TO" bar, the phone frame/status bar, the fixed
demo date, the seed data, the fake 1.4s save delay.

Design tokens (defined in `src/app/globals.css` under `@theme`, used as Tailwind classes like `bg-brand`):

| Token         | Hex       | Used for                         |
|---------------|-----------|----------------------------------|
| `ink`         | `#1B1C19` | main text, toast background      |
| `paper`       | `#F6F5F0` | app background                   |
| `page`        | `#E8E6DF` | area outside the app column      |
| `brand`       | `#2F7D4F` | primary green, buttons, bars     |
| `brand-dark`  | `#1F5E39` | text on light green              |
| `brand-tint`  | `#E3EFE6` | light green chips/badges         |
| `muted`       | `#6B6C66` | secondary text                   |
| `line`        | `#E6E4DC` | input / chip borders             |
| `track`       | `#EEEDE6` | progress-bar track, row dividers |
| `chip-off`    | `#D6D3C9` | inactive dot                     |
| `danger`      | `#B3261E` | errors, delete                   |
| `danger-bg`   | `#FCEEEC` | error banner background          |
| `danger-line` | `#F2C9C4` | error banner border              |
| `danger-text` | `#7A1A14` | error banner text                |
| `saving`      | `#6FA184` | save button while saving         |

Font: **Figtree** (weights 400–800), loaded with `next/font/google`. Currency: **$** (`CURRENCY` in `src/lib/format.ts`).

## Folder map
```
src/
  app/
    layout.tsx        root layout: font, phone-width column, ToastProvider
    globals.css       Tailwind + design tokens
    page.tsx          Home (monthly summary, categories, expense list)
    login/page.tsx    Sign-in screen
    add/page.tsx      New expense
    edit/page.tsx     Edit expense (reads ?id=)
  components/
    ExpenseForm.tsx   the add/edit screen (shared)
    SummaryCard.tsx   green month-total card
    CategoryGrid.tsx  "By category" cards
    ExpenseList.tsx   "Expenses" grouped by day
    EmptyState.tsx    "No expenses yet"
    Toast.tsx         top-of-screen messages (useToast)
    ui.tsx            primary button style, BottomBar, Chip, Spinner
  hooks/
    useRequiredUser.ts  signed-in user, or redirect to /login
    useExpenses.ts      loads expenses for Home
  lib/
    types.ts          Expense / User types
    categories.ts     the 8 categories
    format.ts         money/date helpers (CURRENCY lives here)
    summary.ts        totals and grouping for Home
    firebase.ts       Firebase config + connection (and emulator switch)
    storage.ts        expenses in Firestore
    auth.ts           Firebase sign-in
scripts/
  fix-export-windows.mjs  runs after every build (see below)
firebase.json         Firebase Hosting, Firestore rules and emulator config
.firebaserc           which Firebase project the CLI uses
firestore.rules       who can read/write what in Firestore
```

## Known quirk: Windows build fix
On Windows, Next.js 16 writes some prefetch files into nested folders
(`out/add/__next.add/__PAGE__.txt`) while the browser requests flat names
(`out/add/__next.add.__PAGE__.txt`), which causes 404s. `scripts/fix-export-windows.mjs` runs
automatically as `postbuild` and flattens them. It does nothing on Mac/Linux. Keep it until
Next.js fixes this upstream.

Note: on Windows, `npm run build` fails with `EBUSY` if a terminal or server has `out/` open.

## Commands
- `npm run dev`: start the dev server at http://localhost:3000
- `npm run lint`: check code style and common mistakes
- `npm run build`: build the static site into `out/`
- `npx serve out`: preview the built site locally
- `firebase deploy --only hosting`: publish `out/` to Firebase Hosting (run `npm run build` first)
- `firebase deploy --only firestore:rules`: publish `firestore.rules` (needed after every rules change)

## Testing with the emulators
Firebase's local emulators let you test sign-in and Firestore (with the real rules) without
touching real users or data. Needs Java.
1. `firebase emulators:start --only auth,firestore` (keep it running)
2. In another terminal: `NEXT_PUBLIC_USE_EMULATORS=1 npm run dev` (PowerShell:
   `$env:NEXT_PUBLIC_USE_EMULATORS="1"; npm run dev`)
3. Google sign-in shows a fake account picker on the emulator. Reset emails aren't sent; they are
   listed by the emulator instead.

Never deploy a build made with `NEXT_PUBLIC_USE_EMULATORS=1`. Run a plain `npm run build` first.

## Roadmap
1. ✅ Static Next.js app matching the design
2. ✅ Firebase Auth (Google + Email/Password) and Firestore with per-user security rules
3. ⏳ Deploy the Firestore rules and the site to Firebase Hosting
4. Ideas: email verification, a real empty-state illustration, Terms/Privacy pages
