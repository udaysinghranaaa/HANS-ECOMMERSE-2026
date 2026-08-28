# HANS Solar Frontend

Production-ready React frontend foundation for the HANS Solar e-commerce platform.

## Technology Stack

- **React 19** — UI library
- **Vite** — build tool and dev server
- **React Router** — client-side routing
- **Redux Toolkit** — state management
- **RTK Query** — primary API/data-fetching layer
- **Axios** — centralized HTTP client for non-RTK requests
- **Tailwind CSS** — utility-first styling
- **React Hook Form + Zod** — forms and validation (ready for use)
- **Lucide React** — icon library (ready for use)
- **ESLint + Prettier** — code quality and formatting

## Installation

```bash
npm install
```

## Environment Variables

Copy the example environment file and adjust values as needed:

```bash
cp .env.example .env
```

| Variable       | Description          |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend API base URL |

## Development

```bash
npm run dev
```

Starts the Vite development server (default: http://localhost:5173).

## Production Build

```bash
npm run build
npm run preview
```

## Code Quality

```bash
npm run lint
npm run format
```

## Project Structure

```text
client/
├── public/
├── src/
│   ├── assets/          # Static assets (images, icons, fonts)
│   ├── components/
│   │   ├── common/      # App-level reusable components
│   │   ├── ui/          # Generic UI primitives
│   │   └── layout/      # Layout components
│   ├── features/        # Feature modules (auth, products, cart, etc.)
│   ├── pages/           # Route-level page components
│   ├── layouts/         # Page layout wrappers
│   ├── routes/          # Route definitions and guards
│   ├── services/        # API layer (RTK Query, Axios)
│   ├── store/           # Redux store and slices
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   ├── constants/       # Application constants
│   ├── config/          # Centralized configuration
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── eslint.config.js
├── vite.config.js
└── package.json
```

## Architecture Overview

```text
main.jsx
   ↓
Redux Provider (store)
   ↓
React Router (BrowserRouter)
   ↓
App
   ↓
AppRoutes
   ↓
Pages / Features
```

**Data flow:**

```text
Redux Store
     ↓
RTK Query API (services/api.js)
     ↓
Backend API (VITE_API_URL)
```

- **RTK Query** is the primary data-fetching solution. Endpoint definitions will be injected into `services/api.js` as features are built.
- **Axios** is configured centrally in `services/axios.js` for any non-RTK HTTP needs.
- **ProtectedRoute** is prepared for future authentication and role-based access control.
- **Feature folders** under `src/features/` will house self-contained modules (auth, products, cart, etc.) as they are implemented.
