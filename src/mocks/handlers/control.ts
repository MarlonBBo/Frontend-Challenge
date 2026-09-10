import { http, HttpResponse } from "msw"
import { mockDb } from "@/mocks/db/store"
import { isMockScenarioId, mockScenarios, type MockScenarioId } from "@/mocks/scenarios"

interface SetScenarioRequest {
  scenario: MockScenarioId
}

export const controlHandlers = [
  http.post("/api/__mock/reset", () => {
    const database = mockDb.reset()
    return HttpResponse.json({ success: true, scenario: database.scenario })
  }),

  http.post<never, SetScenarioRequest>("/api/__mock/scenario", async ({ request }) => {
    const body = await request.json()
    if (!isMockScenarioId(body.scenario)) {
      return HttpResponse.json({ code: "VALIDATION_ERROR", message: `Cenário inválido. Use: ${Object.keys(mockScenarios).join(", ")}.` }, { status: 400 })
    }

    mockDb.update((database) => {
      database.scenario = body.scenario
    })
    return HttpResponse.json({ success: true, scenario: body.scenario })
  }),
]

