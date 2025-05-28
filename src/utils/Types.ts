export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "player" | "admin";
  bananaCount: number;
  isBlocked: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface IApiResponse<T> {
  data: T | null;
  status: number;
  message: string;
}
