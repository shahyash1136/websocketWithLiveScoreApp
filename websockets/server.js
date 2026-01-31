import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

//0: CONNECTING
//1: OPEN (The only state where you can safely .send())
//2: CLOSING
//3: CLOSED

// Connect Event.
wss.on("connection", (socket, request) => {
  const ip = request.socket.remoteAddress;

  socket.on("message", (rowData) => {
    const message = rowData.toString();
    console.log({rowData});

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Server Broadcast: ${message}`);
      }
    });
  });

  socket.on("error", (err) => {
    console.log(`Error: ${err.message}: ${ip}`);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("Webscoket server is live on ws://localhost:8080");
