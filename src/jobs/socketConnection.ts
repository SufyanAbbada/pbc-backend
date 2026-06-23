import allowedOriginsList from "../utils/allowedOriginsList";
import { Server as SocketServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: SocketServer;

export const initSocket = (httpServer: HTTPServer): SocketServer => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: allowedOriginsList,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to a new Client", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
