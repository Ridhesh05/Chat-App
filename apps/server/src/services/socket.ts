import { Server, Socket } from "socket.io";
import http from "http";
import { Redis } from "ioredis";

const REDIS_URL = "redis://default:QDgkwEMqRjBUrJKTuckFYcuCoDWwBuSI@centerbeam.proxy.rlwy.net:59555";

const pub = new Redis(REDIS_URL);
const sub = new Redis(REDIS_URL);

const CHANNELS = {
  MESSAGES: "messages",
  USER_JOIN: "user_join",
  USER_LEAVE: "user_leave",
  ROOM_JOIN: "room_join",
  ROOM_LEAVE: "room_leave"
} as const;
class SocketService {
  private io: Server;

  constructor(httpServer: http.Server) {
    console.log("SocketService constructor");
    this.io = new Server(httpServer, {
      cors: {
        origin: "*", 
      },
    });
    
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      await sub.subscribe(CHANNELS.MESSAGES, CHANNELS.USER_JOIN, CHANNELS.USER_LEAVE, CHANNELS.ROOM_JOIN, CHANNELS.ROOM_LEAVE);
      
      sub.on("message", (channel: string, message: string) => {
        this.handleRedisMessage(channel, message);
      });

      pub.on("error", (err: Error) => {
        console.error("Redis Publisher Error:", err);
      });

      sub.on("error", (err: Error) => {
        console.error("Redis Subscriber Error:", err);
      });

      console.log("Redis pub/sub initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Redis:", error);
    }
  }

  private handleRedisMessage(channel: string, message: string) {
    try {
      const data = JSON.parse(message);
      
      switch (channel) {
        case CHANNELS.MESSAGES:
          this.io.to(data.roomId).emit("event:message", data);
          break;
        case CHANNELS.USER_JOIN:
          this.io.emit("event:user_join", data);
          break;
        case CHANNELS.USER_LEAVE:
          this.io.emit("event:user_leave", data);
          break;
        case CHANNELS.ROOM_JOIN:
          this.io.to(data.roomId).emit("event:room_join", data);
          break;
        case CHANNELS.ROOM_LEAVE:
          this.io.to(data.roomId).emit("event:room_leave", data);
          break;
        default:
          console.log(`Unknown channel: ${channel}`);
      }
    } catch (error) {
      console.error("Error handling Redis message:", error);
    }
  }

  public initListeners() {
    this.io.on("connection", (socket: Socket) => {
      console.log("a user connected", socket.id);

      this.publishToRedis(CHANNELS.USER_JOIN, {
        socketId: socket.id,
        timestamp: new Date().toISOString()
      });

      socket.on("event:join_room", async ({ roomId, username }: { roomId: string; username: string }) => {
        socket.join(roomId);
        await this.publishToRedis(CHANNELS.ROOM_JOIN, {
          socketId: socket.id,
          roomId,
          username,
          timestamp: new Date().toISOString(),
        });
      });
      

      socket.on("event:leave_room", async ({ roomId }: { roomId: string }) => {
        try {
          socket.leave(roomId);
          console.log(`User ${socket.id} left room ${roomId}`);
          
          await this.publishToRedis(CHANNELS.ROOM_LEAVE, {
            socketId: socket.id,
            roomId,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error("Error leaving room:", error);
        }
      });

      socket.on("event:message", async ({ roomId, message }: { roomId: string; message: string }) => {
        try {
          await this.publishToRedis(CHANNELS.MESSAGES, {
            socketId: socket.id,
            roomId,
            message,
            timestamp: new Date().toISOString()
          });
          
          console.log(`Message published to room ${roomId}:`, message);
        } catch (error) {
          console.error("Error publishing message to Redis:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("a user disconnected", socket.id);
        
        this.publishToRedis(CHANNELS.USER_LEAVE, {
          socketId: socket.id,
          timestamp: new Date().toISOString()
        });
      });
    });
  }

  private async publishToRedis(channel: string, data: any) {
    try {
      await pub.publish(channel, JSON.stringify(data));
    } catch (error) {
      console.error(`Error publishing to Redis channel ${channel}:`, error);
    }
  }

  getIo() {
    return this.io;
  }

  public async cleanup() {
    try {
      await sub.unsubscribe();
      await sub.quit();
      await pub.quit();
      console.log("Redis connections closed successfully");
    } catch (error) {
      console.error("Error during Redis cleanup:", error);
    }
  }
}

export default SocketService;
