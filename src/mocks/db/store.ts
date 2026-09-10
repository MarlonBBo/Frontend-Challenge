import { nftFixture } from "@/mocks/fixtures/nfts"
import { cartFixture, favoriteFixture, profileFixture, userFixture, walletFixture } from "@/mocks/fixtures/users"
import type { MockDatabase } from "./schema"

const STORAGE_KEY = "kurio:mock-db:v1"
let memoryState: MockDatabase | undefined

function clone<T>(value: T): T {
  return structuredClone(value)
}

function initialState(): MockDatabase {
  return clone({
    schemaVersion: 1,
    scenario: "default",
    users: userFixture,
    sessions: {},
    profiles: profileFixture,
    favorites: favoriteFixture,
    carts: cartFixture,
    wallets: walletFixture,
    orders: {},
    quotes: {},
    nfts: nftFixture,
  })
}

function browserStorage() {
  return typeof window === "undefined" ? undefined : window.localStorage
}

function load(): MockDatabase {
  const storage = browserStorage()
  const serialized = storage?.getItem(STORAGE_KEY)

  if (serialized) {
    try {
      const parsed = JSON.parse(serialized) as MockDatabase
      if (parsed.schemaVersion === 1) return { ...parsed, quotes: parsed.quotes ?? {} }
    } catch {
      storage?.removeItem(STORAGE_KEY)
    }
  }

  return memoryState ?? initialState()
}

function save(database: MockDatabase) {
  memoryState = clone(database)
  browserStorage()?.setItem(STORAGE_KEY, JSON.stringify(database))
}

export const mockDb = {
  read() {
    return clone(load())
  },
  update(recipe: (database: MockDatabase) => void) {
    const database = load()
    recipe(database)
    save(database)
    return clone(database)
  },
  reset() {
    const database = initialState()
    save(database)
    return clone(database)
  },
}
