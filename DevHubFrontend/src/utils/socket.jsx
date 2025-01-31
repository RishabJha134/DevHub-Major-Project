import io from "socket.io-client";
// import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io("http://localhost:7777");
  } else {
    return io("/", { path: "/api/socket.io" });
  }
};