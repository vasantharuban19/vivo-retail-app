# Vivo TN Retail Activity App
## Complete Setup & Deployment Guide

---

## 📁 Project Structure

```
vivo-retail-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── Common.jsx          # Reusable UI components
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx       # Admin analytics dashboard
│   │   ├── form/
│   │   │   ├── ActivityForm.jsx    # Main submission form
│   │   │   ├── ActivityTable.jsx   # Per-activity input table
│   │   │   └── SuccessModal.jsx    # Post-submission popup
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   │   └── Topbar.jsx          # Top navigation bar
│   │   └── submissions/
│   │       └── Submissions.jsx     # Submissions list + filters
│   ├── data/
│   │   ├── constants.js            # Branches, activities, campaigns
│   │   └── dummyData.js            # Sample data for demo/dev
│   ├── hooks/
│   │   ├── ThemeContext.js         # Dark/light mode context
│   │   └── useSubmissions.js       # CRUD + Firebase/localStorage
│   ├── styles/
│   │   └── index.css               # Global styles + Tailwind
│   ├── utils/
│   │   ├── firebase.js             # Firebase CRUD helpers
│   │   └── helpers.js              # Format, validate, export utils
│   ├── App.jsx                     # Root component
│   └── index.js                    # Entry point
├── .env.example                    # Environment variables template
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── GOOGLE_SHEETS_GUIDE.md
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ ([nodejs.org](https://nodejs.org))
- npm 9+ (comes with Node.js)

### Steps

```bash
# 1. Navigate into the project
cd vivo-retail-app

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Start development server
npm start
```

The app opens at **http://localhost:3000**

> **Note:** Without Firebase credentials, the app runs in **offline mode**
> using browser localStorage. All data is preserved across refreshes.

---

## 🔥 Firebase Setup (Production Backend)

### Step 1 — Create Firebase Project

1. Go to [firebase.google.com](https://firebase.google.com)
2. Click **Add project** → name it `vivo-tn-retail`
3. Disable Google Analytics (optional) → **Create project**

### Step 2 — Enable Firestore

1. In Firebase Console → **Build → Firestore Database**
2. Click **Create database**
3. Choose **Production mode** (or test mode for development)
4. Select region: **asia-south1** (Mumbai — closest to Tamil Nadu)

### Step 3 — Get Web App Config

1. Firebase Console → **Project Settings** (gear icon)
2. Under **Your apps**, click **Add app → Web** (`</>`)
3. Register app name: `vivo-tn-retail-web`
4. Copy the `firebaseConfig` values

### Step 4 — Set Environment Variables

Edit your `.env.local`:

```
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=vivo-tn-retail.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=vivo-tn-retail
REACT_APP_FIREBASE_STORAGE_BUCKET=vivo-tn-retail.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
REACT_APP_USE_FIREBASE=true
```

### Step 5 — Firestore Security Rules

In Firebase Console → Firestore → **Rules**, replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to retail_activities collection
    // In production: add authentication rules
    match /retail_activities/{docId} {
      allow read, write: if true;  // Dev mode — restrict in production
    }
  }
}
```

---

## 🌐 Deployment

### Option A — Vercel (Recommended, Free)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Build the project
npm run build

# 3. Deploy
vercel --prod

# 4. Set environment variables in Vercel dashboard
# Project Settings → Environment Variables → Add all REACT_APP_* vars
```

### Option B — Netlify

```bash
# 1. Build
npm run build

# 2. Install Netlify CLI
npm install -g netlify-cli

# 3. Deploy
netlify deploy --prod --dir=build

# 4. Set env vars in Netlify dashboard
# Site Settings → Environment variables
```

### Option C — Firebase Hosting

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize (run once)
firebase init hosting
# Public directory: build
# Single-page app: Yes
# Overwrite index.html: No

# 4. Build and deploy
npm run build
firebase deploy
```

---

## 📱 Mobile Usage

The app is fully responsive and works on mobile browsers. For the best
field team experience:

1. Open the app URL on Chrome/Safari on Android/iOS
2. Tap **Share → Add to Home Screen** to install as a PWA-like app
3. The form is optimized for thumb navigation

---

## 🔧 Customization

### Add a new branch
In `src/data/constants.js`, add to the `BRANCHES` array:
```js
export const BRANCHES = [
  ...
  "New Branch Name",  // Add here
];
```

### Add a new activity type
In `src/data/constants.js`, add to `ACTIVITIES`:
```js
export const ACTIVITIES = [
  ...
  { id: "new_activity", label: "New Activity Name", icon: "🎪", color: "blue" },
];
```

### Add a new campaign
In `src/data/constants.js`, add to `CAMPAIGNS`:
```js
export const CAMPAIGNS = [
  ...
  "New Campaign Name",
];
```

---

## 🛠 Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Frontend     | React 18 + JSX                |
| Styling      | Tailwind CSS 3                |
| Charts       | Recharts                      |
| Backend      | Firebase Firestore / localStorage |
| Export       | SheetJS (xlsx) + jsPDF        |
| Icons        | Lucide React                  |
| Deployment   | Vercel / Netlify / Firebase   |

---

## 📊 Features Checklist

- ✅ 13-branch dropdown selection
- ✅ Campaign / project name selection
- ✅ Budget auto-calculation (remaining = allocated − spent)
- ✅ 5 activity types with planned/executed/budget tracking
- ✅ Execution rate badges (green/amber/red)
- ✅ Duplicate submission warning
- ✅ Form validation with inline error messages
- ✅ Success popup with auto-close
- ✅ Admin dashboard with 4 KPI cards
- ✅ Branch budget bar chart
- ✅ Activity execution chart
- ✅ Campaign distribution pie chart
- ✅ Branch execution rate progress bars
- ✅ All submissions list with sorting
- ✅ Filter by branch / campaign / date
- ✅ Full-text search
- ✅ Edit existing submissions
- ✅ Delete submissions
- ✅ Export to Excel (.xlsx)
- ✅ Export to PDF
- ✅ Dark / light mode with system preference detection
- ✅ Mobile responsive layout
- ✅ Firebase Firestore integration
- ✅ Offline mode (localStorage fallback)
- ✅ Timestamp on every submission

---

## 🆘 Troubleshooting

**App won't start:**
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

**Firebase errors:**
- Check `.env.local` has correct values
- Verify Firestore is enabled in Firebase Console
- Check Firestore security rules allow read/write

**Charts not showing:**
- Ensure Recharts is installed: `npm install recharts`

**Export not working:**
- Ensure xlsx and jspdf are installed: `npm install xlsx jspdf jspdf-autotable`

---

*Built for Vivo Tamil Nadu Operations — Internal Use Only*
