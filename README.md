# Crypto Price Tracker

A real-time cryptocurrency price tracking app built with React + Vite, backed by a local WebSocket server that streams live mock market data.

The repo has two parts:

| Directory | Purpose |
|---|---|
| `crypto-price-tracker/` | React frontend (Vite + TypeScript) |
| `socket-custom-load/` | WebSocket mock market-data server (Node / Bun) |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Bun](https://bun.sh/) (used by the socket server) — or Docker if you prefer

---

## 1. Start the WebSocket Server

The frontend connects to `ws://localhost:8080` for live price data. Start this first.

### Option A — Bun (local)

```bash
cd socket-custom-load
bun install
bun start
```

### Option B — Docker

```bash
cd socket-custom-load
docker compose up
```

The server exposes:

| Port | What |
|---|---|
| `8080` | WebSocket — market data streams |
| `3000` | HTTP — runtime config API |

---

## 2. Start the Frontend

Open a new terminal from the repo root:

```bash
cd crypto-price-tracker
npm install
npm run dev
```

The app will be available at **http://localhost:5173** (Vite default).

---

## Available Frontend Scripts

Run these from inside `crypto-price-tracker/`:

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server with hot reload |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |

---

## Project Structure

```
assignment-repo/
├── crypto-price-tracker/      React + Vite frontend
│   ├── src/
│   │   ├── pages/             Page-level components (ProductListPage, etc.)
│   │   ├── components/        Reusable UI components (ProductList, etc.)
│   │   ├── hooks/             Custom React hooks (useAllTickers, useFavorite, etc.)
│   │   ├── store/             Context providers (ThemeContext, WebSocketContext)
│   │   ├── types/             Shared TypeScript types and constants
│   │   └── utils/             Formatting helpers (formatPrice, formatVolume)
│   ├── vite.config.ts
│   └── package.json
│
└── socket-custom-load/        WebSocket mock server
    ├── index.js               Server entry, HTTP config API
    ├── config.js              Symbols, channels, intervals
    ├── handlers.js            Subscribe/unsubscribe logic
    ├── generators/            Per-channel data generators
    ├── streams/               Per-channel stream loops
    ├── Dockerfile
    └── docker-compose.yml
```
