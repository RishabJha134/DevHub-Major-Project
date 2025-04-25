import io from "socket.io-client";
// import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  return io("https://devmatch-major-project.onrender.com");
};
