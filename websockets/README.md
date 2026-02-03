# WebSockets Playground

This folder contains a minimal Node.js WebSocket server using the `ws` library. It accepts connections on port 8080 and broadcasts any incoming message to all connected clients.

## Quick Start

```bash
npm install
npm run dev
```

Server logs:

```
Webscoket server is live on ws://localhost:8080
```

## Try It From The CLI

```bash
npx wscat -c ws://localhost:8080
```

Type a message and hit enter. All connected clients will receive a broadcast:

```
Server Broadcast: <your message>
```

## Files

- `server.js` - WebSocket server that handles connections, messages, and broadcasts.
- `index.html` - Simple browser client (optional) for manual testing.

## Notes

- Port: `8080`
- This server is intentionally simple and does not persist messages.
