# 🏥 MedConnect — Doctor Appointment Booking Platform

A modern, full-stack healthcare appointment management platform built with **Next.js 14**, **Tailwind CSS**, **Prisma**, and **SQLite**.

## ✨ Features

### For Patients
- 🔍 Browse doctors by specialty
- 📅 Book appointments with available time slots
- 💳 Choose payment method (Online / Pay at Clinic)
- 📋 View and manage appointments
- ❌ Cancel appointments
- 👤 Update profile information

### For Doctors
- 📊 Dashboard with earnings & appointment stats
- 📋 View and manage patient appointments
- ✅ Confirm, complete, or cancel appointments
- ⚙️ Update profile, fees, and availability

### For Admins
- 📈 Platform-wide analytics dashboard
- 👨‍⚕️ Onboard new doctors with schedules
- 🔄 Activate/deactivate doctor profiles
- 📋 Audit all appointments across the platform

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| Database | SQLite (via Prisma ORM) |
| Auth | NextAuth.js (Credentials) |
| Icons | Lucide React |
| Notifications | React Hot Toast |

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation

```bash
# 1. Navigate to project
cd medconnect

# 2. Install dependencies
npm install

# 3. Generate Prisma client
npx prisma generate

# 4. Create database & push schema
npx prisma db push

# 5. Seed with demo data
npx tsx prisma/seed.ts

# 6. Start development server
npm run dev
```

Then open **http://localhost:3000** in your browser.

### One-Command Setup
```bash
npm run setup
```

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@medconnect.com | admin123 |
| **Doctor** | dr.sharma@medconnect.com | doctor123 |
| **Patient** | patient@medconnect.com | patient123 |

## 📁 Project Structure

```
medconnect/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact page
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── doctors/           # Doctor listing & profiles
│   │   ├── my-appointments/   # Patient appointments
│   │   ├── my-profile/        # Patient profile
│   │   ├── doctor/            # Doctor portal
│   │   │   ├── dashboard/
│   │   │   ├── appointments/
│   │   │   └── profile/
│   │   ├── admin/             # Admin portal
│   │   │   ├── dashboard/
│   │   │   ├── doctors/
│   │   │   ├── add-doctor/
│   │   │   └── appointments/
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, DashboardLayout
│   │   └── ui/                # Reusable UI components
│   ├── lib/                   # Utilities, Prisma, Auth config
│   └── types/                 # TypeScript types
├── package.json
├── tailwind.config.ts
└── next.config.mjs
```

## 📄 License

MIT
