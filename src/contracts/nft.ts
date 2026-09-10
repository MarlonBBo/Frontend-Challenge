import type { DecimalString, EntityId, IsoDateString, PaginatedResponse } from "./api"

export type BlockchainNetwork = "ethereum" | "polygon" | "solana"
export type NftSort = "recent" | "price_asc" | "price_desc"
export type CatalogTab = "all" | "recent" | "trending"

export interface NftAttribute {
  trait: string
  value: string
}

export interface NftEdition {
  id: EntityId
  label: string
  availableQuantity: number
  maxPerOrder: number
}

export interface Nft {
  id: EntityId
  tokenId: string
  name: string
  collectionId: EntityId
  collectionName: string
  category: string
  description: string
  imageUrl: string
  network: BlockchainNetwork
  priceEth: DecimalString
  previousPriceEth?: DecimalString
  editions: NftEdition[]
  attributes: NftAttribute[]
  trending: boolean
  createdAt: IsoDateString
  version: number
}

export interface ListNftsParams {
  search?: string
  collectionId?: EntityId
  category?: string
  network?: BlockchainNetwork
  tab?: CatalogTab
  minPrice?: DecimalString
  maxPrice?: DecimalString
  sort?: NftSort
  page: number
  pageSize: number
}

export interface CatalogFacet {
  value: string
  label: string
  count: number
}

export interface ListNftsResponse extends PaginatedResponse<Nft> {
  facets: {
    categories: CatalogFacet[]
    networks: CatalogFacet[]
  }
}
export type GetNftResponse = Nft
