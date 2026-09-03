# Contributing to InterviewLab Frontend

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-org/interviewlab-frontend.git
cd interviewlab-frontend

# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env.local

# Start dev server
npm run dev
```

## Branch Naming

- `feature/` — New features (e.g., `feature/freeze-recovery`)
- `fix/` — Bug fixes (e.g., `fix/audio-reconnect`)
- `refactor/` — Code improvements (e.g., `refactor/ws-client`)
- `docs/` — Documentation changes

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add freeze-recovery mode
fix: resolve WebSocket reconnect loop
refactor: extract audio chunk processor
docs: update WebSocket protocol spec
```

## Code Style

- TypeScript strict mode — no `any` types
- Functional components only
- Hooks must start with `use`
- Feature modules must not import from other feature modules

## Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes with tests
3. Run `npm run lint && npx tsc --noEmit && npm run test`
4. Open a PR against `develop`
5. Get at least 1 code review approval
6. Squash merge into `develop`
