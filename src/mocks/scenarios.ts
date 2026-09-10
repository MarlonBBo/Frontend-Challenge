export type MockScenarioId = "default" | "slow-network" | "empty-catalog" | "server-error" | "expired-session" | "cart-error"

export interface MockScenario {
  id: MockScenarioId
  delayMs: number
  emptyCatalog?: boolean
  failCatalog?: boolean
  expireSession?: boolean
  failCartMutations?: boolean
}

export const mockScenarios: Record<MockScenarioId, MockScenario> = {
  default: { id: "default", delayMs: 150 },
  "slow-network": { id: "slow-network", delayMs: 2_000 },
  "empty-catalog": { id: "empty-catalog", delayMs: 150, emptyCatalog: true },
  "server-error": { id: "server-error", delayMs: 150, failCatalog: true },
  "expired-session": { id: "expired-session", delayMs: 150, expireSession: true },
  "cart-error": { id: "cart-error", delayMs: 500, failCartMutations: true },
}

export function isMockScenarioId(value: unknown): value is MockScenarioId {
  return typeof value === "string" && value in mockScenarios
}
