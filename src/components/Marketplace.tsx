import { useContext, useState } from "react"
import { ChevronRight, Heart, X } from "lucide-react"
import { Dialog } from "@base-ui/react/dialog"
import { CatalogFiltersContext } from "@/lib/catalogFiltersContext"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import type { BlockchainNetwork, CatalogTab, ListNftsParams, NftSort } from "@/contracts"
import { useNfts } from "@/hooks/useNfts"
import nomad from "@/assets/2986a7cb16d09de8970824d2dd58bf0bb021702c.png"

const tabs = [
  { label: "Todos os NFTs", value: "all" },
  { label: "Novos lançamentos", value: "recent" },
  { label: "Em alta", value: "trending" },
] as const

function CatalogSkeleton() {
  return (
    <div aria-label="Carregando catálogo" role="status" className="grid grid-cols-2 items-start gap-x-4 gap-y-5 lg:gap-x-8 lg:gap-y-16 xl:grid-cols-3">
      {Array.from({ length: 9 }, (_, index) => (
        <div key={index} className={`animate-pulse ${index % 2 === 1 ? "translate-y-7 lg:translate-y-0" : ""}`}>
          <div className="aspect-[1/1.08] rounded-[22px] bg-[#261812] lg:aspect-square lg:rounded-none" />
          <div className="mt-3 h-4 w-3/4 rounded bg-[#261812]" />
          <div className="mt-2 h-4 w-1/2 rounded bg-[#261812]" />
        </div>
      ))}
      <span className="sr-only">Carregando NFTs...</span>
    </div>
  )
}

export function Marketplace() {
  const { open, setOpen } = useContext(CatalogFiltersContext)
  const [category, setCategory] = useState<string | null>(null)
  const [network, setNetwork] = useState<BlockchainNetwork | null>(null)
  const [tab, setTab] = useState<CatalogTab>("all")
  const [sort, setSort] = useState<NftSort>("recent")
  const [minimum, setMinimum] = useState(0.02)
  const [maximum, setMaximum] = useState(12.3)
  const [price, setPrice] = useState([0.02, 12.3])
  const [page, setPage] = useState(1)
  const params: ListNftsParams = {
    ...(category ? { category } : {}),
    ...(network ? { network } : {}),
    tab,
    minPrice: price[0].toFixed(2),
    maxPrice: price[1].toFixed(2),
    sort,
    page,
    pageSize: 9,
  }
  const { data, isPending, isError, isFetching, refetch } = useNfts(params)
  const visible = data?.items ?? []
  const pages = data?.totalPages ?? 0
  const filterClass = "flex w-full items-center justify-between gap-2 rounded px-3 py-2 text-left text-sm transition-colors hover:text-[#E89B55] focus-visible:outline-2 focus-visible:outline-[#D28A4C]"

  const filterContent = (
      <>
        <div className="space-y-10 bg-[#261812] px-5 py-5">
          <div>
            <h2 className="mb-2 text-base font-bold">Coleções</h2>
            {(data?.facets.categories ?? []).map((item) => (
              <button key={item.value} type="button" aria-pressed={category === item.value} className={`${filterClass} ${category === item.value ? "text-[#E89B55]" : "text-[#CFB28C]"}`} onClick={() => { setCategory(category === item.value ? null : item.value); setPage(1) }}>
                <span>{item.label}</span><span>({item.count})</span>
              </button>
            ))}
          </div>
          <fieldset>
            <legend className="mb-3 text-base font-bold">Faixa de preço</legend>
            <div className="flex gap-2">
              <input aria-label="Preço mínimo em ETH" type="range" min="0.02" max="12.3" step="0.01" value={minimum} onChange={(event) => setMinimum(Math.min(Number(event.target.value), maximum))} className="min-w-0 flex-1 accent-[#D28A4C]" />
              <input aria-label="Preço máximo em ETH" type="range" min="0.02" max="12.3" step="0.01" value={maximum} onChange={(event) => setMaximum(Math.max(Number(event.target.value), minimum))} className="min-w-0 flex-1 accent-[#D28A4C]" />
            </div>
            <p className="my-3 text-xs">Preço: {minimum.toFixed(2).replace(".", ",")} – {maximum.toFixed(2).replace(".", ",")} ETH</p>
            <Button variant="kurio" className="rounded-md font-bold" onClick={() => { setPrice([minimum, maximum]); setPage(1) }}>Aplicar</Button>
          </fieldset>
          <div>
            <h2 className="mb-2 text-base font-bold">Rede</h2>
            {(data?.facets.networks ?? []).map((item) => (
              <button key={item.value} type="button" aria-pressed={network === item.value} className={`${filterClass} ${network === item.value ? "text-[#E89B55]" : "text-[#CFB28C]"}`} onClick={() => { const next = item.value as BlockchainNetwork; setNetwork(network === next ? null : next); setPage(1) }}>
                <span>{item.label}</span><span>({item.count})</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 overflow-hidden bg-[#261C12] pt-6">
          <h2 className="px-5 text-xl font-bold text-[#E89B55]">NFT EM DESTAQUE</h2>
          <p className="my-3 text-center text-lg font-bold">OFERTA LIMITADA</p>
          <img src={nomad} alt="NFT de macaco com chapéu verde e moletom roxo em destaque" className="aspect-[310/364] w-full rounded-[20px] object-cover" loading="lazy" />
        </div>
      </>
  )

  return (
    <section id="mercado" aria-label="Mercado de NFTs" className="mx-auto mt-4 grid w-full max-w-[1200px] gap-6 text-[#F5F1EB] lg:mt-16 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)] xl:gap-10">
      <aside aria-label="Filtros do catálogo" className="hidden lg:block">{filterContent}</aside>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/60" />
          <Dialog.Popup className="fixed inset-y-0 right-0 z-50 w-[min(360px,100vw)] overflow-y-auto bg-[#261812] pb-8 text-[#F5F1EB] outline-none">
            <div className="flex items-center justify-between p-5">
              <Dialog.Title className="text-lg font-bold">Filtrar coleções</Dialog.Title>
              <Dialog.Close aria-label="Fechar filtros" className="grid size-11 place-items-center rounded-md text-[#E89B55]"><X aria-hidden="true" /></Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">Escolha coleção, faixa de preço, rede e ordenação.</Dialog.Description>
            <label className="block px-5 text-sm">Ordenar por
            <select value={sort} onChange={(event) => { setSort(event.target.value as NftSort); setPage(1) }} className="mt-2 h-11 w-full rounded border border-[#D28A4C]/40 bg-[#140D0A] px-2">
                <option value="recent">Listados recentemente</option><option value="price_asc">Menor preço</option><option value="price_desc">Maior preço</option>
              </select>
            </label>
            {filterContent}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 text-xs lg:mb-7">
          <div className="flex w-full justify-between gap-1 sm:w-auto sm:gap-4" aria-label="Exibição do catálogo">
            {tabs.map((item) => (
              <button key={item.value} type="button" aria-pressed={tab === item.value} onClick={() => { setTab(item.value); setPage(1) }} className={`border-b pb-1 focus-visible:outline-2 focus-visible:outline-[#D28A4C] ${tab === item.value ? "border-[#D28A4C] text-[#E89B55]" : "border-transparent hover:text-[#E89B55]"}`}>{item.label}</button>
            ))}
          </div>
          <label className="hidden items-center gap-1 lg:flex">
            Ordenar por:
            <select value={sort} onChange={(event) => { setSort(event.target.value as NftSort); setPage(1) }} className="max-w-full bg-[#140D0A] py-1 focus-visible:outline-[#D28A4C]">
              <option value="recent">Listados recentemente</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
            </select>
          </label>
        </div>

        {isFetching && !isPending && <span role="status" className="sr-only">Atualizando catálogo...</span>}
        {isPending ? <CatalogSkeleton /> : isError ? (
          <div role="alert" className="rounded-lg bg-[#261812] px-5 py-12 text-center">
            <p>Não foi possível carregar o catálogo.</p>
            <Button variant="kurio" className="mt-4 font-bold" onClick={() => refetch()}>Tentar novamente</Button>
          </div>
        ) : <div className="grid grid-cols-2 items-start gap-x-4 gap-y-5 lg:gap-x-8 lg:gap-y-16 xl:grid-cols-3">
          {visible.map((nft, index) => (
            <article key={nft.id} className={`relative min-w-0 ${index % 2 === 1 ? "translate-y-7 lg:translate-y-0" : ""}`}>
              <Link to="/mercado/$nftId" params={{ nftId: String(nft.id) }} className="block rounded-md focus-visible:outline-2 focus-visible:outline-[#D28A4C]">
              <div className="relative overflow-hidden rounded-[22px] bg-[#261812] px-1 py-3 lg:rounded-none lg:py-5">
                <img src={nft.imageUrl} alt={nft.name} width={250} height={250} loading="lazy" className="aspect-[1/1.08] w-full rounded-[18px] object-cover lg:aspect-square lg:rounded-[14px]" />
                {nft.name === "Neon Vessel" && <span className="absolute top-3 left-0 bg-[#D28A4C] px-3 py-2 text-[10px] text-[#140D0A] lg:hidden">RARO</span>}
              </div>
              <h3 className="mt-2 px-1 text-[13px] leading-5 lg:mt-3 lg:px-0 lg:text-sm">{nft.name} #{nft.tokenId.slice(-3)}</h3>
              <p className="flex flex-wrap gap-1 px-1 text-sm text-[#E89B55] lg:mt-1 lg:gap-3 lg:px-0 lg:text-base">
                <span className="font-bold">{nft.priceEth} ETH</span>
                {nft.previousPriceEth && <del className="text-[#A58A58]">{nft.previousPriceEth} ETH</del>}
              </p>
              </Link>
              {index === 0 && <button type="button" disabled aria-label="Favoritar — em breve" className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-[#261812] text-[#D28A4C] lg:hidden"><Heart className="size-4" aria-hidden="true" /></button>}
            </article>
          ))}
        </div>}
        {!isPending && !isError && visible.length === 0 && <p role="status" className="py-16 text-center text-[#CFB28C]">Nenhum NFT encontrado para os filtros selecionados.</p>}
        {pages > 1 && (
          <nav aria-label="Paginação do catálogo" className="mt-20 flex justify-end gap-2">
            {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
              <Button key={number} variant={page === number ? "kurio" : "ghost"} size="icon" aria-label={`Página ${number}`} aria-current={page === number ? "page" : undefined} className="rounded-sm" onClick={() => setPage(number)}>{number}</Button>
            ))}
            <Button variant="ghost" size="icon" className="rounded-sm" aria-label="Próxima página" disabled={page === pages} onClick={() => setPage(page + 1)}><ChevronRight aria-hidden="true" /></Button>
          </nav>
        )}
      </div>
    </section>
  )
}
