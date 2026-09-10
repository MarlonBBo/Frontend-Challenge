import { useState } from "react"
import { Link } from "@tanstack/react-router"
import type { Nft } from "@/contracts"
import { useNfts } from "@/hooks/useNfts"

const featuredIds = ["3", "4", "5", "6", "8"]

export function RelatedNfts({ nft }: { nft: Nft }) {
  const [page, setPage] = useState(0)
  const { data, isPending } = useNfts({ collectionId: nft.collectionId, tab: "all", sort: "recent", page: 1, pageSize: 50 })
  const related = (data?.items ?? [])
    .filter((item) => item.collectionName === nft.collectionName && item.id !== nft.id)
    .sort((a, b) => {
      const rank = (id: string) => featuredIds.includes(id) ? featuredIds.indexOf(id) : featuredIds.length + Number(id)
      return rank(a.id) - rank(b.id)
    })
    .slice(0, 15)
  const pages = Math.ceil(related.length / 5)

  if (isPending) return <div role="status" className="mt-16 h-52 animate-pulse rounded-xl bg-[#261812]"><span className="sr-only">Carregando NFTs relacionados...</span></div>
  if (!related.length) return null

  return (
    <section aria-labelledby="related-title" className="mt-16">
      <h2 id="related-title" className="border-b border-[#D28A4C]/25 pb-2 text-base font-bold text-[#E89B55]">Mais desta coleção</h2>
      <div id="related-cards" aria-live="polite" className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-5">
        {related.slice(page * 5, page * 5 + 5).map((item) => (
          <article key={item.id}>
            <Link to="/mercado/$nftId" params={{ nftId: String(item.id) }} className="group block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D28A4C]">
              <div className="bg-[#261812] px-1 py-4">
                <img src={item.imageUrl} alt="" width={220} height={220} loading="lazy" className="aspect-square w-full rounded-[14px] object-cover transition-opacity group-hover:opacity-90" />
              </div>
              <h3 className="mt-3 text-sm leading-5 text-[#F5F1EB]">{item.name} #{item.tokenId.slice(-3)}</h3>
              <p className="text-sm font-bold leading-5 text-[#E89B55]">{item.priceEth} ETH</p>
            </Link>
          </article>
        ))}
      </div>
      {pages > 1 && (
        <div aria-label="Grupos de NFTs relacionados" className="mt-5 flex justify-center">
          {Array.from({ length: pages }, (_, index) => (
            <button key={index} type="button" aria-label={`Mostrar grupo ${index + 1} de ${pages}`} aria-pressed={page === index} aria-controls="related-cards" onClick={() => setPage(index)} className="grid size-6 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-[#D28A4C]">
              <span aria-hidden="true" className={`size-2.5 rounded-full border border-[#D28A4C] ${page === index ? "bg-[#D28A4C]" : "bg-transparent"}`} />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
