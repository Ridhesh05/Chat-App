import http from "http";
import SocketService from "./services/socket.js";

let socketService: SocketService;

async function init() {
  const httpServer = http.createServer((req, res) => {
    if (req.url === "/health" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "healthy" }));
      return;
    }
    res.writeHead(404);
    res.end();
  });

  socketService = new SocketService(httpServer);

  const PORT = process.env.PORT || 8000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on PORT ${PORT}`);
  });

  socketService.initListeners();
}

process.on("SIGINT", async () => {
  if (socketService) await socketService.cleanup();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  if (socketService) await socketService.cleanup();
  process.exit(0);
});

init();
