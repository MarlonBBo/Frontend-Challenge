import type { EntityId, IsoDateString } from "./api"

export interface SessionUser {
  id: EntityId
  email: string
  username: string
  displayName: string
  avatarUrl?: string
}

export interface Session {
  user: SessionUser
  expiresAt: IsoDateString
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  session: Session
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  passwordConfirmation: string
}

export interface RegisterResponse {
  session: Session
}

export interface GetSessionResponse {
  session: Session | null
}

export interface LogoutResponse {
  success: true
}
