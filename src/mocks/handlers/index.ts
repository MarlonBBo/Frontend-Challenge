import { authHandlers } from "./auth"
import { cartHandlers } from "./cart"
import { controlHandlers } from "./control"
import { nftHandlers } from "./nfts"
import { quoteHandlers } from "./quotes"
import { realtimeHandlers } from "../realtime"

export const handlers = [...controlHandlers, ...authHandlers, ...nftHandlers, ...cartHandlers, ...quoteHandlers, ...realtimeHandlers]
