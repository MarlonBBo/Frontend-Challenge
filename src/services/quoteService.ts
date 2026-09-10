import type { CreateQuoteRequest, CreateQuoteResponse } from "@/contracts"
import { api } from "@/lib/api"

export const quoteService = {
  async create(request: CreateQuoteRequest) {
    const response = await api.post<CreateQuoteResponse>("/quotes", request)
    return response.data
  },
}

