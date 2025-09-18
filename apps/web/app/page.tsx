"use client";
import { useState, useEffect, useRef } from "react";
import { useSocket } from "./context/SocketProvider";
import classes from "./page.module.css";

export default function Page() {
  const { 
    sendMessage, 
    joinRoom, 
    leaveRoom, 
    messages, 
    connectedUsers, 
    currentRoom, 
    currentUsername,
    isConnected 
  } = useSocket();
  
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentRoom) {
      setIsInRoom(true);
      setRoomId(currentRoom);
    } else {
      setIsInRoom(false);
    }
  }, [currentRoom]);

  useEffect(() => {
    if (currentUsername) {
      setUsername(currentUsername);
    }
  }, [currentUsername]);

  const handleJoinRoom = () => {
    if (!username.trim() || !roomId.trim()) {
      alert("Please enter both username and room ID");
      return;
    }
    
    if (!isConnected) {
      alert("Not connected to server. Please wait...");
      return;
    }
    
    joinRoom(roomId, username);
  };

  const handleLeaveRoom = () => {
    if (currentRoom && currentUsername) {
      leaveRoom(currentRoom, currentUsername);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    if (currentRoom && currentUsername) {
      sendMessage(currentRoom, message, currentUsername);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (isInRoom) {
        handleSendMessage();
      } else {
        handleJoinRoom();
      }
    }
  };

  const roomMessages = messages.filter(msg => msg.roomId === currentRoom);
  const roomUsers = connectedUsers.filter(user => user.roomId === currentRoom);

  const connectionStatus = isConnected ? "Connected" : "Disconnected";

  if (!isInRoom) {
    return (
      <div className={classes.joinContainer}>
        <div className={classes.joinCard}>
          <div className={classes.joinHeader}>
            <h1>Join Chat Room</h1>
            <p>Enter your details to start chatting</p>
            <div className={classes.connectionStatus}>
              {connectionStatus}
            </div>
          </div>

          <div className={classes.joinForm}>
            <div>
              <label>Your Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your name..."
                className={classes.input}
                disabled={!isConnected}
              />
            </div>

            <div>
              <label>Room ID</label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter room ID..."
                className={classes.input}
                disabled={!isConnected}
              />
            </div>

            <button 
              onClick={handleJoinRoom} 
              className={classes.button}
              disabled={!isConnected || !username.trim() || !roomId.trim()}
            >
              {isConnected ? "Join Room" : "Connecting..."}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chat Interface
  return (
    <div className={classes.chatApp}>
      {/* Header */}
      <div className={classes.chatHeader}>
        <div className={classes.headerContent}>
          <div className={classes.roomInfo}>
            <h1>Room: {currentRoom}</h1>
            <p>Logged in as {currentUsername}</p>
            <div className={classes.connectionStatus}>
              {connectionStatus}
            </div>
          </div>
          <button onClick={handleLeaveRoom} className={classes.leaveButton}>
            Leave Room
          </button>
        </div>
      </div>

      <div className={classes.chatContainer}>
        {/* Users Sidebar */}
        <div className={classes.usersSidebar}>
          <div className={classes.usersHeader}>
            <h3>Online Users</h3>
            <span className={classes.userCount}>
              ({roomUsers.length} online)
            </span>
          </div>
          <div className={classes.usersList}>
            {roomUsers.length === 0 ? (
              <div className={classes.noUsers}>
                <p>No users online</p>
              </div>
            ) : (
              roomUsers.map((user, index) => (
                <div key={`${user.socketId}-${index}`} className={classes.userItem}>
                  <div className={classes.userStatus}></div>
                  <div className={classes.userInfo}>
                    <span className={classes.userName}>
                      {user.username}
                      {user.username === currentUsername && (
                        <span className={classes.youLabel}> (You)</span>
                      )}
                    </span>
                    <span className={classes.userSocketId}>
                      {user.socketId.substring(0, 8)}...
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={classes.chatArea}>
          {/* Messages */}
          <div className={classes.messagesContainer}>
            {roomMessages.length === 0 ? (
              <div className={classes.noMessages}>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              roomMessages.map((msg, index) => (
                <div
                  key={`${msg.socketId}-${index}`}
                  className={`${classes.messageWrapper} ${
                    msg.socketId === "system" 
                      ? classes.systemMessageWrapper
                      : msg.username === currentUsername 
                      ? classes.ownMessage 
                      : classes.otherMessage
                  }`}
                >
                  <div
                    className={`${classes.messageBubble} ${
                      msg.isSystem
                        ? classes.systemMessage
                        : msg.username === currentUsername
                        ? classes.ownBubble
                        : classes.otherBubble
                    }`}
                  >
                    {!msg.isSystem && (
                      <div className={classes.messageHeader}>
                        <span className={classes.messageUsername}>
                          {msg.username}
                          {msg.username === currentUsername && (
                            <span className={classes.youLabel}> (You)</span>
                          )}
                        </span>
                        <span className={classes.messageTime}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    <div className={classes.messageContent}>{msg.message}</div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className={classes.messageInput}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className={classes.input}
              disabled={!isConnected}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || !isConnected}
              className={classes.button}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}