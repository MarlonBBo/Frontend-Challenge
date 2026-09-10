import type { Cart, CollectorProfile, Favorite, Nft, Order, Quote, Session, Wallet } from "@/contracts"
import type { MockUserRecord } from "@/mocks/fixtures/users"
import type { MockScenarioId } from "@/mocks/scenarios"

export interface MockSessionRecord extends Session {
  id: string
}

export interface MockDatabase {
  schemaVersion: 1
  scenario: MockScenarioId
  users: MockUserRecord[]
  sessions: Record<string, MockSessionRecord>
  profiles: Record<string, CollectorProfile>
  favorites: Record<string, Favorite[]>
  carts: Record<string, Cart>
  wallets: Record<string, Wallet[]>
  orders: Record<string, Order>
  quotes: Record<string, Quote>
  nfts: Nft[]
}
