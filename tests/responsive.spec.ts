import { expect, test } from "@playwright/test"

test("os layouts se ajustam à viewport", async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  for (const path of ["/", "/mercado", "/mercado/0", "/mercado/carrinho", "/mercado/pagamento", "/criadores", "/aprenda"]) {
    await page.goto(path)
    await expect(page.locator("main")).toBeVisible()
    await page.evaluate(() => document.fonts.ready)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Horizontal overflow on ${path}`).toBe(true)
    if (path === "/") await page.screenshot({ path: testInfo.outputPath("home.png") })
    if (path === "/mercado/carrinho") await page.screenshot({ path: testInfo.outputPath("cart.png") })
  }
  expect(errors).toEqual([])
})

test("O login e o cadastro permanecem acessíveis.", async ({ page }, testInfo) => {
  await page.goto("/")
  const trigger = testInfo.project.name === "desktop"
    ? page.getByRole("button", { name: "Entrar", exact: true })
    : page.getByRole("button", { name: "Abrir perfil e login" })
  await trigger.click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await dialog.getByRole("button", { name: "Criar conta", exact: true }).click()
  await expect(dialog.getByLabel("Confirmar senha", { exact: true })).toBeVisible()
  const box = await dialog.boundingBox()
  expect(box!.width).toBeLessThanOrEqual(page.viewportSize()!.width)
  expect(box!.height).toBeLessThanOrEqual(page.viewportSize()!.height)
  await page.keyboard.press("Escape")
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
})

test("filtros para dispositivos móveis abrem sem bloquear a navegação", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "desktop", "Desktop uses the sidebar")
  await page.goto("/")
  await page.getByRole("link", { name: "Abrir filtros" }).click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole("heading", { name: "Filtrar coleções" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(dialog).not.toBeVisible()
  await page.getByRole("navigation", { name: "Navegação mobile" }).getByRole("link", { name: "Carrinho", exact: true }).click()
  await expect(page).toHaveURL(/\/mercado\/carrinho$/)
})
