import io from "socket.io-client";
// import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  return io("https://devmatch-major-project.onrender.com", {
    // withCredentials: true,
    // reconnection: true,
    // reconnectionAttempts: 5,
    // reconnectionDelay: 1000,
    // timeout: 10000,
    // transports: ["websocket", "polling"],
    withCredentials: true, // Allow cross-origin credential sharing
    transports: ["websocket"], // Force WebSocket only
    upgrade: false, // Prevent transport upgrades
    reconnectionDelay: 500,
    timeout: 5000,
  });
};
