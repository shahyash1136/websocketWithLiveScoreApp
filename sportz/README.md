# Sportz Live Score App

This project is a small Node.js + Express service that serves match data and live commentary over HTTP and WebSockets. It uses Drizzle ORM for PostgreSQL access and a lightweight WebSocket server for live updates.

## What This App Does

- Create and list matches via REST endpoints.
- Create and list match commentary via REST endpoints.
- Stream match commentary to subscribed WebSocket clients in real time.

## High-Level Architecture

```
┌─────────────┐     HTTP      ┌───────────────────────────┐
│ HTTP Client │ ────────────▶ │ Express REST API          │
└─────────────┘               │                           │
                              │  /matches                 │
                              │  /matches/:id/commentary  │
                              └───────────────┬───────────┘
                                              │
                                              │ Drizzle ORM
                                              ▼
                                      ┌───────────────┐
                                      │ PostgreSQL    │
                                      └───────────────┘

┌────────────────┐     WebSocket     ┌────────────────────────────┐
│ WS Client      │ ─────────────────▶│ WS Server (/ws)            │
└────────────────┘                   │ subscribes by matchId      │
                                     │ broadcasts commentary      │
                                     └────────────────────────────┘
```

## Key Folders

- `src/index.js`  
  App entry point. Wires Express routes, WebSocket server, and JSON parsing.

- `src/routes/`  
  - `matches.js`: create/list matches.  
  - `commentary.js`: create/list commentary for a match and broadcast new items.

- `src/db/`  
  - `db.js`: Drizzle + PostgreSQL connection.  
  - `schema.js`: Drizzle schema for `matches` and `commentary`.

- `src/ws/server.js`  
  WebSocket server for live commentary subscriptions.

- `src/validation/`  
  Zod schemas for request validation.

## Data Flow (Short Version)

1. Client posts commentary to:
   - `POST /matches/:matchId/commentary`
2. Server inserts commentary into PostgreSQL via Drizzle.
3. Server broadcasts the new commentary to WebSocket clients subscribed to that matchId.

## REST Endpoints

### Matches

- `GET /matches`  
  List matches.

- `POST /matches`  
  Create a match.

### Commentary (nested)

- `GET /matches/:matchId/commentary`  
  List commentary for a match, newest first.

- `POST /matches/:matchId/commentary`  
  Create commentary for a match.

## WebSocket API

Connect to:

- `ws://localhost:8000/ws`

Subscribe to a match:

```json
{"type":"subscribe","matchId":1}
```

Unsubscribe:

```json
{"type":"unsubscribe","matchId":1}
```

Broadcasts you may receive:

```json
{"type":"commentary","data":{...}}
```

```json
{"type":"match_created","data":{...}}
```

## Environment Variables

Set `DATABASE_URL` in `.env`:

```
DATABASE_URL=postgres://user:pass@localhost:5432/dbname
```

## Notes for Future Changes

- Validation lives in `src/validation/`. Add or update schemas there first.
- Drizzle schema changes go in `src/db/schema.js`.  
- WebSocket broadcast logic lives in `src/ws/server.js`.  
- When adding new REST endpoints, follow the same validation + try/catch pattern used in `matches.js` and `commentary.js`.
