# PublicRes — Civic Issue Reporting & Resolution Tracker

A production-ready comprehensive platform designed for modern civic engagement. PublicRes bridges the gap between citizens and local government by offering a robust AI-powered issue reporting workflow, multi-city tracking, dedicated bribery reporting, and a gamified leaderboard for community champions.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Platform Features](#platform-features)
- [How to Use the Website](#how-to-use-the-website)
  - [For Citizens](#for-citizens)
  - [For Officers & Presidents](#for-officers--presidents)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (Vite), TailwindCSS, React Query, React Router, Leaflet Maps, Recharts |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (Neon), Prisma ORM |
| **AI Integration** | Groq SDK (LLaMA inference for Duplicate Checking & Intensity Scoring) |
| **Auth** | Clerk |
| **Storage** | Cloudinary |

---

## Platform Features

1. **AI-Powered Reporting**: 
   - **Smart Duplication Checks:** Before you submit a report, Groq AI will semantically analyze recent reports in your city/area to warn you of potential duplicates, preventing map clutter.
   - **Automated Intensity Scoring:** Every issue submitted is invisibly graded by AI based on severity (1-10). Highly severe reports automatically trigger real-time notifications for nearby officers and the President.
2. **Dedicated Bribery Board**:
   - Easily isolate and report issues categorized as `Bribery`. These are automatically prioritized and sent directly to high-ranking officials to ensure civic integrity.
3. **Multi-City & Area Filtering**:
   - Users are assigned automatically to regions. You can filter the dashboard to see issues globally or locally, and view AI-generated City Reports summarizing everything happening in your district.
4. **Gamified Community Leaderboard**:
   - Both Officers and Citizens are ranked on a public leaderboard based on issues resolved, ratings received, and community participation. Citizens can directly rate an official's performance here!
5. **Secure Domain Verification**:
   - To become an Admin/Officer, users bypass manual OTPs and are instantly verified by securely signing in with an official `.ac.in` domain email. 

---

## How to Use the Website

### For Citizens

1. **Sign Up / Login**: Use the Clerk interface to seamlessly authenticate.
2. **Report an Issue**: Click the "Report Issue" button. 
   - Write a clear title and description.
   - Attach a live photo.
   - The map will auto-detect your location via browser Geolocation and reverse-geocode the exact street and local area.
   - If AI detects an existing issue matching yours, it will recommend upvoting instead!
3. **Engage with the Community**: View the interactive map or list of issues. Click an issue to Upvote or leave Comments.
4. **Rate Your Officials**: When your reported issue is marked as "Resolved" by an officer, you can rate their performance (1-5 stars) and leave feedback. You can also rate top-performing officers directly from the **Leaderboard**.

### For Officers & Presidents

1. **Upgrade your Account**: Navigate to the `Profile` tab. If your email address uses an authorized domain (e.g., `@bmsce.ac.in`), you will be instantly promoted to an **Officer** or **President**.
2. **The Admin Dashboard**: 
   - **My Assigned Issues**: Officers see issues specifically flagged for their registered municipal area.
   - **Analytics**: Beautiful Recharts graphs show resolution rates and category breakdowns for your jurisdiction.
   - **Notifications**: Click the Bell icon in the navbar. The AI automatically pings you here for severe problems (Intensity 8+) or any Bribery reports in your area.
3. **Resolving Issues**: Click on any assigned issue and change the status from `Reported` ➔ `In Progress` ➔ `Resolved`. Resolving an issue adds points to your Leaderboard ranking! Presidents have overriding authority to assign/resolve any issue globally.

---

## Setup & Installation

### 1. Clone & Install dependencies

```bash
git clone https://github.com/nikhil-m-star/publicres.git
cd publicres

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Variables

Create `.env` files in both the frontend and backend folders using the details below.

### 3. Database Synchronization

We use Prisma ORM connected to a PostgreSQL database. Set up your schema:

```bash
cd backend
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema to the database
npx prisma db seed      # (Optional) Seed the database with fake issues/officers
```

### 4. Run Locally

```bash
# Terminal 1 — Run Backend
cd backend && npm run dev

# Terminal 2 — Run Frontend
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables

**Backend `.env`:**
```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=5000
FRONTEND_URL=http://localhost:5173
GROQ_API_KEY=gsk_...
```

**Frontend `.env`:**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:5000/api
```
