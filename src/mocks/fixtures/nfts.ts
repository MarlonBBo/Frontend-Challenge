import emerald from "@/assets/8459204731e6eba9d474cbc8ebc37071360d3ba5 (1).png"
import nomad from "@/assets/2986a7cb16d09de8970824d2dd58bf0bb021702c.png"
import golden from "@/assets/87580f2def9af0ce13f4b6f6ce17bb2449bcfc16.png"
import neon from "@/assets/9df2ff42dd27ba657621c304557d1a855a4be6a5.png"
import type { BlockchainNetwork, Nft } from "@/contracts"

export const categoryFixture = ["Arte digital", "Fotografia", "Música", "Arte 3D", "Colecionáveis", "Generativa", "Jogos", "Assinaturas", "Utilidade"]

const originals = [
  { name: "Emerald Ape", tokenId: "0042", imageUrl: emerald, priceEth: "1.19", attributes: ["Óculos", "Esmeralda", "Raro"] },
  { name: "Sage Nomad", tokenId: "0009", imageUrl: nomad, priceEth: "1.69", attributes: ["Chapéu", "Violeta", "Nômade"] },
  { name: "Neon Vessel", tokenId: "0552", imageUrl: neon, priceEth: "1.99", previousPriceEth: "2.29", attributes: ["Neon", "Retrato", "Raro"] },
  { name: "Cosmic Bloom", tokenId: "0118", imageUrl: nomad, priceEth: "1.29", attributes: ["Cósmico", "Retrato"] },
  { name: "Violet Nomad", tokenId: "0314", imageUrl: nomad, priceEth: "1.39", attributes: ["Chapéu", "Violeta"] },
  { name: "Ivory Baron", tokenId: "0088", imageUrl: neon, priceEth: "1.79", attributes: ["Marfim", "Barão"] },
  { name: "Golden Beat", tokenId: "0207", imageUrl: golden, priceEth: "0.99", attributes: ["Dourado", "Fones"] },
  { name: "Golden Echo", tokenId: "0215", imageUrl: golden, priceEth: "0.79", attributes: ["Dourado", "Eco"] },
  { name: "Golden Signal", tokenId: "0160", imageUrl: golden, priceEth: "0.39", attributes: ["Dourado", "Sinal"] },
] as const

const networks: BlockchainNetwork[] = ["ethereum", "polygon", "solana"]

export const nftFixture: Nft[] = Array.from({ length: 36 }, (_, index) => {
  const original = originals[index % originals.length]
  const tokenNumber = Number(original.tokenId) + Math.floor(index / originals.length) * 600

  return {
    id: String(index),
    tokenId: String(tokenNumber).padStart(4, "0"),
    name: original.name,
    collectionId: "kurio-apes",
    collectionName: "Kurio Apes",
    category: categoryFixture[index < 9 ? 0 : 1 + (index % 8)],
    description: "Colecionável digital finalizado à mão da coleção Kurio Editions.",
    imageUrl: original.imageUrl,
    network: networks[index % networks.length],
    priceEth: original.priceEth,
    ...("previousPriceEth" in original ? { previousPriceEth: original.previousPriceEth } : {}),
    editions: [
      { id: `${index}-1-1`, label: "1/1", availableQuantity: 1, maxPerOrder: 1 },
      { id: `${index}-1-10`, label: "1/10", availableQuantity: 10, maxPerOrder: 10 },
      { id: `${index}-1-50`, label: "1/50", availableQuantity: 50, maxPerOrder: 50 },
      { id: `${index}-open`, label: "ABERTA", availableQuantity: 99, maxPerOrder: 99 },
    ],
    attributes: original.attributes.map((value) => ({ trait: "Atributo", value })),
    trending: index % 2 === 0,
    createdAt: new Date(Date.UTC(2026, 0, 1 + index)).toISOString(),
    version: 1,
  }
})
