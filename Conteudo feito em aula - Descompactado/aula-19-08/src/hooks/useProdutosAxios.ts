import { apiDummyJson } from "@/utils/api";

export interface Produto {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
}

export interface RespostaProdutos {
  products: Produto[];
}

export function useProdutosAxios() {
  const carregar = async () => {
    const resposta = await apiDummyJson.get<RespostaProdutos>("/products");
    return resposta.data;
  };

  const criar = async (produto: Produto) => {
    return await apiDummyJson.post("/products/add", produto);
  };

  return {
    carregar,
    criar,
  };
}
