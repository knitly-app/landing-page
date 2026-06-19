---
title: Contributing
description: Set up a Knitly development environment, follow code style, run tests, and prepare focused pull requests.
---

# Contributing to Knitly

Thanks for your interest in Knitly! This guide covers everything you need to know to get started.

## Quick Start

1. Read the [README](https://github.com/knitly-app/knitly) for project overview
2. Set up [development environment](#development-environment)
3. Pick an issue from [GitHub Issues](https://github.com/knitly-app/knitly/issues)
4. Create a branch and start coding

## Development Environment

### Requirements

- [Bun](https://bun.sh) (Node.js runtime)
- Git
- ffmpeg (optional, for video processing)

### Setup

```bash
# Clone repository
git clone https://github.com/knitly-app/knitly.git
cd knitly/app

# Install dependencies
bun install
```

### Running Development

```bash
# Start development servers
bun run dev

# Frontend: http://localhost:5173
# API: http://localhost:3000
```

### Seed Data

```bash
# Create admin user
bun --cwd server run seed

# Create admin + test data
bun --cwd server run seed:dev
```

Override admin credentials:

```bash
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpass bun --cwd server run seed
```

## Project Structure

```
knitly/
├── frontend/          # Preact SPA
│   ├── src/
│   │   ├── api/       # API client and query keys
│   │   ├── routes/    # Router routes
│   │   ├── components/# UI components
│   │   ├── hooks/     # Custom hooks
│   │   ├── stores/    # State management
│   │   └── test/      # Tests
│   └── dist/          # Built frontend
├── server/            # Hono API server
│   ├── src/
│   │   ├── routes/    # API routes
│   │   ├── middleware/# Request middleware
│   │   ├── lib/       # Database and utilities
│   │   └── __tests__/ # API tests
│   └── uploads/       # File storage
└── custom/            # Gitignored extensions
```

## Code Style

### Preact
- Use hooks, not class components
- Use functional components
- Keep components small and focused

### State Management
- Use **TanStack Query** for all server state
- Use **Zustand** for client state
- Derive state as expressions
- Never duplicate state in useState

### React Hooks
- **No useCallback** - ever
- **No useEffect** unless syncing with external systems
- Self-documenting names over explanatory comments

### TypeScript
- Strict mode enabled
- No `any` types
- Use branded types for better safety

### Linting

```bash
# Run linting
bun run lint

# Fix linting issues
bun run lint:fix
```

## Making Changes

### 1. Create a Branch

```bash
# For features
git checkout -b feature/your-feature-name

# For bugs
git checkout -b bugfix/your-bug-name
```

### 2. Make Your Changes

- Follow existing code patterns
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
bun test

# Run frontend tests
bun --cwd frontend run test

# Run E2E tests
bun --cwd frontend run test:e2e

# Run specific test
bun test src/test/unit/some-test.test.ts
```

### 4. Run Linting

```bash
bun run lint
```

### 5. Commit Your Changes

Use conventional commit format:

```
feat: add support for video uploads
fix: resolve login issue on mobile
docs: update configuration guide
refactor: move API client to separate module
```

### 6. Push and Create PR

```bash
# Push branch
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## Pull Request Guidelines

- **Keep PRs focused** - one feature or fix per PR
- **Write clear descriptions** - explain what changed and why
- **Include screenshots** for UI changes
- **Don't refactor unrelated code** in the same PR
- **Respond to review comments** promptly

## Architecture Principles

### Keep It Simple
- Avoid unnecessary complexity
- Follow existing patterns
- Assume future maintainers are smart but unfamiliar

### Performance First
- Optimize for 120 users per instance
- Database indexes for common queries
- Lazy loading for routes and components

### Security by Default
- Input validation on all endpoints
- XSS sanitization on user content
- Rate limiting on sensitive endpoints
- SQL parameterized queries

## Testing

### Unit Tests

```bash
bun --cwd frontend run test
```

Test files: `src/**/*.test.ts` and `src/**/*.test.tsx`

### Component Tests

```bash
bun --cwd frontend run test
```

Test files: `src/test/component/*.test.tsx`

### E2E Tests

```bash
bun --cwd frontend run test:e2e
```

Test files: `src/e2e/*.spec.ts`

### API Tests

```bash
bun test
```

Test files: `server/src/__tests__/*.test.ts`

## Documentation

### Updating Docs

1. Update relevant docs in `docs/`
2. Update README.md if needed
3. Add inline comments only for non-obvious logic

### API Documentation

For new API endpoints:
1. Update [docs/api.md](/docs/api/)
2. Add type definitions
3. Document request/response format

## Common Tasks

### Adding a New Route

**Frontend:**

```tsx
// src/routes/new-route.tsx
export const route = {
  Component: () => <div>New Route</div>,
};
```

**API:**

```javascript
// server/src/routes/newRoute.js
import { Hono } from "hono";

export const newRouteRouter = new Hono();

newRouteRouter.get("/", (c) => {
  return c.json({ message: "Hello!" });
});
```

### Adding a New Component

```tsx
// src/components/NewComponent.tsx
import { Component, createSignal } from "preact";

export const NewComponent = () => {
  const [count, setCount] = createSignal(0);
  
  return (
    <div>
      <button onClick={() => setCount(count() + 1)}>
        Count: {count()}
      </button>
    </div>
  );
};
```

### Adding a New Hook

```typescript
// src/hooks/useNewHook.ts
import { createSignal } from "preact";

export const useNewHook = () => {
  const [state, setState] = createSignal(false);
  
  const toggle = () => setState(!state());
  
  return { state, toggle };
};
```

## Issue Templates

### Bug Report

```
**Description**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain.

**Environment:**
- Browser: [e.g. Chrome, Safari]
- OS: [e.g. iOS, Windows]
- Knitly Version: [e.g. v0.1.0]
```

### Feature Request

```
**Problem**
A clear description of what problem this would solve.

**Solution**
A clear description of the proposed solution.

**Alternatives**
Any alternative solutions considered.

**Additional context**
Add any other context or screenshots.
```

## Getting Help

- Join our Discord (if available)
- Check existing issues
- Ask questions in PRs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Happy coding!** 🎉
