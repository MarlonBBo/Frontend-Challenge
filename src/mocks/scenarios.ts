export type MockScenarioId = "default" | "slow-network" | "empty-catalog" | "server-error" | "expired-session" | "cart-error" | "invalid-coupon" | "expired-coupon" | "price-changed" | "edition-sold-out" | "quote-expired"

export interface MockScenario {
  id: MockScenarioId
  delayMs: number
  emptyCatalog?: boolean
  failCatalog?: boolean
  expireSession?: boolean
  failCartMutations?: boolean
  invalidCoupon?: boolean
  expiredCoupon?: boolean
  expiredQuote?: boolean
}

export const mockScenarios: Record<MockScenarioId, MockScenario> = {
  default: { id: "default", delayMs: 150 },
  "slow-network": { id: "slow-network", delayMs: 2_000 },
  "empty-catalog": { id: "empty-catalog", delayMs: 150, emptyCatalog: true },
  "server-error": { id: "server-error", delayMs: 150, failCatalog: true },
  "expired-session": { id: "expired-session", delayMs: 150, expireSession: true },
  "cart-error": { id: "cart-error", delayMs: 500, failCartMutations: true },
  "invalid-coupon": { id: "invalid-coupon", delayMs: 150, invalidCoupon: true },
  "expired-coupon": { id: "expired-coupon", delayMs: 150, expiredCoupon: true },
  "price-changed": { id: "price-changed", delayMs: 150 },
  "edition-sold-out": { id: "edition-sold-out", delayMs: 150 },
  "quote-expired": { id: "quote-expired", delayMs: 150, expiredQuote: true },
}

export function isMockScenarioId(value: unknown): value is MockScenarioId {
  return typeof value === "string" && value in mockScenarios
}
