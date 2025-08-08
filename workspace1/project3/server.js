const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Serve static files (e.g., styles.css, client assets) from project1
const staticDir = path.join(__dirname, '..', 'project1');
app.use(express.static(staticDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// Create a WebSocket server bound to the same HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  ws.send('Connected to WebSocket server');

  ws.on('message', (message) => {
    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Server received "${message}"`);
        console.log(`Server received "${message}"`);
      }
    });
  });

  ws.send(`New user joined the chat`);

  ws.on('close', () => {
    // Connection closed
  });
});

server.listen(PORT, () => {
  console.log('HTTP server listening on http://localhost:' + PORT);
  console.log('WebSocket server attached on the same port');
});
