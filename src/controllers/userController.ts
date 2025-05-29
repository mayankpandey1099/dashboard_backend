import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { IApiResponse } from "../utils/Types";

const userService = new UserService();

export class UserController {
  async updateUser(req: Request, res: Response) {
    const response = await userService.updateUser(req.params.id, req.body);
    res.status(response.status).json(response);
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const response = await userService.deleteUser(id);
    res.status(response.status).json(response);
  }

  async blockUser(req: Request, res: Response) {
    const { id } = req.params;
    const response = await userService.blockUser(id);
    res.status(response.status).json(response);
  }

  async unblockUser(req: Request, res: Response) {
    const { id } = req.params;
    const response = await userService.unblockUser(id);
    res.status(response.status).json(response);
  }
}
