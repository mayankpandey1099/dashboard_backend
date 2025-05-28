import User from "../models/User";
import { IApiResponse, IUser } from "../utils/Types";

export class UserService {
  async getAllUsers(): Promise<IApiResponse<IUser[]>> {
    try {
      const users = await User.find();
      return {
        data: users,
        status: 200,
        message: "Users fetched successfully",
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
        message: "Error fetching users",
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

  async clickBanana(userId: string): Promise<IApiResponse<IUser>> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { bananaCount: 1 } },
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
        message: "Banana clicked",
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
        message: "Error clicking banana",
      };
    }
  }
}
