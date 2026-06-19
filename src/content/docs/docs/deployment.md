---
title: Deployment
description: Deploy Knitly with Docker, bare metal services, reverse proxies, and managed hosting platforms.
---

# Knitly Deployment Guide

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 1 core | 2+ cores |
| RAM | 512MB | 1GB+ |
| Storage | 5GB | 10GB+ |
| Node.js | Bun | Latest |

## Deployment Options

### 1. Docker (Recommended)

#### Quick Start

```bash
git clone https://github.com/knitly-app/knitly.git
cd knitly

# Create environment file
cp app/deploy/env.production.example app/server/.env.production
# Edit with your values

# Start
docker compose up -d
```

#### Environment Setup

Create `app/docker-compose.yml`:

```yaml
version: "3.8"
services:
  knitly:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - BASE_URL=https://your-domain.com
      - ALLOWED_ORIGINS=https://your-domain.com
      - DATABASE_PATH=../knitly.db
    volumes:
      - knitly-data:/app/server/uploads
      - knitly-db:/app/server/knitly.db

volumes:
  knitly-data:
  knitly-db:
```

#### Backups

```bash
# Stop services
docker compose down

# Backup database
docker compose run --rm knitly cp /app/server/knitly.db /backup/knitly.db.$(date +%Y%m%d)

# Restart
docker compose up -d
```

### 2. Bare Metal (systemd)

#### Prerequisites

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install bun sqlite3 ffmpeg git

# Arch Linux
sudo pacman -Sy bun sqlite ffmpeg git
```

#### Installation

```bash
# Clone repository
git clone https://github.com/knitly-app/knitly.git
cd knitly/app

# Install dependencies
bun install

# Build frontend
bun run build

# Create environment file
cp deploy/env.production.example server/.env.production
# Edit with your values

# Create data directories
mkdir -p uploads
```

#### Systemd Service

Create `/etc/systemd/system/knitly.service`:

```ini
[Unit]
Description=Knitly Social Network
After=network.target

[Service]
Type=simple
User=knitly
WorkingDirectory=/opt/knitly/app
ExecStart=/usr/bin/bun --cwd /opt/knitly/app run start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=BASE_URL=https://your-domain.com
Environment=ALLOWED_ORIGINS=https://your-domain.com

[Install]
WantedBy=multi-user.target
```

#### Setup Service

```bash
# Create user
sudo useradd -r -s /bin/false knitly

# Copy app
sudo cp -r /path/to/knitly/app /opt/knitly
sudo chown -R knitly:knitly /opt/knitly

# Enable service
sudo systemctl daemon-reload
sudo systemctl enable knitly
sudo systemctl start knitly

# Check status
sudo systemctl status knitly
```

### 3. Reverse Proxy Configuration

#### Caddy (Recommended)

Create `/etc/caddy/Caddyfile`:

```
knitly.example.com {
    reverse_proxy localhost:3000
    
    # Security headers (optional, Knitly adds its own)
    header {
        X-Frame-Options "DENY"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
    
    # Rate limiting (optional, Knitly handles this)
}
```

Install Caddy:

```bash
# Ubuntu/Debian
sudo apt install caddy

# Arch Linux
sudo pacman -S caddy
```

#### Nginx

Create `/etc/nginx/sites-available/knitly`:

```nginx
server {
    listen 80;
    server_name knitly.example.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/knitly /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. DigitalOcean App Platform

1. Connect your GitHub repository
2. Set build command: `bun install && bun run build`
3. Set start command: `bun run start`
4. Add environment variables
5. Set instance size: $12/mo (2GB RAM recommended)

### 5. Railway

1. Create new project
2. Connect GitHub repository
3. Add environment variables
4. Set port to 3000
5. Deploy

## SSL/TLS Configuration

### Let's Encrypt with Caddy

Caddy automatically obtains and renews Let's Encrypt certificates:

```
knitly.example.com {
    reverse_proxy localhost:3000
}
```

### Manual SSL with Nginx

```nginx
server {
    listen 443 ssl;
    server_name knitly.example.com;
    
    ssl_certificate /etc/letsencrypt/live/knitly.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/knitly.example.com/privkey.pem;
    
    # Strong SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;
    
    location / {
        proxy_pass http://localhost:3000;
        # ... proxy settings
    }
}
```

## Monitoring

### Health Check

```bash
curl https://your-domain.com/api/health
```

### Logs

**Docker:**
```bash
docker compose logs -f
```

**systemd:**
```bash
journalctl -u knitly -f
```

### Metrics

Monitor with:
- CPU usage: `top` or `htop`
- Memory: `free -h`
- Disk: `df -h`
- Network: `nethogs`

## Scaling

### Horizontal Scaling

Knitly is designed for single-instance deployment. For larger deployments:

1. Use a reverse proxy/load balancer
2. Multiple instances behind load balancer (sticky sessions required)
3. External database (PostgreSQL/MySQL) - not currently supported

### Vertical Scaling

1. Upgrade server resources
2. Enable S3 storage for media
3. Use CDN for static assets

## Security Checklist

- [ ] HTTPS enabled (Let's Encrypt)
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] Environment variables set
- [ ] Admin account created
- [ ] Regular backups configured
- [ ] Security updates enabled
- [ ] Rate limiting active
- [ ] Security headers configured

## Troubleshooting

### Port Already in Use

```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Locked

```bash
# Stop server
sudo systemctl stop knitly

# Kill any remaining processes
kill -9 $(pgrep -f knitly)

# Restart
sudo systemctl start knitly
```

### Permission Issues

```bash
# Fix permissions
sudo chown -R knitly:knitly /opt/knitly
sudo chmod -R 755 /opt/knitly
```

### Logs Not Showing

```bash
# Check journal
journalctl -u knitly -n 50

# Check log directory
ls -la /opt/knitly/app/server/logs/
```

## Maintenance

### Updates

```bash
# Pull latest changes
cd /opt/knitly/app
git pull origin main

# Install dependencies
bun install

# Rebuild
bun run build

# Restart
sudo systemctl restart knitly
```

### Database Maintenance

```bash
# Backup
cp knitly.db knitly.db.backup.$(date +%Y%m%d)

# Optimize
sqlite3 knitly.db "VACUUM;"
```

### Cleanup Old Files

```bash
# Remove old uploads (manual review recommended)
find uploads -type f -mtime +365 -delete
```
