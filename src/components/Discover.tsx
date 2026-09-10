import { ArrowRight } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import emerald from "@/assets/8459204731e6eba9d474cbc8ebc37071360d3ba5 (1).png"
import nomad from "@/assets/2986a7cb16d09de8970824d2dd58bf0bb021702c.png"
import golden from "@/assets/87580f2def9af0ce13f4b6f6ce17bb2449bcfc16.png"
import neon from "@/assets/9df2ff42dd27ba657621c304557d1a855a4be6a5.png"

const promotions = [
  {
    title: "Lançamentos gênesis de edição limitada",
    description: "Colecione edições escassas diretamente dos criadores antes da revelação pública.",
    image: emerald,
  },
  {
    title: "Arte digital selecionada e muito mais",
    description: "Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.",
    image: neon,
  },
]

const articles = [
  {
    title: "Como funciona a propriedade de NFTs",
    description: "Aprenda a colecionar, negociar e verificar ativos digitais.",
    date: "12 de setembro",
    minutes: 6,
    image: neon,
  },
  {
    title: "10 artistas digitais para acompanhar",
    description: "Conheça criadores que moldam a cultura digital.",
    date: "13 de setembro",
    minutes: 2,
    image: emerald,
  },
  {
    title: "Raridade, atributos e procedência",
    description: "Entenda raridade, procedência, direitos autorais e utilidade.",
    date: "15 de setembro",
    minutes: 3,
    image: nomad,
  },
  {
    title: "Como proteger sua carteira",
    description: "Proteja sua carteira, seus ativos e sua identidade.",
    date: "15 de setembro",
    minutes: 2,
    image: golden,
  },
]

export function Discover({ section = "all" }: { section?: "all" | "promotions" | "journal" }) {
  return (
    <div className="mx-auto mt-20 w-full max-w-[1200px] pb-3 text-[#F5F1EB]">
      {section !== "journal" && <section aria-label="Coleções em destaque" className="grid gap-6 xl:grid-cols-2">
        {promotions.map((promotion) => (
          <article key={promotion.title} className="grid overflow-hidden bg-[#261812] sm:grid-cols-2">
            <div className="relative overflow-hidden rounded-[20px]">
              <img src={promotion.image} alt="" width={290} height={250} loading="lazy" className="h-full min-h-[250px] w-full object-cover" />
              <span aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-40 size-60 rounded-full border-[3px] border-double border-[#D28A4C]" />
            </div>
            <div className="flex flex-col items-end justify-center px-6 py-7 text-right">
              <h2 className="text-lg font-bold leading-6">{promotion.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#CFB28C]">{promotion.description}</p>
              <Button
                variant="kurio"
                className="mt-1 h-10 gap-1 rounded-md px-6 text-sm tracking-normal"
                render={<Link to="/mercado" />}
                nativeButton={false}
                aria-label={`Explorar: ${promotion.title}`}
              >
                Explorar <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </article>
        ))}
      </section>}

      {section !== "promotions" && <section id="aprenda" aria-labelledby="journal-title" className={section === "all" ? "mt-24" : ""}>
        <header className="text-center">
          <h2 id="journal-title" className="text-[28px] font-bold leading-9">Diário da Cunhagem</h2>
          <p className="mt-3 text-sm leading-6 text-[#CFB28C]">Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.</p>
        </header>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {articles.map((article) => (
            <article key={article.title} className="flex flex-col overflow-hidden rounded-lg bg-[#261812]">
              <img src={article.image} alt="" width={270} height={196} loading="lazy" className="aspect-[270/196] w-full object-cover" />
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs leading-4 text-[#CFB28C]">{article.date} <span aria-hidden="true"> | </span> Leitura de {article.minutes} min</p>
                <h3 className="mt-2 text-base font-bold leading-[22px]">{article.title}</h3>
                <p className="mt-2 text-xs leading-4 text-[#CFB28C]">{article.description}</p>
                {/* Ativar quando as páginas dos artigos estiverem disponíveis. */}
                <button type="button" disabled title="Artigo em breve" className="mt-auto flex items-center gap-1 self-start pt-2 text-xs font-medium text-[#E89B55] disabled:cursor-not-allowed">
                  Ler mais <ArrowRight className="size-3" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>}
    </div>
  )
}
