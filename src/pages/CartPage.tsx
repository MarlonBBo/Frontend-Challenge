import axios from "axios"
import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import type { ApiErrorResponse, CartItem } from "@/contracts"
import { nfts } from "@/data/nfts"
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/useCart"
import { useAcceptQuoteChanges, useQuote } from "@/hooks/useQuote"
import { multiplyDecimal } from "@/lib/decimal"

const recommendations = [nfts[3], nfts[4], nfts[5], nfts[6], nfts[8]]

function formatDecimal(value: string, minimumFractionDigits = 2) {
  const [integer, fraction = ""] = value.split(".")
  return `${integer}.${fraction.padEnd(minimumFractionDigits, "0")}`
}

function CartLoading() {
  return (
    <div role="status">
      <span className="sr-only">Carregando carrinho...</span>
      <div className="space-y-4 px-6 sm:hidden">
        {Array.from({ length: 4 }, (_, index) => <div key={index} className="flex h-[92px] overflow-hidden rounded-[15px] bg-[#261512]"><Skeleton className="size-[92px] shrink-0 rounded-none bg-[#38231A]" /><div className="flex-1 space-y-2 p-3"><Skeleton className="h-4 w-3/4 bg-[#38231A]" /><Skeleton className="h-3 w-1/2 bg-[#38231A]" /><Skeleton className="mt-3 h-5 w-1/3 bg-[#38231A]" /></div></div>)}
      </div>
      <div className="hidden items-start gap-12 sm:grid xl:grid-cols-[minmax(0,2.35fr)_minmax(280px,1fr)] xl:gap-20">
        <div className="space-y-3"><Skeleton className="h-7 w-full rounded-none bg-[#261812]" />{Array.from({ length: 4 }, (_, index) => <div key={index} className="flex h-[82px] items-center gap-4 bg-[#261812] pr-5"><Skeleton className="size-[70px] shrink-0 bg-[#38231A]" /><Skeleton className="h-5 w-36 bg-[#38231A]" /><Skeleton className="ml-auto h-5 w-20 bg-[#38231A]" /></div>)}</div>
        <div className="space-y-4 pt-3"><Skeleton className="h-7 w-2/3 bg-[#261812]" /><Skeleton className="h-10 w-full bg-[#261812]" />{Array.from({ length: 4 }, (_, index) => <div key={index} className="flex justify-between"><Skeleton className="h-4 w-1/2 bg-[#261812]" /><Skeleton className="h-4 w-20 bg-[#261812]" /></div>)}<Skeleton className="h-10 w-full bg-[#261812]" /></div>
      </div>
    </div>
  )
}

export function CartPage() {
  const navigate = useNavigate()
  const [couponInput, setCouponInput] = useState("")
  const [couponCode, setCouponCode] = useState<string>()
  const [quoteClock, setQuoteClock] = useState(() => Date.now())
  const { data: cart, isPending, isError, refetch } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()
  const quoteQuery = useQuote(cart?.version, couponCode)
  const acceptChanges = useAcceptQuoteChanges()
  const items = cart?.items ?? []
  const quote = quoteQuery.data
  const mutationError = updateItem.error ?? removeItem.error ?? acceptChanges.error
  const errorMessage = axios.isAxiosError<ApiErrorResponse>(mutationError) ? mutationError.response?.data.message : undefined
  const quoteError = axios.isAxiosError<ApiErrorResponse>(quoteQuery.error) ? quoteQuery.error.response?.data.message : undefined
  const quoteExpired = quote ? Date.parse(quote.expiresAt) <= quoteClock : false

  useEffect(() => {
    if (!quote) return
    const expiresIn = Math.max(0, Date.parse(quote.expiresAt) - Date.now())
    const timeout = window.setTimeout(() => setQuoteClock(Date.now()), expiresIn + 25)
    return () => window.clearTimeout(timeout)
  }, [quote])

  function changeQuantity(item: CartItem, quantity: number) {
    if (quantity >= 1 && quantity <= item.availableQuantity) updateItem.mutate({ itemId: item.id, quantity })
  }

  function applyCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextCode = couponInput.trim().toUpperCase()
    if (!nextCode) return
    if (nextCode === couponCode) quoteQuery.refetch()
    else setCouponCode(nextCode)
  }

  function removeCoupon() {
    setCouponInput("")
    setCouponCode(undefined)
  }

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

      {isPending ? <CartLoading /> : isError ? (
        <div role="alert" className="mx-6 rounded-xl bg-[#261512] p-8 text-center sm:mx-0"><p>Não foi possível carregar o carrinho.</p><Button variant="kurio" className="mt-4" onClick={() => refetch()}>Tentar novamente</Button></div>
      ) : items.length === 0 ? (
        <div className="mx-6 rounded-xl bg-[#261512] p-8 text-center sm:mx-0"><p>Seu carrinho está vazio.</p><Link to="/mercado" className="mt-4 inline-block text-[#E89B55] underline">Explorar NFTs</Link></div>
      ) : <>
        <div className="space-y-4 px-6 sm:hidden">
          {items.map((item) => (
            <article key={item.id} className="relative flex h-[92px] overflow-hidden rounded-[15px] bg-[#261512]">
              <img src={item.nft.imageUrl} alt="" width={92} height={92} className="size-[92px] shrink-0 object-cover" />
              <div className="min-w-0 flex-1 px-2 py-2.5">
                <h2 className="truncate pr-6 text-sm font-bold">{item.nft.name} #{item.nft.tokenId.slice(-3)}</h2>
                <p className="mt-0.5 text-xs text-[#CFB28C]">Edição: {item.editionLabel}</p>
                <p className="mt-3 text-lg font-bold text-[#E89B55]">{multiplyDecimal(item.unitPriceEth, item.quantity)} ETH</p>
              </div>
              <div className="absolute right-2 top-9 flex items-center gap-1.5 text-sm">
                <button type="button" aria-label={`Diminuir quantidade de ${item.nft.name}`} disabled={item.quantity === 1 || updateItem.isPending} onClick={() => changeQuantity(item, item.quantity - 1)} className="grid size-6 place-items-center rounded-full border border-[#D28A4C]/15 text-[#D28A4C] disabled:opacity-40"><Minus className="size-3" aria-hidden="true" /></button>
                <output aria-label={`Quantidade de ${item.nft.name}`}>{item.quantity}</output>
                <button type="button" aria-label={`Aumentar quantidade de ${item.nft.name}`} disabled={item.quantity >= item.availableQuantity || updateItem.isPending} onClick={() => changeQuantity(item, item.quantity + 1)} className="grid size-6 place-items-center rounded-full border border-[#D28A4C]/15 disabled:opacity-40"><Plus className="size-3.5" aria-hidden="true" /></button>
                <button type="button" aria-label={`Remover ${item.nft.name}`} disabled={removeItem.isPending} onClick={() => removeItem.mutate(item.id)} className="grid size-6 place-items-center text-[#D28A4C] disabled:opacity-40"><Trash2 className="size-3.5" aria-hidden="true" /></button>
              </div>
            </article>
          ))}
        </div>

        <div className="grid items-start gap-12 xl:grid-cols-[minmax(0,2.35fr)_minmax(280px,1fr)] xl:gap-20">
          <div className="hidden overflow-x-auto sm:block">
            <table className="cart-table w-full min-w-[620px] border-separate border-spacing-x-0 border-spacing-y-3 text-left text-sm">
              <caption className="sr-only">NFTs no carrinho</caption>
              <thead><tr>{["NFTs", "Preço", "Edições", "Total"].map((label) => <th key={label} scope="col" className="border-b border-[#D28A4C]/20 pb-2 font-medium">{label}</th>)}<th scope="col" className="border-b border-[#D28A4C]/20"><span className="sr-only">Remover</span></th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="bg-[#261812]">
                    <th scope="row" className="py-0 pr-5 font-normal"><div className="flex items-center gap-4"><img src={item.nft.imageUrl} alt="" width={70} height={70} className="size-[70px] shrink-0 rounded-md object-cover" /><div><p className="whitespace-nowrap font-bold">{item.nft.name} #{item.nft.tokenId.slice(-3)}</p><p className="mt-1 text-xs text-[#A58A58]">ID do token: #{item.nft.tokenId}</p></div></div></th>
                    <td className="whitespace-nowrap pr-6 font-bold text-[#CFB28C]">{item.unitPriceEth} ETH</td>
                    <td className="pr-6"><div className="flex items-center gap-3"><Button variant="kurio" aria-label={`Diminuir quantidade de ${item.nft.name}`} disabled={item.quantity === 1 || updateItem.isPending} onClick={() => changeQuantity(item, item.quantity - 1)} className="h-7 w-5 rounded-full px-0"><Minus className="size-3" aria-hidden="true" /></Button><output aria-label={`Quantidade de ${item.nft.name}`}>{item.quantity}</output><Button variant="kurio" aria-label={`Aumentar quantidade de ${item.nft.name}`} disabled={item.quantity >= item.availableQuantity || updateItem.isPending} onClick={() => changeQuantity(item, item.quantity + 1)} className="h-7 w-5 rounded-full px-0"><Plus className="size-3" aria-hidden="true" /></Button></div></td>
                    <td className="whitespace-nowrap pr-6 font-bold text-[#E89B55]">{multiplyDecimal(item.unitPriceEth, item.quantity)} ETH</td>
                    <td className="pr-4"><button type="button" aria-label={`Remover ${item.nft.name}`} disabled={removeItem.isPending} onClick={() => removeItem.mutate(item.id)} className="text-[#A58A58] disabled:opacity-40"><Trash2 className="size-5" strokeWidth={1.5} aria-hidden="true" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section aria-labelledby="cart-summary-title" className="mt-2 rounded-t-[36px] bg-[#211310] px-6 pt-5 pb-6 sm:mt-0 sm:rounded-none sm:bg-transparent sm:px-0 sm:pt-3 sm:pb-0">
            <h2 id="cart-summary-title" className="sr-only sm:not-sr-only sm:border-b sm:border-[#D28A4C]/20 sm:pb-2 sm:text-lg sm:font-bold">Resumo da carteira</h2>
            <Label htmlFor="cart-coupon" className="sr-only sm:not-sr-only sm:mt-6 sm:block sm:text-sm sm:font-bold">Código promocional</Label>
            <form onSubmit={applyCoupon} className="flex rounded-full border border-[#D28A4C]/20 sm:mt-2 sm:rounded-none sm:border-0"><Input id="cart-coupon" value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="Digite o código promocional..." className="h-11 min-w-0 flex-1 rounded-l-full rounded-r-none border-0 bg-transparent px-3 text-xs uppercase shadow-none placeholder:normal-case placeholder:text-[#A58A58] sm:h-10 sm:rounded-l-sm sm:border sm:border-[#D28A4C] sm:px-2" /><Button type="submit" disabled={!couponInput.trim() || quoteQuery.isFetching} variant="kurio" className="h-11 rounded-full px-5 font-bold sm:h-10 sm:rounded-l-none sm:rounded-r-sm">Aplicar</Button></form>
            {couponCode && <button type="button" onClick={removeCoupon} className="mt-2 text-xs text-[#E89B55] underline">Remover cupom {couponCode}</button>}
            {quoteError && <p role="alert" className="mt-3 text-xs text-[#E8794C]">{quoteError}</p>}
            {quoteQuery.isPending ? <div role="status" className="mt-6 space-y-3"><span className="sr-only">Calculando cotação...</span>{Array.from({ length: 4 }, (_, index) => <div key={index} className="flex justify-between"><Skeleton className="h-5 w-1/2 bg-[#321F17]" /><Skeleton className="h-5 w-20 bg-[#321F17]" /></div>)}</div> : quote && <dl className="mt-4 space-y-3 text-sm sm:mt-6"><div className="flex justify-between gap-3"><dt>Subtotal</dt><dd className="whitespace-nowrap text-base">{formatDecimal(quote.subtotalEth)} ETH</dd></div><div className="flex justify-between gap-3"><dt>Desconto do lançamento</dt><dd className="whitespace-nowrap">(-) {formatDecimal(quote.discountEth)}</dd></div><div className="flex justify-between gap-3"><dt>Taxa de rede</dt><dd className="whitespace-nowrap text-base">{formatDecimal(quote.networkFeeEth, 3)} ETH</dd></div></dl>}
            <p className="mt-2 text-right text-xs text-[#E89B55]">Taxa estimada</p>
            {quote && <div className="mt-5 flex justify-between gap-3 font-bold sm:mt-6"><span>Total</span><span className="text-[#E89B55]">{formatDecimal(quote.totalEth, 3)} ETH</span></div>}
            {quote?.changes.length ? <div role="alert" className="mt-4 rounded-lg border border-[#E8794C]/50 p-3 text-xs"><p className="font-bold text-[#E8794C]">O carrinho mudou desde a última cotação.</p><ul className="mt-2 space-y-1 text-[#CFB28C]">{quote.changes.map((change) => <li key={`${change.nftId}-${change.type}`}>{change.message}</li>)}</ul><Button variant="kurio" disabled={acceptChanges.isPending} onClick={() => acceptChanges.mutate({ couponCode })} className="mt-3">{acceptChanges.isPending ? "Atualizando..." : "Aceitar alterações"}</Button></div> : null}
            {quoteExpired && <p role="alert" className="mt-3 text-xs text-[#E8794C]">Esta cotação expirou. Atualize antes de continuar.</p>}
            {errorMessage && <p role="alert" className="mt-3 text-xs text-[#E8794C]">{errorMessage}</p>}
            <Button disabled={!quote || quoteQuery.isFetching || quoteExpired || quote.changes.length > 0} onClick={() => navigate({ to: "/mercado/pagamento" })} variant="kurio" className="mt-6 h-14 w-full rounded-full font-bold sm:mt-5 sm:h-10 sm:rounded-sm">Conectar e finalizar</Button>
            <Link to="/mercado" className="mt-3 hidden text-center text-sm text-[#E89B55] hover:underline sm:block">Continuar explorando</Link>
          </section>
        </div>
      </>}

      <section aria-labelledby="cart-recommendations-title" className="mt-24 hidden sm:block">
        <h2 id="cart-recommendations-title" className="border-b border-[#D28A4C]/20 pb-2 text-base font-bold text-[#E89B55]">Colecionadores também viram</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-5">{recommendations.map((nft) => <article key={nft.id}><div className="bg-[#261812] px-1 py-4"><img src={nft.image} alt={nft.name} width={220} height={220} loading="lazy" className="aspect-square w-full rounded-[14px] object-cover" /></div><h3 className="mt-3 text-sm">{nft.name} #{String(nft.number).padStart(3, "0")}</h3><p className="mt-1 text-sm font-bold text-[#E89B55]">{nft.price.toFixed(2)} ETH</p></article>)}</div>
        <div aria-hidden="true" className="mt-7 flex justify-center gap-2"><span className="size-2.5 rounded-full border border-[#D28A4C]" /><span className="size-2.5 rounded-full bg-[#D28A4C]" /><span className="size-2.5 rounded-full border border-[#D28A4C]" /></div>
      </section>
    </div>
  )
}
