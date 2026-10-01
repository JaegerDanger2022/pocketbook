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
- **Planned, not yet added:** Firebase Auth (Google sign-in) and Firestore for data

## Static export rules (important)
Everything runs in the browser. There is no server. So:
- No API routes (`app/api`), server actions, middleware, `cookies()` or `headers()`.
- No dynamic route segments like `app/edit/[id]`. Use query strings instead (`/edit?id=abc`).
- Any component that uses `useSearchParams()` must be inside a `<Suspense>` boundary.
- Components with state, effects or event handlers need `"use client"` at the top.
- `next/image` runs with `images.unoptimized: true`.

## Data rule
Components **never** touch `localStorage` (or Firebase) directly. They go through:
- `src/lib/storage.ts`: expenses (list/add/update/delete). localStorage today, Firestore later.
- `src/lib/auth.ts`: sign-in state. A fake sign-in today, Firebase Auth (Google) later.

These two files are the only ones that should need to change when Firebase is added.
Keep their function signatures async so swapping them in doesn't change any callers.

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
    storage.ts        expenses data layer (swap to Firestore later)
    auth.ts           sign-in layer (swap to Firebase Auth later)
scripts/
  fix-export-windows.mjs  runs after every build (see below)
firebase.json         Firebase Hosting config (serves out/)
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

## Roadmap
1. ✅ Static Next.js app matching the design, data saved in the browser
2. ⏳ Firebase Hosting deploy
3. ⏳ Firebase Auth with Google: replace `src/lib/auth.ts`
4. ⏳ Firestore at `users/{uid}/expenses`: replace `src/lib/storage.ts`.
   Firebase config goes in `NEXT_PUBLIC_FIREBASE_*` env vars (`.env.local`, not committed).
