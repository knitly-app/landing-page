---
title: Getting Started
description: Install Knitly, run it locally, configure required environment variables, and complete first setup.
---

# Getting Started with Knitly

## Installation

### Requirements
- [Bun](https://bun.sh) (Node.js runtime)
- SQLite3 (usually pre-installed on most systems)
- ffmpeg (optional, for video processing)

### Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/knitly-app/knitly.git
cd knitly/app
```

#### 2. Install Dependencies

```bash
bun install
```

#### 3. Start the Development Server

```bash
bun run dev
```

This starts:
- Frontend at http://localhost:5173
- API at http://localhost:3000

#### 4. Create Your First Admin Account

Visit http://localhost:5173 and complete the setup wizard, or seed manually:

```bash
bun --cwd server run seed
```

## Environment Variables

Copy `.env.sample` to `server/.env.production` and configure:

```bash
cp deploy/env.production.example server/.env.production
```

### Required Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `3000` | API server port |
| `BASE_URL` | `https://your-domain.com` | Public URL |
| `ALLOWED_ORIGINS` | `https://your-domain.com` | CORS whitelist |

### Database

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_PATH` | `../knitly.db` | SQLite file path |

### Storage

**Local Filesystem (default):**

| Variable | Default | Description |
|----------|---------|-------------|
| `USE_LOCAL_STORAGE` | `true` | Use local storage |
| `LOCAL_UPLOAD_DIR` | `../uploads` | Media upload directory |

**S3-Compatible Storage:**

| Variable | Description |
|----------|-------------|
| `SPACES_ENDPOINT` | S3 endpoint (e.g., nyc3.digitaloceanspaces.com) |
| `SPACES_REGION` | S3 region (e.g., nyc3) |
| `SPACES_BUCKET` | Bucket name |
| `SPACES_KEY` | Access key |
| `SPACES_SECRET` | Secret key |
| `SPACES_PUBLIC_URL` | CDN URL for uploads |

## Deployment Options

### Docker

```bash
# Build and run
docker compose up -d

# View logs
docker compose logs -f
```

**Environment variables** should be set in `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - BASE_URL=https://your-domain.com
  - ALLOWED_ORIGINS=https://your-domain.com
```

### Bare Metal (systemd)

1. **Install dependencies:**
```bash
# Ubuntu/Debian
sudo apt install sqlite3 ffmpeg

# Arch Linux
sudo pacman -S sqlite ffmpeg
```

2. **Build and deploy:**
```bash
bun install
bun run build
```

3. **Create systemd service:**
```bash
sudo cp deploy/knitly.service /etc/systemd/system/
sudo systemctl edit knitly.service
```

4. **Configure environment:**
```bash
sudo mkdir -p /etc/knitly
sudo cp deploy/env.production.example /etc/knitly/.env
sudo nano /etc/knitly/.env  # Edit with your values
```

5. **Enable and start:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable knitly
sudo systemctl start knitly
```

### Reverse Proxy (Caddy)

Example Caddyfile:

```
knitly.example.com {
    reverse_proxy localhost:3000
}
```

## First Run

1. Visit your domain
2. Complete the setup wizard (create admin account)
3. Invite others via admin panel
4. Configure app name/logo in admin settings

## Updating

### Git Update

```bash
git pull origin main
bun install  # if dependencies changed
bun run build
bun run start  # or restart systemd
```

### Docker Update

```bash
docker compose pull
docker compose up -d
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000
# or
netstat -tulpn | grep :3000
```

### Database Migration

Knitly handles schema migrations automatically on startup. If issues persist:

```bash
# Backup database
cp knitly.db knitly.db.backup

# Restart to trigger migration
bun run start
```

### Logs

```bash
# Development
bun run dev  # logs to console

# Production (systemd)
journalctl -u knitly -f

# Docker
docker compose logs -f
```

## Next Steps

1. [Configuration](/docs/configuration/) - Deep dive into settings
2. [Custom Extensions](/docs/custom-extensions/) - Add deployment-specific features
3. [API Documentation](/docs/api/) - Programmatic access
4. [Contributing](https://github.com/knitly-app/knitly/blob/main/CONTRIBUTING.md) - Development
