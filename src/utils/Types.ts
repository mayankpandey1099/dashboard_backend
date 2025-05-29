export interface IUser {
  id: string;
  username: string;
  email: string;
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
