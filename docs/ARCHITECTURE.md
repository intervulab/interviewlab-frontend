# InterviewLab Frontend — Architecture

## Overview

This repository contains **Component 1** of the InterviewLab platform:
the Next.js 15 frontend and real-time audio streaming infrastructure.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Next.js  │  │ Audio    │  │ WebSocket│  │ Canvas  │ │
│  │ App      │  │ Worklet  │  │ Client   │  │ Embed   │ │
│  │ Router   │  │ Pipeline │  │ (Dual Ch)│  │ (C2)    │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │              │              │              │      │
└───────┼──────────────┼──────────────┼──────────────┼──────┘
        │              │              │              │
        │  REST/SSR    │  Binary WS   │  JSON WS     │ PostMessage
        ▼              ▼              ▼              ▼
┌───────────────────────────────────────────────────────────┐
│              Component 3: Node.js Backend                 │
│         (Express/Fastify, Prisma, Redis, BullMQ)         │
│                                                           │
│  ┌─────────────────────┐  ┌─────────────────────────┐    │
│  │ REST API Gateway    │  │ WebSocket Server        │    │
│  │ - Auth endpoints    │  │ - Audio relay to C5     │    │
│  │ - CRUD operations   │  │ - Transcript relay      │    │
│  │ - Resume upload     │  │ - Metrics relay         │    │
│  └─────────────────────┘  └─────────────────────────┘    │
└───────────────────────────────────────────────────────────┘
        │                              │
        ▼                              ▼
┌────────────────┐          ┌────────────────────────┐
│  Component 4   │          │    Component 5         │
│  LangGraph     │◄────────►│    ML / Audio          │
│  Multi-Agent   │          │    Analytics           │
│  Orchestrator  │          │    (MFCC, VAD, etc.)   │
└────────────────┘          └────────────────────────┘
```

## Key Design Decisions

### ADR-001: AudioWorklet over MediaRecorder
- **Decision**: Use AudioWorklet for audio capture instead of MediaRecorder
- **Rationale**: MediaRecorder has ~300ms latency and opaque encoding. AudioWorklet gives frame-level access at ~10ms latency, enabling client-side VAD and custom chunking.
- **Trade-off**: More complex implementation, but critical for real-time speech metrics.

### ADR-002: Zustand over Redux
- **Decision**: Use Zustand for client state management
- **Rationale**: Interview sessions have complex, rapidly changing state (audio levels, transcript updates, phase transitions). Zustand's subscribe-with-selector pattern lets WebSocket handlers update state outside React's render cycle without re-rendering the entire tree.

### ADR-003: Dual WebSocket Channels
- **Decision**: Separate binary and JSON channels over a single WebSocket connection
- **Rationale**: Audio binary data and control messages (transcript, metrics, commands) have different serialization needs. Using a single connection with mixed frame types (binary + text) avoids the overhead of maintaining two TCP connections.

### ADR-004: Feature-Sliced Architecture
- **Decision**: Organize code by feature (`features/audio`, `features/interview`, etc.) rather than by file type
- **Rationale**: As the app grows, features become self-contained modules with their own hooks, stores, types, and services. This prevents cross-feature coupling and makes it easy to onboard new team members to specific features.

## Directory Conventions

- `src/app/` — Next.js App Router (routes, layouts, pages only)
- `src/components/` — Presentational components (no business logic)
- `src/features/` — Feature modules (hooks, stores, services, types)
- `src/lib/` — Pure utilities and configurations
- `src/providers/` — React context providers
- `src/hooks/` — Generic reusable hooks
- `src/types/` — Global TypeScript types
