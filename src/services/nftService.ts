import type { GetNftResponse, ListNftsParams, ListNftsResponse } from "@/contracts"
import { api } from "@/lib/api"

export const nftService = {
  async list(params: ListNftsParams) {
    const response = await api.get<ListNftsResponse>("/nfts", { params })
    return response.data
  },

  async getById(nftId: string) {
    const response = await api.get<GetNftResponse>(`/nfts/${nftId}`)
    return response.data
  },
}

