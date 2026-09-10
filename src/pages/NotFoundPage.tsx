import { Link } from "@tanstack/react-router"

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-[1200px] py-24 text-center text-[#F5F1EB]">
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <p className="mt-4 text-[#CFB28C]">O endereço que você acessou não existe.</p>
      <Link to="/" className="mt-6 inline-block text-[#E89B55] underline">Voltar ao início</Link>
    </section>
  )
}
