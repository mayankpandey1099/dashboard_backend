import { Server, Socket } from "socket.io";
import User from "../models/User";
import jwt from "jsonwebtoken";

export class SocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  setupSocket() {
    this.io.on("connection", async (socket: Socket) => {
      console.log(`New client connected with ID: ${socket.id}`);
      const token = socket.handshake.auth.token || socket.handshake.query.token;;
      let user: any = null;

      try {
        const decoded: any = jwt.verify(
          token,
          process.env.JWT_SECRET!
        );
        user = await User.findById(decoded.userId);
        if (!user || user.isBlocked) {
          socket.disconnect();
          return;
        }

        await User.updateOne({ _id: user._id }, { isActive: true });
        this.io.emit("userStatus", { id: user._id.toString(), isActive: true });

        socket.emit("bananaCount", { bananaCount: user.bananaCount });

        const users = await User.find({ _id: { $ne: user._id } }).select(
          "username email bananaCount isActive"
        );

        this.io.emit("activeUsers", users);

        const ranking = await User.find({ role: "player" })
          .select("username email bananaCount")
          .sort({ bananaCount: -1 });
        this.io.emit("ranking", ranking);
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

        this.io.emit("activeUsers", users);

        const ranking = await User.find({ role: "player" })
          .select("username email bananaCount")
          .sort({ bananaCount: -1 });
          
        this.io.emit("ranking", ranking);
      });

      socket.on("disconnect", async () => {
        if (user) {
          await User.updateOne({ _id: user._id }, { isActive: false });
          this.io.emit("userStatus", {
            id: user._id.toString(),
            isActive: false,
          });
          const activeUsers = await User.find({ isActive: true }).select(
            "username email bananaCount isActive"
          );
          this.io.emit("activeUsers", activeUsers);
        }
      });
    });
  }
}
