import { Header } from "./components/Header"
import { Outlet, useLocation } from "@tanstack/react-router"
import { Footer } from "./components/Footer"
import { useState } from "react"
import { CatalogFiltersContext } from "./lib/catalogFiltersContext"
import { MobileNavigation } from "./components/MobileNavigation"

function App() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const pathname = useLocation({ select: (location) => location.pathname })
  const isCart = pathname === "/mercado/carrinho"
  return (
    <CatalogFiltersContext.Provider value={{ open: filtersOpen, setOpen: setFiltersOpen }}>
    <div className={`min-h-svh px-5 pt-9 sm:px-8 lg:py-6 xl:px-[max(32px,calc((100vw-1200px)/2))] ${isCart ? "pb-0" : "pb-[calc(110px+env(safe-area-inset-bottom))]"}`}>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <MobileNavigation />
    </div>
    </CatalogFiltersContext.Provider>
  )
}

export default App
