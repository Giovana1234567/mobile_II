// ============================================================================
// hooks/useProdutosFetch.ts  →  VERSÃO fetch (a "nativa" do JavaScript).
// MESMA INTERFACE do useProdutos.ts (carregar/criar/...), de propósito:
// a tela troca de versão mudando só 1 import. Serve para comparar as duas
// abordagens (é o que a aula fez com useProdutosFetch x useProdutosAxios).
// ============================================================================

import { Produto } from "@/types/produto.response";

const BASE = "https://fakestoreapi.com";

export function useProdutosFetch() {
  // Com fetch: NÃO existe baseURL, NÃO existe interceptor, NÃO lança erro
  // sozinho em status 4xx/5xx. Tudo isso é manual.
  const carregar = async (): Promise<Produto[]> => {
    const resposta = await fetch(`${BASE}/products`);

    if (!resposta.ok) {
      throw new Error("Erro ao carregar produtos!"); // checagem manual
    }

    return await resposta.json(); // parse manual do JSON
  };

  const criar = async (produto: Produto) => {
    const resposta = await fetch(`${BASE}/products`, {
      method: "POST",
      body: JSON.stringify(produto), // serialização manual
      headers: { "Content-Type": "application/json" }, // header manual
    });

    if (!resposta.ok) {
      throw new Error("Erro ao cadastrar produto!");
    }

    return await resposta.json();
  };

  return { carregar, criar };
}
