"use client";

import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";

const RoomSelector: React.FC = () => {
  const { joinRoom, currentRoom, currentUsername, isConnected } = useSocket();
  const [newRoomName, setNewRoomName] = useState("");
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const predefinedRooms = [
    { 
      id: "general", 
      name: "General", 
      description: "General discussion", 
      icon: "💬",
      color: "from-blue-500 to-blue-600",
      hoverColor: "from-blue-600 to-blue-700"
    },
    { 
      id: "tech", 
      name: "Technology", 
      description: "Tech talk and programming", 
      icon: "💻",
      color: "from-purple-500 to-purple-600",
      hoverColor: "from-purple-600 to-purple-700"
    },
    { 
      id: "random", 
      name: "Random", 
      description: "Random conversations", 
      icon: "🎲",
      color: "from-green-500 to-green-600",
      hoverColor: "from-green-600 to-green-700"
    },
    { 
      id: "help", 
      name: "Help", 
      description: "Get help and support", 
      icon: "🆘",
      color: "from-red-500 to-red-600",
      hoverColor: "from-red-600 to-red-700"
    }
  ];

  const handleJoinRoom = (roomId: string) => {
    if (isConnected && currentUsername) {
      joinRoom(roomId, currentUsername);
    }
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim() && isConnected && currentUsername) {
      const roomId = newRoomName.toLowerCase().replace(/\s+/g, "-");
      joinRoom(roomId, currentUsername);
      setNewRoomName("");
    }
  };

  return (
    <div className={`room-selector transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Choose Your
        </h2>
        <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Adventure
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
      </div>
      
      {/* Predefined Rooms */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3"></span>
          Popular Rooms
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {predefinedRooms.map((room, index) => (
            <div
              key={room.id}
              className={`transform transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => handleJoinRoom(room.id)}
                disabled={!isConnected}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group relative overflow-hidden ${
                  currentRoom === room.id
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg scale-105"
                    : "border-gray-200 hover:border-purple-300 hover:shadow-xl hover:scale-105"
                } ${!isConnected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${room.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${room.color} flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform duration-300`}>
                        {room.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                          {room.name}
                        </h4>
                        <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                          {room.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Join Button */}
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${room.color} flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 ${
                      currentRoom === room.id ? "scale-110" : ""
                    }`}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${room.color} rounded-full transform transition-all duration-1000 ${
                      hoveredRoom === room.id ? "w-full" : "w-0"
                    }`}></div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Room */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mr-3"></span>
          Create New Room
        </h3>
        <div className="relative">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Enter room name..."
                disabled={!isConnected}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 disabled:opacity-50 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <button
              onClick={handleCreateRoom}
              disabled={!isConnected || !newRoomName.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold"
            >
              <div className="flex items-center space-x-2">
                <span>Create</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="text-center">
        <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
          isConnected 
            ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-lg" 
            : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-lg"
        }`}>
          <div className={`w-3 h-3 rounded-full mr-3 ${
            isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
          }`}></div>
          {isConnected ? "Connected to Server" : "Disconnected from Server"}
        </div>
      </div>
    </div>
  );
};

export default RoomSelector;
