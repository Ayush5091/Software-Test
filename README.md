# FitBook — Smart Gym Booking & Membership Management System

A full-stack gym booking platform built with **Next.js (App Router)**, **MongoDB/Mongoose**, and **JWT auth**. Members book sessions, trainers, and equipment; trainers manage their schedule and appointments; admins run the whole gym from one dashboard.

## What's included

**Members**
- Register/login, browse and buy membership plans (demo checkout)
- Book workout sessions, trainers, or equipment; cancel/reschedule
- Booking history with live status
- QR check-in (simulated scan) with loyalty points
- BMI calculator
- AI-style workout planner — pick a goal, get a weekly split from a full exercise library, each move with sets, target muscle, and step-by-step form cues (custom illustrations, no external images required)
- Progress dashboard — weight trend chart, attendance count, diet plan suggestions by goal

**Trainers**
- Daily/upcoming appointments, accept/reject/complete bookings
- Manage weekly availability slots

**Admin**
- Manage users (roles), trainers (add/edit/remove), membership plans
- View and update all bookings
- Reports & analytics (members, trainers, bookings by status, revenue)
- Send announcements to members/trainers/everyone
- Payments ledger

## Tech stack

- Next.js 14 (App Router) + Tailwind CSS
- MongoDB + Mongoose
- JWT auth via httpOnly cookies, bcrypt password hashing
- Zero external image hosting — exercise illustrations are inline SVG

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up MongoDB

Easiest path: create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (takes ~5 minutes), then grab your connection string. Or run MongoDB locally (`mongodb://localhost:27017/fitbook`).

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/fitbook
JWT_SECRET=<a long random string>
```

Generate a secret quickly with `openssl rand -base64 32`.

### 4. Seed demo data (optional but recommended)

Creates an admin account, three trainers, and starter membership plans.

```bash
npm run seed
```

This prints the generated login credentials, e.g.:
- Admin: `admin@fitbook.com` / `Admin@1234`
- Trainers: `ariana.cole@fitbook.com` / `Trainer@123` (etc.)

### 5. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`. Register a normal account to explore the member flow, or log in with the seeded admin/trainer accounts above.

## Notes on what's simulated vs. real

- **Payments** are a demo checkout — no real card processor is wired up. Swap `app/api/payments/route.js` for a real Stripe/Razorpay integration when you're ready to take real payments.
- **QR check-in** simulates the scan client-side (`Simulate scan` button in the dashboard). In production, a physical scanner at the door would hit `POST /api/checkin` with the member's session.
- **The AI workout planner** is a fast, deterministic rules-based recommender (goal → filtered exercise pool → weekly split) — no external AI API key required, so it works out of the box. It's straightforward to swap in a call to the Anthropic API if you want genuinely generative plans.
- **Email/SMS reminders** aren't wired to a real provider (Twilio/SendGrid, etc.) — the `Notification` model and admin announcements screen are ready to plug one in.

## Project structure

```
app/
  api/                # All backend routes (auth, plans, trainers, bookings, payments, ...)
  (auth)/login, register
  dashboard/           # Member dashboard
  plans/ trainers/ sessions/ bookings/
  workout-planner/ progress/
  trainer/appointments, schedule/
  admin/users, trainers, plans, bookings, reports, announcements, payments
components/            # Shared UI + admin-specific rows/forms
lib/
  models/              # Mongoose schemas
  auth.js dbConnect.js exercises.js diet.js
middleware.js           # Role-based route protection
scripts/seed.mjs        # Demo data seeder
```

## Default roles & route protection

`middleware.js` protects `/admin/*` (admin only), `/trainer/*` (trainer only), and `/dashboard`, `/bookings`, `/progress` (any logged-in user), redirecting to `/login` or `/dashboard` as appropriate.
