import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { LoginRequest } from "@/contracts"
import { authService } from "@/services/authService"

export const authKeys = {
  session: ["session"] as const,
}

const privateQueryRoots = new Set(["favorites", "orders", "profile", "wallets"])

export function useSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: authService.getSession,
    staleTime: 60_000,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess(session) {
      queryClient.setQueryData(authKeys.session, session)
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess() {
      queryClient.setQueryData(authKeys.session, null)
      queryClient.removeQueries({
        predicate: (query) => privateQueryRoots.has(String(query.queryKey[0])),
      })
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}
