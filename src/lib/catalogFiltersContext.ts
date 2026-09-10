import { createContext } from "react"

export const CatalogFiltersContext = createContext({
  open: false,
  setOpen: (_open: boolean) => { void _open },
})
