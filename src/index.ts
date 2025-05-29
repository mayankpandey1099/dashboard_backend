import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import http from "http";
import { Server } from "socket.io";
import { SocketService } from "./services/socketService";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({
    data: null,
    status: 200,
    message: "Banana Clicker Backend is running",
  });
});

const socketService = new SocketService(io);
socketService.setupSocket();

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
