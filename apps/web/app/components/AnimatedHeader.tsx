"use client";

import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";

const AnimatedHeader: React.FC = () => {
  const { isConnected, connectedUsers } = useSocket();
  const [isVisible, setIsVisible] = useState(false);
  const [particleCount, setParticleCount] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    setParticleCount(connectedUsers.length);
  }, [connectedUsers.length]);

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 opacity-90">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform -skew-y-1"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center">
          {/* Main Title with Animation */}
          <h1 
            className={`text-6xl md:text-8xl font-black text-white mb-4 transition-all duration-1000 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
            }`}
            style={{
              background: "linear-gradient(45deg, #fff, #a8edea, #fed6e3, #fff)",
              backgroundSize: "400% 400%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradientShift 3s ease-in-out infinite"
            }}
          >
            RealTime
          </h1>
          
          <h2 
            className={`text-4xl md:text-6xl font-bold text-white mb-6 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
            }`}
            style={{
              background: "linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)",
              backgroundSize: "400% 400%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradientShift 3s ease-in-out infinite reverse"
            }}
          >
            Chat
          </h2>

          {/* Subtitle */}
          <p 
            className={`text-xl md:text-2xl text-white/90 mb-8 transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
            }`}
          >
            Experience the future of real-time communication
          </p>

          {/* Status Indicators */}
          <div 
            className={`flex flex-wrap justify-center gap-4 mb-8 transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
            }`}
          >
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} ${isConnected ? 'animate-pulse' : ''}`}></div>
              <span className="text-white font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">
                {particleCount} Online
              </span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">
                Real-time
              </span>
            </div>
          </div>

          {/* Animated Icons */}
          <div 
            className={`flex justify-center space-x-8 transition-all duration-1000 delay-800 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
            }`}
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16l8-8 8 8V4H4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Wave */}
      <div className="absolute bottom-0 left-0 w-full h-20 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-100 to-transparent"></div>
        <svg
          className="absolute bottom-0 left-0 w-full h-20"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47,79,119,119,200,119,59,0,115-20,155-55,40-35,69-85,69-140V0H0Z"
            fill="rgb(243 244 246)"
            className="animate-pulse"
          />
          <path
            d="M1200,0V46.29c-47,79-119,119-200,119-59,0-115-20-155-55-40-35-69-85-69-140V0H1200Z"
            fill="rgb(243 244 246)"
            className="animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
        </svg>
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedHeader;
