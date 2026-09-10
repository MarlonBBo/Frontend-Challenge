import type { DecimalString, EntityId, IsoDateString } from "./api"

export interface CartItem {
  id: EntityId
  nftId: EntityId
  editionId: EntityId
  quantity: number
  unitPriceEth: DecimalString
  availableQuantity: number
  nftVersion: number
}

export interface Cart {
  id: EntityId
  userId?: EntityId
  items: CartItem[]
  updatedAt: IsoDateString
  version: number
}

export interface AddCartItemRequest {
  nftId: EntityId
  editionId: EntityId
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

export type GetCartResponse = Cart
export type AddCartItemResponse = Cart
export type UpdateCartItemResponse = Cart
export type RemoveCartItemResponse = Cart

