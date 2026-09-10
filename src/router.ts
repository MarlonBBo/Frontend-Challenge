import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router"
import { NftDetailPage } from "./pages/NftDetailPage"
import App from "./App"
import { HomePage } from "./pages/HomePage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { Marketplace } from "./components/Marketplace"
import { LearnPage } from "./pages/LearnPage"
import { CreatorsPage } from "./pages/CreatorsPage"
import { CartPage } from "./pages/CartPage"
import { PaymentPage } from "./pages/PaymentPage"

const rootRoute = createRootRoute({ component: App, notFoundComponent: NotFoundPage })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: HomePage })
const marketRoute = createRoute({ getParentRoute: () => rootRoute, path: "/mercado", component: Marketplace })
const learnRoute = createRoute({ getParentRoute: () => rootRoute, path: "/aprenda", component: LearnPage })
const creatorsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/criadores", component: CreatorsPage })
const cartRoute = createRoute({ getParentRoute: () => rootRoute, path: "/mercado/carrinho", component: CartPage })
const paymentRoute = createRoute({ getParentRoute: () => rootRoute, path: "/mercado/pagamento", component: PaymentPage })
const nftRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mercado/$nftId",
  component: NftDetailPage,
})

export const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, marketRoute, learnRoute, creatorsRoute, nftRoute, cartRoute, paymentRoute]),
  scrollRestoration: true,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
