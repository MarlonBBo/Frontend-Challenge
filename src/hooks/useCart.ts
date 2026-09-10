import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AddCartItemRequest, Cart } from "@/contracts"
import { cartService } from "@/services/cartService"

export const cartKeys = {
  all: ["cart"] as const,
  current: ["cart", "current"] as const,
}

export function useCart() {
  return useQuery({ queryKey: cartKeys.current, queryFn: cartService.get })
}

export function useAddCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (item: AddCartItemRequest) => cartService.addItem(item),
    onSuccess(cart) {
      queryClient.setQueryData(cartKeys.current, cart)
    },
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => cartService.updateItem(itemId, { quantity }),
    async onMutate({ itemId, quantity }) {
      await queryClient.cancelQueries({ queryKey: cartKeys.current })
      const previous = queryClient.getQueryData<Cart>(cartKeys.current)
      queryClient.setQueryData<Cart>(cartKeys.current, (cart) => cart ? {
        ...cart,
        items: cart.items.map((item) => item.id === itemId ? { ...item, quantity } : item),
      } : cart)
      return { previous }
    },
    onError(_error, _variables, context) {
      if (context?.previous) queryClient.setQueryData(cartKeys.current, context.previous)
    },
    onSuccess(cart) {
      queryClient.setQueryData(cartKeys.current, cart)
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: cartKeys.current })
    },
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    async onMutate(itemId) {
      await queryClient.cancelQueries({ queryKey: cartKeys.current })
      const previous = queryClient.getQueryData<Cart>(cartKeys.current)
      queryClient.setQueryData<Cart>(cartKeys.current, (cart) => cart ? {
        ...cart,
        items: cart.items.filter((item) => item.id !== itemId),
      } : cart)
      return { previous }
    },
    onError(_error, _itemId, context) {
      if (context?.previous) queryClient.setQueryData(cartKeys.current, context.previous)
    },
    onSuccess(cart) {
      queryClient.setQueryData(cartKeys.current, cart)
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: cartKeys.current })
    },
  })
}

