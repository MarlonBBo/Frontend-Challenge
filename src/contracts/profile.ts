import type { EntityId, IsoDateString } from "./api"

export interface CollectorProfile {
  userId: EntityId
  username: string
  displayName: string
  email: string
  bio?: string
  avatarUrl?: string
  updatedAt: IsoDateString
}

export interface UpdateProfileRequest {
  username: string
  displayName: string
  email: string
  bio?: string
  avatarUrl?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

export type GetProfileResponse = CollectorProfile
export type UpdateProfileResponse = CollectorProfile

export interface ChangePasswordResponse {
  success: true
}

