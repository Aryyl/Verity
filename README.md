# Verity

**Digital Asset Protection and Deepfake Forensics Platform**

Verity is a near-real-time digital asset monitoring and forensics platform designed to help organizations identify, track, and flag unauthorized use or misappropriation of their proprietary digital media across the internet. Built to address the growing challenge of deepfakes, IP theft, and unauthorized content redistribution at scale.

---

## Overview

Sports organizations, media companies, and content creators generate massive volumes of high-value digital assets that rapidly propagate across global platforms. Verity provides a scalable solution to close the visibility gap — enabling organizations to proactively authenticate their digital assets and detect anomalies in content propagation in near real-time.

---

## Features

- **Near Real-Time Detection** — Continuous scanning and monitoring of digital assets across social platforms, web crawlers, broadcast networks, and P2P channels.
- **AI Forensics Engine** — Confidence-scored asset matching using fingerprint hashing (SHA-256) and deepfake analysis.
- **Violations Command Center** — Full case management workflow with DMCA escalation, evidence review, and status tracking.
- **Asset Library** — Centralized repository for managing licensed digital media with rights metadata.
- **Detection Feed** — Live stream of flagged and authenticated content propagation events.
- **Reports and Analytics** — Detection trend charts, platform distribution analysis, and integrity scoring.
- **Light and Dark Mode** — Fully theme-aware UI with seamless grid backgrounds.
- **Responsive Design** — Optimized for desktop and mobile with a collapsible sidebar and mobile navigation drawer.
- **Profile Management** — Synchronized user profile state across all dashboard views via React Context.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS, Vanilla CSS (global theme layer) |
| UI Components | Custom components, Lucide React icons |
| Animations | Tailwind animate-in, CSS transitions |
| State Management | React Context API (ProfileContext) |
| Build Tool | Turbopack |
| Package Manager | npm / pnpm |

---

## Project Structure

```
landing_page/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── globals.css                 # Global styles and theme tokens
│   └── dashboard/
│       ├── layout.tsx              # Dashboard shell with ProfileProvider
│       ├── page.tsx                # Overview — stats, charts, activity feed
│       ├── assets/page.tsx         # Asset Library
│       ├── feed/page.tsx           # Detection Feed
│       ├── violations/page.tsx     # Violations Case Management
│       ├── reports/page.tsx        # Reports and Analytics
│       ├── subscription/page.tsx   # Subscription Plans
│       └── settings/               # Settings sub-pages
├── components/
│   ├── atoms/                      # Button, Heading, Generating widget
│   ├── layout/                     # Navbar, Header, Sidebar, AuthModal
│   ├── sections/                   # Hero, Pricing, Benefits, Services, Roadmap
│   └── design/                     # Decorative SVG and gradient components
├── context/
│   └── profile-context.tsx         # Global profile state provider
├── constants/                      # Shared data constants
├── lib/                            # Utility functions
└── public/assets/                  # Static images, SVGs, and icons
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Aryyl/Verity.git
cd Verity

# Install dependencies
npm install
# or
pnpm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run start
```

---

## Dashboard Pages

| Route | Description |
|---|---|
| `/dashboard` | Overview with stats, detection trend chart, and recent activity |
| `/dashboard/assets` | Asset Library with split-pane detail view |
| `/dashboard/feed` | Live detection feed with filter and sort |
| `/dashboard/violations` | Case management with DMCA escalation workflow |
| `/dashboard/reports` | Analytics and downloadable reports |
| `/dashboard/subscription` | Subscription tier management |
| `/dashboard/settings` | Profile, security, notifications, and API settings |

---

## Security

- No API keys or secrets are stored in the codebase.
- All environment variables should be placed in a `.env.local` file which is excluded from version control via `.gitignore`.
- The `.gitignore` covers `.env`, `.env.*`, `.env*.local`, `*.pem`, and `node_modules`.

---

## License

This project is proprietary. All rights reserved.
