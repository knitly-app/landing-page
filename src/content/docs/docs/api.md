---
title: API Reference
description: Reference Knitly API endpoints for health checks, setup, authentication, users, posts, comments, reactions, media, circles, invites, admin, and settings.
---

# Knitly API Documentation

## Base URL

```
/api
```

## Authentication

All endpoints (except public ones) require authentication via session cookies.

## Endpoints

### Public Endpoints

#### Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok"
}
```

#### Setup

```http
GET /api/setup/check
```

Check if setup is required.

**Response:**
```json
{
  "setupRequired": true
}
```

---

### Authentication Endpoints

#### Signup

```http
POST /api/auth/signup
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "username": "username",
  "displayName": "Display Name",
  "inviteToken": "optional-invite-token"
}
```

**Response (201):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "displayName": "Display Name",
  "avatarUrl": "/uploads/avatars/user.png",
  "role": "member",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Login

```http
POST /api/auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "displayName": "Display Name",
  "avatarUrl": "/uploads/avatars/user.png",
  "role": "member"
}
```

#### Logout

```http
POST /api/auth/logout
```

**Response:** 204 No Content

#### Forgot Password

```http
POST /api/auth/forgot-password
```

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:** 204 No Content

#### Reset Password

```http
POST /api/auth/reset-password
```

**Request:**
```json
{
  "token": "password-reset-token",
  "password": "newpassword123"
}
```

**Response:** 204 No Content

#### Check Session

```http
GET /api/auth/session
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "displayName": "Display Name",
  "avatarUrl": "/uploads/avatars/user.png",
  "role": "member"
}
```

---

### User Endpoints

#### Get User by ID

```http
GET /api/users/:id
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "displayName": "Display Name",
  "avatarUrl": "/uploads/avatars/user.png",
  "bio": "Hello!",
  "location": "New York",
  "website": "https://example.com",
  "coverImageUrl": "/uploads/covers/user.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Update User

```http
PATCH /api/users/:id
```

**Request:**
```json
{
  "displayName": "New Name",
  "bio": "Updated bio",
  "location": "San Francisco",
  "website": "https://newsite.com"
}
```

**Response:** 200 with updated user

#### Upload Avatar

```http
POST /api/users/:id/avatar
```

**Form Data:**
- `file`: Image file

**Response:**
```json
{
  "avatarUrl": "/uploads/avatars/user.png"
}
```

#### Upload Cover

```http
POST /api/users/:id/cover
```

**Form Data:**
- `file`: Image file

**Response:**
```json
{
  "coverUrl": "/uploads/covers/user.jpg"
}
```

#### Search Users

```http
GET /api/users/search?q=search-term
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "username": "username",
      "displayName": "Display Name",
      "avatarUrl": "/uploads/avatars/user.png"
    }
  ]
}
```

---

### Post Endpoints

#### Create Post

```http
POST /api/posts
```

**Request:**
```json
{
  "content": "This is a post",
  "media": ["base64-image-data", ...],
  "circleIds": [1, 2]
}
```

**Response (201):**
```json
{
  "id": 1,
  "userId": 1,
  "username": "username",
  "displayName": "Display Name",
  "avatarUrl": "/uploads/avatars/user.png",
  "content": "This is a post",
  "media": [],
  "circleIds": [1, 2],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "reactions": [],
  "comments": []
}
```

#### Get Feed

```http
GET /api/posts/feed
```

**Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "userId": 1,
      "username": "username",
      "displayName": "Display Name",
      "avatarUrl": "/uploads/avatars/user.png",
      "content": "This is a post",
      "media": [],
      "circleIds": [1, 2],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "reactions": [],
      "comments": []
    }
  ]
}
```

#### Get Post by ID

```http
GET /api/posts/:id
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "username": "username",
  "displayName": "Display Name",
  "avatarUrl": "/uploads/avatars/user.png",
  "content": "This is a post",
  "media": [],
  "circleIds": [1, 2],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "reactions": [],
  "comments": []
}
```

#### Update Post

```http
PATCH /api/posts/:id
```

**Request:**
```json
{
  "content": "Updated content"
}
```

**Response:** 200 with updated post

#### Delete Post

```http
DELETE /api/posts/:id
```

**Response:** 204 No Content

#### Create Comment

```http
POST /api/posts/:id/comments
```

**Request:**
```json
{
  "content": "This is a comment"
}
```

**Response (201):**
```json
{
  "id": 1,
  "postId": 1,
  "userId": 1,
  "username": "username",
  "content": "This is a comment",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Delete Comment

```http
DELETE /api/comments/:id
```

**Response:** 204 No Content

#### Add Reaction

```http
POST /api/posts/:id/reactions
```

**Request:**
```json
{
  "type": "love"
}
```

**Response:** 204 No Content

#### Remove Reaction

```http
DELETE /api/posts/:id/reactions/:type
```

**Response:** 204 No Content

---

### Notifications Endpoints

#### Get Notifications

```http
GET /api/notifications
```

**Response:**
```json
{
  "notifications": [
    {
      "id": 1,
      "type": "reaction",
      "userId": 1,
      "postId": 1,
      "read": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Mark All as Read

```http
POST /api/notifications/read
```

**Response:** 204 No Content

---

### Circle Endpoints

#### Get Circles

```http
GET /api/circles
```

**Response:**
```json
{
  "circles": [
    {
      "id": 1,
      "name": "Family",
      "description": "Family members",
      "memberCount": 4
    }
  ]
}
```

#### Create Circle

```http
POST /api/circles
```

**Request:**
```json
{
  "name": "Friends",
  "description": "Close friends"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Friends",
  "description": "Close friends",
  "memberCount": 0
}
```

#### Update Circle

```http
PATCH /api/circles/:id
```

**Request:**
```json
{
  "name": "Close Friends"
}
```

**Response:** 200 with updated circle

#### Delete Circle

```http
DELETE /api/circles/:id
```

**Response:** 204 No Content

#### Add Member to Circle

```http
POST /api/circles/:id/members
```

**Request:**
```json
{
  "userId": 2
}
```

**Response:** 204 No Content

#### Remove Member from Circle

```http
DELETE /api/circles/:id/members/:userId
```

**Response:** 204 No Content

---

### Invite Endpoints

#### Get Invites

```http
GET /api/invites
```

**Response:**
```json
{
  "invites": [
    {
      "id": 1,
      "token": "abc123",
      "expiresAt": "2024-12-31T23:59:59.000Z",
      "used": false,
      "revokedAt": null
    }
  ]
}
```

#### Create Invite

```http
POST /api/invites
```

**Request:**
```json
{
  "expiresIn": 30
}
```

**Response (201):**
```json
{
  "id": 1,
  "token": "abc123",
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "used": false
}
```

#### Revoke Invite

```http
DELETE /api/invites/:id
```

**Response:** 204 No Content

#### Accept Invite

```http
POST /api/invites/accept
```

**Request:**
```json
{
  "token": "abc123"
}
```

**Response:** 200 with user data

---

### Admin Endpoints

#### Get Admin Stats

```http
GET /api/admin/stats
```

**Response:**
```json
{
  "totalUsers": 10,
  "totalPosts": 50,
  "totalCircles": 3,
  "totalInvites": 20,
  "dailyActiveUsers": 5
}
```

#### Get Users

```http
GET /api/admin/users
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "username": "username",
      "role": "admin",
      "isActive": true,
      "lastActive": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Update User

```http
PATCH /api/admin/users/:id
```

**Request:**
```json
{
  "role": "member",
  "isActive": false
}
```

**Response:** 200 with updated user

#### Delete User

```http
DELETE /api/admin/users/:id
```

**Response:** 204 No Content

#### Get Invites

```http
GET /api/admin/invites
```

**Response:**
```json
{
  "invites": [...]
}
```

#### Get Audit Log

```http
GET /api/admin/audit-log
```

**Response:**
```json
{
  "logEntries": [
    {
      "id": 1,
      "action": "user_created",
      "userId": 1,
      "details": {},
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Update App Settings

```http
PATCH /api/admin/settings
```

**Request:**
```json
{
  "appName": "My Knitly",
  "appLogo": "base64-logo"
}
```

**Response:** 200 with updated settings

---

### Media Endpoints

#### Upload Media

```http
POST /api/media
```

**Form Data:**
- `file`: Image or video file

**Response (201):**
```json
{
  "id": 1,
  "type": "image",
  "url": "/uploads/media/image.png",
  "thumbnailUrl": "/uploads/media/image-thumb.png"
}
```

#### Get Media

```http
GET /api/media/:id
```

**Response:** Media file (streamed)

#### Delete Media

```http
DELETE /api/media/:id
```

**Response:** 204 No Content

---

### Search Endpoints

#### Search

```http
GET /api/search?q=search-term
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "username": "username",
      "displayName": "Display Name",
      "avatarUrl": "/uploads/avatars/user.png"
    }
  ],
  "posts": [
    {
      "id": 1,
      "userId": 1,
      "username": "username",
      "displayName": "Display Name",
      "avatarUrl": "/uploads/avatars/user.png",
      "content": "This is a post",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Settings Endpoints

#### Get User Settings

```http
GET /api/settings
```

**Response:**
```json
{
  "notifications": {
    "reactions": true,
    "comments": true,
    "mentions": true
  },
  "privacy": {
    "profileVisible": true,
    "searchable": true
  }
}
```

#### Update User Settings

```http
PATCH /api/settings
```

**Request:**
```json
{
  "notifications": {
    "reactions": true,
    "comments": false
  }
}
```

**Response:** 200 with updated settings

---

### Chat Endpoints

#### Get Lobby Messages

```http
GET /api/chat/messages
```

**Response:**
```json
{
  "messages": [
    {
      "id": 1,
      "userId": 1,
      "username": "username",
      "content": "Hello!",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Send Lobby Message

```http
POST /api/chat/messages
```

**Request:**
```json
{
  "content": "Hello everyone!"
}
```

**Response (201):**
```json
{
  "id": 1,
  "userId": 1,
  "username": "username",
  "content": "Hello everyone!",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Auth | 5 | minute |
| Search | 20 | minute |
| General | 100 | minute |

## Error Responses

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```
