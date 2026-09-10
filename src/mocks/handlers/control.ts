import { http, HttpResponse } from "msw"
import { mockDb } from "@/mocks/db/store"
import { isMockScenarioId, mockScenarios, type MockScenarioId } from "@/mocks/scenarios"
import { broadcastNftUpdated, getRealtimeClientCount } from "@/mocks/realtime"

interface SetScenarioRequest {
  scenario: MockScenarioId
}

export const controlHandlers = [
  http.get("/api/__mock/realtime", () => HttpResponse.json({ connectedClients: getRealtimeClientCount() })),

  http.post("/api/__mock/reset", () => {
    const database = mockDb.reset()
    return HttpResponse.json({ success: true, scenario: database.scenario })
  }),

  http.post<never, SetScenarioRequest>("/api/__mock/scenario", async ({ request }) => {
    const body = await request.json()
    if (!isMockScenarioId(body.scenario)) {
      return HttpResponse.json({ code: "VALIDATION_ERROR", message: `Cenário inválido. Use: ${Object.keys(mockScenarios).join(", ")}.` }, { status: 400 })
    }

    const database = mockDb.update((database) => {
      database.scenario = body.scenario
      if (body.scenario === "price-changed") {
        const nft = database.nfts.find((item) => item.id === "0")
        if (nft && nft.priceEth !== "1.29") {
          nft.priceEth = "1.29"
          nft.version += 1
        }
      }
      if (body.scenario === "edition-sold-out") {
        const nft = database.nfts.find((item) => item.id === "0")
        const edition = nft?.editions.find((item) => item.id === "0-1-50")
        if (nft && edition && edition.availableQuantity !== 0) {
          edition.availableQuantity = 0
          nft.version += 1
        }
      }
    })
    if (body.scenario === "price-changed" || body.scenario === "edition-sold-out") {
      const nft = database.nfts.find((item) => item.id === "0")
      if (nft) broadcastNftUpdated({
        eventId: crypto.randomUUID(),
        resourceId: nft.id,
        version: nft.version,
        occurredAt: new Date().toISOString(),
        priceEth: nft.priceEth,
        editions: nft.editions.map(({ id, availableQuantity }) => ({ id, availableQuantity })),
      })
    }
    return HttpResponse.json({ success: true, scenario: body.scenario })
  }),
]
