import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("main")).toBeVisible()
  await page.evaluate(() => fetch("/api/__mock/reset", { method: "POST" }))
  await page.reload()
  await expect(page.locator("main")).toBeVisible()
})

test("O catálogo é servido pelo mock REST.", async ({ page }) => {
  const catalog = await page.evaluate(async () => {
    const response = await fetch("/api/nfts?page=1&pageSize=9&sort=recent")
    return response.json()
  })

  expect(catalog.totalItems).toBe(36)
  expect(catalog.items).toHaveLength(9)
  expect(catalog.items[0].priceEth).toMatch(/^\d+\.\d{2}$/)
})

test("o cenário persiste e a redefinição restaura o banco de dados padrão", async ({ page }) => {
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

test("O detalhe usa REST e trata NFT inexistente.", async ({ page }) => {
  await page.goto("/mercado/0")
  await expect(page.getByRole("heading", { name: "Emerald Ape #042" })).toBeVisible()

  await page.goto("/mercado/9999")
  await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible()
})

test("A sessão de login sobrevive ao refresh e permite logout.", async ({ page }, testInfo) => {
  await page.goto("/")
  const trigger = testInfo.project.name === "desktop"
    ? page.getByRole("button", { name: "Entrar", exact: true })
    : page.getByRole("button", { name: "Abrir perfil e login" })

  await trigger.click()
  const dialog = page.getByRole("dialog")
  await dialog.getByLabel("E-mail").fill("ana@kurio.test")
  await dialog.getByLabel("Senha", { exact: true }).fill("Kurio123!")
  await dialog.locator('button[type="submit"]').click()
  await expect(dialog).not.toBeVisible()

  const logout = testInfo.project.name === "desktop"
    ? page.getByRole("button", { name: "Sair", exact: true })
    : page.getByRole("button", { name: "Sair da conta de Ana Colecionadora" })
  await expect(logout).toBeVisible()

  await page.reload()
  await expect(logout).toBeVisible()
  await logout.click()
  await expect(trigger).toBeVisible()
})

test("As duas contas fictícias criam sessões isoladas.", async ({ page }) => {
  const userIds = await page.evaluate(async () => {
    async function login(email: string, password: string) {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      return (await response.json()).session.user.id as string
    }

    const ana = await login("ana@kurio.test", "Kurio123!")
    await fetch("/api/auth/logout", { method: "POST" })
    const bruno = await login("bruno@kurio.test", "Arte456!")
    return { ana, bruno }
  })

  expect(userIds).toEqual({ ana: "user-ana", bruno: "user-bruno" })
})

test("O carrinho persiste quantidade e remoção após refresh.", async ({ page }, testInfo) => {
  await page.goto("/mercado/0")
  await page.getByRole("button", { name: "Comprar NFT", exact: true }).click()
  await expect(page.getByText(/adicionada/)).toBeVisible()
  await page.goto("/mercado/carrinho")

  const cartItem = () => testInfo.project.name === "mobile"
    ? page.locator("article").filter({ hasText: "Emerald Ape" }).first()
    : page.locator("tbody tr").filter({ hasText: "Emerald Ape" }).first()
  const emeraldCard = cartItem()
  await expect(emeraldCard.locator("output")).toHaveText("2")
  const updateResponse = page.waitForResponse((response) => response.url().includes("/api/cart/items/") && response.request().method() === "PATCH")
  await emeraldCard.getByRole("button", { name: "Aumentar quantidade de Emerald Ape" }).click()
  await expect(emeraldCard.locator("output")).toHaveText("3")
  await updateResponse

  await page.reload()
  const persistedCard = cartItem()
  await expect(persistedCard.locator("output")).toHaveText("3")
  const removeResponse = page.waitForResponse((response) => response.url().includes("/api/cart/items/") && response.request().method() === "DELETE")
  await persistedCard.getByRole("button", { name: "Remover Emerald Ape" }).click()
  await expect(persistedCard).not.toBeVisible()
  await removeResponse
})

test("Uma falha de mutation desfaz a atualização otimista.", async ({ page }, testInfo) => {
  await page.goto("/mercado/carrinho")
  const emeraldCard = testInfo.project.name === "mobile"
    ? page.locator("article").filter({ hasText: "Emerald Ape" }).first()
    : page.locator("tbody tr").filter({ hasText: "Emerald Ape" }).first()
  await expect(emeraldCard.locator("output")).toHaveText("1")
  await page.evaluate(() => fetch("/api/__mock/scenario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario: "cart-error" }),
  }))

  await emeraldCard.getByRole("button", { name: "Aumentar quantidade de Emerald Ape" }).click()
  await expect(page.getByRole("alert")).toContainText("Não foi possível atualizar o carrinho")
  await expect(emeraldCard.locator("output")).toHaveText("1")
})

test("O login une o carrinho visitante sem vazar itens para outro usuário.", async ({ page }, testInfo) => {
  await page.goto("/mercado/1")
  await page.getByRole("button", { name: /^(COMPRAR|Comprar NFT)$/ }).click()
  await expect(page.getByText(/adicionada/)).toBeVisible()

  async function login(email: string, password: string) {
    await page.goto("/")
    const trigger = testInfo.project.name === "desktop"
      ? page.getByRole("button", { name: "Entrar", exact: true })
      : page.getByRole("button", { name: "Abrir perfil e login" })
    await trigger.click()
    const dialog = page.getByRole("dialog")
    await dialog.getByLabel("E-mail").fill(email)
    await dialog.getByLabel("Senha", { exact: true }).fill(password)
    await dialog.locator('button[type="submit"]').click()
    await expect(dialog).not.toBeVisible()
  }

  async function cartNames() {
    return page.evaluate(async () => {
      const visitorId = localStorage.getItem("kurio:visitor-id") ?? ""
      const response = await fetch("/api/cart", { headers: { "X-Visitor-Id": visitorId } })
      return ((await response.json()).items as Array<{ nft: { name: string } }>).map((item) => item.nft.name)
    })
  }

  await login("ana@kurio.test", "Kurio123!")
  expect(await cartNames()).toContain("Sage Nomad")

  const logout = testInfo.project.name === "desktop"
    ? page.getByRole("button", { name: "Sair", exact: true })
    : page.getByRole("button", { name: "Sair da conta de Ana Colecionadora" })
  await logout.click()
  await cartNames()

  await login("bruno@kurio.test", "Arte456!")
  expect(await cartNames()).not.toContain("Sage Nomad")
})

test("A cotação da API calcula o resumo e aplica ou remove cupom.", async ({ page }) => {
  await page.goto("/mercado/carrinho")
  await expect(page.getByText("8.156 ETH")).toBeVisible()

  const coupon = page.getByLabel("Código promocional")
  await coupon.fill("kurio10")
  await page.getByRole("button", { name: "Aplicar" }).click()
  await expect(page.getByText("(-) 0.814")).toBeVisible()
  await expect(page.getByText("7.342 ETH")).toBeVisible()

  await page.getByRole("button", { name: "Remover cupom KURIO10" }).click()
  await expect(page.getByText("8.156 ETH")).toBeVisible()
  await page.getByRole("button", { name: "Conectar e finalizar" }).click()
  await expect(page.getByRole("heading", { name: "Pagamento" })).toBeVisible()
})

test("Cupons inválidos e expirados exibem o erro retornado pela API.", async ({ page }) => {
  await page.goto("/mercado/carrinho")
  const coupon = page.getByLabel("Código promocional")

  await coupon.fill("NAOEXISTE")
  await page.getByRole("button", { name: "Aplicar" }).click()
  await expect(page.getByRole("alert")).toContainText("Código promocional inválido")

  await coupon.fill("EXPIRED")
  await page.getByRole("button", { name: "Aplicar" }).click()
  await expect(page.getByRole("alert")).toContainText("Este cupom expirou")
})

test("Mudança de preço exige aceite antes de liberar o checkout.", async ({ page }) => {
  await page.evaluate(() => fetch("/api/__mock/scenario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario: "price-changed" }),
  }))
  await page.goto("/mercado/carrinho")

  const checkout = page.getByRole("button", { name: "Conectar e finalizar" })
  await expect(page.getByText("O carrinho mudou desde a última cotação.")).toBeVisible()
  await expect(page.getByText(/preço atualizado de 1\.19 para 1\.29 ETH/)).toBeVisible()
  await expect(checkout).toBeDisabled()

  await page.getByRole("button", { name: "Aceitar alterações" }).click()
  await expect(page.getByText("O carrinho mudou desde a última cotação.")).not.toBeVisible()
  await expect(checkout).toBeEnabled()
})

test("Cotação expirada bloqueia o checkout.", async ({ page }) => {
  await page.evaluate(() => fetch("/api/__mock/scenario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario: "quote-expired" }),
  }))
  await page.goto("/mercado/carrinho")

  await expect(page.getByText("Esta cotação expirou. Atualize antes de continuar.")).toBeVisible()
  await expect(page.getByRole("button", { name: "Conectar e finalizar" })).toBeDisabled()
})

test("Edição esgotada é removida somente após aceite explícito.", async ({ page }) => {
  await page.evaluate(() => fetch("/api/__mock/scenario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario: "edition-sold-out" }),
  }))
  await page.goto("/mercado/carrinho")

  await expect(page.getByText("Emerald Ape esgotou nesta edição.")).toBeVisible()
  await page.getByRole("button", { name: "Aceitar alterações" }).click()
  await expect(page.getByRole("heading", { name: "Emerald Ape #042" })).not.toBeVisible()
  await expect(page.getByRole("button", { name: "Conectar e finalizar" })).toBeEnabled()
})

test("Socket.IO atualiza a cotação enquanto o carrinho está aberto.", async ({ page }) => {
  await page.goto("/mercado/carrinho")
  await expect(page.getByText("8.156 ETH")).toBeVisible()
  await expect.poll(() => page.evaluate(async () => {
    const response = await fetch("/api/__mock/realtime")
    return ((await response.json()) as { connectedClients: number }).connectedClients
  })).toBeGreaterThan(0)

  await page.evaluate(() => fetch("/api/__mock/scenario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario: "price-changed" }),
  }))

  await expect(page.getByText(/preço atualizado de 1\.19 para 1\.29 ETH/)).toBeVisible()
  await expect(page.getByRole("button", { name: "Conectar e finalizar" })).toBeDisabled()
})
