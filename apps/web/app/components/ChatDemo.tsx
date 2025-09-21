"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";

const ChatDemo: React.FC = () => {
  const { sendMessage, messages, connectedUsers, isConnected } = useSocket();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [roomId, setRoomId] = useState("general");
  const [username, setUsername] = useState("User" + Math.random().toString(36).substr(2, 9));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && isConnected) {
      sendMessage(roomId, inputMessage.trim(), username);
      setInputMessage("");
      setIsTyping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    
    // Typing indicator logic
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStatus = (index: number) => {
    if (index === messages.length - 1) {
      return isConnected ? "delivered" : "sending";
    }
    return "delivered";
  };

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-0">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2V10a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-white">General Chat</h3>
                <div className="flex items-center space-x-1 md:space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-xs md:text-sm text-blue-100">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                  <span className="text-xs md:text-sm text-blue-200 hidden sm:inline">•</span>
                  <span className="text-xs md:text-sm text-blue-100 hidden sm:inline">
                    {connectedUsers.length} online
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-2 md:px-3 py-1 bg-white/20 rounded-full">
                <span className="text-xs md:text-sm text-white font-medium">Room: {roomId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Online Users */}
        {connectedUsers.length > 0 && (
          <div className="px-4 md:px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Online:</span>
              <div className="flex flex-wrap gap-2">
                {connectedUsers.map((user) => (
                  <div
                    key={user.socketId}
                    className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{user.username}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="h-80 md:h-96 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 p-3 md:p-4 space-y-3 transition-colors duration-300">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-base md:text-lg font-medium mb-2">Welcome to the chat!</h4>
              <p className="text-xs md:text-sm text-center max-w-sm px-4">
                Start a conversation by typing a message below. Your messages will appear here in real-time.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="flex items-start space-x-2 md:space-x-3 group">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs md:text-sm font-medium">
                    {msg.socketId.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1 md:space-x-2 mb-1">
                    <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">
                      User {msg.socketId.slice(0, 8)}...
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(msg.timestamp)}
                    </span>
                    {getMessageStatus(index) === "delivered" && (
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-tl-sm px-3 md:px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                    <p className="text-gray-800 dark:text-gray-200 text-xs md:text-sm leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex items-start space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-tl-sm px-3 md:px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-600">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 md:w-2 md:h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 md:w-2 md:h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 md:w-2 md:h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-3 md:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 transition-colors duration-300">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2 md:space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder={isConnected ? "Type your message..." : "Connecting..."}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                disabled={!isConnected}
              />
              {isTyping && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!isConnected || !inputMessage.trim()}
              className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl md:rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg disabled:shadow-none"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>

        {/* Status Bar */}
        <div className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-t border-gray-200 dark:border-gray-600 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs md:text-sm font-medium text-green-800 dark:text-green-400">Redis Pub/Sub Active</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
              Real-time messaging powered by WebSocket technology
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDemo;

