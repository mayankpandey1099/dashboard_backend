import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import User from "../models/User";
import { SocketService } from "../services/socketService";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const { username, email, password, role } = req.body;
    const response = await authService.register(
      username,
      email,
      password,
      role
    );
    if (response.status === 201) {
      const user = response.data;
      const users = await User.find().select(
        "username email bananaCount isActive"
      );
      SocketService.getIO().emit("activeUsers", users);
    }
    res.status(response.status).json(response);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const response = await authService.login(email, password);
    res.status(response.status).json(response);
  }
}