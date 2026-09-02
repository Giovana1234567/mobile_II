// ============================================================================
// hooks/useAuth.ts  →  fluxo de autenticação básico.
// login  -> chama a API, guarda o token EM MEMÓRIA (interceptor) + SEGURO (SecureStore).
// logout -> limpa os dois.
// ============================================================================

import { LoginRequest, LoginResponse } from "@/types/produto.response";
import { api, definirToken } from "@/utils/api";
import { limparToken, salvarToken } from "@/utils/sessao";

export function useAuth() {
  // POST /auth/login  { username, password }  ->  { token }
  // Usuário de teste da fakestoreapi:  mor_2314 / 83r5^_
  const login = async (credenciais: LoginRequest): Promise<string> => {
    const resposta = await api.post<LoginResponse>("/auth/login", credenciais);
    const token = resposta.data.token;

    definirToken(token); // memória: interceptor passa a enviar o token
    await salvarToken(token); // disco (criptografado): sobrevive a fechar o app
    return token;
  };

  const logout = async () => {
    definirToken(null);
    await limparToken();
  };

  return { login, logout };
}
