var WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({
    port: 8080
});

wss.on("connection", function(ws) {
    ws.on("message", function(message) {
        console.log("Server received message: %s", message);

        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        })
    });
});