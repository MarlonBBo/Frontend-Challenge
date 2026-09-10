import type { DecimalString, EntityId, IsoDateString } from "./api"

export type OrderStatus = "pending" | "confirmed" | "declined"

export interface CreateOrderRequest {
  quoteId: EntityId
  walletId: EntityId
  idempotencyKey: string
}

export interface OrderItemSnapshot {
  nftId: EntityId
  tokenId: string
  name: string
  imageUrl: string
  editionLabel: string
  quantity: number
  unitPriceEth: DecimalString
  subtotalEth: DecimalString
}

export interface Order {
  id: EntityId
  userId: EntityId
  status: OrderStatus
  transactionReference?: string
  items: OrderItemSnapshot[]
  subtotalEth: DecimalString
  discountEth: DecimalString
  networkFeeEth: DecimalString
  totalEth: DecimalString
  createdAt: IsoDateString
  updatedAt: IsoDateString
  version: number
}

export type CreateOrderResponse = Order
export type GetOrderResponse = Order

