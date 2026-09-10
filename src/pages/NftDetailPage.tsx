import { useRef, useState } from "react"
import { Link, useParams } from "@tanstack/react-router"
import axios from "axios"
import { ArrowLeft, Copy, Heart, Mail, Minus, Plus, Search, ShoppingCart, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { ApiErrorResponse, Nft } from "@/contracts"
import { RelatedNfts } from "@/components/RelatedNfts"
import { useNft } from "@/hooks/useNfts"
import { multiplyDecimal } from "@/lib/decimal"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { useAddCartItem } from "@/hooks/useCart"

type EditionLabel = "1/1" | "1/10" | "1/50" | "ABERTA"
const views = ["Completa", "Retrato", "Detalhe", "Composição"]
const crops = ["scale-100", "scale-125 origin-top", "scale-150 origin-center", "scale-110 origin-bottom"]

function NftDetailSkeleton() {
  return (
    <div role="status" aria-label="Carregando detalhes do NFT" className="mx-auto -mt-7 w-full max-w-[1200px] sm:mt-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="grid gap-6 sm:grid-cols-[100px_minmax(0,1fr)]">
          <div className="hidden space-y-3 sm:block">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="aspect-square bg-[#261812]" />)}</div>
          <Skeleton className="aspect-square rounded-[24px] bg-[#261812]" />
        </div>
        <div className="space-y-4 pt-4 xl:pt-0">
          <Skeleton className="h-8 w-2/3 bg-[#261812]" />
          <Skeleton className="h-6 w-1/3 bg-[#261812]" />
          <Skeleton className="h-20 w-full bg-[#261812]" />
          <div className="flex gap-2">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-7 w-14 rounded-full bg-[#261812]" />)}</div>
          <Skeleton className="h-12 w-full bg-[#261812]" />
          <Skeleton className="h-20 w-4/5 bg-[#261812]" />
        </div>
      </div>
      <span className="sr-only">Carregando NFT...</span>
    </div>
  )
}

export function NftDetailPage() {
  const { nftId } = useParams({ from: "/mercado/$nftId" })
  const { data: nft, isPending, error, refetch } = useNft(nftId)

  if (isPending) {
    return <NftDetailSkeleton />
  }

  if (axios.isAxiosError(error) && error.response?.status === 404) return <NotFoundPage />

  if (!nft) {
    return <div role="alert" className="mx-auto mt-10 max-w-xl rounded-xl bg-[#261812] p-8 text-center text-[#F5F1EB]"><p>Não foi possível carregar este NFT.</p><Button variant="kurio" className="mt-4" onClick={() => refetch()}>Tentar novamente</Button></div>
  }

  return <NftDetails key={nft.id} nft={nft} />
}

function NftDetails({ nft }: { nft: Nft }) {
  const [view, setView] = useState(0)
  const [edition, setEdition] = useState<EditionLabel>("1/50")
  const [quantity, setQuantity] = useState(1)
  const [favorite, setFavorite] = useState(false)
  const [tab, setTab] = useState("details")
  const [notice, setNotice] = useState("")
  const addItem = useAddCartItem()
  const zoom = useRef<HTMLDialogElement>(null)
  const title = `${nft.name} #${nft.tokenId.slice(-3)}`
  const selectedEdition = nft.editions.find((item) => item.label === edition)
  const limit = selectedEdition ? Math.min(selectedEdition.availableQuantity, selectedEdition.maxPerOrder) : 0
  const attributes = nft.attributes.map((attribute) => attribute.value).join(", ")
  const total = multiplyDecimal(nft.priceEth, quantity)
  const networkName = nft.network[0].toUpperCase() + nft.network.slice(1)

  function addToCart() {
    if (!selectedEdition) return
    addItem.mutate({ nftId: nft.id, editionId: selectedEdition.id, quantity }, {
      onSuccess: () => setNotice(`${quantity} unidade(s) adicionada(s) ao carrinho. Total: ${total} ETH.`),
      onError: (error) => {
        const message = axios.isAxiosError<ApiErrorResponse>(error) ? error.response?.data.message : undefined
        setNotice(message ?? "Não foi possível adicionar o NFT ao carrinho.")
      },
    })
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setNotice("Link copiado.")
    } catch {
      setNotice("Não foi possível copiar. Você pode compartilhar o endereço desta página.")
    }
  }

  return (
    <div className="mx-auto -mt-7 w-full max-w-[1200px] text-[#F5F1EB] sm:mt-8">
      <nav aria-label="Caminho de navegação" className="mb-3 hidden gap-2 text-sm font-bold sm:flex">
        <Link to="/" className="hover:text-[#E89B55]">Início</Link><span aria-hidden="true">/</span>
        <Link to="/mercado" className="hover:text-[#E89B55]">Mercado</Link>
      </nav>
      <div className="relative -mx-4 grid gap-0 rounded-[24px] bg-[#261812] px-4 pt-10 pb-4 sm:mx-0 sm:gap-8 sm:rounded-none sm:bg-transparent sm:p-0 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <Link to="/mercado" aria-label="Voltar ao mercado" className="absolute top-3 left-4 grid size-6 place-items-center rounded-full bg-[#321F17] text-[#CFB28C] sm:hidden">
          <ArrowLeft className="size-3.5" aria-hidden="true" />
        </Link>
        <button type="button" aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"} aria-pressed={favorite} onClick={() => setFavorite(!favorite)} className="absolute top-3 right-4 grid size-6 place-items-center rounded-full bg-[#321F17] text-[#D28A4C] sm:hidden">
          <Heart className={`size-3.5 ${favorite ? "fill-current" : ""}`} aria-hidden="true" />
        </button>
        <div className="grid min-w-0 grid-cols-1 items-start gap-3 sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-6">
          <div className="order-2 hidden grid-cols-4 gap-3 sm:order-none sm:grid sm:grid-cols-1" aria-label="Visualizações da arte">
            {views.map((label, index) => (
              <button key={label} type="button" aria-label={`Ver imagem: ${label}`} aria-pressed={view === index} onClick={() => setView(index)} className={`aspect-square overflow-hidden rounded-lg border-2 focus-visible:outline-2 focus-visible:outline-[#D28A4C] ${view === index ? "border-[#D28A4C]" : "border-transparent"}`}>
                <img src={nft.imageUrl} alt="" className={`h-full w-full object-cover ${crops[index]}`} />
              </button>
            ))}
          </div>
          <div className="relative rounded-[14px] sm:rounded-md sm:bg-[#261812] sm:p-5">
            <div className="aspect-square overflow-hidden rounded-[14px] sm:rounded-[24px]">
              <img src={nft.imageUrl} alt={`${title} — ${views[view]}`} className={`h-full w-full object-cover ${crops[view]}`} />
            </div>
            <button type="button" aria-label="Ampliar imagem" title="Ampliar imagem" onClick={() => zoom.current?.showModal()} className="absolute top-3 right-3 hidden size-8 place-items-center rounded-full bg-[#3A271C] focus-visible:outline-2 focus-visible:outline-[#D28A4C] sm:grid">
              <Search className="size-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        <section aria-labelledby="nft-title" className="pt-4 sm:pt-0">
          <div className="flex items-center justify-between gap-3">
            <h1 id="nft-title" className="min-w-0 text-sm font-bold leading-5 sm:text-[28px] sm:leading-9">{title}</h1>
            <div className="flex shrink-0 items-center gap-0.5 rounded-full border border-[#D28A4C]/45 px-1.5 py-0.5 text-[9px] sm:hidden">
              <Star className="size-2.5 fill-[#D28A4C] text-[#D28A4C]" aria-hidden="true" />
              <span className="font-bold">4.8</span><span className="text-[#A58A58]">(19)</span>
            </div>
          </div>
          <div className="mt-2 hidden flex-wrap items-center justify-between gap-3 border-b border-[#D28A4C]/25 pb-2 sm:flex">
            <p className="text-2xl font-bold text-[#E89B55]">{nft.priceEth} ETH</p>
            <div className="flex flex-wrap items-center gap-1 text-sm">
              <span aria-label="Avaliação ilustrativa: 5 estrelas" className="flex text-[#D28A4C]">{Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-3.5 fill-current" aria-hidden="true" />)}</span>
              <span>19 avaliações de colecionadores</span>
            </div>
          </div>
          <h2 className="mt-2 text-[10px] font-bold sm:mt-3 sm:text-sm">Sobre este NFT:</h2>
          <p className="mt-1 text-[9px] leading-4 text-[#CFB28C] sm:mt-2 sm:text-sm sm:leading-6">{nft.description} Verificado na {networkName}, com arte desbloqueável e acesso para colecionadores.</p>
          <fieldset className="mt-2 sm:mt-2">
            <legend className="text-[10px] font-bold sm:text-sm">Edição:</legend>
            <div className="mt-1 flex flex-wrap gap-1.5 sm:mt-2 sm:gap-2">
              {nft.editions.map((item) => <button key={item.id} type="button" disabled={item.availableQuantity === 0} aria-pressed={edition === item.label} onClick={() => { setEdition(item.label as EditionLabel); setQuantity(1) }} className={`rounded-full border px-2 py-1 text-[8px] focus-visible:outline-2 focus-visible:outline-[#D28A4C] disabled:cursor-not-allowed disabled:opacity-40 sm:text-xs ${edition === item.label ? "border-[#D28A4C] text-[#E89B55]" : "border-[#D28A4C]/25 text-[#CFB28C]"}`}>{item.label}</button>)}
            </div>
          </fieldset>
          <div className="mt-4 hidden flex-wrap items-center justify-between gap-4 sm:flex">
            <div className="flex items-center gap-3" aria-label="Quantidade">
              <Button variant="kurio" className="h-12 w-8 rounded-full px-0" aria-label="Diminuir quantidade" disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)}><Minus aria-hidden="true" /></Button>
              <output aria-label="Quantidade selecionada" className="text-lg">{quantity}</output>
              <Button variant="kurio" className="h-12 w-8 rounded-full px-0" aria-label="Aumentar quantidade" disabled={quantity === limit} onClick={() => setQuantity(quantity + 1)}><Plus aria-hidden="true" /></Button>
            </div>
            <div className="flex gap-2">
              <Button variant="kurio" disabled={!limit || addItem.isPending} className="h-10 rounded-md px-8 font-bold" onClick={addToCart}>{addItem.isPending ? "ADICIONANDO..." : "COMPRAR"}</Button>
              <Button variant="ghost" aria-pressed={favorite} onClick={() => setFavorite(!favorite)} className="h-10 gap-2 rounded-md border border-[#D28A4C] text-[#E89B55] hover:bg-[#261812] hover:text-[#E89B55]"><Heart className={favorite ? "fill-current" : ""} aria-hidden="true" />{favorite ? "Favoritado" : "Favoritar"}</Button>
            </div>
          </div>
          <dl className="mt-3 space-y-1 text-[9px] leading-4 text-[#A58A58] sm:mt-4 sm:space-y-2 sm:text-sm">
            <div><dt className="inline">ID do token: </dt><dd className="inline">#{nft.tokenId}</dd></div>
            <div><dt className="inline">Coleção: </dt><dd className="inline">{nft.collectionName}</dd></div>
            <div><dt className="inline">Atributos: </dt><dd className="inline">{attributes}</dd></div>
          </dl>
          <div className="mt-3 hidden items-center gap-2 text-sm sm:flex">
            <span className="font-bold">Compartilhar este NFT:</span>
            <button type="button" onClick={copyLink} aria-label="Copiar link do NFT" className="hover:text-[#E89B55]"><Copy className="size-4" /></button>
            <a href={`mailto:?subject=${encodeURIComponent(title)}`} aria-label="Compartilhar por e-mail" onClick={(event) => { event.currentTarget.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(window.location.href)}` }} className="hover:text-[#E89B55]"><Mail className="size-4" /></a>
          </div>
          <div className="mt-4 border-t border-[#D28A4C]/15 pt-3 sm:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px]" aria-label="Quantidade">
                <span className="text-[#CFB28C]">Qtd.</span>
                <button type="button" aria-label="Diminuir quantidade" disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)} className="grid size-4 place-items-center rounded-full bg-[#D28A4C] text-[#261812] disabled:opacity-40"><Minus className="size-2.5" aria-hidden="true" /></button>
                <output aria-label="Quantidade selecionada" className="font-bold">{quantity}</output>
                <button type="button" aria-label="Aumentar quantidade" disabled={quantity === limit} onClick={() => setQuantity(quantity + 1)} className="grid size-4 place-items-center rounded-full bg-[#D28A4C] text-[#261812] disabled:opacity-40"><Plus className="size-2.5" aria-hidden="true" /></button>
              </div>
              <p className="text-sm font-bold text-[#E89B55]">{total} ETH</p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button variant="kurio" disabled={!limit || addItem.isPending} className="h-9 flex-1 rounded-full text-[10px] font-bold" onClick={addToCart}>{addItem.isPending ? "Adicionando..." : "Comprar NFT"}</Button>
              <Link to="/mercado/carrinho" aria-label="Ir para o carrinho" className="grid size-9 place-items-center rounded-full bg-[#321F17] text-[#CFB28C]"><ShoppingCart className="size-4" aria-hidden="true" /></Link>
            </div>
          </div>
          <p role="status" className="mt-2 text-[9px] leading-4 text-[#CFB28C] sm:text-xs sm:leading-5">{notice}</p>
        </section>
      </div>

      <section aria-label="Informações do NFT" className="mt-20">
        <div className="flex flex-wrap gap-8 border-b border-[#D28A4C]/30">
          <button type="button" aria-pressed={tab === "details"} onClick={() => setTab("details")} className={`border-b-2 pb-2 text-base ${tab === "details" ? "border-[#D28A4C] font-bold text-[#E89B55]" : "border-transparent"}`}>Detalhes do NFT</button>
          <button type="button" aria-pressed={tab === "reviews"} onClick={() => setTab("reviews")} className={`border-b-2 pb-2 text-base ${tab === "reviews" ? "border-[#D28A4C] font-bold text-[#E89B55]" : "border-transparent"}`}>Avaliações de colecionadores (19)</button>
        </div>
        {tab === "details" ? (
          <div className="space-y-6 pt-3 text-sm leading-6 text-[#CFB28C]">
            <p>{title} é uma obra digital {edition === "ABERTA" ? "de edição aberta" : edition} finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na {networkName}. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.</p>
            <p>A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.</p>
            <dl className="space-y-4">
              <div><dt className="font-bold text-[#F5F1EB]">Rede:</dt><dd>Cunhado na {networkName} com procedência imutável e metadados armazenados no IPFS.</dd></div>
              <div><dt className="font-bold text-[#F5F1EB]">Contrato:</dt><dd>Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.</dd></div>
              <div><dt className="font-bold text-[#F5F1EB]">Direitos autorais:</dt><dd>0x7A42...19E8 · Contrato inteligente ERC-721 verificado.</dd></div>
            </dl>
            <p className="text-xs text-[#A58A58]">Dados demonstrativos do catálogo. Contrato, avaliações e condições da coleção ainda não estão integrados à rede.</p>
          </div>
        ) : <p className="py-8 text-sm text-[#CFB28C]">As 19 avaliações são ilustrativas do layout. Os comentários de colecionadores ainda não estão disponíveis.</p>}
      </section>

      <RelatedNfts nft={nft} />

      <dialog ref={zoom} aria-label={`Imagem ampliada de ${title}`} className="fixed inset-0 m-auto max-h-[90vh] max-w-[90vw] rounded-2xl bg-[#261812] p-4 text-[#F5F1EB] backdrop:bg-black/80">
        <form method="dialog" className="mb-3 flex justify-end"><Button type="submit" variant="kurio" size="icon" aria-label="Fechar imagem ampliada"><X aria-hidden="true" /></Button></form>
        <img src={nft.imageUrl} alt={title} className="max-h-[75vh] max-w-full rounded-xl object-contain" />
      </dialog>
    </div>
  )
}
