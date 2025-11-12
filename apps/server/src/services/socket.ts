// backend/socketService.ts
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import { Redis } from "ioredis";
import http from "http";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const REDIS_URL = process.env.REDIS_URL || "";
const redisOptions = { tls: {} };

// Redis publisher & subscriber
const pub = new Redis(REDIS_URL, redisOptions);
const sub = new Redis(REDIS_URL, redisOptions);

const CHANNELS = {
  MESSAGES: "messages",
  USER_JOIN: "user_join",
  USER_LEAVE: "user_leave",
} as const;

class SocketService {
  private io: Server;

  constructor(httpServer: http.Server) {
    console.log("✅ SocketService initialized");
    this.io = new Server(httpServer, {
      cors: { origin: "*" },
    });
    this.initializeRedis();
  }

  private async initializeRedis() {
    await sub.subscribe(CHANNELS.MESSAGES, CHANNELS.USER_JOIN, CHANNELS.USER_LEAVE);

     sub.on("message", (channel: string, message: string) => {
    const data = JSON.parse(message);
    const serverPort = process.env.PORT || "unknown";

    switch (channel) {
      case CHANNELS.MESSAGES:
        console.log(` [Server ${serverPort}] Received message from Redis:`, data);
        this.io.emit("event:message", data);
        break;
      case CHANNELS.USER_JOIN:
        console.log(` [Server ${serverPort}] User joined via Redis:`, data);
        this.io.emit("event:user_join", data);
        break;
      case CHANNELS.USER_LEAVE:
        console.log(`[Server ${serverPort}] User left via Redis:`, data);
        this.io.emit("event:user_leave", data);
        break;
      default:
        console.log(`[Server ${serverPort}] Unknown Redis channel:`, channel);
    }
  });


    console.log(" Redis Pub/Sub initialized");
  }

  public initListeners() {
    this.io.on("connection", (socket: Socket) => {
      console.log("👤 User connected:", socket.id);

      this.publishToRedis(CHANNELS.USER_JOIN, {
        socketId: socket.id,
        timestamp: new Date().toISOString(),
      });

      socket.on("event:message", async ({ message }: { message: string }) => {
        await this.publishToRedis(CHANNELS.MESSAGES, {
          socketId: socket.id,
          message,
          timestamp: new Date().toISOString(),
        });
        console.log(`💬 Message from ${socket.id}:`, message);
      });

      socket.on("disconnect", async () => {
        console.log("❌ User disconnected:", socket.id);
        await this.publishToRedis(CHANNELS.USER_LEAVE, {
          socketId: socket.id,
          timestamp: new Date().toISOString(),
        });
      });
    });
  }

  private async publishToRedis(channel: string, data: any) {
    await pub.publish(channel, JSON.stringify(data));
  }

  async cleanup() {
    await sub.unsubscribe();
    await sub.quit();
    await pub.quit();
    console.log("🧹 Redis connections closed");
  }

  getIo() {
    return this.io;
  }
}

export default SocketService;
