// ============================================================================
// utils/api.ts  →  PRIMEIRO arquivo a ser criado no projeto.
// Responsabilidade única: criar a INSTÂNCIA do Axios e registrar os INTERCEPTORS.
// Nenhuma tela e nenhum hook conversa com a API sem passar por aqui.
// (Mesmo padrão de "revisao-pre-ava1/src/utils/api.ts", só trocando a baseURL.)
// ============================================================================

import axios from "axios";

// ----------------------------------------------------------------------------
// 1) Instância: centraliza a URL base. Assim os hooks chamam só "/products".
//    CUIDADO: baseURL SEM barra no final -> "https://fakestoreapi.com"
// ----------------------------------------------------------------------------
export const api = axios.create({
  baseURL: "https://fakestoreapi.com",
  timeout: 10000, // 10s: se a API não responder, cai no catch em vez de travar
});

// ----------------------------------------------------------------------------
// 2) Token da sessão.
//    Na prova/aula guardamos em memória (variável do módulo). Simples e suficiente.
//    Em produção: expo-secure-store ou AsyncStorage (ver Arquivo 1 - teoria).
// ----------------------------------------------------------------------------
let tokenSessao: string | null = null;

export function definirToken(token: string | null) {
  tokenSessao = token;
}

// ----------------------------------------------------------------------------
// 3) Interceptor de REQUISIÇÃO: roda ANTES de toda chamada sair.
//    Uso clássico: anexar o token de autenticação no cabeçalho.
//    REGRA DE OURO: sempre retornar o "config" no final, senão a request morre.
// ----------------------------------------------------------------------------
api.interceptors.request.use((config) => {
  console.log("[REQ]", config.method?.toUpperCase(), config.url);

  if (tokenSessao) {
    config.headers.Authorization = `Bearer ${tokenSessao}`;
  }

  return config; // <- obrigatório
});

// ----------------------------------------------------------------------------
// 4) Interceptor de RESPOSTA: roda DEPOIS que a API responde.
//    1º argumento = deu certo (2xx). 2º argumento = deu erro.
//    Aqui padronizamos a mensagem de erro para as telas exibirem algo legível.
// ----------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const mensagem =
      error.response?.data?.message ||
      (status ? `Erro ${status} na requisição` : "Falha de conexão");

    console.log("[ERRO]", mensagem);
    return Promise.reject(new Error(mensagem)); // repassa o erro tratado
  }
);
