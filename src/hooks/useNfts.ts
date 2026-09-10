import { useQuery } from "@tanstack/react-query"
import type { ListNftsParams } from "@/contracts"
import { nftService } from "@/services/nftService"

export const nftKeys = {
  all: ["nfts"] as const,
  lists: () => [...nftKeys.all, "list"] as const,
  list: (params: ListNftsParams) => [...nftKeys.lists(), params] as const,
  details: () => [...nftKeys.all, "detail"] as const,
  detail: (nftId: string) => [...nftKeys.details(), nftId] as const,
}

export function useNfts(params: ListNftsParams) {
  return useQuery({
    queryKey: nftKeys.list(params),
    queryFn: () => nftService.list(params),
  })
}

export function useNft(nftId: string) {
  return useQuery({
    queryKey: nftKeys.detail(nftId),
    queryFn: () => nftService.getById(nftId),
  })
}
