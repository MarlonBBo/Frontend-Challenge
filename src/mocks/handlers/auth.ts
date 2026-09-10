import { delay, http, HttpResponse } from "msw"
import type { ApiErrorResponse, GetSessionResponse, LoginRequest, LoginResponse, LogoutResponse } from "@/contracts"
import { mockDb } from "@/mocks/db/store"
import { mockScenarios } from "@/mocks/scenarios"
import { mergeGuestCart } from "@/mocks/cartState"

const SESSION_COOKIE = "kurio_session"

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")
}

function unauthorized(message: string) {
  return HttpResponse.json<ApiErrorResponse>({
    code: "UNAUTHORIZED",
    message,
    retryable: false,
    requestId: crypto.randomUUID(),
  }, { status: 401 })
}

export const authHandlers = [
  http.post<never, LoginRequest, LoginResponse | ApiErrorResponse>("/api/auth/login", async ({ request }) => {
    const database = mockDb.read()
    await delay(mockScenarios[database.scenario].delayMs)
    const credentials = await request.json()
    const passwordHash = await hashPassword(credentials.password)
    const user = database.users.find((candidate) => candidate.email.toLowerCase() === credentials.email.toLowerCase() && candidate.passwordHash === passwordHash)

    if (!user) return unauthorized("E-mail ou senha inválidos.")

    const profile = database.profiles[user.id]
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 60 * 60_000).toISOString()
    const session = {
      user: { id: user.id, email: user.email, username: user.username, displayName: profile.displayName, ...(profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {}) },
      expiresAt,
    }

    mockDb.update((draft) => {
      draft.sessions[sessionId] = { id: sessionId, ...session }
      mergeGuestCart(draft, user.id, request)
    })

    return HttpResponse.json<LoginResponse>({ session }, {
      headers: { "Set-Cookie": `${SESSION_COOKIE}=${sessionId}; Path=/; SameSite=Lax` },
    })
  }),

  http.get<never, never, GetSessionResponse | ApiErrorResponse>("/api/auth/session", async ({ cookies }) => {
    const database = mockDb.read()
    const scenario = mockScenarios[database.scenario]
    await delay(scenario.delayMs)

    if (scenario.expireSession) return unauthorized("Sua sessão expirou.")

    const sessionId = cookies[SESSION_COOKIE]
    const session = sessionId ? database.sessions[sessionId] : undefined

    if (!session) return HttpResponse.json<GetSessionResponse>({ session: null })
    if (Date.parse(session.expiresAt) <= Date.now()) return unauthorized("Sua sessão expirou.")

    return HttpResponse.json<GetSessionResponse>({ session })
  }),

  http.post<never, never, LogoutResponse>("/api/auth/logout", async ({ cookies }) => {
    const sessionId = cookies[SESSION_COOKIE]
    if (sessionId) {
      mockDb.update((database) => {
        delete database.sessions[sessionId]
      })
    }

    return HttpResponse.json<LogoutResponse>({ success: true }, {
      headers: { "Set-Cookie": `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax` },
    })
  }),
]
