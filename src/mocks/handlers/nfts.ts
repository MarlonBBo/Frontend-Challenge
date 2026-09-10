import { delay, http, HttpResponse } from "msw"
import type { ApiErrorResponse, BlockchainNetwork, GetNftResponse, ListNftsResponse, Nft } from "@/contracts"
import { mockDb } from "@/mocks/db/store"
import { categoryFixture } from "@/mocks/fixtures/nfts"
import { mockScenarios } from "@/mocks/scenarios"

const networkLabels: Record<BlockchainNetwork, string> = {
  ethereum: "Ethereum",
  polygon: "Polygon",
  solana: "Solana",
}

function catalogError() {
  return HttpResponse.json<ApiErrorResponse>({
    code: "INTERNAL_ERROR",
    message: "Não foi possível carregar o catálogo.",
    retryable: true,
    requestId: crypto.randomUUID(),
  }, { status: 503 })
}

function countBy(items: Nft[], value: string, select: (nft: Nft) => string) {
  return items.filter((nft) => select(nft) === value).length
}

export const nftHandlers = [
  http.get<never, never, ListNftsResponse | ApiErrorResponse>("/api/nfts", async ({ request }) => {
    const database = mockDb.read()
    const scenario = mockScenarios[database.scenario]
    await delay(scenario.delayMs)
    if (scenario.failCatalog) return catalogError()

    const url = new URL(request.url)
    const search = url.searchParams.get("search")?.trim().toLocaleLowerCase("pt-BR")
    const category = url.searchParams.get("category")
    const network = url.searchParams.get("network")
    const tab = url.searchParams.get("tab")
    const minPrice = url.searchParams.get("minPrice")
    const maxPrice = url.searchParams.get("maxPrice")
    const sort = url.searchParams.get("sort")
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1)
    const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get("pageSize")) || 9))

    let filtered = scenario.emptyCatalog ? [] : database.nfts.filter((nft) =>
      (!search || `${nft.name} ${nft.collectionName} ${nft.tokenId}`.toLocaleLowerCase("pt-BR").includes(search)) &&
      (!category || nft.category === category) &&
      (!network || nft.network === network) &&
      (!minPrice || Number(nft.priceEth) >= Number(minPrice)) &&
      (!maxPrice || Number(nft.priceEth) <= Number(maxPrice)) &&
      (tab !== "recent" || Date.parse(nft.createdAt) >= Date.UTC(2026, 0, 20)) &&
      (tab !== "trending" || nft.trending),
    )

    filtered = [...filtered].sort((left, right) => {
      if (sort === "price_asc") return Number(left.priceEth) - Number(right.priceEth)
      if (sort === "price_desc") return Number(right.priceEth) - Number(left.priceEth)
      return Date.parse(right.createdAt) - Date.parse(left.createdAt)
    })

    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const start = (page - 1) * pageSize

    return HttpResponse.json<ListNftsResponse>({
      items: filtered.slice(start, start + pageSize),
      page,
      pageSize,
      totalItems,
      totalPages,
      facets: {
        categories: categoryFixture.map((label) => ({ value: label, label, count: countBy(database.nfts, label, (nft) => nft.category) })),
        networks: (Object.keys(networkLabels) as BlockchainNetwork[]).map((value) => ({ value, label: networkLabels[value], count: countBy(database.nfts, value, (nft) => nft.network) })),
      },
    })
  }),

  http.get<{ nftId: string }, never, GetNftResponse | ApiErrorResponse>("/api/nfts/:nftId", async ({ params }) => {
    const database = mockDb.read()
    await delay(mockScenarios[database.scenario].delayMs)
    const nft = database.nfts.find((item) => item.id === params.nftId)

    if (!nft) {
      return HttpResponse.json<ApiErrorResponse>({ code: "NOT_FOUND", message: "NFT não encontrado.", retryable: false, requestId: crypto.randomUUID() }, { status: 404 })
    }

    return HttpResponse.json<GetNftResponse>(nft)
  }),
]

