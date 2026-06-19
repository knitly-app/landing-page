---
title: Knitly Documentation
description: Start here for Knitly installation, configuration, deployment, API, architecture, and extension documentation.
---

# Knitly Documentation

Self-hosted, invite-only social network for families, churches, clubs, and communities.

## Overview

Knitly is a private social network designed for small, trusted circles. Each instance is a closed network for ~120 people — roughly the size of a real-world social circle.

**Knitly is:**
- a private timeline for friends & family
- a shared memory space
- a calm alternative to algorithmic feeds
- infrastructure for trusted communities

**Knitly is not:**
- a public social network
- an influencer platform
- an ad network
- a discovery feed
- a dopamine machine

## Start Here

Get up and running quickly:

- [Getting Started](/docs/getting-started/) - Installation and first steps
- [Configuration](/docs/configuration/) - Environment variables and settings
- [Deployment](/docs/deployment/) - Production deployment guide

## For Developers

Technical documentation for developers:

- [Architecture](/docs/architecture/) - System design and tech stack
- [API Reference](/docs/api/) - Complete API documentation
- [Custom Extensions](/docs/custom-extensions/) - Add deployment-specific features
- [Contributing](/docs/contributing/) - How to contribute code and issues

## Features

### Moments
- Text posts with photos (up to 6 images) or video (30s max, 720p)
- Chronological feed (no algorithm)
- Reactions (love, haha, hugs, celebrate)
- Comments with markdown support
- Edit/delete your own content
- Image lightbox with gallery navigation
- @mentions

### Profiles
- Bio, avatar, header/cover image
- Location and website links
- Posts and media tabs

### Circles
- Create private groups within your network
- Share posts with specific circles only
- Manage circle membership

### The Lobby
- Ephemeral group chat room (IRC/AOL vibes)
- Messages disappear after 24 hours
- See who's online, join/leave announcements
- No chat history anxiety — conversations are fleeting

### Polls
- Create polls on any post
- Multiple choice with customizable options

### Network
- Invite-only membership
- Closed member directory
- No public access or guest viewing

### Notifications
- Reactions and comments on your moments
- In-app only (no email spam)

### Admin
- Generate and revoke invite links
- User management (disable, promote, remove)
- Content moderation (delete posts/comments)
- Audit log for accountability
- Customize app name and logo
- Backup and restore database

## Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Bun + Hono |
| Database | SQLite |
| Frontend | Preact + TanStack Query/Router |
| Styling | Tailwind v4 |
| Storage | S3-compatible (or local filesystem) |
| Auth | Session cookies (Argon2 hashing) |

## Quick Start

### Docker (recommended)

```bash
git clone https://github.com/knitly-app/knitly.git
cd knitly/app
docker compose up -d
```

Open http://localhost:3000 — the first user to sign up becomes admin.

### Local Development

**Requirements:** [Bun](https://bun.sh), ffmpeg (optional, for video processing)

```bash
git clone https://github.com/knitly-app/knitly.git
cd knitly/app
bun install
bun run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3000

## Links

- [Main README](https://github.com/knitly-app/knitly) - Project overview
- [Landing Page](https://knitly.io) - Marketing site
- [GitHub](https://github.com/knitly-app/knitly) - Source code

---

Knitly is a digital living room.

A place for the people you trust.
A network that belongs to you.
A timeline that moves at the speed of real life.

Welcome home.
