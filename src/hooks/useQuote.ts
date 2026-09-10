import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cartKeys } from "@/hooks/useCart"
import { quoteService } from "@/services/quoteService"

export const quoteKeys = {
  all: ["quotes"] as const,
  cart: (cartVersion: number, couponCode?: string) => [...quoteKeys.all, cartVersion, couponCode ?? null] as const,
}

export function useQuote(cartVersion: number | undefined, couponCode?: string) {
  return useQuery({
    queryKey: quoteKeys.cart(cartVersion ?? 0, couponCode),
    queryFn: () => quoteService.create({ ...(couponCode ? { couponCode } : {}) }),
    enabled: cartVersion !== undefined,
    placeholderData: undefined,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useAcceptQuoteChanges() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ couponCode }: { couponCode?: string }) => quoteService.create({ ...(couponCode ? { couponCode } : {}), acceptChanges: true }),
    onSuccess(quote) {
      queryClient.setQueryData(quoteKeys.cart(quote.cartVersion, quote.couponCode), quote)
      queryClient.invalidateQueries({ queryKey: cartKeys.current })
    },
  })
}

