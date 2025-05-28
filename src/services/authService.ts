import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IApiResponse, IUser } from "../utils/Types";

export class AuthService {
  async register(
    username: string,
    email: string,
    password: string,
    role: "player" | "admin" = "player"
  ): Promise<IApiResponse<IUser>> {
    try {
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return {
          data: null,
          status: 400,
          message: "Username or email already exists",
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role,
      });
      await user.save();

      return {
        data: user,
        status: 201,
        message: "User registered successfully",
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
        message: "Error registering user",
      };
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<IApiResponse<{ user: IUser; token: string }>> {
    try {
      const user = await User.findOne({ email });
      if (!user || user.isBlocked) {
        return {
          data: null,
          status: 401,
          message: user?.isBlocked ? "User is blocked" : "Invalid credentials",
        };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          data: null,
          status: 401,
          message: "Invalid credentials",
        };
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      user.isActive = true;
      await user.save();

      return {
        data: { user, token },
        status: 200,
        message: "Login successful",
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
        message: "Error logging in",
      };
    }
  }
}
