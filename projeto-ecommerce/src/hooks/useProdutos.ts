// ============================================================================
// hooks/useProdutos.ts  →  VERSÃO AXIOS.
// Só funções de acesso à API (carregar/criar/atualizar/deletar).
// NÃO tem JSX, NÃO tem useQuery aqui dentro. Quem chama useQuery é a TELA.
// (Mesmo padrão de "useTodos.ts" da aula.)
// ============================================================================

import { Produto } from "@/types/produto.response";
import { api } from "@/utils/api";

export function useProdutos() {
  // GET /products  -> Produto[]  (array direto!)
  const carregar = async (): Promise<Produto[]> => {
    const resposta = await api.get<Produto[]>("/products");
    return resposta.data;
  };

  // GET /products/:id -> Produto
  const carregarUm = async (id: number): Promise<Produto> => {
    const resposta = await api.get<Produto>(`/products/${id}`);
    return resposta.data;
  };

  // POST /products
  const criar = async (produto: Produto) => {
    const resposta = await api.post("/products", produto);
    return resposta.data;
  };

  // PUT /products/:id
  const atualizar = async (produto: Produto) => {
    const resposta = await api.put(`/products/${produto.id}`, produto);
    return resposta.data;
  };

  // DELETE /products/:id
  const deletar = async (id: number) => {
    const resposta = await api.delete(`/products/${id}`);
    return resposta.data;
  };

  return { carregar, carregarUm, criar, atualizar, deletar };
}
