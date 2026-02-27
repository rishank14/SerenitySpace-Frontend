# SerenitySpace • Frontend

**A calming, responsive interface designed for emotional wellbeing.**

SerenitySpace is a mental wellness platform where users can vent privately, reflect through journaling, send messages to their future selves, and talk to a supportive AI companion.  
This frontend brings all of that to life — with smooth animations, accessible components, and a design that feels safe and welcoming.

It's not just a UI — it's the space where users feel heard, supported, and gently empowered.

---

## 🧩 Overview

This frontend is a modern Next.js application that provides the full user-facing experience for SerenitySpace — from an animated landing page to real-time vault message delivery. Every interaction is designed with care, warmth, and emotional sensitivity.

It is built for accessibility, responsiveness, and visual delight — with system-aware theming, spring-physics animations, and composable UI primitives.

---

## 🚀 Features

- **Landing Page:**  
  A beautifully animated public-facing page with hero section, feature highlights, how-it-works flow, testimonials, FAQ accordion, and a call-to-action — all with staggered Framer Motion transitions.

- **Authentication:**  
  Full auth flow with sign-up, sign-in, and protected routes.  
  Supports login via email or username, automatic token refresh on 401 responses, and session expiry toasts.

- **Vent Room:**  
  Users can write, edit, and delete emotional vents.  
  Toggle between public (anonymous) and private, filter by mood, and switch between "All Vents" and "My Vents."

- **Reflection Space:**  
  A private journaling area with tag-based and emotion-based filtering.  
  Color-coded emotion badges, full CRUD, and a clean writing experience.

- **Message Vault:**  
  Schedule messages to your future self with a date picker.  
  Real-time delivery via Socket.IO with green highlight pulse animation, live countdown, and fallback polling every 10 seconds.

- **SerenityBot (AI Chatbot):**  
  A floating chatbot widget on the dashboard.  
  Typing dots animation, clear chat option, and empathetic AI responses powered by the backend's Gemini integration.

- **Dashboard:**  
  Personalized welcome, quick-access feature cards, and live stats (latest vent, reflection, and delivered message) with staggered load animations.

- **Theme System:**  
  System-aware light/dark mode with a smooth animated toggle (sun/moon rotation with spring physics), consistent across all components.

- **User Management:**  
  Profile updates, password changes, and account deletion — all from an accessible dropdown menu.

---

## ⚙️ Tech Stack

| Layer              | Technology / Tools                           |
| ------------------ | -------------------------------------------- |
| Framework          | Next.js 15 (App Router, Turbopack)           |
| UI Library         | React 19                                     |
| Language           | TypeScript                                   |
| Styling            | Tailwind CSS v4 (oklch color system)         |
| Animations         | Framer Motion                                |
| UI Primitives      | shadcn/ui + Radix UI                         |
| Forms & Validation | React Hook Form + Zod                        |
| Real-time          | Socket.IO Client                             |
| HTTP Client        | Axios (with interceptor-based token refresh) |
| Toasts             | Sonner                                       |
| Theming            | next-themes                                  |
| Icons              | Lucide React                                 |

---

## 📁 Folder Structure

```
client/
│
├── src/
│   ├── app/                    # Next.js App Router pages and layouts
│   │   ├── (auth)/             # Auth route group (sign-in, sign-up)
│   │   ├── dashboard/          # Dashboard page
│   │   ├── reflections/        # Reflection Space page
│   │   ├── vault/              # Message Vault page
│   │   ├── vent/               # Vent Room page
│   │   ├── layout.tsx          # Root layout (providers, navbar, footer)
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Global styles and Tailwind config
│   │
│   ├── components/             # Reusable UI components
│   │   ├── auth/               # Auth form component
│   │   ├── chatbot/            # Floating chatbot widget
│   │   ├── dashboard/          # Dashboard header, stats, feature cards
│   │   ├── landing-page/       # Hero, features, how-it-works, FAQ, CTA, testimonials
│   │   ├── layout/             # Navbar, Footer, NavbarSwitcher
│   │   ├── reflections/        # Reflection card and form
│   │   ├── ui/                 # shadcn/ui primitives (button, card, dialog, etc.)
│   │   ├── user/               # User menu, profile update, password change modals
│   │   ├── vault/              # Vault card and form
│   │   ├── vent/               # Vent card and form
│   │   ├── ConfirmDialog.tsx   # Reusable confirmation dialog
│   │   ├── mode-toggle.tsx     # Animated theme toggle
│   │   └── theme-provider.tsx  # next-themes provider wrapper
│   │
│   ├── context/                # React context providers
│   │   └── AuthContext.tsx     # Auth state, login, logout, token refresh
│   │
│   └── lib/                    # Utilities and helpers
│       ├── axios.ts            # Axios instance with interceptors
│       ├── formatDateTime.ts   # Date/time formatting utilities
│       ├── utils.ts            # cn() helper and general utilities
│       └── validations/        # Zod schemas for form validation
│
├── public/                     # Static assets (logo, etc.)
├── components.json             # shadcn/ui configuration
├── next.config.ts              # Next.js configuration
├── postcss.config.mjs          # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

---

## 🔧 Environment Setup

Create a `.env.local` file in the `client/` directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:7000/api/v1
```

---

## 🏁 Getting Started

```bash
cd client
npm install
npm run dev
```

- App runs at: `http://localhost:3000`
- Requires the SerenitySpace backend to be running for full functionality

---

## 📄 Pages Overview

| Route          | Description                                       | Auth Required |
| -------------- | ------------------------------------------------- | ------------- |
| `/`            | Animated landing page with features and CTA       | No            |
| `/sign-in`     | Login with email or username                      | No            |
| `/sign-up`     | Register a new account                            | No            |
| `/dashboard`   | Personalized dashboard with stats and quick links | Yes           |
| `/vent`        | Vent Room — write and browse emotional vents      | Yes           |
| `/reflections` | Reflection Space — private journaling             | Yes           |
| `/vault`       | Message Vault — schedule and receive messages     | Yes           |

---

## 🚀 Deployment

This frontend is designed to be deployed on **Vercel** (or any platform supporting Next.js).  
It supports SSR, Turbopack builds, and real-time WebSocket connections to the backend.

---

## 👤 Author

**Rishank Kalra**
