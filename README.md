# websocketWithLiveScoreApp

Monorepo with two Node.js projects:

- `sportz`: Express + WebSocket live score API with PostgreSQL via Drizzle ORM.
- `websockets`: Minimal WebSocket broadcast server for quick testing.

## Repo Layout

- `sportz/` - main live score app
- `websockets/` - lightweight WS playground
- `README.md` - this file

## sportz

### What It Does

- REST API for matches and commentary
- WebSocket server that broadcasts live commentary updates

### Quick Start

```bash
cd sportz
npm install
npm run dev
```

Server logs:

```
Server is running on http://localhost:8000
WebSocket Server is running on ws://localhost:8000/ws
```

### Environment

Set `DATABASE_URL` in `sportz/.env`:

```
DATABASE_URL=postgres://user:pass@localhost:5432/dbname
```

### REST Endpoints

- `GET /matches`
- `POST /matches`
- `GET /matches/:matchId/commentary`
- `POST /matches/:matchId/commentary`

### WebSocket

Connect to:

```
ws://localhost:8000/ws
```

Subscribe:

```json
{"type":"subscribe","matchId":1}
```

Unsubscribe:

```json
{"type":"unsubscribe","matchId":1}
```

Broadcasts:

```json
{"type":"commentary","data":{...}}
```

```json
{"type":"match_created","data":{...}}
```

## websockets

### Quick Start

```bash
cd websockets
npm install
npm run dev
```

Server logs:

```
Webscoket server is live on ws://localhost:8080
```

### Try It From The CLI

```bash
npx wscat -c ws://localhost:8080
```

Type a message and hit enter to broadcast to all clients.

## Notes

- Both projects use `node --watch` for development.
- The `sportz` app is the primary service; `websockets` is a simple playground.
