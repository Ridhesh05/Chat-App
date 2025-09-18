"use client";

import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";

interface Room {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  messageCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  isActive: boolean;
}

const RoomDisplay: React.FC = () => {
  const { joinRoom, currentRoom, messages, isConnected } = useSocket();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [roomMessages, setRoomMessages] = useState<any[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Predefined rooms with enhanced data
  const initialRooms: Room[] = [
    {
      id: "general",
      name: "General",
      description: "General discussion and casual chat",
      icon: "💬",
      color: "from-blue-500 to-blue-600",
      messageCount: 0,
      isActive: false
    },
    {
      id: "tech",
      name: "Technology",
      description: "Tech talk, programming, and development",
      icon: "💻",
      color: "from-purple-500 to-purple-600",
      messageCount: 0,
      isActive: false
    },
    {
      id: "random",
      name: "Random",
      description: "Random conversations and off-topic discussions",
      icon: "🎲",
      color: "from-green-500 to-green-600",
      messageCount: 0,
      isActive: false
    },
    {
      id: "help",
      name: "Help",
      description: "Get help and support from the community",
      icon: "🆘",
      color: "from-red-500 to-red-600",
      messageCount: 0,
      isActive: false
    },
    {
      id: "gaming",
      name: "Gaming",
      description: "Gaming discussions and game recommendations",
      icon: "🎮",
      color: "from-indigo-500 to-indigo-600",
      messageCount: 0,
      isActive: false
    },
    {
      id: "music",
      name: "Music",
      description: "Music sharing and discussions",
      icon: "🎵",
      color: "from-pink-500 to-pink-600",
      messageCount: 0,
      isActive: false
    }
  ];

  // Initialize rooms
  useEffect(() => {
    setRooms(initialRooms);
  }, []);

  // Update room data based on messages
  useEffect(() => {
    const updatedRooms = initialRooms.map(room => {
      const roomMsgs = messages.filter(msg => msg.roomId === room.id);
      const lastMessage = roomMsgs[roomMsgs.length - 1];
      
      return {
        ...room,
        messageCount: roomMsgs.length,
        lastMessage: lastMessage?.message || "No messages yet",
        lastMessageTime: lastMessage?.timestamp ? 
          new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
          undefined,
        isActive: currentRoom === room.id
      };
    });
    setRooms(updatedRooms);
  }, [messages, currentRoom]);

  // Filter messages for selected room
  useEffect(() => {
    if (selectedRoom) {
      const filteredMessages = messages.filter(msg => msg.roomId === selectedRoom);
      setRoomMessages(filteredMessages);
    }
  }, [selectedRoom, messages]);

  const handleRoomClick = (roomId: string) => {
    if (isConnected) {
      setSelectedRoom(roomId);
      joinRoom(roomId);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Chat Rooms
          </h1>
          <p className="text-gray-600">
            Choose a room to start chatting with others
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'} ${isConnected ? 'animate-pulse' : ''}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rooms List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Available Rooms</h2>
              <div className="space-y-3">
                {rooms.map((room, index) => (
                  <div
                    key={room.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      room.isActive
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => isConnected && handleRoomClick(room.id)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${room.color} flex items-center justify-center text-2xl`}>
                        {room.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                          {room.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {room.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {room.messageCount} messages
                          </span>
                          {room.lastMessageTime && (
                            <span className="text-xs text-gray-400">
                              {room.lastMessageTime}
                            </span>
                          )}
                        </div>
                      </div>
                      {room.isActive && (
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg h-[600px] flex flex-col">
              {selectedRoom ? (
                <>
                  {/* Room Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {rooms.find(r => r.id === selectedRoom)?.name} Room
                        </h3>
                        <p className="text-sm text-gray-500">
                          {roomMessages.length} messages
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-500">Live</span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {roomMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium mb-2">No messages yet</h4>
                        <p className="text-sm text-center">
                          Be the first to send a message in this room!
                        </p>
                      </div>
                    ) : (
                      roomMessages.map((msg, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-medium">
                              {msg.socketId.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                User {msg.socketId.slice(0, 8)}...
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTime(msg.timestamp)}
                              </span>
                            </div>
                            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2">
                              <p className="text-gray-800 text-sm leading-relaxed">{msg.message}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Select a Room</h3>
                  <p>Choose a room from the left to view messages</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDisplay;