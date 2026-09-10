import type { EntityId, IsoDateString } from "./api"

export interface Favorite {
  nftId: EntityId
  createdAt: IsoDateString
}

export interface ListFavoritesResponse {
  items: Favorite[]
}

export interface AddFavoriteRequest {
  nftId: EntityId
}

export type AddFavoriteResponse = Favorite

export interface RemoveFavoriteResponse {
  success: true
}

