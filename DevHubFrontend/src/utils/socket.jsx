import io from "socket.io-client";
// import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  return io("https://devmatch-major-project.onrender.com", {
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
    transports: ["websocket", "polling"],
  });
};
