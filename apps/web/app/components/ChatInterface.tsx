"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";

const ChatInterface: React.FC = () => {
  const { sendMessage, messages, connectedUsers, isConnected, currentRoom, leaveRoom } = useSocket();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter messages for current room
  const roomMessages = messages.filter(msg => msg.roomId === currentRoom);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [roomMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && isConnected && currentRoom) {
      sendMessage(currentRoom, inputMessage.trim());
      setInputMessage("");
      setIsTyping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleLeaveRoom = () => {
    if (currentRoom) {
      leaveRoom(currentRoom);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const emojis = ["😀", "😂", "😍", "😎", "🤔", "😮", "😢", "😡", "👍", "👎", "❤️", "🎉", "🔥", "💯", "🚀"];

  if (!currentRoom) {
    return null;
  }

  return (
    <div className="chat-interface h-full flex flex-col">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-1">Room: {currentRoom}</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-100">
                    {connectedUsers.length} user(s) online
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-100">Real-time</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLeaveRoom}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 p-4 space-y-4 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {roomMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold mb-2 text-gray-700">No messages yet</h4>
            <p className="text-sm text-center text-gray-500">
              Start the conversation by sending a message below.
            </p>
          </div>
        ) : (
          roomMessages.map((msg, index) => (
            <div 
              key={index} 
              className="flex items-start space-x-3 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-sm font-bold">
                  {msg.socketId.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-semibold text-gray-800">
                    User {msg.socketId.slice(0, 8)}...
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(msg.timestamp)}
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg border border-gray-200 group-hover:shadow-xl transition-all duration-300 relative">
                  <p className="text-gray-800 text-sm leading-relaxed">{msg.message}</p>
                  <div className="absolute top-0 left-0 w-0 h-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex items-start space-x-3 animate-fade-in">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg border border-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl relative">
        {/* Emoji Picker */}
        {showEmojis && (
          <div className="absolute bottom-20 left-4 right-4 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-20">
            <div className="grid grid-cols-5 gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputMessage(prev => prev + emoji);
                    setShowEmojis(false);
                  }}
                  className="text-2xl hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className="p-2 text-gray-500 hover:text-purple-500 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder={isConnected ? "Type your message..." : "Connecting..."}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-gray-800 placeholder-gray-500"
              disabled={!isConnected}
            />
            {isTyping && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!isConnected || !inputMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold"
          >
            <div className="flex items-center space-x-2">
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;