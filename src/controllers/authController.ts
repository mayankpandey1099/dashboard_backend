import { Request, Response } from "express";
import { AuthService } from "../services/authService";

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
    res.status(response.status).json(response);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const response = await authService.login(email, password);
    res.status(response.status).json(response);
  }
}