import { Server, Socket } from "socket.io";
import User from "../models/User";
import jwt from "jsonwebtoken";

export class SocketService {
  private static io: Server;

  constructor(io: Server) {
    SocketService.io = io;
  }

  static getIO(): Server {
    if (!SocketService.io) {
      throw new Error("SocketService not initialized with IO");
    }
    return SocketService.io;
  }

  setupSocket() {
    SocketService.io.on("connection", async (socket: Socket) => {
      console.log(`New client connected with ID: ${socket.id}`);
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      let user: any = null;

      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        user = await User.findById(decoded.userId);
        if (!user || user.isBlocked) {
          socket.disconnect();
          return;
        }

        await User.updateOne({ _id: user._id }, { isActive: true });
        SocketService.io.emit("userStatus", {
          id: user._id.toString(),
          isActive: true,
        });

        socket.emit("bananaCount", { bananaCount: user.bananaCount });

        const users = await User.find({ _id: { $ne: user._id } }).select(
          "username email bananaCount isActive"
        );

        SocketService.io.emit("activeUsers", users);

        const ranking = await User.find({ role: "player" })
          .select("username email bananaCount")
          .sort({ bananaCount: -1 });
        SocketService.io.emit("ranking", ranking);
      } catch (error) {
        socket.disconnect();
        return;
      }

      socket.on("bananaClick", async () => {
        if (!user) return;
        user.bananaCount += 1;
        await user.save();
        socket.emit("bananaCount", { bananaCount: user.bananaCount });

        const users = await User.find({ _id: { $ne: user._id } }).select(
          "username email bananaCount isActive"
        );

        SocketService.io.emit("activeUsers", users);

        const ranking = await User.find({ role: "player" })
          .select("username email bananaCount")
          .sort({ bananaCount: -1 });

        SocketService.io.emit("ranking", ranking);
      });

      socket.on("disconnect", async () => {
        if (user) {
          await User.updateOne({ _id: user._id }, { isActive: false });
          SocketService.io.emit("userStatus", {
            id: user._id.toString(),
            isActive: false,
          });
          const activeUsers = await User.find({ isActive: true }).select(
            "username email bananaCount isActive"
          );
          SocketService.io.emit("activeUsers", activeUsers);
        }
      });
    });
  }
}
