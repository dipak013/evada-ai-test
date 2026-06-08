import { api } from "@/lib/axios";

export const AuthService = {
  me: () => api.get("/auth/me/"),
  logout: () => api.post("/auth/logout/"),
};