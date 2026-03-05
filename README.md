# PublicRes — Civic Issue Reporting & Resolution Tracker

A production-ready PERN stack web application for reporting and tracking civic issues like potholes, broken streetlights, garbage overflow, and water leaks.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), TailwindCSS, React Query, React Router, Leaflet Maps, Recharts |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Neon), Prisma ORM |
| Auth | Clerk |
| Storage | Cloudinary |

## Features

- **Citizens**: Report issues with photo + map pin, track status, upvote, comment
- **Admins**: Dashboard with issue table, status management, analytics charts
- **Maps**: Interactive Leaflet map with color-coded markers (red=reported, yellow=in_progress, green=resolved)
- **Auth**: Clerk-powered sign up/login with protected routes

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/nikhil-m-star/publicres.git
cd publicres

# Backend
cd backend
npm install
cp .env.example .env   # Fill in your credentials

# Frontend
cd ../frontend
npm install
cp .env.example .env   # Fill in your Clerk key
```

### 2. Environment Variables

**Backend `.env`:**
```
DATABASE_URL=postgresql://...@neon.tech/...
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Frontend `.env`:**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:5000/api
```

### 3. Database

```bash
cd backend
npx prisma db push      # Push schema to Neon
npx prisma generate     # Generate client
```

### 4. Run

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon |
| Auth | Clerk |
