# HANS Solar Backend

Production-ready Node.js/Express API foundation for the HANS Solar e-commerce platform.

## Technology Stack

- **Node.js** — runtime
- **Express.js** — web framework
- **MongoDB + Mongoose** — database and ODM
- **dotenv** — environment configuration
- **cors** — cross-origin resource sharing
- **helmet** — security headers
- **morgan** — HTTP request logging
- **cookie-parser** — cookie parsing
- **jsonwebtoken** — JWT support (ready for auth)
- **bcryptjs** — password hashing (ready for auth)
- **express-rate-limit** — rate limiting
- **zod** — request validation (ready for use)
- **nodemon** — development auto-reload

## Installation

```bash
npm install
```

## Environment Variables

Copy the example environment file and adjust values as needed:

```bash
cp .env.example .env
```

| Variable         | Description                    |
| ---------------- | ------------------------------ |
| `NODE_ENV`       | Application environment        |
| `PORT`           | Server port                    |
| `MONGODB_URI`    | MongoDB connection string      |
| `JWT_SECRET`     | JWT signing secret             |
| `JWT_EXPIRES_IN` | JWT expiration duration        |
| `CLIENT_URL`     | Frontend URL for CORS          |

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## API

Base URL: `http://localhost:5000/api/v1`

### Health Check

```http
GET /api/v1/health
```

Response:

```json
{
  "success": true,
  "message": "HANS Solar API is running"
}
```

## Project Structure

```text
server/
├── src/
│   ├── config/        # Environment and database configuration
│   ├── controllers/   # Route handlers
│   ├── middleware/    # Express middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API route definitions
│   ├── services/      # Business logic layer
│   ├── validators/    # Zod validation schemas
│   ├── utils/         # Helper utilities
│   ├── constants/     # Application constants
│   ├── app.js         # Express application setup
│   └── server.js      # Server entry point
├── uploads/           # File uploads directory
├── .env.example
└── package.json
```

## Architecture Overview

```text
server.js
   ↓
MongoDB Connection
   ↓
Express App (app.js)
   ↓
Middleware (CORS, Helmet, Morgan, Rate Limit, etc.)
   ↓
Routes (/api/v1)
   ↓
Controllers → Services → Models (future)
```
