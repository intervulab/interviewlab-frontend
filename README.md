<div align="center">

# 🎤 InterviewLab Frontend

**Component 1: Next.js Frontend & Real-Time Audio Infrastructure**

[![CI](https://github.com/your-org/interviewlab-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/interviewlab-frontend/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*AI-powered interview preparation with real-time speech analytics, multi-agent debate engine, and interactive system design canvas.*

</div>

---

## 🏗️ Architecture

This repository is **1 of 5 components** in the InterviewLab platform:

| Component | Repository | Owner |
|-----------|-----------|-------|
| **1. Frontend & Audio** | **This repo** | You |
| 2. System Design Canvas | `interviewlab-canvas` | Teammate 2 |
| 3. Node.js Backend | `interviewlab-backend` | Teammate 3 |
| 4. LangGraph AI Engine | `interviewlab-ai` | Teammate 4 |
| 5. ML & Audio Analytics | `interviewlab-ml` | Teammate 5 |

## ✨ Features

- 🖥️ **Next.js 15 App Router** with TypeScript, Tailwind CSS, Shadcn/ui
- 🎤 **Real-time audio capture** via AudioWorklet with 250ms chunking
- 🔌 **WebSocket streaming** with auto-reconnect and dual-channel (binary + JSON)
- 🧊 **Freeze-recovery mode** — detects prolonged silence and guides candidates back
- 📊 **Live speech metrics HUD** — WPM, filler words, hesitation, confidence
- 🪪 **Student Passport** — longitudinal skill tracking across sessions
- 🎨 **System design canvas integration** — Component 2 mount point
- 🔒 **NextAuth.js** with Google/GitHub OAuth + WebAuthn support
- 🌙 **Dark/Light/System theme** with glassmorphic design system
- 🐳 **Docker-ready** for production deployment

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router (routes & pages)
│   ├── (auth)/             # Login, Register
│   ├── (dashboard)/        # Dashboard, Interviews, Passport, Resume, Settings
│   ├── (interview)/        # Live interview room, System design canvas
│   └── (marketing)/        # Landing, Pricing, About
├── components/             # Presentational UI components
│   ├── layout/             # Sidebar, Header
│   ├── shared/             # Loading skeletons, Empty state, Error boundary
│   └── ui/                 # Shadcn/ui primitives
├── features/               # Feature modules (business logic)
│   ├── audio/              # Mic capture, VAD, audio store
│   ├── interview/          # Session state, phase management
│   └── realtime/           # WebSocket client, connection store
├── hooks/                  # Generic reusable hooks
├── lib/                    # Utilities, constants, API client, validators
├── providers/              # Theme, Query, Toast providers
└── types/                  # Global TypeScript types
```

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run type-check` | TypeScript type checking |

## 📖 Documentation

- [Architecture & ADRs](docs/ARCHITECTURE.md)
- [API Contracts](docs/API_CONTRACTS.md)
- [WebSocket Protocol](docs/WEBSOCKET_PROTOCOL.md)
- [Audio Pipeline](docs/AUDIO_PIPELINE.md)
- [Contributing](docs/CONTRIBUTING.md)

## 🤝 Integration Points

| Component | Protocol | Notes |
|-----------|----------|-------|
| C2 (Canvas) | PostMessage / npm package | Embedded in interview session |
| C3 (Backend) | REST + WebSocket | All API calls proxied through `api-client.ts` |
| C4 (AI Engine) | Transparent (via C3) | Questions and debate flow through C3 |
| C5 (ML) | Transparent (via C3) | Audio chunks relayed for analytics |

## 📄 License

MIT © InterviewLab Team
