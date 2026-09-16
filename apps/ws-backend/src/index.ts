import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8000 });

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    console.log("Received message:", data.toString());
    ws.send("pong");
  });
});

console.log("WebSocket server running on ws://localhost:8000");
