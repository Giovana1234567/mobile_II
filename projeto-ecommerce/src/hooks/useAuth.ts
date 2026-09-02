// ============================================================================
// hooks/useAuth.ts  →  fluxo de autenticação básico.
// Só a função de acesso à API. A tela de login é quem chama isto.
// ============================================================================

import { LoginRequest, LoginResponse } from "@/types/produto.response";
import { api, definirToken } from "@/utils/api";

export function useAuth() {
  // POST /auth/login  { username, password }  ->  { token }
  // Usuário de teste da fakestoreapi:  mor_2314 / 83r5^_
  const login = async (credenciais: LoginRequest): Promise<string> => {
    const resposta = await api.post<LoginResponse>("/auth/login", credenciais);
    const token = resposta.data.token;

    definirToken(token); // guarda o token -> interceptor passa a enviá-lo
    return token;
  };

  const logout = () => {
    definirToken(null);
  };

  return { login, logout };
}
