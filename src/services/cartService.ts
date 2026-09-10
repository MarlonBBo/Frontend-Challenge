import type { AddCartItemRequest, Cart, UpdateCartItemRequest } from "@/contracts"
import { api } from "@/lib/api"

export const cartService = {
  async get() {
    const response = await api.get<Cart>("/cart")
    return response.data
  },

  async addItem(item: AddCartItemRequest) {
    const response = await api.post<Cart>("/cart/items", item)
    return response.data
  },

  async updateItem(itemId: string, update: UpdateCartItemRequest) {
    const response = await api.patch<Cart>(`/cart/items/${itemId}`, update)
    return response.data
  },

  async removeItem(itemId: string) {
    const response = await api.delete<Cart>(`/cart/items/${itemId}`)
    return response.data
  },
}

