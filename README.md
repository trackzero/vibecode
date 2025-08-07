# Team Metrics API

This project provides a minimal backend for the **SOV Vibe-A-Thon** challenge. It exposes a REST API for user authentication, team management and accomplishment tracking. Data is persisted to a local JSON file and authentication is handled with JSON Web Tokens.

## Features

- **User Authentication & Roles**: register and login with email/password. Returned JWT embeds the user role (`admin`, `lead`, or `user`) and team id. Protected routes use middleware to enforce authentication and authorization.
- **User Management**: admins and team leads can list all users in the system.
- **Team Management**: admins and team leads can create teams.
- **Accomplishment Tracking**: authenticated users can create accomplishments with title, description, type, date, tags and metrics. Query parameters allow filtering by type, tag, date range and text search. Role based scoping ensures users see only their own accomplishments while team leads see their team's data.
- **File Backed Storage**: information is saved to `data.json` so server restarts preserve data.

## Running Locally
=======
This project implements a simplified backend for the SOV Vibe-A-Thon Team Metrics application. It provides user authentication, accomplishment tracking, and basic team/user management.

## Setup

The API will be available at `http://localhost:3000`.

## Verification Tests

Jest/Supertest tests cover registration, login, accomplishment creation/listing, user listing authorization, team creation authorization and accomplishment filtering.
=======
The server will start on `http://localhost:3000`.

## Running Tests

## Docker

A `Dockerfile` is provided so the server can run in a container.

Build the image:

```bash
docker build -t team-metrics .
```

Run the container:

```bash
docker run -p 3000:3000 team-metrics
```

The API will be accessible on `http://localhost:3000`.

## API Overview

### `POST /register`
Create a user. Body: `{ email, password, name, role?, teamId? }`

### `POST /login`
Authenticate a user and receive a JWT: `{ token }`

### `GET /users`
List all users (admin or team lead only).

### `POST /teams`
Create a new team (admin or team lead only).

### `POST /accomplishments`
Create an accomplishment for the authenticated user.

### `GET /accomplishments`
List accomplishments scoped to the requester and optionally filter with `type`, `tag`, `q`, `start`, `end` query params.

=======
