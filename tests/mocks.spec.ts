import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("main")).toBeVisible()
  await page.evaluate(() => fetch("/api/__mock/reset", { method: "POST" }))
})

test("catalog is served by the REST mock", async ({ page }) => {
  const catalog = await page.evaluate(async () => {
    const response = await fetch("/api/nfts?page=1&pageSize=9&sort=recent")
    return response.json()
  })

  expect(catalog.totalItems).toBe(36)
  expect(catalog.items).toHaveLength(9)
  expect(catalog.items[0].priceEth).toMatch(/^\d+\.\d{2}$/)
})

test("scenario persists and reset restores the default database", async ({ page }) => {
  await page.evaluate(() => fetch("/api/__mock/scenario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario: "empty-catalog" }),
  }))

  await page.reload()
  await expect(page.getByText("Nenhum NFT encontrado para os filtros selecionados.").first()).toBeVisible()

  const restoredTotal = await page.evaluate(async () => {
    await fetch("/api/__mock/reset", { method: "POST" })
    const response = await fetch("/api/nfts?page=1&pageSize=9")
    return (await response.json()).totalItems
  })
  expect(restoredTotal).toBe(36)
})

test("fixture users create isolated sessions", async ({ page }) => {
  const users = await page.evaluate(async () => {
    async function login(email: string, password: string) {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const body = await response.json()
      return body.session.user.id
    }

    const ana = await login("ana@kurio.test", "Kurio123!")
    await fetch("/api/auth/logout", { method: "POST" })
    const bruno = await login("bruno@kurio.test", "Arte456!")
    return { ana, bruno }
  })

  expect(users).toEqual({ ana: "user-ana", bruno: "user-bruno" })
})

