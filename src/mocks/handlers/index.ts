import { authHandlers } from "./auth"
import { cartHandlers } from "./cart"
import { controlHandlers } from "./control"
import { nftHandlers } from "./nfts"

export const handlers = [...controlHandlers, ...authHandlers, ...nftHandlers, ...cartHandlers]
