import type { DecimalString, EntityId, IsoDateString } from "./api"

export type QuoteChangeType = "PRICE_CHANGED" | "AVAILABILITY_CHANGED"

export interface QuoteChange {
  nftId: EntityId
  editionId: EntityId
  type: QuoteChangeType
  message: string
}

export interface QuoteItem {
  cartItemId: EntityId
  nftId: EntityId
  editionId: EntityId
  quantity: number
  unitPriceEth: DecimalString
  subtotalEth: DecimalString
}

export interface Quote {
  id: EntityId
  cartVersion: number
  couponCode?: string
  items: QuoteItem[]
  subtotalEth: DecimalString
  discountEth: DecimalString
  networkFeeEth: DecimalString
  totalEth: DecimalString
  changes: QuoteChange[]
  expiresAt: IsoDateString
}

export interface CreateQuoteRequest {
  couponCode?: string
  acceptChanges?: boolean
}

export type CreateQuoteResponse = Quote
