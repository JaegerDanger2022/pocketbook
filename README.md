# pocketbook
My first app: a simple expense tracker built with Claude Code and Firebase

Log an expense in five seconds and see your monthly total, category totals and a day-by-day list.
Built with Next.js as a static site and hosted on Firebase Hosting. For now, data is saved in your browser.
Firebase login and database are coming next.

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
First time only: create a project at [console.firebase.google.com](https://console.firebase.google.com), then:
```bash
npm install -g firebase-tools
firebase login
firebase use --add   # pick the project you created
```

Every deploy:
```bash
npm run build
firebase deploy --only hosting
```
