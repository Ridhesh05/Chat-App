import http from "http";
import SocketService from "./services/socket.js";

let socketService: SocketService;

async function init() {
  const httpServer = http.createServer();
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
