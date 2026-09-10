import { Link, useLocation } from "@tanstack/react-router"
import { Heart, House, ShoppingBag, ShoppingCart } from "lucide-react"
import { LoginModal } from "@/components/LoginModal"

export function MobileNavigation() {
  const pathname = useLocation({ select: (location) => location.pathname })
  const linkClass = "grid size-12 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-[#D28A4C]"
  if (pathname === "/mercado/carrinho") return null
  return (
    <nav aria-label="Navegação mobile" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 items-center rounded-t-[36px] bg-[#261812] px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))] text-[#CFB28C] shadow-[0_-8px_24px_#140D0A55] lg:hidden">
      <Link to="/" aria-label="Início" activeOptions={{ exact: true }} activeProps={{ className: "text-[#E89B55]" }} className={`${linkClass} justify-self-center`}><House className="size-5 fill-current" aria-hidden="true" /></Link>
      <button disabled type="button" aria-label="Favoritos — em breve" className={`${linkClass} justify-self-center`}><Heart className="size-5 fill-current" aria-hidden="true" /></button>
      <Link to="/mercado" aria-label="Explorar mercado" className="-mt-14 grid size-[72px] place-items-center justify-self-center rounded-full border-[7px] border-[#140D0A] bg-linear-to-br from-[#CFB28C] to-[#D28A4C] text-[#F7F3EC] focus-visible:outline-2 focus-visible:outline-[#D28A4C]"><ShoppingBag className="size-7" strokeWidth={1.5} aria-hidden="true" /></Link>
      <Link to="/mercado/carrinho" aria-label="Carrinho" activeProps={{ className: "text-[#E89B55]" }} className={`${linkClass} justify-self-center`}><ShoppingCart className="size-5 fill-current" aria-hidden="true" /></Link>
      <div className="justify-self-center"><LoginModal mobile /></div>
    </nav>
  )
}
