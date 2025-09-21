import http from "http";
import SocketService from "./services/socket.js";

let socketService: SocketService;

async function init() {
  const httpServer = http.createServer((req, res) => {
    // Health check endpoint
    if (req.url === '/health' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
      }));
      return;
    }

    // Default response for other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  });

  socketService = new SocketService(httpServer);

  const PORT = process.env.PORT || 8000;

  httpServer.listen(PORT, () => {
    console.log(`HTTP Server started at PORT:${PORT}`);
  });

  socketService.initListeners();
}

process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  if (socketService) {
    await socketService.cleanup();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  if (socketService) {
    await socketService.cleanup();
  }
  process.exit(0);
});

init();
