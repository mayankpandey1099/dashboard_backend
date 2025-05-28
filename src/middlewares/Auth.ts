import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IApiResponse } from "../utils/Types";

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      data: null,
      status: 401,
      message: "No token provided",
    } as IApiResponse<null>);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      data: null,
      status: 401,
      message: "Invalid or expired token",
    } as IApiResponse<null>);
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      data: null,
      status: 403,
      message: "Admin access required",
    } as IApiResponse<null>);
  }
  next();
};
