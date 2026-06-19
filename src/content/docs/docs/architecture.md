---
title: Architecture
description: Understand Knitly's frontend, backend, data, extension, deployment, and security architecture.
---

# Knitly Architecture

## Project Structure

```
Knitly/
├── app/
│   ├── frontend/          # Preact SPA
│   │   ├── src/
│   │   │   ├── api/       # API client and query keys
│   │   │   ├── routes/    # Router routes
│   │   │   ├── components/# UI components
│   │   │   ├── hooks/     # Custom hooks
│   │   │   ├── stores/    # Zustand stores
│   │   │   ├── utils/     # Utility functions
│   │   │   └── test/      # Tests
│   │   └── dist/          # Built frontend (vite)
│   │
│   ├── server/            # Hono API server
│   │   ├── src/
│   │   │   ├── routes/    # API route handlers
│   │   │   ├── middleware/# Request middleware
│   │   │   ├── lib/       # Database, security, etc.
│   │   │   └── __tests__/ # API tests
│   │   └── uploads/       # File storage
│   │
│   ├── custom/            # Gitignored extensions
│   │   ├── server/        # Custom API routes
│   │   └── frontend/      # Custom frontend code
│   │
│   └── deploy/            # Deployment configs
│       ├── Caddyfile.example
│       ├── env.production.example
│       ├── knitly.service
│       └── knitly.openrc
│
├── landing/               # Marketing site (Astro)
│   └── src/pages/
│       └── index.astro
│
└── docs/                  # This documentation
```

## Frontend Architecture

### Tech Stack
- **Framework:** Preact 10.27+ (React-compatible, smaller bundle)
- **State:** TanStack Query (server state), Zustand (client state)
- **Routing:** @tanstack/react-router v1.157+
- **Styling:** Tailwind CSS v4.1+
- **Build:** Vite 7.2+

### Directory Structure

```
frontend/src/
├── api/
│   ├── client.ts      # API request wrapper
│   └── queryKeys.ts   # Query key factories
├── routes/
│   ├── index.ts       # Route exports
│   ├── constants.ts   # Route configuration
│   └── [routes].tsx   # Individual route components
├── components/
│   ├── Navigation.tsx
│   ├── PostCard.tsx
│   ├── ProfileCard.tsx
│   ├── CreatePostModal.tsx
│   └── ...
├── hooks/
│   ├── useAuth.ts
│   ├── usePosts.ts
│   ├── useFollow.ts
│   └── index.ts
├── stores/
│   ├── ui.ts          # Global UI state
│   └── lightbox.ts    # Lightbox state
├── utils/
│   ├── avatar.ts
│   ├── markdown.ts
│   ├── time.ts
│   └── inviter.ts
└── test/
    ├── unit/          # Unit tests
    └── component/     # Component tests
```

### State Management Pattern

**Server State (TanStack Query):**
- All API data fetches use TanStack Query
- Query keys defined in `src/api/queryKeys.ts`
- No duplicate state in useState/Zustand

**Client State (Zustand):**
- Global UI state: `src/stores/ui.ts`
- Lightbox state: `src/stores/lightbox.ts`
- Single source of truth per concern

**No useCallback or useEffect unless syncing with external systems**

## Backend Architecture

### Tech Stack
- **Framework:** Hono 4.7+
- **Runtime:** Bun
- **Database:** SQLite (via node:sqlite or better-sqlite3)
- **Security:** Argon2 for password hashing

### Directory Structure

```
server/src/
├── routes/
│   ├── auth.js        # Authentication endpoints
│   ├── users.js       # User management
│   ├── posts.js       # Post CRUD
│   ├── feed.js        # Feed retrieval
│   ├── notifications.js
│   ├── search.js
│   ├── invites.js
│   ├── admin.js       # Admin endpoints
│   ├── media.js       # Media upload/download
│   ├── circles.js
│   ├── settings.js
│   ├── chat.js
│   └── setup.js       # First-time setup
├── middleware/
│   ├── auth.js        # Session verification
│   ├── rateLimit.js   # Rate limiting
│   └── security.js    # Security headers
├── lib/
│   ├── db.js          # Database utilities
│   ├── security.js    # Password hashing, token generation
│   ├── media.js       # File storage abstraction
│   ├── email.js       # Email sending (Resend)
│   └── logging.js
├── scripts/
│   └── seed.js        # Database seeding
└── __tests__/         # API tests
```

### Database Schema

**Tables:**
- `users` - User accounts
- `sessions` - Active sessions
- `posts` - Moments/posts
- `comments` - Post comments
- `reactions` - Post reactions
- `notifications` - User notifications
- `invites` - Invite tokens
- `circles` - User circles
- `circle_members` - Circle membership
- `media` - Media attachments
- `settings` - User/app settings
- `audit_log` - Admin actions

### API Middleware Pipeline

```
Request → Logger → Security Headers → Rate Limit → Route Handler
```

## Custom Extensions System

The `custom/` directory enables deployment-specific features without forking:

```
custom/
├── server/
│   ├── index.js       # Router registration
│   ├── routes.js      # Route definitions
│   ├── ai-chat/       # AI chat extension
│   └── image-gen/     # Image generation extension
└── frontend/
    ├── components/    # Custom components
    └── routes/        # Custom routes
```

**Loading:**
- Server extensions loaded via dynamic import
- Frontend extensions use Vite's glob imports
- Graceful degradation if `custom/` is missing

## Deployment Flow

### Development
```bash
bun run dev          # Start frontend + server
```

### Production Build
```bash
bun run build        # Build frontend with Vite
bun run start        # Start production server
```

### Docker
```bash
docker compose up -d
```

## Security Model

### Authentication
- Session-based with cookies
- Argon2 password hashing
- Secure cookie attributes (httpOnly, secure, sameSite)

### Rate Limiting
- Auth: 5 requests/minute
- Search: 20 requests/minute
- API: 100 requests/minute

### Input Sanitization
- XSS sanitization on posts, comments, search
- SQL parameterized queries
- File upload validation (magic bytes, dimensions)

### CORS
- whitelist via `ALLOWED_ORIGINS` env var
- credentials enabled

## Performance Optimizations

- Database indexes for common queries
- N+1 query fixes (feed, user posts, search)
- Lazy route loading in frontend
- Vendor splitting with Vite
- Image lazy loading
- TanStack Query caching (staleTime/gcTime)
