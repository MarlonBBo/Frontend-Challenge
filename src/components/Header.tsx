import { Search, ShoppingCart, SlidersHorizontal } from "lucide-react"
import { Link, useLocation } from "@tanstack/react-router"
import { useContext } from "react"
import { CatalogFiltersContext } from "@/lib/catalogFiltersContext"
import { LoginModal } from "@/components/LoginModal"

const navItems = [
  { label: "Início", to: "/" },
  { label: "Mercado", to: "/mercado" },
  { label: "Criadores", to: "/criadores" },
  { label: "Aprenda", to: "/aprenda" },
] as const

export function Header() {
  const { setOpen } = useContext(CatalogFiltersContext)
  const pathname = useLocation({ select: (location) => location.pathname })
  const isNftDetail = /^\/mercado\/\d+\/?$/.test(pathname)
  const hideMobileHeader = isNftDetail || pathname === "/mercado/carrinho"
  return (
    <>
    {!hideMobileHeader && <header className="mx-auto flex w-full max-w-[1200px] items-center gap-2 lg:hidden">
      <Link to="/mercado" className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl bg-[#261812] px-3 text-sm font-bold text-[#A58A58]"><Search className="size-5 shrink-0" strokeWidth={1.5} aria-hidden="true" /><span>Explorar coleções</span></Link>
      <Link to={pathname === "/" ? "/" : "/mercado"} onClick={() => setOpen(true)} aria-label="Abrir filtros" className="grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-[#CFB28C] to-[#D28A4C] text-[#140D0A]"><SlidersHorizontal className="size-5" aria-hidden="true" /></Link>
    </header>}
    <header className="relative mx-auto hidden h-[45px] w-full max-w-[1200px] items-start justify-between lg:flex">
      <div className="flex h-[34.3px] w-[160px] items-center">
        <div className="flex h-[18px] w-12 items-center text-sm font-bold leading-none tracking-[0.1em] text-[#F5F1EB]">
          KURIO
        </div>
      </div>

      <nav className="relative z-10 flex h-[45px] w-[401px] items-stretch gap-10" aria-label="Navegação principal">
        {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to !== "/mercado" }}
              activeProps={{ className: "border-[#D28A4C] font-bold text-[#E89B55]" }}
              inactiveProps={{ className: "border-transparent font-normal text-[#F5F1EB] hover:text-[#E89B55]" }}
              className="flex h-[45px] items-start border-b-[3px] pt-0 text-base leading-none no-underline transition-colors"
            >
              <span className="flex h-[21px] items-center">{item.label}</span>
            </Link>
        ))}
      </nav>

      <div className="flex h-[35px] w-[211px] items-center gap-7" aria-label="Ações do cabeçalho">
        <button
          type="button"
          className="grid size-6 shrink-0 place-items-center border-0 bg-transparent p-0 text-[#F5F1EB] transition-colors hover:text-[#E89B55] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E89B55]"
          aria-label="Pesquisar"
        >
          <Search className="size-6" strokeWidth={2} aria-hidden="true" />
        </button>

        <Link
          to="/mercado/carrinho"
          className="relative h-6 w-[31px] shrink-0 border-0 bg-transparent p-0 text-[#F5F1EB] transition-colors hover:text-[#E89B55] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E89B55]"
          aria-label="Carrinho com 6 itens"
        >
          <ShoppingCart className="absolute left-0 top-0 size-6" strokeWidth={2} aria-hidden="true" />
          <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full border-2 border-[#140D0A] bg-[#D28A4C] text-[10px] font-medium leading-none text-[#140D0A]">
            6
          </span>
        </Link>

        <LoginModal />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 border-t-[0.3px] border-[#d28b4c48]"
        aria-hidden="true"
      />
    </header>
    </>
  )
}
