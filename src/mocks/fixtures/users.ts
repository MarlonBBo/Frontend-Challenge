import type { Cart, CollectorProfile, Favorite, Wallet } from "@/contracts"

export interface MockUserRecord {
  id: string
  email: string
  username: string
  passwordHash: string
}

export const userFixture: MockUserRecord[] = [
  {
    id: "user-ana",
    email: "ana@kurio.test",
    username: "ana",
    passwordHash: "5967c16c2022d4e40c36c348638237f3846e004c5f74dcde8aa0373f383aa8d4",
  },
  {
    id: "user-bruno",
    email: "bruno@kurio.test",
    username: "bruno",
    passwordHash: "96c166c08abd7a6ed1c0f29d33f7c7e917e7778f9afe2a51d0c5683a542f3660",
  },
]

export const profileFixture: Record<string, CollectorProfile> = {
  "user-ana": { userId: "user-ana", username: "ana", displayName: "Ana Colecionadora", email: "ana@kurio.test", updatedAt: "2026-01-01T10:00:00.000Z" },
  "user-bruno": { userId: "user-bruno", username: "bruno", displayName: "Bruno Art", email: "bruno@kurio.test", updatedAt: "2026-01-01T10:00:00.000Z" },
}

export const favoriteFixture: Record<string, Favorite[]> = {
  "user-ana": [{ nftId: "0", createdAt: "2026-01-02T10:00:00.000Z" }],
  "user-bruno": [{ nftId: "4", createdAt: "2026-01-02T11:00:00.000Z" }],
}

export const cartFixture: Record<string, Cart> = {
  "user-ana": { id: "cart-ana", userId: "user-ana", items: [], updatedAt: "2026-01-02T10:00:00.000Z", version: 1 },
  "user-bruno": { id: "cart-bruno", userId: "user-bruno", items: [], updatedAt: "2026-01-02T11:00:00.000Z", version: 1 },
}

export const walletFixture: Record<string, Wallet[]> = {
  "user-ana": [{ id: "wallet-ana", userId: "user-ana", label: "Carteira principal", address: "0xA11CE00000000000000000000000000000000001", provider: "metamask", network: "ethereum", primary: true, createdAt: "2026-01-01T10:00:00.000Z", updatedAt: "2026-01-01T10:00:00.000Z" }],
  "user-bruno": [{ id: "wallet-bruno", userId: "user-bruno", label: "Carteira principal", address: "0xB200000000000000000000000000000000000002", provider: "coinbase", network: "polygon", primary: true, createdAt: "2026-01-01T11:00:00.000Z", updatedAt: "2026-01-01T11:00:00.000Z" }],
}

