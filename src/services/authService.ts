import type { GetSessionResponse, LoginRequest, LoginResponse, LogoutResponse } from "@/contracts"
import { api } from "@/lib/api"

export const authService = {
  async getSession() {
    const response = await api.get<GetSessionResponse>("/auth/session")
    return response.data.session
  },

  async login(credentials: LoginRequest) {
    const response = await api.post<LoginResponse>("/auth/login", credentials)
    return response.data.session
  },

  async logout() {
    const response = await api.post<LogoutResponse>("/auth/logout")
    return response.data
  },
}

