import type { EntityId, IsoDateString } from "./api"
import type { BlockchainNetwork } from "./nft"

export type WalletProvider = "metamask" | "walletconnect" | "coinbase"
export type WalletConnectionStatus = "disconnected" | "connecting" | "connected" | "declined"

export interface Wallet {
  id: EntityId
  userId: EntityId
  label: string
  address: string
  ensName?: string
  provider: WalletProvider
  network: BlockchainNetwork
  primary: boolean
  createdAt: IsoDateString
  updatedAt: IsoDateString
}

export interface CreateWalletRequest {
  label: string
  address: string
  ensName?: string
  provider: WalletProvider
  network: BlockchainNetwork
  primary: boolean
}

export type UpdateWalletRequest = Partial<CreateWalletRequest>

export interface ListWalletsResponse {
  items: Wallet[]
}

export type CreateWalletResponse = Wallet
export type UpdateWalletResponse = Wallet

export interface ConnectWalletRequest {
  network: BlockchainNetwork
}

export interface ConnectWalletResponse {
  walletId: EntityId
  status: WalletConnectionStatus
}

