---
title: Custom Extensions
description: Add deployment-specific server routes and frontend features through Knitly's custom extension system.
---

# Knitly Custom Extensions

Knitly supports a custom extensions system via the `custom/` directory. This allows deployment-specific features without forking the main repository.

## Directory Structure

```
custom/
├── server/          # Custom API routes
│   ├── index.js     # Router registration
│   └── routes.js    # Route definitions
└── frontend/        # Custom frontend code
    ├── components/  # Custom components
    └── routes/      # Custom routes
```

## Server Extensions

### Basic Structure

1. Create `custom/server/index.js`:

```javascript
import { Hono } from "hono";
import { customRouteRouter } from "./routes.js";

export const customRouter = new Hono();

// Register your routes
customRouter.route("/custom-route", customRouteRouter);
```

2. Create `custom/server/routes.js`:

```javascript
import { Hono } from "hono";
import { z } from "zod";

export const customRouteRouter = new Hono();

customRouteRouter.get("/", (c) => {
  return c.json({ message: "Custom route working!" });
});
```

### Full Example: Homelab Portal

```javascript
// custom/server/index.js
import { Hono } from "hono";
import { homelabRouter } from "./homelab/routes.js";

export const customRouter = new Hono();

customRouter.route("/homelab", homelabRouter);
```

```javascript
// custom/server/homelab/routes.js
import { Hono } from "hono";
import { dbUtils } from "../../server/lib/db.js";

export const homelabRouter = new Hono();

homelabRouter.get("/services", (c) => {
  const config = JSON.parse(process.env.HOMELAB_SERVICES || "[]");
  return c.json(config);
});
```

## Frontend Extensions

### Basic Structure

1. Create `custom/frontend/components/CustomComponent.tsx`:

```tsx
import { Component, createSignal } from "preact";

export const CustomComponent = () => {
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

2. Create `custom/frontend/routes/CustomRoute.tsx`:

```tsx
import { CustomComponent } from "../components/CustomComponent";

export const route = {
  Component: () => (
    <div>
      <h1>Custom Page</h1>
      <CustomComponent />
    </div>
  ),
};
```

### Loading Custom Extensions

In `frontend/src/App.tsx`, custom routes are loaded dynamically:

```javascript
// Custom routes are loaded from custom/frontend/routes/
// Using Vite's glob imports
const customRoutes = import.meta.glob("/src/routes/*.tsx", { eager: true });
```

## Available Custom Routes

### 1. Homelab Portal (Built-in)

A config-driven service card grid for homelab management.

**Configuration:**
```bash
HOMELAB_SERVICES='[
  {
    "name": "Jellyfin",
    "url": "http://localhost:8096",
    "icon": "film",
    "description": "Media server"
  },
  {
    "name": "Transistor",
    "url": "http://localhost:8080",
    "icon": "radio",
    "description": "Radio server"
  }
]'
```

**Access:** `/custom/homelab/services`

### 2. AI Chat (Built-in)

Streaming OpenRouter chat via AI SDK.

**Configuration:**
```bash
OPENROUTER_API_KEY=your-api-key
OPENROUTER_MODEL=meta-llama/llama-3-70b-instruct
```

**Access:** `/custom/ai-chat`

### 3. Image Generation (Built-in)

OpenRouter image generation with download + post-to-feed.

**Configuration:**
```bash
OPENROUTER_API_KEY=your-api-key
OPENROUTER_IMAGE_MODEL=stabilityai/stable-diffusion-xl-base-1.0
```

**Access:** `/custom/image-gen`

## Development

### Testing Custom Extensions

1. Start the development server:
```bash
bun run dev
```

2. Custom extensions are automatically loaded from `custom/`

3. Access your custom routes:
```
http://localhost:3000/api/custom/your-route
```

### Logging

Custom routes have access to logging utilities:

```javascript
import { logInfo, logError } from "../../server/lib/logging.js";

logInfo("Custom route called");
logError("Custom route error", error);
```

## Deployment

### Production

1. Ensure `custom/` exists in your deployment
2. Set any required environment variables
3. Restart the server

### Docker

Add custom files to your Docker image:

```dockerfile
FROM knitly/knitly
COPY custom/ /app/custom/
```

### Git

The `custom/` directory is gitignored by default:

```bash
# .gitignore
custom/
```

For version control, create a `custom.example/` directory:

```bash
cp -r custom custom.example
# Update custom.example with your config
```

## Security Considerations

1. **Input Validation** - Always validate user input in custom routes
2. **Rate Limiting** - Consider adding rate limiting for custom endpoints
3. **Authentication** - Custom routes inherit auth middleware
4. **XSS Prevention** - Sanitize user content

## Examples

### 1. Custom Metrics Endpoint

```javascript
// custom/server/metrics/routes.js
import { Hono } from "hono";

export const metricsRouter = new Hono();

metricsRouter.get("/", (c) => {
  const stats = dbUtils.getStats();
  return c.text(
    `knitly_users ${stats.users}\nknitly_posts ${stats.posts}\nknitly_sessions ${stats.sessions}`
  );
});
```

### 2. Webhook Handler

```javascript
// custom/server/webhook/routes.js
import { Hono } from "hono";

export const webhookRouter = new Hono();

webhookRouter.post("/github", async (c) => {
  const payload = await c.req.json();
  // Process GitHub webhook
  return c.json({ status: "ok" });
});
```

### 3. Custom Dashboard

```tsx
// custom/frontend/components/Dashboard.tsx
import { createSignal, onMount } from "preact";
import { api } from "../../../api/client";

export const Dashboard = () => {
  const [stats, setStats] = createSignal(null);

  onMount(async () => {
    const data = await api.get("/custom/dashboard/stats");
    setStats(data);
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg">
        <h3>Total Users</h3>
        <p className="text-2xl">{stats()?.users || 0}</p>
      </div>
      {/* More stats */}
    </div>
  );
};
```

## Troubleshooting

### Extensions Not Loading

1. Check `custom/server/index.js` exports `customRouter`
2. Verify route paths match in `app.js`
3. Check browser/server logs for errors

### Import Errors

Use absolute imports from the `custom/` directory:

```javascript
// Correct
import { dbUtils } from "../../server/lib/db.js";

// Avoid relative imports beyond custom/
```

### Frontend Build Errors

Ensure custom routes are properly exported:

```tsx
// Correct
export const route = { Component: ... };

// Not supported
export default function Component() { ... }
```
