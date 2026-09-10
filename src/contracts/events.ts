import type { DecimalString, EntityId, IsoDateString } from "./api"
import type { OrderStatus } from "./order"

interface VersionedEvent {
  eventId: EntityId
  resourceId: EntityId
  version: number
  occurredAt: IsoDateString
}

export interface NftUpdatedEvent extends VersionedEvent {
  priceEth: DecimalString
  editions: Array<{
    id: EntityId
    availableQuantity: number
  }>
}

export interface OrderUpdatedEvent extends VersionedEvent {
  userId: EntityId
  status: OrderStatus
  transactionReference?: string
}

export interface ServerToClientEvents {
  "nft.updated": (event: NftUpdatedEvent) => void
  "order.updated": (event: OrderUpdatedEvent) => void
}

export interface ClientToServerEvents {
  "session.identify": (payload: { userId: EntityId }) => void
}

