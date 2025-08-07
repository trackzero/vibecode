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

Build the image:

```bash
docker build -t team-metrics .
```

Run the container:

```bash
docker run -p 3000:3000 team-metrics
```

The API will be accessible at [http://localhost:3000](http://localhost:3000).

## 🔧 Environment Variables

| Variable     | Description                          | Default       |
| ------------ | ------------------------------------ | ------------- |
| `PORT`       | Port for the server to listen on     | `3000`        |
| `JWT_SECRET` | Secret key for signing JWT tokens    | `secretkey`   |

Optionally, create a `.env` file in the project root to set these variables automatically:
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
