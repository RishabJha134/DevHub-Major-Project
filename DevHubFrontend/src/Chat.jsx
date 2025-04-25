import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "./utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [displayMenu, setDisplayMenu] = useState(false);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Format timestamp to relative time like WhatsApp
  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const messageTime = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - messageTime) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInSeconds < 172800) {
      return "Yesterday";
    } else {
      return messageTime.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    }
  };

  const fetchChatMessages = async () => {
    const chat = await axios.get(`https://devmatch-major-project.onrender.com/chat/${targetUserId}`, {
      withCredentials: true,
    });

    const chatMessages = chat.data.messages.map((msg) => ({
      senderId: msg.senderId._id,
      firstName: msg.senderId.firstName,
      lastName: msg.senderId.lastName,
      text: msg.text,
      createdAt: msg.createdAt,
    }));
    setMessages(chatMessages);
  };

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(
        `https://devmatch-major-project.onrender.com/getUserDetails/${targetUserId}`,
        {
          withCredentials: true,
        }
      );
      setTargetUser(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChatMessages();
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((prev) => [
        ...prev,
        { firstName, lastName, text, createdAt: new Date().toISOString() },
      ]);
    });

    return () => socket.disconnect();
  }, [userId, targetUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
  };

  // Toggle chat menu
  const toggleMenu = () => {
    setDisplayMenu(!displayMenu);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-colors duration-300"
      ref={chatContainerRef}
    >
      {/* Header with avatar and name - sticky position */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 mt-16 md:mt-20 dark:from-cyan-600 dark:to-blue-700 text-white p-3 md:p-2 flex items-center justify-between shadow-xl z-10 sticky top-0 backdrop-blur-sm backdrop-saturate-150">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            {targetUser && (
              <img
                src={targetUser.photoUrl}
                alt={`${targetUser.firstName} avatar`}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-cyan-500/20"
              />
            )}
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold truncate tracking-tight">
              {targetUser
                ? `${targetUser.firstName} ${targetUser.lastName}`
                : "Developer Chat"}
            </h1>
            <p className="text-xs md:text-sm opacity-80 flex items-center space-x-1">
              {isTyping ? (
                <span className="flex items-center">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  typing...
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                  online
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="p-2 rounded-full hover:bg-white/20 text-white opacity-80 hover:opacity-100 transition-all duration-200 active:scale-95">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-white/20 text-white opacity-80 hover:opacity-100 transition-all duration-200 active:scale-95">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-white/20 text-white opacity-80 hover:opacity-100 transition-all duration-200 active:scale-95">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat messages area - Updated background pattern with glass effect */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-1"
        style={{
          backgroundImage: `url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')`,
          backgroundSize: "250px",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(20,25,35,0.9)",
        }}
      >
        {/* Date separator */}
        <div className="flex justify-center mb-4">
          <span className="bg-slate-800/80 backdrop-blur-sm text-gray-300 text-xs px-4 py-1 rounded-full shadow-lg transition-all duration-300 hover:shadow-cyan-500/5 border border-slate-700">
            Today
          </span>
        </div>

        {messages.map((msg, i) => {
          const isSentByUser = user.firstName === msg.firstName;
          const avatarUrl = isSentByUser ? user.photoUrl : targetUser?.photoUrl;

          // Check if this is the first message from this sender in a sequence
          const isFirstInSequence =
            i === 0 || messages[i - 1].firstName !== msg.firstName;

          // Check if this is the last message from this sender in a sequence
          const isLastInSequence =
            i === messages.length - 1 ||
            messages[i + 1].firstName !== msg.firstName;

          return (
            <div
              key={i}
              className={`flex ${
                isSentByUser ? "justify-end" : "justify-start"
              } animate-fade-in-up transition-all duration-300 mb-2`}
              style={{
                animationDelay: `${i * 0.05}s`,
                opacity: 0,
                animation: "fadeIn 0.3s ease forwards",
              }}
            >
              {/* Avatar for received messages - only show on last message in sequence */}
              {!isSentByUser && (
                <div
                  className={`flex-shrink-0 mr-2 ${
                    isLastInSequence ? "self-end mb-1" : "invisible"
                  }`}
                >
                  <img
                    src={avatarUrl}
                    alt={`${msg.firstName} avatar`}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700 shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-cyan-500/20"
                  />
                </div>
              )}

              <div
                className={`
                  ${
                    isSentByUser
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                      : "bg-slate-800/80 backdrop-blur-sm text-white"
                  } 
                  p-3 rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-md
                  ${
                    isFirstInSequence
                      ? isSentByUser
                        ? "rounded-tr-sm"
                        : "rounded-tl-sm"
                      : ""
                  }
                  ${
                    isLastInSequence
                      ? isSentByUser
                        ? "rounded-br-sm"
                        : "rounded-bl-sm"
                      : ""
                  }
                  transform transition-all duration-300 hover:shadow-cyan-500/5 hover:-translate-y-0.5
                `}
              >
                {isFirstInSequence && !isSentByUser && (
                  <div className="font-medium text-xs text-cyan-400 mb-1">
                    {`${msg.firstName} ${msg.lastName}`}
                  </div>
                )}
                <div className="mb-1 text-sm break-words whitespace-pre-wrap">
                  {msg.text}
                </div>
                <div className="flex items-center justify-end space-x-1 text-xs opacity-70">
                  <span>{formatTime(msg.createdAt)}</span>
                  {isSentByUser && (
                    <span className="text-xs transition-all duration-300">
                      {/* Double check mark for read messages */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path d="M11.3 4.3L6.6 9 4.7 7.1 3.3 8.5 6.6 11.8 12.7 5.7 11.3 4.3Z" />
                        <path d="M8.3 4.3L3.6 9 1.7 7.1 0.3 8.5 3.6 11.8 9.7 5.7 8.3 4.3Z" />
                      </svg>
                    </span>
                  )}
                </div>
              </div>

              {/* Avatar for sent messages - only show on last message in sequence */}
              {isSentByUser && (
                <div
                  className={`flex-shrink-0 ml-2 ${
                    isLastInSequence ? "self-end mb-1" : "invisible"
                  }`}
                >
                  <img
                    src={avatarUrl}
                    alt="Your avatar"
                    className="w-8 h-8 rounded-full object-cover border border-slate-700 shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-cyan-500/20"
                  />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area - Enhanced with dark theme */}
      <div className="p-3 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 shadow-xl">
        <div className="flex items-center gap-2">
          {/* Emoji button */}
          <button className="p-2 text-slate-400 hover:text-cyan-400 transition-all duration-200 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 active:scale-95">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          {/* Add attachment button */}
          <button
            onClick={toggleMenu}
            className="p-2 text-slate-400 hover:text-cyan-400 transition-all duration-200 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>

          {/* Message input */}
          <div className="relative flex-1">
            <input
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type a message"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="w-full p-3 pr-10 rounded-full bg-slate-700/50 text-white placeholder-gray-400 shadow-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
            />

            {/* Camera button inside input */}
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>

          {/* Mic or Send button */}
          {newMessage.trim() ? (
            <button
              onClick={sendMessage}
              className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transform hover:scale-105 active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          ) : (
            <button className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transform hover:scale-105 active:scale-95">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
          )}
        </div>

        {displayMenu && (
          <div className="absolute bottom-20 left-16 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-xl p-4 grid grid-cols-3 gap-4 transform transition-all duration-300 ease-in-out animate-fade-in-up z-20 border border-slate-700">
            {[
              { icon: "📷", label: "Camera", color: "bg-cyan-500" },
              { icon: "🖼️", label: "Photos", color: "bg-blue-600" },
              { icon: "📄", label: "Document", color: "bg-indigo-500" },
            ].map((item, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-slate-700 transition-all duration-200 group"
              >
                <div
                  className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-2xl mb-2 shadow-lg group-hover:scale-110 transition-transform duration-200 group-hover:shadow-cyan-500/20`}
                >
                  {item.icon}
                </div>
                <span className="text-xs font-medium text-gray-300">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
