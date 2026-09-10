import type { CartItem, Nft } from "@/contracts"
import type { MockDatabase } from "@/mocks/db/schema"

const SESSION_COOKIE = "kurio_session"

interface CartOwner {
  key: string
  userId?: string
}

function toCartItem(nft: Nft, editionId: string, quantity: number): CartItem {
  const edition = nft.editions.find((item) => item.id === editionId)
  if (!edition) throw new Error(`Edition ${editionId} not found for NFT ${nft.id}`)

  return {
    id: crypto.randomUUID(),
    nftId: nft.id,
    nft: { name: nft.name, tokenId: nft.tokenId, imageUrl: nft.imageUrl },
    editionId: edition.id,
    editionLabel: edition.label,
    quantity,
    unitPriceEth: nft.priceEth,
    availableQuantity: edition.availableQuantity,
    nftVersion: nft.version,
  }
}

function createStarterItems(database: MockDatabase) {
  return [
    { nftId: "0", editionSuffix: "1-50", quantity: 1 },
    { nftId: "4", editionSuffix: "1-1", quantity: 1 },
    { nftId: "5", editionSuffix: "1-10", quantity: 2 },
    { nftId: "6", editionSuffix: "1-50", quantity: 2 },
  ].map(({ nftId, editionSuffix, quantity }) => {
    const nft = database.nfts.find((item) => item.id === nftId)
    if (!nft) throw new Error(`Starter NFT ${nftId} not found`)
    return toCartItem(nft, `${nftId}-${editionSuffix}`, quantity)
  })
}

export function resolveCartOwner(database: MockDatabase, request: Request, cookies: Record<string, string>): CartOwner {
  const sessionId = cookies[SESSION_COOKIE]
  const session = sessionId ? database.sessions[sessionId] : undefined
  if (session && Date.parse(session.expiresAt) > Date.now()) return { key: session.user.id, userId: session.user.id }

  const visitorId = request.headers.get("x-visitor-id") ?? "anonymous"
  return { key: `guest:${visitorId}` }
}

export function ensureCart(database: MockDatabase, owner: CartOwner) {
  if (!database.carts[owner.key]) {
    database.carts[owner.key] = {
      id: `cart-${owner.key}`,
      ...(owner.userId ? { userId: owner.userId } : {}),
      items: owner.userId ? [] : createStarterItems(database),
      updatedAt: new Date().toISOString(),
      version: 1,
    }
  }
  return database.carts[owner.key]
}

export function mergeGuestCart(database: MockDatabase, userId: string, request: Request) {
  const visitorId = request.headers.get("x-visitor-id") ?? "anonymous"
  const guestKey = `guest:${visitorId}`
  const guestCart = database.carts[guestKey]
  if (!guestCart?.items.length) return

  const userCart = ensureCart(database, { key: userId, userId })
  for (const guestItem of guestCart.items) {
    const current = userCart.items.find((item) => item.nftId === guestItem.nftId && item.editionId === guestItem.editionId)
    if (current) {
      current.quantity = Math.min(current.quantity + guestItem.quantity, current.availableQuantity)
    } else {
      userCart.items.push(guestItem)
    }
  }
  userCart.version += 1
  userCart.updatedAt = new Date().toISOString()
  delete database.carts[guestKey]
}
