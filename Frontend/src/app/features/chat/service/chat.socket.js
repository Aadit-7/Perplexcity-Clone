import { io } from "socket.io-client";

export const initializeSocketConnetction = () => {
  const socket = io("http://localhost:3000", {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log(`Connected to Socket.io server`);
  });
};
