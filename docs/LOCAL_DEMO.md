# Local full-stack demo

## Prerequisites

- Docker (Postgres + optional Python containers)
- Node 20+, Python 3.12+
- `OPENAI_API_KEY` in `interviewlab-agent-orchestrator/.env`

## Start (5 terminals)

```bash
# 1 Postgres (+ optional C4/C5)
cd backend && docker compose -f docker-compose.integration.yml up -d

# 2 Agent (if not docker)
cd interviewlab-agent-orchestrator && uvicorn app.main:app --port 8000

# 3 ML
cd intervulab && uvicorn app.main:app --port 8001

# 4 Backend
cd backend && cp .env.example .env && npm install && npx prisma migrate deploy && npm run dev

# 5 Frontend
cd interviewlab-frontend && cp .env.example .env.local && npm install && npm run dev

# 6 Canvas (optional)
cd interviewlab-system-canvas && npm install && npm run dev
```

## Happy path

1. http://localhost:3000/register  
2. Practice → Initialize Session  
3. Answer questions (text and/or record)  
4. System Design → draw → Submit design  
5. End & Report  

CLI spine: `backend/scripts/demo-spine.sh`
