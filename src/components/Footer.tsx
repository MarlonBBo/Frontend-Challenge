import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const features = [
  { letter: "W", title: "Segurança da carteira", description: "Proteja sua carteira e colecione arte digital verificada com confiança." },
  { letter: "C", title: "Criadores em destaque", description: "Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede." },
  { letter: "D", title: "Alertas de lançamentos", description: "Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado." },
]
const groups = [
  { title: "Meu perfil", items: ["Meu perfil", "Minha coleção", "Atividade", "Estúdio do criador", "Lista de interesse"] },
  { title: "Central de ajuda", items: ["Central de ajuda", "Como comprar NFTs", "Carteira e segurança", "Política do mercado", "Denunciar item"] },
  { title: "Coleções", items: ["Arte digital", "Fotografia", "Música", "Arte 3D", "Utilidade"] },
]
const socials = [
  { name: "Facebook", path: "M14 22v-9h3l.5-4H14V7c0-1 .3-2 2-2h2V1h-3c-4 0-6 2-6 6v2H6v4h3v9z" },
  { name: "Instagram", path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M18 6h.01" },
  { name: "Twitter", path: "M22 5a8 8 0 0 1-2.4.7A4.2 4.2 0 0 0 21.4 3a8 8 0 0 1-2.7 1A4.2 4.2 0 0 0 11.5 8a12 12 0 0 1-8.7-4.4 4.2 4.2 0 0 0 1.3 5.6L2 8.6a4.2 4.2 0 0 0 3.4 4.2l-1.9.1a4.2 4.2 0 0 0 3.9 2.9A8.4 8.4 0 0 1 2 17.5 12 12 0 0 0 20.5 7.3z" },
  { name: "LinkedIn", path: "M4 9v12 M4 4v.01 M10 21V9 M10 14c0-6 10-6 10 0v7" },
  { name: "YouTube", path: "M5 4h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z M10 8l6 4-6 4z" },
]

export function Footer() {
  const [notice, setNotice] = useState("")

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice("Cadastro em breve. Seu e-mail ainda não foi enviado ou armazenado.")
  }

  return (
    <footer className="mx-auto mt-20 w-full max-w-[1200px] bg-[#261812] text-[#F5F1EB]">
      <div className="grid gap-6 px-8 pt-8 pb-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.35fr] xl:gap-0">
        {features.map((feature) => (
          <section key={feature.letter} className="xl:mr-4 xl:border-r xl:border-[#D28A4C]/60 xl:pr-4">
            <span aria-hidden="true" className="mb-3 grid size-[74px] place-items-center rounded-full bg-[#D28A4C] text-2xl font-bold text-[#140D0A]">{feature.letter}</span>
            <h2 className="text-base font-bold leading-5">{feature.title}</h2>
            <p className="mt-2 max-w-[220px] text-sm leading-[22px] text-[#CFB28C]">{feature.description}</p>
          </section>
        ))}
        <section aria-labelledby="newsletter-title">
          <h2 id="newsletter-title" className="max-w-[260px] text-base font-bold leading-4">Antecipe-se ao próximo lançamento</h2>
          <form className="mt-4 flex" onSubmit={handleSubscribe}>
            <Label htmlFor="newsletter-email" className="sr-only">Seu e-mail</Label>
            <Input id="newsletter-email" name="email" type="email" autoComplete="email" required placeholder="digite seu e-mail..." className="h-10 min-w-0 flex-1 rounded-l-md rounded-r-none border-0 bg-[#3A230E] px-3 text-sm text-[#F5F1EB] shadow-none placeholder:text-[#A58A58] focus-visible:ring-[#D28A4C]/50" />
            <Button type="submit" variant="kurio" className="h-10 rounded-l-none rounded-r-md px-4 text-base font-bold">Enviar</Button>
          </form>
          <p className="mt-3 text-xs leading-[22px] text-[#CFB28C]">Receba lançamentos selecionados, histórias de criadores e novidades do mercado.</p>
          <p role="status" className="mt-2 text-xs leading-5 text-[#E89B55]">{notice}</p>
        </section>
      </div>

      <div className="grid items-center gap-5 bg-[#3A230E] px-8 py-6 text-sm leading-[22px] sm:grid-cols-2 xl:grid-cols-4">
        <span className="font-bold tracking-[0.1em]">KURIO</span>
        <p>Feito para colecionadores,<br />criadores e cultura</p>
        <span>contato@email.com</span>
        <span>+55 11 4002 8922</span>
      </div>

      <div className="grid gap-8 px-8 py-8 sm:grid-cols-2 xl:grid-cols-4">
        {groups.map((group) => (
          <section key={group.title} aria-label={group.title}>
            <h2 className="mb-3 text-lg font-bold">{group.title}</h2>
            <ul className="space-y-2 text-sm leading-[22px]">
              {group.items.map((item) => (
                <li key={item}>
                  {/* Destinos serão conectados quando essas páginas existirem. */}
                  <button type="button" disabled title="Em breve" className="text-left disabled:cursor-not-allowed">{item}</button>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <div>
          <section aria-label="Redes sociais">
            <h2 className="mb-3 text-lg font-bold">Redes sociais</h2>
            <div className="flex flex-wrap gap-2">
              {socials.map(({ name, path }) => (
                <button key={name} type="button" disabled aria-label={`${name} — em breve`} title={`${name} — em breve`} className="grid size-8 place-items-center rounded border border-[#D28A4C] text-[#D28A4C] disabled:cursor-not-allowed">
                  <svg viewBox="0 0 24 24" className="size-5" fill={name === "Facebook" || name === "Twitter" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg>
                </button>
              ))}
            </div>
          </section>
          <section aria-label="Carteiras compatíveis" className="mt-7">
            <h2 className="mb-2 text-lg font-bold">Carteiras compatíveis</h2>
            <p className="inline-block rounded-md border border-[#D28A4C]/20 bg-[#3A230E] px-2 py-1.5 text-[9px] font-medium text-[#E89B55]">METAMASK · WALLETCONNECT · COINBASE</p>
          </section>
        </div>
      </div>
      <p className="bg-[#140D0A] px-4 py-3 text-center text-sm">© 2026 Kurio. Propriedade digital para todos.</p>
    </footer>
  )
}
