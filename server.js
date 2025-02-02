import pkg from 'ws';
const { Server: WebSocketServer } = pkg;
import { createServer } from 'http';
import express from 'express';
import path from 'path';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(path.resolve('public')));

wss.on("connection", function(ws) {
    ws.on("message", function(message) {
        console.log("Server received message:", message);

        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === ws.OPEN) {
                client.send(message);
            }
        });
    });
});

const PORT = 8080;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
