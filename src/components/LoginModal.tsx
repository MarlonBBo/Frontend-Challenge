import { useState, type FormEvent } from "react"
import axios from "axios"
import { Dialog } from "@base-ui/react/dialog"
import { Eye, EyeOff, LogIn, UserRound, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ApiErrorResponse } from "@/contracts"
import { useLogin, useLogout, useSession } from "@/hooks/useAuth"

export function LoginModal({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { data: session } = useSession()
  const login = useLogin()
  const logout = useLogout()
  const isRegister = mode === "register"
  const fieldClass = "h-9 w-full rounded-sm border border-[#D28A4C]/20 bg-transparent px-3 text-xs placeholder:text-[#A58A58] focus-visible:outline-2 focus-visible:outline-[#D28A4C]"

  function changeMode(next: "login" | "register") {
    setMode(next)
    setShowPassword(false)
    login.reset()
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      changeMode("login")
      setPassword("")
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isRegister) return
    login.mutate({ email, password }, { onSuccess: () => handleOpenChange(false) })
  }

  const loginError = axios.isAxiosError<ApiErrorResponse>(login.error) ? login.error.response?.data.message : undefined

  if (session) {
    return <Button type="button" variant={mobile ? "ghost" : "kurio"} disabled={logout.isPending} onClick={() => logout.mutate()} aria-label={mobile ? `Sair da conta de ${session.user.displayName}` : undefined} title={mobile ? session.user.displayName : undefined} className={mobile ? "size-12 rounded-full text-[#E89B55] hover:bg-[#3A230E]" : "h-[35px] w-[100px] gap-2 rounded-md px-2 text-base font-medium"}><UserRound className="size-5" aria-hidden="true" />{!mobile && <span>Sair</span>}</Button>
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger aria-label={mobile ? "Abrir perfil e login" : undefined} render={<Button variant={mobile ? "ghost" : "kurio"} className={mobile ? "size-12 rounded-full text-[#CFB28C] hover:bg-[#3A230E] hover:text-[#E89B55]" : "h-[35px] w-[100px] gap-2 rounded-md px-2 text-base font-medium leading-none"} />}>
        {mobile ? <UserRound className="size-5 fill-current" aria-hidden="true" /> : <><LogIn className="size-5" strokeWidth={1.5} aria-hidden="true" /><span>Entrar</span></>}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/20" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-32px)] w-[440px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border-b-[7px] border-[#D28A4C] bg-[#261812] pb-20 text-[#F5F1EB] shadow-2xl outline-none">
          <Dialog.Close aria-label="Fechar modal" className="absolute top-2 right-2 rounded-sm p-1 text-[#A58A58] hover:text-[#E89B55] focus-visible:outline-2 focus-visible:outline-[#D28A4C]">
            <X className="size-4" aria-hidden="true" />
          </Dialog.Close>

          <div className="px-7 pt-10 sm:px-[70px]">
            <div className="flex items-center justify-center gap-2 text-base tracking-wide">
              <Dialog.Title className="sr-only">{isRegister ? "Criar conta" : "Entrar"}</Dialog.Title>
              <button type="button" aria-pressed={!isRegister} onClick={() => changeMode("login")} className={`rounded-sm focus-visible:outline-2 focus-visible:outline-[#D28A4C] ${!isRegister ? "font-bold text-[#E89B55]" : ""}`}>Entrar</button>
              <span aria-hidden="true" className="text-[#CFB28C]">|</span>
              <button type="button" aria-pressed={isRegister} onClick={() => changeMode("register")} className={`rounded-sm focus-visible:outline-2 focus-visible:outline-[#D28A4C] ${isRegister ? "font-bold text-[#E89B55]" : ""}`}>Criar conta</button>
            </div>
            <Dialog.Description className="mt-8 text-center text-[11px] leading-4 text-[#CFB28C]">
              {isRegister ? "Crie seu perfil de colecionador e conecte uma carteira quando quiser." : "Entre para gerenciar sua carteira, coleção e perfil de criador."}
            </Dialog.Description>

            <form onSubmit={handleSubmit}>
            <div key={mode} className="mt-5 space-y-3">
              {isRegister && <div>
                <Label htmlFor="register-username" className="sr-only">Nome de usuário</Label>
                <Input id="register-username" autoComplete="username" placeholder="Nome de usuário" className={fieldClass} />
              </div>}
              <Label htmlFor="login-email" className="sr-only">E-mail</Label>
              <Input id="login-email" name="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={isRegister ? "Digite seu e-mail" : "contato@email.com"} className={fieldClass} />
              <div className="relative">
                <Label htmlFor="login-password" className="sr-only">Senha</Label>
                <Input id="login-password" name="password" type={showPassword ? "text" : "password"} required autoComplete={isRegister ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isRegister ? "Senha" : "***********"} className={`${fieldClass} pr-10`} />
                <button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="absolute top-0 right-0 grid size-9 place-items-center text-[#A58A58] focus-visible:outline-2 focus-visible:outline-[#D28A4C]">
                  {showPassword ? <Eye className="size-4" aria-hidden="true" /> : <EyeOff className="size-4" aria-hidden="true" />}
                </button>
              </div>
              {isRegister && <div>
                <Label htmlFor="register-password-confirmation" className="sr-only">Confirmar senha</Label>
                <Input id="register-password-confirmation" type="password" autoComplete="new-password" placeholder="Confirmar senha" className={fieldClass} />
              </div>}
            </div>
            {!isRegister && <button type="button" disabled title="Recuperação de senha em breve" className="mt-2 block w-full text-right text-xs text-[#D28A4C]">Esqueceu a senha?</button>}
            {loginError && <p role="alert" className="mt-3 text-xs text-[#E8794C]">{loginError}</p>}
            <Button type="submit" disabled={isRegister || login.isPending} variant="kurio" className="mt-5 h-10 w-full rounded-sm text-sm font-bold disabled:opacity-60">{isRegister ? "Cadastro em breve" : login.isPending ? "Entrando..." : "Entrar"}</Button>
            </form>
          </div>

          <div className="relative mt-7 border-t border-[#D28A4C]/10">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#261812] px-3 text-[11px] text-[#CFB28C]">Ou continue com</span>
          </div>
          <div className="mt-5 space-y-2 px-7 sm:px-[70px]">
            <Button disabled variant="ghost" className="h-9 w-full gap-2 rounded-sm border border-[#D28A4C]/20 text-[11px] text-[#CFB28C] disabled:opacity-100">
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 2.9-4.3 2.9-7.4" />
                <path fill="#34A853" d="M12 22c2.7 0 5-1 6.7-2.4l-3.3-2.5c-.9.6-2 1-3.4 1-2.6 0-4.9-1.8-5.7-4.2H2.9v2.6A10 10 0 0 0 12 22" />
                <path fill="#FBBC05" d="M6.3 13.9a6 6 0 0 1 0-3.8V7.5H2.9a10 10 0 0 0 0 9z" />
                <path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.7 9.7 0 0 0 12 2a10 10 0 0 0-9.1 5.5l3.4 2.6A6 6 0 0 1 12 5.9" />
              </svg>
              Continuar com Google
            </Button>
            <Button disabled variant="ghost" className="h-9 w-full gap-2 rounded-sm border border-[#D28A4C]/20 text-[11px] text-[#CFB28C] disabled:opacity-100">
              <svg viewBox="0 0 24 24" className="size-5 fill-[#4267B2]" aria-hidden="true"><path d="M14 22v-9h3l.5-4H14V7c0-1 .3-2 2-2h2V1h-3c-4 0-6 2-6 6v2H6v4h3v9z" /></svg>
              Continuar com Facebook
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
