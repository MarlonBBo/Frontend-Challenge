import { delay, http, HttpResponse } from "msw"
import type { ApiErrorResponse, Cart, CreateQuoteRequest, Quote, QuoteChange } from "@/contracts"
import { addDecimals, compareDecimals, multiplyDecimal, percentageOfDecimal } from "@/lib/decimal"
import { ensureCart, resolveCartOwner } from "@/mocks/cartState"
import type { MockDatabase } from "@/mocks/db/schema"
import { mockDb } from "@/mocks/db/store"
import { mockScenarios, type MockScenario } from "@/mocks/scenarios"

function couponError(code: "COUPON_INVALID" | "COUPON_EXPIRED", message: string, status = 400) {
  return HttpResponse.json<ApiErrorResponse>({ code, message, retryable: false, requestId: crypto.randomUUID() }, { status })
}

function validateCoupon(code: string | undefined, scenario: MockScenario) {
  if (!code) return undefined
  if (scenario.expiredCoupon || code === "EXPIRED") return couponError("COUPON_EXPIRED", "Este cupom expirou.", 410)
  if (scenario.invalidCoupon || !["KURIO10", "GENESIS"].includes(code)) return couponError("COUPON_INVALID", "Código promocional inválido.")
  return undefined
}

function synchronizeCart(database: MockDatabase, cart: Cart) {
  cart.items = cart.items.flatMap((item) => {
    const nft = database.nfts.find((candidate) => candidate.id === item.nftId)
    const edition = nft?.editions.find((candidate) => candidate.id === item.editionId)
    if (!nft || !edition || edition.availableQuantity === 0) return []

    return [{
      ...item,
      quantity: Math.min(item.quantity, edition.availableQuantity, edition.maxPerOrder),
      unitPriceEth: nft.priceEth,
      availableQuantity: Math.min(edition.availableQuantity, edition.maxPerOrder),
      nftVersion: nft.version,
    }]
  })
  cart.version += 1
  cart.updatedAt = new Date().toISOString()
}

function createQuote(database: MockDatabase, cart: Cart, couponCode: string | undefined, scenario: MockScenario): Quote {
  const changes: QuoteChange[] = []
  const items = cart.items.flatMap((item) => {
    const nft = database.nfts.find((candidate) => candidate.id === item.nftId)
    const edition = nft?.editions.find((candidate) => candidate.id === item.editionId)
    if (!nft || !edition) return []

    if (item.unitPriceEth !== nft.priceEth) {
      changes.push({ nftId: nft.id, editionId: item.editionId, type: "PRICE_CHANGED", message: `${nft.name} teve o preço atualizado de ${item.unitPriceEth} para ${nft.priceEth} ETH.` })
    }
    if (item.quantity > edition.availableQuantity || edition.availableQuantity === 0) {
      changes.push({ nftId: nft.id, editionId: item.editionId, type: "AVAILABILITY_CHANGED", message: edition.availableQuantity === 0 ? `${nft.name} esgotou nesta edição.` : `${nft.name} agora possui apenas ${edition.availableQuantity} unidade(s) disponível(is).` })
    }

    return [{
      cartItemId: item.id,
      nftId: item.nftId,
      editionId: item.editionId,
      quantity: Math.min(item.quantity, edition.availableQuantity),
      unitPriceEth: nft.priceEth,
      subtotalEth: multiplyDecimal(nft.priceEth, Math.min(item.quantity, edition.availableQuantity)),
    }]
  })
  const subtotalEth = addDecimals(items.map((item) => item.subtotalEth))
  let discountEth = "0.00"
  if (couponCode === "KURIO10") discountEth = percentageOfDecimal(subtotalEth, 10)
  if (couponCode === "GENESIS") discountEth = compareDecimals(subtotalEth, "0.50") < 0 ? subtotalEth : "0.50"
  const networkFeeEth = items.length ? "0.016" : "0.000"
  const totalEth = addDecimals([subtotalEth, `-${discountEth}`, networkFeeEth])

  return {
    id: crypto.randomUUID(),
    cartVersion: cart.version,
    ...(couponCode ? { couponCode } : {}),
    items,
    subtotalEth,
    discountEth,
    networkFeeEth,
    totalEth,
    changes,
    expiresAt: new Date(Date.now() + (scenario.expiredQuote ? -1_000 : 5 * 60_000)).toISOString(),
  }
}

export const quoteHandlers = [
  http.post<never, CreateQuoteRequest, Quote | ApiErrorResponse>("/api/quotes", async ({ request, cookies }) => {
    let database = mockDb.read()
    const scenario = mockScenarios[database.scenario]
    await delay(scenario.delayMs)
    const body = await request.json()
    const couponCode = body.couponCode?.trim().toUpperCase() || undefined
    const invalidCoupon = validateCoupon(couponCode, scenario)
    if (invalidCoupon) return invalidCoupon

    const owner = resolveCartOwner(database, request, cookies)
    if (!database.carts[owner.key]) database = mockDb.update((draft) => { ensureCart(draft, owner) })
    let cart = database.carts[owner.key]
    const initialQuote = createQuote(database, cart, couponCode, scenario)

    if (body.acceptChanges && initialQuote.changes.length) {
      database = mockDb.update((draft) => synchronizeCart(draft, draft.carts[owner.key]))
      cart = database.carts[owner.key]
    }

    const quote = body.acceptChanges ? createQuote(database, cart, couponCode, scenario) : initialQuote
    mockDb.update((draft) => { draft.quotes[quote.id] = quote })
    return HttpResponse.json<Quote>(quote, { status: 201 })
  }),
]
