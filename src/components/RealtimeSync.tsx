import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import type { Cart, ListNftsResponse, Nft, NftUpdatedEvent } from "@/contracts"
import { useSession } from "@/hooks/useAuth"
import { cartKeys } from "@/hooks/useCart"
import { nftKeys } from "@/hooks/useNfts"
import { quoteKeys } from "@/hooks/useQuote"

function applyNftEvent(nft: Nft, event: NftUpdatedEvent): Nft {
  if (nft.id !== event.resourceId || nft.version >= event.version) return nft
  const availability = new Map(event.editions.map((edition) => [edition.id, edition.availableQuantity]))

  return {
    ...nft,
    previousPriceEth: nft.priceEth === event.priceEth ? nft.previousPriceEth : nft.priceEth,
    priceEth: event.priceEth,
    editions: nft.editions.map((edition) => availability.has(edition.id) ? { ...edition, availableQuantity: availability.get(edition.id)! } : edition),
    version: event.version,
  }
}

export function RealtimeSync() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const userId = session?.user.id

  useEffect(() => {
    let socket: ReturnType<(typeof import("@/realtime/socket"))["getRealtimeSocket"]> | undefined
    let disposed = false
    const latestVersions = new Map<string, number>()

    function reconcile() {
      queryClient.invalidateQueries({ queryKey: nftKeys.all })
      queryClient.invalidateQueries({ queryKey: cartKeys.current })
      queryClient.invalidateQueries({ queryKey: quoteKeys.all })
      if (userId) socket?.emit("session.identify", { userId })
    }

    function onNftUpdated(event: NftUpdatedEvent) {
      const detail = queryClient.getQueryData<Nft>(nftKeys.detail(event.resourceId))
      const listVersions = queryClient.getQueriesData<ListNftsResponse>({ queryKey: nftKeys.lists() })
        .flatMap(([, data]) => data?.items ?? [])
        .filter((nft) => nft.id === event.resourceId)
        .map((nft) => nft.version)
      const knownVersion = Math.max(latestVersions.get(event.resourceId) ?? 0, detail?.version ?? 0, ...listVersions)
      if (event.version <= knownVersion) return
      latestVersions.set(event.resourceId, event.version)

      queryClient.setQueryData<Nft>(nftKeys.detail(event.resourceId), (nft) => nft ? applyNftEvent(nft, event) : nft)
      queryClient.setQueriesData<ListNftsResponse>({ queryKey: nftKeys.lists() }, (data) => data ? {
        ...data,
        items: data.items.map((nft) => applyNftEvent(nft, event)),
      } : data)
      queryClient.setQueryData<Cart>(cartKeys.current, (cart) => cart ? {
        ...cart,
        items: cart.items.map((item) => item.nftId === event.resourceId ? {
          ...item,
          availableQuantity: event.editions.find((edition) => edition.id === item.editionId)?.availableQuantity ?? item.availableQuantity,
        } : item),
      } : cart)
      queryClient.invalidateQueries({ queryKey: quoteKeys.all })
    }

    const connectTimer = window.setTimeout(() => {
      void import("@/realtime/socket").then(({ getRealtimeSocket }) => {
        if (disposed) return
      socket = getRealtimeSocket()
      socket.on("connect", reconcile)
        socket.on("nft.updated", onNftUpdated)
      socket.connect()
      })
    }, 0)

    return () => {
      disposed = true
      window.clearTimeout(connectTimer)
      socket?.off("connect", reconcile)
      socket?.off("nft.updated", onNftUpdated)
      socket?.disconnect()
    }
  }, [queryClient, userId])

  return null
}
