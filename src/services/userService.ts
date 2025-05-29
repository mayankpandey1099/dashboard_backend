import User from "../models/User";
import { IApiResponse, IUser } from "../utils/Types";
import bcrypt from "bcryptjs";

export class UserService {
  async updateUser(
    id: string,
    data: {
      username?: string;
      email?: string;
      password?: string;
      role?: "admin" | "player";
    }
  ): Promise<IApiResponse<IUser>> {
    try {
      const updateData: any = {};
      if (data.username) updateData.username = data.username;
      if (data.email) updateData.email = data.email;
      if (data.password)
        updateData.password = await bcrypt.hash(data.password, 10);
      if (data.role) updateData.role = data.role;

      const user = await User.findByIdAndUpdate(id, updateData, { new: true });
      if (!user) {
        return {
          data: null,
          status: 404,
          message: "User not found",
        };
      }

      const userResponse: IUser = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        bananaCount: user.bananaCount,
        isBlocked: user.isBlocked,
        isActive: user.isActive,
        createdAt: user.createdAt,
      };

      return {
        data: userResponse,
        status: 200,
        message: "User updated successfully",
      };
    } catch (error) {
      return {
        data: null,
        status: 400,
        message: (error as Error).message,
      };
    }
  }

  async deleteUser(id: string): Promise<IApiResponse<any>> {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return {
          data: null,
          status: 404,
          message: "User not found",
        };
      }
      return {
        data: null,
        status: 200,
        message: "User deleted successfully",
      };
    } catch (error) {
      return {
        data: null,
        status: 400,
        message: (error as Error).message,
      };
    }
  }

  async blockUser(userId: string): Promise<IApiResponse<IUser>> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isBlocked: true, isActive: false },
        { new: true }
      );
      if (!user) {
        return {
          data: null,
          status: 404,
          message: "User not found",
        };
      }
      return {
        data: user,
        status: 200,
        message: "User blocked successfully",
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
        message: "Error blocking user",
      };
    }
  }

  async unblockUser(userId: string): Promise<IApiResponse<IUser>> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isBlocked: false },
        { new: true }
      );
      if (!user) {
        return {
          data: null,
          status: 404,
          message: "User not found",
        };
      }
      return {
        data: user,
        status: 200,
        message: "User unblocked successfully",
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
        message: "Error unblocking user",
      };
    }
  }
}
