import { Link } from "@tanstack/react-router"
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { nfts } from "@/data/nfts"

// Composição estática da referência, sem estado ou operações de carrinho.
const items = [
  { nft: nfts[0], token: "0042", edition: "1/50", quantity: 1, total: "1.19" },
  { nft: nfts[4], token: "0314", edition: "1/1", quantity: 1, total: "1.39" },
  { nft: nfts[5], token: "0088", edition: "1/10", quantity: 2, total: "3.58" },
  { nft: nfts[6], token: "0207", edition: "1/50", quantity: 2, total: "1.98" },
]
const recommendations = [nfts[3], nfts[4], nfts[5], nfts[6], nfts[8]]

export function CartPage() {
  return (
    <div className="-mx-4 -mt-9 w-auto rounded-t-[36px] bg-[#1B100D] pt-7 text-[#F5F1EB] sm:mx-auto sm:mt-8 sm:w-full sm:max-w-[1200px] sm:rounded-none sm:bg-transparent sm:pt-0">
      <h1 className="sr-only">Carrinho</h1>
      <div className="relative mb-5 flex h-8 items-center justify-center px-6 sm:hidden">
        <Link to="/mercado" aria-label="Voltar ao mercado" className="absolute left-6 grid size-8 place-items-center rounded-full bg-[#321F17] text-[#D28A4C]"><ArrowLeft className="size-4" aria-hidden="true" /></Link>
        <span className="text-xl font-bold">Carrinho de NFTs</span>
      </div>
      <nav aria-label="Caminho de navegação" className="mb-3 hidden gap-2 text-sm font-bold sm:flex">
        <Link to="/" className="hover:text-[#E89B55]">Início</Link><span aria-hidden="true">/</span>
        <Link to="/mercado" className="hover:text-[#E89B55]">Mercado</Link><span aria-hidden="true">/</span>
        <span aria-current="page">Carrinho</span>
      </nav>

      <div className="space-y-4 px-6 sm:hidden">
        {items.map(({ nft, edition, quantity, total }) => (
          <article key={nft.id} className="relative flex h-[92px] overflow-hidden rounded-[15px] bg-[#261512]">
            <img src={nft.image} alt="" width={92} height={92} className="size-[92px] shrink-0 object-cover" />
            <div className="min-w-0 flex-1 px-2 py-2.5">
              <h2 className="truncate text-sm font-bold">{nft.name} #{String(nft.number).padStart(3, "0")}</h2>
              <p className="mt-0.5 text-xs text-[#CFB28C]">Edição: {edition}</p>
              <p className="mt-3 text-lg font-bold text-[#E89B55]">{total} ETH</p>
            </div>
            <div className="absolute right-3 top-9 flex items-center gap-2 text-sm">
              <button type="button" disabled aria-label={`Diminuir quantidade de ${nft.name}`} className="grid size-6 place-items-center rounded-full border border-[#D28A4C]/15 text-[#D28A4C]"><Minus className="size-3" aria-hidden="true" /></button>
              <span>{quantity}</span>
              <button type="button" disabled aria-label={`Aumentar quantidade de ${nft.name}`} className="grid size-6 place-items-center rounded-full border border-[#D28A4C]/15 text-[#F5F1EB]"><Plus className="size-3.5" aria-hidden="true" /></button>
            </div>
          </article>
        ))}
      </div>

      <div className="grid items-start gap-12 xl:grid-cols-[minmax(0,2.35fr)_minmax(280px,1fr)] xl:gap-20">
        <div className="hidden overflow-x-auto sm:block">
          <table className="cart-table w-full min-w-[620px] border-separate border-spacing-x-0 border-spacing-y-3 text-left text-sm">
            <caption className="sr-only">NFTs no carrinho</caption>
            <thead>
              <tr>
                {['NFTs', 'Preço', 'Edições', 'Total'].map((label) => <th key={label} scope="col" className="border-b border-[#D28A4C]/20 pb-2 font-medium">{label}</th>)}
                <th scope="col" className="border-b border-[#D28A4C]/20"><span className="sr-only">Remover</span></th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ nft, token, quantity, total }) => (
                <tr key={nft.id} className="bg-[#261812]">
                  <th scope="row" className="py-0 pr-5 font-normal">
                    <div className="flex items-center gap-4">
                      <img src={nft.image} alt="" width={70} height={70} className="size-[70px] shrink-0 rounded-md object-cover" />
                      <div><p className="whitespace-nowrap font-bold">{nft.name} #{String(nft.number).padStart(3, "0")}</p><p className="mt-1 text-xs text-[#A58A58]">ID do token: #{token}</p></div>
                    </div>
                  </th>
                  <td className="whitespace-nowrap pr-6 font-bold text-[#CFB28C]">{nft.price.toFixed(2)} ETH</td>
                  <td className="pr-6">
                    <div className="flex items-center gap-3">
                      <Button disabled variant="kurio" aria-label={`Diminuir quantidade de ${nft.name}`} className="h-7 w-5 rounded-full px-0 disabled:opacity-100"><Minus className="size-3" aria-hidden="true" /></Button>
                      <span>{quantity}</span>
                      <Button disabled variant="kurio" aria-label={`Aumentar quantidade de ${nft.name}`} className="h-7 w-5 rounded-full px-0 disabled:opacity-100"><Plus className="size-3" aria-hidden="true" /></Button>
                    </div>
                  </td>
                  <td className="whitespace-nowrap pr-6 font-bold text-[#E89B55]">{total} ETH</td>
                  <td className="pr-4"><button type="button" disabled aria-label={`Remover ${nft.name}`} className="text-[#A58A58]"><Trash2 className="size-5" strokeWidth={1.5} aria-hidden="true" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section aria-labelledby="cart-summary-title" className="mt-2 rounded-t-[36px] bg-[#211310] px-6 pt-5 pb-6 sm:mt-0 sm:rounded-none sm:bg-transparent sm:px-0 sm:pt-3 sm:pb-0">
          <h2 id="cart-summary-title" className="sr-only sm:not-sr-only sm:border-b sm:border-[#D28A4C]/20 sm:pb-2 sm:text-lg sm:font-bold">Resumo da carteira</h2>
          <Label htmlFor="cart-coupon" className="sr-only sm:not-sr-only sm:mt-6 sm:block sm:text-sm sm:font-bold">Código promocional</Label>
          <div className="flex rounded-full border border-[#D28A4C]/20 sm:mt-2 sm:rounded-none sm:border-0">
            <Input id="cart-coupon" disabled placeholder="Digite o código promocional..." className="h-11 min-w-0 flex-1 rounded-l-full rounded-r-none border-0 bg-transparent px-3 text-xs shadow-none placeholder:text-[#A58A58] disabled:opacity-100 sm:h-10 sm:rounded-l-sm sm:border sm:border-[#D28A4C] sm:px-2" />
            <Button disabled variant="kurio" className="h-11 rounded-full px-5 font-bold disabled:opacity-100 sm:h-10 sm:rounded-l-none sm:rounded-r-sm">Aplicar</Button>
          </div>
          <dl className="mt-4 space-y-3 text-sm sm:mt-6">
            <div className="flex justify-between gap-3"><dt>Subtotal</dt><dd className="whitespace-nowrap text-base">8.92 ETH</dd></div>
            <div className="flex justify-between gap-3"><dt>Desconto do lançamento</dt><dd className="whitespace-nowrap">(-) 00.00</dd></div>
            <div className="flex justify-between gap-3"><dt>Taxa de rede</dt><dd className="whitespace-nowrap text-base">0.016 ETH</dd></div>
          </dl>
          <p className="mt-2 text-right text-xs text-[#E89B55]">Taxa estimada</p>
          <div className="mt-5 flex justify-between gap-3 font-bold sm:mt-6"><span>Total</span><span className="text-[#E89B55]">8.936 ETH</span></div>
          <Button disabled variant="kurio" className="mt-6 h-14 w-full rounded-full font-bold disabled:opacity-100 sm:mt-5 sm:h-10 sm:rounded-sm">Conectar e finalizar</Button>
          <Link to="/mercado" className="mt-3 hidden text-center text-sm text-[#E89B55] hover:underline sm:block">Continuar explorando</Link>
        </section>
      </div>

      <section aria-labelledby="cart-recommendations-title" className="mt-24 hidden sm:block">
        <h2 id="cart-recommendations-title" className="border-b border-[#D28A4C]/20 pb-2 text-base font-bold text-[#E89B55]">Colecionadores também viram</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-5">
          {recommendations.map((nft) => (
            <article key={nft.id}>
              <div className="bg-[#261812] px-1 py-4"><img src={nft.image} alt={nft.name} width={220} height={220} loading="lazy" className="aspect-square w-full rounded-[14px] object-cover" /></div>
              <h3 className="mt-3 text-sm">{nft.name} #{String(nft.number).padStart(3, "0")}</h3>
              <p className="mt-1 text-sm font-bold text-[#E89B55]">{nft.price.toFixed(2)} ETH</p>
            </article>
          ))}
        </div>
        <div aria-hidden="true" className="mt-7 flex justify-center gap-2">
          <span className="size-2.5 rounded-full border border-[#D28A4C]" /><span className="size-2.5 rounded-full bg-[#D28A4C]" /><span className="size-2.5 rounded-full border border-[#D28A4C]" />
        </div>
      </section>
    </div>
  )
}
