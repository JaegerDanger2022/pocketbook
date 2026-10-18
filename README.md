# pocketbook
My first app: a simple expense tracker built with Claude Code and Firebase

Log an expense in five seconds and see your monthly total, category totals and a day-by-day list.
Built with Next.js as a static site, hosted on Firebase Hosting. Sign in with Google or email and
password; each person's expenses are saved in Cloud Firestore where only they can see them.

## Run it on your computer
You need [Node.js](https://nodejs.org) installed.

```bash
npm install      # first time only
npm run dev      # then open http://localhost:3000
```

## Build the website files
```bash
npm run build    # creates the out/ folder
npx serve out    # optional: preview the built site
```

## Deploy to Firebase Hosting
First time only:
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules   # publishes the privacy rules in firestore.rules
```
(The project, `pocketbook-38ba5`, is already set in `.firebaserc`. Deploy the rules again
whenever `firestore.rules` changes.)

Every deploy:
```bash
npm run build
firebase deploy --only hosting
```
