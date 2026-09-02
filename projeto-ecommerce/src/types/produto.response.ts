// ============================================================================
// types/produto.response.ts  →  o "contrato" dos dados que a API devolve.
// Serve para o TypeScript avisar quando a gente acessa um campo que não existe.
// (Mesmo papel de "correcao-exercicio1/src/types/todo.response.ts".)
// ============================================================================

// Formato de UM produto da fakestoreapi (GET /products).
export interface Produto {
  id?: number; // opcional: ao CRIAR ainda não existe id
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

// GET /products devolve um ARRAY direto: Produto[]  (NÃO vem { products: [...] })

// Resposta do POST /auth/login
export interface LoginResponse {
  token: string;
}

// Dados que o formulário de login envia
export interface LoginRequest {
  username: string;
  password: string;
}
