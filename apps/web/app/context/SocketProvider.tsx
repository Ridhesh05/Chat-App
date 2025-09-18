"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface Message {
  socketId: string;
  roomId: string;
  message: string;
  username: string; 
  timestamp: string;
  isSystem?: boolean; 
}

interface UserEvent {
  socketId: string;
  username: string; 
  roomId?: string; 
  timestamp: string;
}

interface RoomEvent {
  socketId: string;
  username: string;
  roomId: string;
  timestamp: string;
}

interface ConnectedUser {
  socketId: string;
  username: string;
  roomId: string;
}

interface ISocketContext {
  sendMessage: (roomId: string, message: string, username: string) => void;
  joinRoom: (roomId: string, username: string) => void; 
  leaveRoom: (roomId: string, username: string) => void; 
  messages: Message[];
  connectedUsers: ConnectedUser[]; 
  isConnected: boolean;
  currentRoom: string | null;
  currentUsername: string | null; 
  setCurrentRoom: (roomId: string | null) => void;
  setCurrentUsername: (username: string | null) => void; 
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:8000");
    setSocket(socket);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
      setIsConnected(false);
    });

    socket.on("event:message", (data: Message) => {
      console.log("📩 Message from server:", data);
      setMessages(prev => [...prev, data]);
    });

    socket.on("event:user_join", (data: UserEvent) => {
      console.log("👤 User joined:", data.socketId, data.username);
      
      if (data.roomId) {
        setConnectedUsers(prev => {
          const existingUser = prev.find(u => u.socketId === data.socketId && u.roomId === data.roomId);
          if (!existingUser) {
            return [...prev, { socketId: data.socketId, username: data.username, roomId: data.roomId }];
          }
          return prev;
        });

        const systemMessage: Message = {
          socketId: "system",
          roomId: data.roomId,
          message: `${data.username} joined the room`,
          username: "System",
          timestamp: data.timestamp,
          isSystem: true
        };
        setMessages(prev => [...prev, systemMessage]);
      }
    });

    socket.on("event:user_leave", (data: UserEvent) => {
      console.log(" User left:", data.socketId, data.username);
      
      if (data.roomId) {
        setConnectedUsers(prev => prev.filter(u => !(u.socketId === data.socketId && u.roomId === data.roomId)));

        const systemMessage: Message = {
          socketId: "system",
          roomId: data.roomId,
          message: `${data.username} left the room`,
          username: "System",
          timestamp: data.timestamp,
          isSystem: true
        };
        setMessages(prev => [...prev, systemMessage]);
      }
    });

    socket.on("event:room_join", (data: RoomEvent) => {
      console.log("🚪 User joined room:", data.socketId, data.username, data.roomId);
      
      setConnectedUsers(prev => {
        const existingUser = prev.find(u => u.socketId === data.socketId && u.roomId === data.roomId);
        if (!existingUser) {
          return [...prev, { socketId: data.socketId, username: data.username, roomId: data.roomId }];
        }
        return prev;
      });
    });

    socket.on("event:room_leave", (data: RoomEvent) => {
      console.log("🚪 User left room:", data.socketId, data.username, data.roomId);
      
      setConnectedUsers(prev => prev.filter(u => !(u.socketId === data.socketId && u.roomId === data.roomId)));
    });

    socket.on("event:room_users", (data: { roomId: string, users: ConnectedUser[] }) => {
      console.log("👥 Room users update:", data);
      setConnectedUsers(prev => {
        const otherRoomUsers = prev.filter(u => u.roomId !== data.roomId);
        return [...otherRoomUsers, ...data.users];
      });
    });

    return () => {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  const sendMessage: ISocketContext["sendMessage"] = useCallback((roomId, message, username) => {
    console.log("📤 Sending message to room:", roomId, message, "from:", username);
    socketRef.current?.emit("event:message", { roomId, message, username });
  }, []);

  const joinRoom: ISocketContext["joinRoom"] = useCallback((roomId, username) => {
    console.log("📂 Joining room:", roomId, "as:", username);
    socketRef.current?.emit("event:join_room", { roomId, username });
    setCurrentRoom(roomId);
    setCurrentUsername(username);
  }, []);

  const leaveRoom: ISocketContext["leaveRoom"] = useCallback((roomId, username) => {
    console.log("📂 Leaving room:", roomId, "as:", username);
    socketRef.current?.emit("event:leave_room", { roomId, username });
    if (currentRoom === roomId) {
      setCurrentRoom(null);
      setCurrentUsername(null);
      setConnectedUsers(prev => prev.filter(u => u.roomId !== roomId));
    }
  }, [currentRoom]);

  return (
    <SocketContext.Provider value={{
      sendMessage,
      joinRoom,
      leaveRoom,
      messages,
      connectedUsers,
      isConnected,
      currentRoom,
      currentUsername,
      setCurrentRoom,
      setCurrentUsername
    }}>
      {children}
    </SocketContext.Provider>
  );
};