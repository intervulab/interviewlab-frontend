# API Contracts — Frontend ↔ Backend

This document defines the REST API contracts between the Frontend (Component 1)
and the Backend (Component 3).

## Base URL

```
Development: http://localhost:4000/api/v1
Production:  https://api.interviewlab.app/api/v1
```

## Authentication

All authenticated endpoints require:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Email/password login |
| POST | `/auth/refresh` | Refresh JWT token |
| GET | `/auth/me` | Get current user |

### Interviews

| Method | Path | Description |
|--------|------|-------------|
| GET | `/interviews` | List user's interviews |
| POST | `/interviews` | Create new interview session |
| GET | `/interviews/:id` | Get interview detail |
| GET | `/interviews/:id/report` | Get interview report |
| DELETE | `/interviews/:id` | Delete interview |

### Resume

| Method | Path | Description |
|--------|------|-------------|
| POST | `/resume/upload` | Upload resume (multipart) |
| GET | `/resume` | Get user's current resume |
| GET | `/resume/analysis` | Get ATS analysis results |

### Passport

| Method | Path | Description |
|--------|------|-------------|
| GET | `/passport` | Get passport metrics |
| GET | `/passport/history` | Get historical snapshots |

---

> **Note**: The WebSocket protocol is documented separately in
> [WEBSOCKET_PROTOCOL.md](./WEBSOCKET_PROTOCOL.md).
