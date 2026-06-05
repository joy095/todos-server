# Task Manager API

Backend API for the Task Manager application built with Express, TypeScript, MongoDB, and Better Auth.

## Features

- User Authentication
- Protected Routes
- Task CRUD Operations
- Request Validation
- MongoDB Integration
- Health Check Endpoint

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Better Auth
- Zod
- Bun

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/joy095/todos-server.git
cd server
```

### Install Dependencies

```bash
bun install
```

or

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MONGODB_URI=mongodb://localhost:27017/task-manager

BETTER_AUTH_SECRET=your-secret-key

BETTER_AUTH_URL=http://localhost:5000

CLIENT_URL=http://localhost:5173
```

---

## Generate Better Auth Schema

```bash
bun run auth:generate
```

---

## Run Development Server

```bash
bun run dev
```

Server URL:

```text
http://localhost:5000
```

---

## Build for Production

```bash
bun run build
```

---

## Start Production Server

```bash
bun run start
```

---

## API Health Check

### Request

```http
GET /
```

### Response

```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2026-06-05T12:00:00.000Z",
  "uptime": 123.45,
  "environment": "development"
}
```

---

## Available Scripts

```bash
bun run dev
bun run build
bun run start
bun run compile
```

---

## Requirements

- Bun 1.2+
- Node.js 22+
- MongoDB 7+

---

## License

MIT