# MTU Campus Medical Mobility System — Full Project Documentation

> **Project Title:** MTU Campus Medical Mobility System  
> **Institution:** Mountain Top University (MTU)  
> **Project Type:** Final Year Project  
> **Live URL:** http://localhost:3000 (development)

---

## 1. Project Overview

The **MTU Campus Medical Mobility System** is an intelligent, web-based platform designed to streamline how students at Mountain Top University access campus health services. The system solves two critical problems:

1. **Scheduled Medical Transport** — Students can book seats on organized shuttle batches that transport them to the campus clinic at fixed daily times, eliminating overcrowding and long wait times.
2. **Emergency Medical Dispatch** — Students experiencing urgent medical situations can instantly alert the campus clinic, triggering a real-time notification to the driver/admin for immediate dispatch.

Additionally, the system features an **AI-Powered Triage Chatbot (MedBot)** that conversationally assesses a student's symptoms and classifies the urgency of their condition before recommending the appropriate action (self-care, shuttle booking, priority booking, or emergency dispatch).

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | Next.js 16 (App Router) | Server-side rendering, file-based routing, React Server Components |
| **Language** | TypeScript | Type-safe development across the full stack |
| **UI Library** | React 19 | Component-based user interface |
| **Styling** | Tailwind CSS 3.4 | Utility-first responsive design system |
| **Database** | Supabase (PostgreSQL) | Cloud-hosted relational database with real-time subscriptions |
| **AI/LLM** | Groq API (LLaMA 3.3 70B) | Powers the MedBot triage chatbot via OpenAI-compatible SDK |
| **QR Code** | qrcode.react | Generates scannable QR codes on booking receipts |
| **Package Manager** | pnpm | Fast, disk-efficient package management |
| **Deployment** | Node.js | Local development server via `pnpm run dev` |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌────────┐ │
│  │ Home     │  │ Booking  │  │ Emergency │  │ Admin  │ │
│  │ Page     │  │ Page     │  │ Page      │  │ Portal │ │
│  └──────────┘  └──────────┘  └───────────┘  └────────┘ │
│                       │              │            │     │
│              ┌────────┴──────────────┴────────────┘     │
│              ▼                                          │
│     ┌─────────────────┐    ┌──────────────────┐         │
│     │ Supabase Client │    │ /api/triage      │         │
│     │ (Real-time)     │    │ (API Route)      │         │
│     └────────┬────────┘    └────────┬─────────┘         │
└──────────────┼──────────────────────┼───────────────────┘
               │                      │
               ▼                      ▼
    ┌──────────────────┐   ┌──────────────────┐
    │   SUPABASE       │   │   GROQ API       │
    │   (PostgreSQL)   │   │   (LLaMA 3.3)    │
    │                  │   │                  │
    │  • trips         │   │  Conversational  │
    │  • bookings      │   │  triage chat     │
    │  • waitlist      │   │  with symptom    │
    │  • emergencies   │   │  assessment      │
    └──────────────────┘   └──────────────────┘
```

---

## 4. Database Schema (Supabase / PostgreSQL)

### 4.1 `trips` Table
Stores shuttle trip schedules. Each trip represents a specific date and batch.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated unique identifier |
| `batch_number` | INTEGER | Batch number (1–5) |
| `date` | DATE | Trip departure date |
| `seats` | TEXT[] | Array of seat identifiers |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

### 4.2 `bookings` Table
Stores individual student shuttle reservations.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated unique identifier |
| `user_name` | TEXT | Student's full name |
| `user_email` | TEXT | Student's email address |
| `trip_id` | UUID (FK → trips) | Reference to the associated trip |
| `batch_number` | INTEGER | Batch number for quick lookup |
| `seat_number` | TEXT | Assigned seat letter (A–G) |
| `serial_number` | TEXT | Unique booking serial code |
| `status` | TEXT | Either `booked` or `cancelled` |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

### 4.3 `waitlist` Table
Manages overflow when shuttle batches are full.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated unique identifier |
| `user_name` | TEXT | Student's full name |
| `user_email` | TEXT | Student's email |
| `trip_id` | UUID (FK → trips) | Associated trip |
| `batch_number` | INTEGER | Batch number |
| `position` | INTEGER | Queue position |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

### 4.4 `emergencies` Table
Records all emergency dispatch requests.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated unique identifier |
| `user_name` | TEXT | Student name and location info |
| `latitude` | DOUBLE PRECISION | GPS latitude |
| `longitude` | DOUBLE PRECISION | GPS longitude |
| `status` | TEXT | `REQUESTED`, `DISPATCHED`, or `ARRIVING` |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

### 4.5 Row-Level Security (RLS)
All tables have RLS enabled with permissive policies for the initial build, allowing the application's anonymous key to perform full CRUD operations.

---

## 5. Feature Breakdown

### 5.1 Landing Page (`/`)
- **Hero Section**: Large headline with animated badge, two CTA buttons ("Book a Shuttle" and "Request Emergency")
- **Feature Cards Section**: Four cards highlighting Predictive Scheduling, Intelligent Seat Allocation, Emergency Dispatch, and Real-Time Notifications
- **How It Works Section**: Interactive toggle (Book Appointment / Emergency) showing 3-step visual guides for each flow
- **Bento Grid Section**: Premium card layout showcasing core system capabilities with hover effects and gradient blurs
- **Emergency CTA Section**: Large call-to-action card for emergency assistance
- **FAQ Section**: Dark-themed section with categorized frequently asked questions
- **Fully Responsive**: All sections adapt from mobile (320px) to desktop with scaled typography, adjusted padding, and stacked layouts on small screens

### 5.2 Shuttle Booking System (`/booking`)
**How it works:**
1. Student enters their **full name**
2. Selects a **date** (Today or Tomorrow)
3. Selects a **departure batch** (5 daily batches: 7:30 AM, 10:00 AM, 1:00 PM, 4:00 PM, 7:00 PM)
4. Clicks **Confirm Booking**

**What happens behind the scenes:**
- The system checks if a `trip` record exists for the selected date and batch. If not, it creates one.
- A `booking` record is inserted into Supabase with the student's name, auto-generated email, trip reference, batch number, randomly assigned seat (A–G), and a unique serial number.
- On success, a **QR Code Receipt** is displayed with all booking details.
- The receipt can be **downloaded as an HTML file** for offline access.

**Key Component:** `BookingForm.tsx` → `QRReceipt.tsx`

### 5.3 Emergency Dispatch System (`/emergency`)
The emergency page has two independent pathways:

#### Path A: AI Triage Chat (MedBot)
- A conversational chatbot powered by **Groq's LLaMA 3.3 70B** model
- The bot asks targeted follow-up questions about symptoms, pain level (1–10), and duration
- After sufficient assessment (minimum 2–3 exchanges), it classifies the case:
  - **EMERGENCY** → Immediate dispatch triggered
  - **URGENT** → Priority shuttle booking
  - **MODERATE** → Normal shuttle booking
  - **MILD** → Self-care advice
- For EMERGENCY/URGENT cases, the student is prompted to select their location (College or Hostel → specific building)
- Uses a structured `<assessment>` tag format to parse the AI's final decision from its conversational response

**Key Components:** `EmergencyTriageChat.tsx`, `/api/triage/route.ts`

#### Path B: Direct Emergency Button
- A manual "TRIGGER EMERGENCY" button for situations too urgent for conversation
- Flow: Enter Name → Select Category (College/Hostel) → Select Exact Location → Confirmed
- Inserts a record into the `emergencies` table in Supabase with the student's name and location
- The admin dashboard is notified in real-time

**Key Component:** `EmergencyButton.tsx`

### 5.4 Admin Dashboard (`/admin`)
Protected by session-based authentication (username: `Admin`, password: `admin`).

#### Bookings Tab
- **Active Bookings (Today & Upcoming)**: Displayed at the top, sorted by date then batch number — this is what the driver focuses on
- **Archive: Former Batches**: Past bookings grouped by week (e.g., "Week of May 5, 2026") with booking counts per week
- Each booking row shows: User Name, Time Booked, Trip Date, Batch Details (number + departure time), Seat Number
- Data is fetched from Supabase with a JOIN on the `trips` table to get the trip date

#### Emergencies Tab
- Shows all emergency requests with: User & Location, Date & Time, Severity badge, Status badge
- Status-based color coding: `REQUESTED` = red, `DISPATCHED`/`ARRIVING` = green
- Emergency count badge on the tab button

#### Real-Time Updates
- Uses **Supabase Realtime** channels (`postgres_changes`) to listen for INSERT/UPDATE/DELETE events on both `bookings` and `emergencies` tables
- When a new emergency is inserted, three things happen simultaneously:
  1. **Audio Alarm**: Web Audio API plays 3 loud 800Hz square-wave beeps
  2. **System Notification**: Native browser `Notification` API sends a persistent alert (even when the tab is in the background) with the student's name and location
  3. **Full-Screen Modal**: A large red modal overlay appears saying "Critical Emergency!" with the student's details, requiring the driver to click "Acknowledge & Respond" to dismiss

**Key Component:** `AdminSummaryCard.tsx`

### 5.5 Login Pages
- **Student Login** (`/login`): UI-only login form (email + password) — not yet connected to authentication
- **Admin Login** (`/admin/login`): Functional login with hardcoded credentials, uses `sessionStorage` for session persistence, redirects to `/admin` on success

### 5.6 Navigation & Layout
- **Navbar** (`Navbar.tsx`): Fixed top navigation with logo (clickable, refreshes to home via `<a href="/">`), center nav links (Home, About Us, Book Shuttle — hidden on mobile), right-side auth buttons. Automatically hides on admin pages. Responsive: brand name shortens to "MTU Medical" on small screens, Login link hidden on mobile.
- **Footer** (`Footer.tsx`): Site-wide footer rendered on all non-admin pages
- **Layout** (`layout.tsx`): Root layout wrapping all pages with Navbar and Footer, includes `suppressHydrationWarning` to prevent browser-extension-caused hydration mismatches

---

## 6. AI Triage System — Technical Details

### 6.1 API Route (`/api/triage/route.ts`)
- Receives an array of conversation messages from the frontend
- Sends them to **Groq API** (using OpenAI SDK pointed at `https://api.groq.com/openai/v1`) with the `llama-3.3-70b-versatile` model
- Includes a comprehensive **system prompt** that defines MedBot's personality, strict triage rules, and the structured `<assessment>` output format
- Falls back to basic keyword matching if no API key is configured

### 6.2 Triage Rules (from system prompt)
- **Fainting/Loss of consciousness** → Always EMERGENCY (immediate dispatch, no questions)
- **Fractures/Severe sports injuries** → URGENT or EMERGENCY based on pain + mobility
- **Malaria/Typhoid signs** → URGENT if very high fever + extreme weakness, otherwise MODERATE
- **Stomach ache/Food poisoning** → URGENT/EMERGENCY if non-stop vomiting + pain 8+, otherwise MODERATE
- **Menstrual pain** → Only URGENT if completely debilitating (8+), otherwise MODERATE
- **Headache/Dizziness** → Usually MODERATE/MILD unless with chest pain or fainting
- The bot must always ask for pain level (1–10) and conduct minimum 2–3 exchanges before final assessment

### 6.3 Utility Modules
- **`symptomExtractor.ts`**: Extracts symptoms from free-text input using OpenAI (or keyword fallback)
- **`triage.ts`**: Scoring engine that calculates severity based on symptoms, pain level, duration, and risk classification
- **`triageService.ts`**: Orchestration layer that runs the full triage pipeline (extract → classify → score → determine action → generate message)

---

## 7. File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Navbar + Footer wrapper)
│   ├── page.tsx                # Landing/home page
│   ├── globals.css             # Global styles
│   ├── fonts.css               # Font imports
│   ├── theme.css               # Theme variables
│   ├── booking/
│   │   └── page.tsx            # Shuttle booking page
│   ├── emergency/
│   │   └── page.tsx            # Emergency page (triage chat + button)
│   ├── login/
│   │   └── page.tsx            # Student login page
│   ├── admin/
│   │   ├── page.tsx            # Admin dashboard (protected)
│   │   └── login/
│   │       └── page.tsx        # Admin login page
│   ├── receipt/                # Receipt-related pages
│   └── api/
│       └── triage/
│           └── route.ts        # AI triage API endpoint
├── components/
│   ├── Navbar.tsx              # Top navigation bar
│   ├── Footer.tsx              # Site footer
│   ├── BookingForm.tsx         # Shuttle booking form with Supabase integration
│   ├── QRReceipt.tsx           # Booking confirmation with QR code + download
│   ├── SeatGrid.tsx            # Visual seat grid component
│   ├── EmergencyButton.tsx     # Direct emergency trigger with location selection
│   ├── EmergencyTriageChat.tsx # AI-powered triage chatbot interface
│   └── AdminSummaryCard.tsx    # Full admin dashboard (bookings + emergencies + real-time)
├── lib/
│   ├── supabaseClient.ts       # Supabase client initialization
│   └── types.ts                # TypeScript type definitions (Trip, Booking, Waitlist, Emergency)
└── utils/
    ├── symptomExtractor.ts     # AI-based symptom extraction
    ├── triage.ts               # Triage scoring and severity classification engine
    └── triageService.ts        # Triage orchestration service
```

---

## 8. Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (public, used client-side) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public API key |
| `GROQ_API_KEY` | API key for Groq (powers MedBot triage chat) |

---

## 9. Design System

- **Color Palette**: 55% white (`#fafaf9`, `#ffffff`), 35% dark navy (`#0f172a`, `#1e293b`), 10% green accent (`#059669`, `#16a34a`)
- **Typography**: System font stack with font weights 400–900, tracking-tight headings
- **Border Radius**: Large rounded corners (`rounded-2xl` = 16px, `rounded-[32px]`, `rounded-full`)
- **Shadows**: Subtle shadows with colored glows on hover (e.g., `shadow-green-600/20`)
- **Animations**: CSS `animate-in`, `fade-in`, `slide-in-from-bottom-4` transitions, pulse effects on emergency elements
- **Responsive Breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px) — text scales from `text-3xl` on mobile to `text-7xl` on desktop

---

## 10. Key Technical Achievements

1. **Real-Time Database Sync**: Supabase Realtime channels enable instant data propagation between student-facing pages and the admin dashboard without polling
2. **AI-Powered Medical Triage**: Integration with Groq's LLaMA 3.3 70B model for conversational symptom assessment with structured output parsing
3. **Multi-Layer Emergency Alert System**: Combines Web Audio API alarms, native browser notifications (`requireInteraction: true`), and in-app modal overlays for maximum driver awareness
4. **Downloadable QR Receipts**: Students receive a scannable QR code with their booking details, downloadable as a self-contained HTML file
5. **Intelligent Booking Organization**: Admin dashboard automatically separates current/upcoming bookings from historical ones, with weekly grouping for easy archival reference
6. **Fully Responsive Design**: Every page adapts seamlessly from 320px mobile screens to full desktop, with contextual text truncation and layout reflows

---

## 11. Future Enhancements

- Full authentication system (Supabase Auth) for students and admins
- GPS-based live location tracking for emergency dispatch
- Push notifications via service workers for true background alerting
- Seat capacity enforcement (preventing overbooking beyond 7 seats per batch)
- Booking cancellation and waitlist auto-promotion
- Admin ability to update emergency status (REQUESTED → DISPATCHED → ARRIVING)
- Analytics dashboard with booking trends and emergency response times
