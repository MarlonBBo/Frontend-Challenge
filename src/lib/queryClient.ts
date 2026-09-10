import { QueryClient, keepPreviousData } from "@tanstack/react-query"
import axios from "axios"

function shouldRetry(failureCount: number, error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status

    if (status && status >= 400 && status < 500) return false
  }

  return failureCount < 2
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: shouldRetry,
      refetchOnWindowFocus: true,
      placeholderData: keepPreviousData,
    },
    mutations: {
      retry: false,
    },
  },
})

