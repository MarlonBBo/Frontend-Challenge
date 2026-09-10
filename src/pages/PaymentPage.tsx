import type { ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { nfts } from "@/data/nfts"

const inputClass = "h-10 w-full rounded-sm border border-[#D28A4C]/25 bg-transparent px-3 text-sm text-[#CFB28C] placeholder:text-[#A58A58] disabled:opacity-100"
const items = [
  { nft: nfts[0], quantity: 2, subtotal: "2.38" },
  { nft: nfts[4], quantity: 6, subtotal: "8.34" },
  { nft: nfts[5], quantity: 9, subtotal: "16.11" },
]

function Field({ id, label, required = false, children }: { id: string; label: string; required?: boolean; children?: ReactNode }) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1 block text-sm leading-5">
        {label}{required && <span aria-hidden="true" className="ml-0.5 text-xl leading-none text-[#E8794C]">*</span>}
      </Label>
      {children ?? <Input id={id} disabled aria-required={required} className={inputClass} />}
    </div>
  )
}

function SelectPreview({ id, text, compact = false }: { id: string; text: string; compact?: boolean }) {
  return (
    <div className={`relative ${compact ? "w-[78px]" : "w-full"}`}>
      <select id={id} disabled defaultValue="" className={`${inputClass} appearance-none pr-8`}>
        <option value="">{text}</option>
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-3 right-2 size-4 text-[#A58A58]" />
    </div>
  )
}

export function PaymentPage() {
  return (
    <div className="mx-auto mt-8 w-full max-w-[1200px] pb-8 text-[#F5F1EB]">
      <h1 className="sr-only">Pagamento</h1>
      <nav aria-label="Caminho de navegação" className="mb-7 flex flex-wrap gap-2 text-sm font-bold">
        <Link to="/" className="hover:text-[#E89B55]">Início</Link><span aria-hidden="true">/</span>
        <Link to="/mercado" className="hover:text-[#E89B55]">Mercado</Link><span aria-hidden="true">/</span>
        <span aria-current="page">Pagamento</span>
      </nav>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <section aria-labelledby="collector-title">
          <h2 id="collector-title" className="mb-3 text-base font-bold">Perfil do colecionador</h2>
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <Field id="payment-display-name" label="Nome de exibição" required />
            <Field id="payment-username" label="Nome de usuário" required />
            <Field id="payment-network" label="Rede" required><SelectPreview id="payment-network" text="Selecione uma rede" /></Field>
            <Field id="payment-profile-name" label="Nome do perfil" required />
            <Field id="payment-wallet-address" label="Endereço da carteira" required><Input id="payment-wallet-address" disabled aria-required="true" placeholder="Endereço 0x da carteira" className={inputClass} /></Field>
            <div className="self-end">
              <Label htmlFor="payment-secondary-wallet" className="sr-only">ENS ou carteira secundária (opcional)</Label>
              <Input id="payment-secondary-wallet" disabled placeholder="ENS ou carteira secundária (opcional)" className={inputClass} />
            </div>
            <Field id="payment-wallet-type" label="Tipo de carteira" required><SelectPreview id="payment-wallet-type" text="Selecione uma carteira" /></Field>
            <Field id="payment-referral" label="Código de indicação" required />
            <Field id="payment-email" label="E-mail" required><Input id="payment-email" type="email" disabled aria-required="true" className={inputClass} /></Field>
            <Field id="payment-ens" label="Nome ENS" required><SelectPreview id="payment-ens" text=".eth" compact /></Field>
          </div>

          <label className="mt-6 flex items-center gap-2 text-sm">
            <input type="checkbox" disabled className="size-3.5 appearance-none rounded-full border-2 border-[#D28A4C]" />
            Usar outra carteira?
          </label>
          <div className="mt-6 sm:max-w-[46%]">
            <Label htmlFor="payment-note" className="mb-2 block text-sm">Observação do colecionador (opcional)</Label>
            <Textarea id="payment-note" disabled className="h-[150px] w-full resize-none rounded-sm border border-[#D28A4C]/25 bg-transparent p-3 text-sm disabled:opacity-100" />
          </div>
        </section>

        <section aria-labelledby="payment-summary-title">
          <h2 id="payment-summary-title" className="text-base font-bold">Seus NFTs</h2>
          <div className="mt-2 flex justify-between border-b border-[#D28A4C]/20 pb-2 text-sm font-bold"><span>NFTs</span><span>Subtotal</span></div>
          <ul className="mt-3 space-y-3">
            {items.map(({ nft, quantity, subtotal }) => (
              <li key={nft.id} className="grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-2 bg-[#261812] p-1">
                <img src={nft.image} alt="" width={66} height={66} className="row-span-2 size-[52px] rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold">{nft.name} #{String(nft.number).padStart(3, "0")}</h3>
                  <p className="mt-1 text-[10px] text-[#A58A58]">ID do token: #{String(nft.number).padStart(4, "0")}</p>
                </div>
                <span className="whitespace-nowrap text-xs text-[#CFB28C]">(× {quantity})</span>
                <span className="col-start-2 col-end-4 pr-1 text-right text-sm font-bold whitespace-nowrap text-[#E89B55]">{subtotal} ETH</span>
              </li>
            ))}
          </ul>
          <button type="button" disabled className="mt-3 block w-full text-center text-xs">Tem um código promocional? Aplique aqui</button>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt>Subtotal</dt><dd className="text-base">26.83 ETH</dd></div>
            <div className="flex justify-between gap-3"><dt>Desconto do lançamento</dt><dd>(-) 00.00</dd></div>
            <div className="flex justify-between gap-3"><dt>Taxa de rede</dt><dd className="text-base">0.016 ETH</dd></div>
          </dl>
          <p className="mt-3 text-center text-xs text-[#E89B55]">Taxa estimada</p>
          <div className="mt-3 flex justify-between gap-3 border-t border-[#D28A4C]/30 px-10 pt-2 font-bold"><span>Total</span><span className="whitespace-nowrap text-[#E89B55]">26.846 ETH</span></div>

          <fieldset className="mt-2">
            <legend className="mb-4 w-full text-center text-base font-bold">Carteira e rede</legend>
            <div className="space-y-4">
              {['Carteiras compatíveis', 'MetaMask', 'Coinbase Wallet'].map((wallet, index) => (
                <label key={wallet} className={`flex min-h-11 items-center gap-3 rounded-sm border px-3 py-2 text-sm ${index === 2 ? "border-[#D28A4C]" : "border-[#D28A4C]/25"}`}>
                  <input type="radio" name="payment-wallet" disabled defaultChecked={index === 2} aria-label={wallet} className="size-4 shrink-0 appearance-none rounded-full border border-[#D28A4C] checked:bg-[#D28A4C] checked:shadow-[inset_0_0_0_2px_#140D0A]" />
                  {index === 0 ? <span className="rounded-md border border-[#D28A4C]/20 bg-[#3A230E] px-2 py-1 text-[9px] text-[#E89B55]">METAMASK · WALLETCONNECT · COINBASE</span> : <span>{wallet}</span>}
                </label>
              ))}
            </div>
          </fieldset>
          <Button disabled variant="kurio" className="mt-6 h-11 w-full rounded-md font-bold disabled:opacity-100">Confirmar compra</Button>
        </section>
      </div>
    </div>
  )
}
