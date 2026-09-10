import { delay, http, HttpResponse } from "msw"
import type { AddCartItemRequest, ApiErrorCode, ApiErrorResponse, Cart, CartItem, UpdateCartItemRequest } from "@/contracts"
import { ensureCart, resolveCartOwner } from "@/mocks/cartState"
import { mockDb } from "@/mocks/db/store"
import { mockScenarios } from "@/mocks/scenarios"

function errorResponse(code: ApiErrorCode, message: string, status: number, retryable = false) {
  return HttpResponse.json<ApiErrorResponse>({ code, message, retryable, requestId: crypto.randomUUID() }, { status })
}

function itemFromRequest(database: ReturnType<typeof mockDb.read>, body: AddCartItemRequest): CartItem | ApiErrorResponse {
  const nft = database.nfts.find((item) => item.id === body.nftId)
  const edition = nft?.editions.find((item) => item.id === body.editionId)

  if (!nft || !edition) return { code: "NOT_FOUND", message: "NFT ou edição não encontrados.", retryable: false, requestId: crypto.randomUUID() }
  if (!Number.isInteger(body.quantity) || body.quantity < 1) return { code: "VALIDATION_ERROR", message: "A quantidade deve ser um número inteiro positivo.", fieldErrors: { quantity: ["Informe uma quantidade válida."] }, retryable: false, requestId: crypto.randomUUID() }
  if (body.quantity > Math.min(edition.availableQuantity, edition.maxPerOrder)) return { code: "OUT_OF_STOCK", message: "A quantidade solicitada não está disponível.", retryable: false, requestId: crypto.randomUUID() }

  return {
    id: crypto.randomUUID(),
    nftId: nft.id,
    nft: { name: nft.name, tokenId: nft.tokenId, imageUrl: nft.imageUrl },
    editionId: edition.id,
    editionLabel: edition.label,
    quantity: body.quantity,
    unitPriceEth: nft.priceEth,
    availableQuantity: Math.min(edition.availableQuantity, edition.maxPerOrder),
    nftVersion: nft.version,
  }
}

export const cartHandlers = [
  http.get<never, never, Cart>("/api/cart", async ({ request, cookies }) => {
    const snapshot = mockDb.read()
    await delay(mockScenarios[snapshot.scenario].delayMs)
    const owner = resolveCartOwner(snapshot, request, cookies)
    const database = mockDb.update((draft) => { ensureCart(draft, owner) })
    return HttpResponse.json<Cart>(database.carts[owner.key])
  }),

  http.post<never, AddCartItemRequest, Cart | ApiErrorResponse>("/api/cart/items", async ({ request, cookies }) => {
    let snapshot = mockDb.read()
    const scenario = mockScenarios[snapshot.scenario]
    await delay(scenario.delayMs)
    if (scenario.failCartMutations) return errorResponse("INTERNAL_ERROR", "Não foi possível atualizar o carrinho. Tente novamente.", 503, true)
    let owner = resolveCartOwner(snapshot, request, cookies)
    if (!snapshot.carts[owner.key]) {
      mockDb.update((draft) => { ensureCart(draft, owner) })
      snapshot = mockDb.read()
      owner = resolveCartOwner(snapshot, request, cookies)
    }
    const body = await request.json()
    const candidate = itemFromRequest(snapshot, body)
    if ("code" in candidate) return HttpResponse.json(candidate, { status: candidate.code === "NOT_FOUND" ? 404 : candidate.code === "OUT_OF_STOCK" ? 409 : 400 })

    const existing = snapshot.carts[owner.key]?.items.find((item) => item.nftId === body.nftId && item.editionId === body.editionId)
    if (existing && existing.quantity + body.quantity > candidate.availableQuantity) return errorResponse("OUT_OF_STOCK", "A quantidade solicitada não está disponível.", 409)

    const database = mockDb.update((draft) => {
      const cart = ensureCart(draft, owner)
      const current = cart.items.find((item) => item.nftId === body.nftId && item.editionId === body.editionId)
      if (current) current.quantity += body.quantity
      else cart.items.push(candidate)
      cart.version += 1
      cart.updatedAt = new Date().toISOString()
    })
    return HttpResponse.json<Cart>(database.carts[owner.key], { status: 201 })
  }),

  http.patch<{ itemId: string }, UpdateCartItemRequest, Cart | ApiErrorResponse>("/api/cart/items/:itemId", async ({ params, request, cookies }) => {
    const snapshot = mockDb.read()
    const scenario = mockScenarios[snapshot.scenario]
    await delay(scenario.delayMs)
    if (scenario.failCartMutations) return errorResponse("INTERNAL_ERROR", "Não foi possível atualizar o carrinho. Tente novamente.", 503, true)
    const owner = resolveCartOwner(snapshot, request, cookies)
    const cart = snapshot.carts[owner.key]
    const item = cart?.items.find((candidate) => candidate.id === params.itemId)
    if (!item) return errorResponse("NOT_FOUND", "Item do carrinho não encontrado.", 404)

    const body = await request.json()
    if (!Number.isInteger(body.quantity) || body.quantity < 1) return errorResponse("VALIDATION_ERROR", "A quantidade deve ser um número inteiro positivo.", 400)
    if (body.quantity > item.availableQuantity) return errorResponse("OUT_OF_STOCK", "A quantidade solicitada não está disponível.", 409)

    const database = mockDb.update((draft) => {
      const currentCart = draft.carts[owner.key]
      const current = currentCart.items.find((candidate) => candidate.id === params.itemId)!
      current.quantity = body.quantity
      currentCart.version += 1
      currentCart.updatedAt = new Date().toISOString()
    })
    return HttpResponse.json<Cart>(database.carts[owner.key])
  }),

  http.delete<{ itemId: string }, never, Cart | ApiErrorResponse>("/api/cart/items/:itemId", async ({ params, request, cookies }) => {
    const snapshot = mockDb.read()
    const scenario = mockScenarios[snapshot.scenario]
    await delay(scenario.delayMs)
    if (scenario.failCartMutations) return errorResponse("INTERNAL_ERROR", "Não foi possível atualizar o carrinho. Tente novamente.", 503, true)
    const owner = resolveCartOwner(snapshot, request, cookies)
    const cart = snapshot.carts[owner.key]
    if (!cart?.items.some((item) => item.id === params.itemId)) return errorResponse("NOT_FOUND", "Item do carrinho não encontrado.", 404)

    const database = mockDb.update((draft) => {
      const currentCart = draft.carts[owner.key]
      currentCart.items = currentCart.items.filter((item) => item.id !== params.itemId)
      currentCart.version += 1
      currentCart.updatedAt = new Date().toISOString()
    })
    return HttpResponse.json<Cart>(database.carts[owner.key])
  }),
]
