/** Identificador opaco fornecido pela API. */
export type EntityId = string

/** Valor decimal serializado. Valores monetários nunca trafegam como number. */
export type DecimalString = string

/** Data serializada no formato ISO 8601. */
export type IsoDateString = string

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "OUT_OF_STOCK"
  | "COUPON_INVALID"
  | "COUPON_EXPIRED"
  | "QUOTE_EXPIRED"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"

export interface ApiErrorResponse {
  code: ApiErrorCode
  message: string
  fieldErrors?: Record<string, string[]>
  retryable: boolean
  requestId: string
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

