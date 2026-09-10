import emerald from "@/assets/8459204731e6eba9d474cbc8ebc37071360d3ba5 (1).png"
import nomad from "@/assets/2986a7cb16d09de8970824d2dd58bf0bb021702c.png"
import golden from "@/assets/87580f2def9af0ce13f4b6f6ce17bb2449bcfc16.png"
import neon from "@/assets/9df2ff42dd27ba657621c304557d1a855a4be6a5.png"

export const collections = ["Arte digital", "Fotografia", "Música", "Arte 3D", "Colecionáveis", "Generativa", "Jogos", "Assinaturas", "Utilidade"]
export const networks = ["Ethereum", "Polygon", "Solana"]
const originals = [
  { name: "Emerald Ape", number: 42, image: emerald, price: 1.19 },
  { name: "Sage Nomad", number: 9, image: nomad, price: 1.69 },
  { name: "Neon Vessel", number: 552, image: neon, price: 1.99, previous: 2.29 },
  { name: "Cosmic Bloom", number: 118, image: nomad, price: 1.29 },
  { name: "Violet Nomad", number: 314, image: nomad, price: 1.39 },
  { name: "Ivory Baron", number: 88, image: neon, price: 1.79 },
  { name: "Golden Beat", number: 207, image: golden, price: 0.99 },
  { name: "Golden Echo", number: 215, image: golden, price: 0.79 },
  { name: "Golden Signal", number: 160, image: golden, price: 0.39 },
]

// Dados demonstrativos compartilhados pelo catálogo e pela página de detalhes.
export const nfts = Array.from({ length: 36 }, (_, index) => ({
  ...originals[index % originals.length],
  id: index,
  collectionName: "Kurio Apes",
  number: originals[index % originals.length].number + Math.floor(index / 9) * 600,
  collection: collections[index < 9 ? 0 : 1 + (index % 8)],
  network: networks[index % 3],
  trending: index % 2 === 0,
  recent: index % 3 === 0,
}))

export type Nft = (typeof nfts)[number]
