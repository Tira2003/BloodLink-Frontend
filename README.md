# 🩸 BloodLink

> Connecting blood donors, patients, and hospitals — faster, smarter, and more humanely.

BloodLink is a web application that bridges the gap between blood donors and those in critical need. Donors register once, get notified automatically when a compatible blood request appears near them, and earn reward points for every accepted donation. Patients and hospitals can submit blood requests in minutes — no complexity, no repeated form-filling.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [User Flows](#-user-flows)
  - [Donor Flow](#donor-flow)
  - [Blood Request Flow](#blood-request-flow)
- [Application Pages](#-application-pages)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Design Principles](#-design-principles)

---

## 🌐 Overview

BloodLink removes friction from the blood donation process. Most users never need to visit the site after registration — they are informed via **SMS and email** (handled by the backend) when a matching blood request is posted in their area. The platform is built with a calm, light-colored UI that keeps users at ease, reserving red accents only for urgency indicators.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Donor Registration** | One-time registration capturing name, age, phone, district, nearest hospital, and blood type |
| **Smart Matching** | Backend geo-demographic matching notifies only nearby, compatible donors |
| **Accept / Reject Requests** | Donors can browse matching requests and accept or reject with full detail revealed on acceptance |
| **Reward Points** | Donors earn points for each accepted donation to encourage continued participation |
| **Blood Requests** | Patients or hospitals submit requests with blood type, urgency level, units needed, and location |
| **Auto-fill for Repeat Users** | Returning users' basic info is auto-populated from their saved profile |
| **Donation Camps** | Registered hospitals and blood banks can list upcoming community donation camp events |
| **Donor Profile** | View personal info, total donations, reward points, and full donation history |
| **SMS & Email Notifications** | All critical alerts are delivered through the backend — no app required |

---

## 🔄 User Flows

### Donor Flow

```
Visit Home Page
      │
      ▼
Register as Donor
  (Full Name, Age, Phone, District,
   Nearest Hospital, Blood Type, Password)
      │
      ▼
  Account Created
      │
      ▼
Receive SMS / Email when a matching
blood request is posted nearby
      │
      ▼
Log In → View Blood Requests Page
  (Only shows requests matching donor's blood type)
      │
      ├── Accept Request
      │      └── Full request details revealed
      │          Donor earns reward points 🎖️
      │
      └── Reject Request
             └── Request remains open for other donors
```

### Blood Request Flow

```
Visit Home Page → Click "Request Blood"
      │
      ▼
Fill Request Form
  (Patient/Hospital basic info — saved for future use)
  Blood Type, Age, Units Needed,
  Urgency Level (Critical / Medium / Low),
  Location, Contact Info
      │
      ▼
Request Submitted
      │
      ▼
Backend finds compatible donors in the district
      │
      ▼
Donors notified via SMS & Email
      │
      ▼
Donor Accepts → Full contact info shared
```

---

## 📄 Application Pages

### `/` — Home
The landing page. Includes:
- Hero section with call-to-action
- Impact statistics
- Blood group compatibility bar
- Features overview
- How It Works section
- Community stories and testimonials
- FAQ section
- CTA banner

### `/requests` — Blood Requests
- Lists all open (`PENDING`) blood requests
- Donors see only requests that match their blood type
- Filters available: blood type, urgency, district
- Clicking a request card opens a detail modal
- Donors can **Accept** or **Reject** a request from the modal

### `/request/create` — Submit a Blood Request
- Open to anyone (no login required)
- Form pre-fills with saved user data for logged-in users
- Fields: patient/hospital info, blood type, units, urgency, district, contact
- On success, compatible donors in the district are notified automatically

### `/register` — Donor Registration
- Single-step registration form for new donors
- Collected fields: Full Name, Email, Phone, Age, District, Nearest Hospital, Blood Type, Password
- Role is automatically set to `DONOR` — no role-selection step required

### `/login` — Sign In
- Email and password login
- Falls back to demo user data when the backend is unavailable

### `/profile` — Donor Profile *(protected — donors only)*
- Personal information card
- Donation stats: total donations, reward points
- Full donation history log
- Edit profile modal

### `/camps` — Donation Camps
- Lists upcoming blood donation camp events
- Hospitals (role: `HOSPITAL`) can create new camp listings
- Filterable by district and upcoming/past status

### `/about` — About BloodLink
- Project mission and information

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 (Vite) |
| **Routing** | React Router DOM v7 |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui, Base UI |
| **Icons** | Lucide React |
| **Animations** | Motion (Framer Motion) |
| **Charts** | Recharts |
| **Font** | Geist Variable |
| **HTTP** | Native `fetch` with JWT Bearer token |
| **Backend API** | REST API at `http://localhost:8080` (configurable) |

---

## 📁 Project Structure

```
se project/
├── public/                    # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── about/             # About page content
│   │   ├── camps/             # Donation camp components
│   │   ├── common/            # Shared generic components
│   │   ├── createRequest/     # Blood request form
│   │   ├── home/              # Home page sections
│   │   │   ├── HeroSection
│   │   │   ├── ImpactStatsSection
│   │   │   ├── BloodGroupsBar
│   │   │   ├── FeaturesSection
│   │   │   ├── HowItWorksSection
│   │   │   ├── VoicesSection
│   │   │   ├── CommunityStoriesSection
│   │   │   ├── FaqSection
│   │   │   └── CtaBanner
│   │   ├── layout/            # PageLayout, Navbar, Footer
│   │   ├── login/             # Login form
│   │   ├── motion-primitives/ # Animation wrappers
│   │   ├── profile/           # Donor profile components
│   │   ├── register/          # Donor registration form
│   │   ├── requests/          # Request cards, filters, modal
│   │   └── ui/                # Base UI primitives (Button, Modal, etc.)
│   ├── constants/             # App-wide constants
│   ├── context/
│   │   └── AuthContext.jsx    # Global auth state (user, login, logout)
│   ├── data/
│   │   ├── demoUsers.js       # Demo/offline user fixtures
│   │   ├── mockData.js        # Mock blood request data (offline fallback)
│   │   └── campData.js        # Mock donation camp data
│   ├── lib/                   # Utility libraries
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Requests.jsx
│   │   ├── CreateRequest.jsx
│   │   ├── DonationCamp.jsx
│   │   └── DonorProfile.jsx
│   ├── services/
│   │   ├── api.js             # Fetch wrapper with JWT auth & 401 handling
│   │   ├── authService.js     # Login, register, logout, session persistence
│   │   ├── donorService.js    # Donor profile, donation history, request responses
│   │   ├── requestService.js  # Blood request CRUD
│   │   └── campService.js     # Donation camp CRUD
│   ├── utils/                 # Helper utilities
│   ├── App.jsx                # Route definitions & protected route guard
│   ├── main.jsx               # App entry point
│   ├── index.css              # Global styles & design tokens
│   └── App.css
├── .env                       # Environment variables
├── vite.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A running backend API (default: `http://localhost:8080`)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd "se project"

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and set your backend URL

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔧 Environment Variables

Create a `.env` file in the project root:

```env
# Backend REST API base URL
VITE_API_URL=http://localhost:8080
```

> **Note:** When the backend is unreachable, the frontend automatically falls back to local mock/demo data so the UI remains usable during development.

---

## 📡 API Reference

All requests are sent to `VITE_API_URL`. JWT tokens are stored in `localStorage` under `bl_token` and sent as `Authorization: Bearer <token>` headers.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new donor |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT |
| `GET` | `/api/requests` | List blood requests (filterable by `bloodType`, `urgency`, `district`, `status`) |
| `POST` | `/api/requests` | Submit a new blood request |
| `GET` | `/api/requests/:id` | Get a single blood request by ID |
| `POST` | `/api/requests/:id/respond` | Donor accepts or rejects a request (`{ action: "ACCEPT" \| "REJECT" }`) |
| `GET` | `/api/donors/me` | Get the current donor's profile |
| `PUT` | `/api/donors/me` | Update the current donor's profile |
| `GET` | `/api/donors/me/donations` | Get the current donor's donation history |
| `GET` | `/api/camps` | List donation camps (filterable by `district`, `upcoming`) |
| `POST` | `/api/camps` | Create a new donation camp (hospital role only) |

---

## 🎨 Design Principles

- **Calm & Clean UI** — Light, white-dominant color palette. Red is reserved exclusively for critical urgency indicators.
- **Minimal Friction** — No unnecessary role-selection screens. Donors register directly; patients request blood without creating an account.
- **Offline-First DX** — Mock data fallbacks ensure developers can work without a live backend.
- **Notification-Driven** — The platform is designed so most users don't need to visit regularly. SMS and email keep donors informed passively.
- **Smart Filtering** — Donors automatically see only blood-type-matched requests; full details are revealed only after accepting.
- **Rewards & Retention** — Reward points incentivize repeat donations and build community engagement.

---

## 🏥 Roles

| Role | Capabilities |
|---|---|
| **Guest** | Browse home page, submit a blood request |
| **DONOR** | All guest features + view matched requests, accept/reject, view profile & donation history |
| **HOSPITAL** | All donor features + organize and list donation camp events |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is developed as a Software Engineering academic project. All rights reserved.

---

<div align="center">
  Made with ❤️ to save lives — <strong>BloodLink</strong>
</div>
