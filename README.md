# 🚀 Team Metrics API

This project provides a minimal backend for the **SOV Vibe-A-Thon** Team Metrics application. It exposes a REST API for user authentication, team management, and accomplishment tracking. Data is persisted to a local JSON file and authentication is handled with JSON Web Tokens (JWT).

## ✨ Features

- **User Authentication & Roles**: register and login with email/password. Returned JWT embeds the user role (`admin`, `lead`, or `user`) and team ID. Protected routes enforce authentication and authorization.
- **User Management**: admins and team leads can list all users and manage basic user information.
- **Team Management**: admins and team leads can create teams.
- **Accomplishment Tracking**: authenticated users can create accomplishments with title, description, type, date, tags, and metrics. Query parameters allow filtering by type, tag, date range, and text search. Role-based scoping ensures users see only their own accomplishments while team leads see their team's data.
- **File-Backed Storage**: data is saved to `data.json` so server restarts preserve data.

## 📋 Prerequisites

- Node.js v20+ (https://nodejs.org/)
- npm (bundled with Node.js)
- Docker (optional, for containerization)

_Note: No manual `data.json` file is required; the application auto-creates or repairs it on startup._


## 📦 Installation

```bash
git clone <repository_url>
cd <repo-folder>
npm install
```

## 🏃‍♂️ Running Locally

Start the server on [http://localhost:3000](http://localhost:3000):

```bash
npm start
```

## ✅ Running Tests

Run the test suite (Jest + Supertest):

```bash
npm test
```


## 🐳 Docker

A `Dockerfile` is provided for containerized deployment.
Build and run with Docker Compose (data persists via bind-mount to `data.json`):

```bash
# Build image and start service
docker-compose up -d --build

# To monitor logs:
docker-compose logs -f

# To stop and remove containers:
docker-compose down
```

The web UI and API will be accessible at [http://localhost:3000](http://localhost:3000).

## 🔄 Data Reset UI (Development Only)

You can reset all data by visiting the reset page:

```text
http://localhost:3000/reset
```

This will present a confirmation button and clear users, teams, and accomplishments.

## 🔧 Environment Variables

| Variable     | Description                          | Default       |
| ------------ | ------------------------------------ | ------------- |
| `PORT`       | Port for the server to listen on     | `3000`        |
| `JWT_SECRET` | Secret key for signing JWT tokens    | `secretkey`   |

Optionally, create a `.env` file in the project root to configure secret values and ports. Docker Compose will pick it up automatically:
```
PORT=3000
JWT_SECRET=your_secret_key
```

## 📖 API Overview

### 🔐 `POST /register`
Create a new user. Body: `{ email, password, name, role?, teamId? }`

### 🔑 `POST /login`
Authenticate a user and receive a JWT: `{ token }`

### 👥 `GET /users`
List all users (admin or team lead only).

### 🏢 `POST /teams`
Create a new team (admin or team lead only).

### 🎯 `POST /accomplishments`
Create a new accomplishment for the authenticated user.

### 📊 `GET /accomplishments`
List accomplishments scoped to the requester. Optional query parameters:
`type`, `tag`, `q`, `start`, `end`.

### 🧹 `POST /reset`
Reset all application data (users, teams, accomplishments) to empty arrays. **For development/debug only; not linked in UI.**

## ⚠️ Notes on Browser Warnings

- You may see an in-browser Babel transformer warning (development-only JSX compilation). This is expected; precompile scripts for production (https://babeljs.io/docs/setup).
- Chrome may warn that a password input isn't inside a `<form>`; this is a harmless browser notification and doesn't affect functionality.
