---
title: Configuration
description: Configure Knitly environment variables, storage, upload limits, CORS, security headers, rate limits, backups, and logging.
---

# Knitly Configuration

## Environment Variables

Configuration is managed via environment variables. Copy the example file and customize:

```bash
cp server/.env.example server/.env.production
```

### Core Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode (`development` or `production`) |
| `PORT` | `3000` | API server port |
| `BASE_URL` | `http://localhost:3000` | Public URL for your instance |
| `ALLOWED_ORIGINS` | — | Comma-separated list of allowed CORS origins |

**Example:**
```bash
NODE_ENV=production
PORT=3000
BASE_URL=https://knitly.example.com
ALLOWED_ORIGINS=https://knitly.example.com
```

### Database

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_PATH` | `../knitly.db` | Path to SQLite database (relative or absolute) |

### File Storage

#### Local Filesystem (Default)

| Variable | Default | Description |
|----------|---------|-------------|
| `USE_LOCAL_STORAGE` | `true` | Store uploads on local filesystem |
| `LOCAL_UPLOAD_DIR` | `../uploads` | Directory for media uploads |

#### S3-Compatible Storage

| Variable | Description |
|----------|-------------|
| `USE_LOCAL_STORAGE` | Set to `false` to use S3 |
| `SPACES_ENDPOINT` | S3 endpoint URL |
| `SPACES_REGION` | S3 region |
| `SPACES_BUCKET` | Bucket name |
| `SPACES_KEY` | Access key ID |
| `SPACES_SECRET` | Secret access key |
| `SPACES_PUBLIC_URL` | Public URL for accessing uploads |

**Example S3 Configuration:**
```bash
USE_LOCAL_STORAGE=false
SPACES_ENDPOINT=nyc3.digitaloceanspaces.com
SPACES_REGION=nyc3
SPACES_BUCKET=my-knitly-bucket
SPACES_KEY=YOUR_ACCESS_KEY
SPACES_SECRET=YOUR_SECRET_KEY
SPACES_PUBLIC_URL=https://my-bucket.nyc3.cdn.digitaloceanspaces.com
```

### Upload Limits

| Variable | Default | Description |
|----------|---------|-------------|
| `MAX_UPLOAD_BYTES` | `10485760` (10MB) | Maximum file size |
| `MEDIA_MAX_DIMENSION` | `2048` | Maximum image dimension |
| `MEDIA_QUALITY` | `82` | JPEG quality (1-100) |

### Seed User

| Variable | Default | Description |
|----------|---------|-------------|
| `ADMIN_EMAIL` | — | Email for admin account |
| `ADMIN_PASSWORD` | — | Password for admin account |
| `ADMIN_USERNAME` | — | Username for admin account |
| `ADMIN_DISPLAY_NAME` | — | Display name for admin account |

## App Settings (via Admin Panel)

After setup, configure via the admin panel at `/admin`:

### General Settings
- **App Name** - Display name for your instance
- **App Logo** - Upload a custom logo icon

### User Management
- **Member Limits** - Currently fixed at 120 users
- **Invite Settings** - Manage invite links and expiration

### Appearance
- **Theme** - Current: light only (dark mode in roadmap)

## CORS Configuration

Set `ALLOWED_ORIGINS` to a comma-separated list of allowed domains:

```bash
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

For development, you can use wildcards:
```bash
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Note:** Wildcards are not allowed in production for security.

## Security Headers

Knitly includes automatic security headers:

| Header | Value |
|--------|-------|
| `Content-Security-Policy` | Default CSP for self-hosted app |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Restricted permissions |

Customize via `middleware/security.js` if needed.

## Rate Limiting

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Auth | 5 | minute |
| Search | 20 | minute |
| General API | 100 | minute |

Customize via `middleware/rateLimit.js`.

## Database Backups

### Manual Backup

```bash
# Stop the server first
bun run stop

# Backup
cp ../knitly.db ../knitly.db.backup.$(date +%Y%m%d)

# Restart
bun run start
```

### Automated Backup (systemd)

Create a backup script:

```bash
sudo nano /usr/local/bin/knitly-backup
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/knitly"
DB_PATH="/path/to/knitly.db"

mkdir -p "$BACKUP_DIR"
cp "$DB_PATH" "$BACKUP_DIR/knitly.db.$(date +%Y%m%d%H%M%S)"
find "$BACKUP_DIR" -name "knitly.db.*" -mtime +30 -delete
```

```bash
sudo chmod +x /usr/local/bin/knitly-backup
```

Add to crontab:

```bash
sudo crontab -e
# Backup daily at 2am
0 2 * * * /usr/local/bin/knitly-backup
```

## Logging

### Development

Logs to console when running `bun run dev`.

### Production

Check logs via:

**systemd:**
```bash
journalctl -u knitly -f
```

**Docker:**
```bash
docker compose logs -f
```

### Log Location

Production logs go to `server/logs/`.

## Custom Environment Files

You can specify a custom environment file:

```bash
NODE_ENV=staging bun --cwd server run dev
```

Or for production:
```bash
NODE_ENV=production bun --cwd server run start
```

## Environment File Locations

| Environment | Location |
|-------------|----------|
| Development | `server/.env` |
| Production | `server/.env.production` |
| Docker | Set in `docker-compose.yml` |
