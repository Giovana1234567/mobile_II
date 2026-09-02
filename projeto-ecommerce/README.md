# projeto-ecommerce

App de estudo para a **Prova 1 de Mobile II** — consumo da API pública
`https://fakestoreapi.com` (cenário de loja) com **Axios + TanStack Query + login**.
Construído nos moldes dos exercícios de aula (`aula-19-08`, `correcao-exercicio1`, `revisao-pre-ava1`).

## Rodar

```bash
npm install
npx expo start
```

## Estrutura (a "receita" que se repete em toda tela)

```
src/
├── utils/api.ts              1º: instância do Axios + interceptors (token, erro)
├── types/produto.response.ts 2º: contrato dos dados da API
├── hooks/
│   ├── useProdutos.ts        3º: acesso à API com AXIOS  (carregar/criar/atualizar/deletar)
│   ├── useProdutosFetch.ts       mesma interface com FETCH (para comparar)
│   └── useAuth.ts                login (POST /auth/login)
├── components/               peças visuais reutilizáveis (sem lógica de API)
│   ├── Campo.tsx             TextInput + rótulo
│   ├── EstadoTela.tsx        <Carregando /> e <Erro />
│   └── ProdutoCard.tsx       card de 1 produto
└── app/                      telas (expo-router, file-based routing)
    ├── _layout.tsx           QueryClientProvider + <Stack>
    ├── login.tsx             fluxo de autenticação (useMutation)
    ├── index.tsx             lista + cadastro + exclusão (useQuery + useMutation + invalidate)
    └── infinita.tsx          BÔNUS: useInfiniteQuery
```

## Fluxo de dados (sempre o mesmo)

`tela` → chama `useQuery/useMutation` → que chama função do `hook` → que chama `api` (axios) → `interceptor` anexa token → API responde → `interceptor` trata erro → cache do TanStack Query guarda o resultado.

## Credenciais de teste (fakestoreapi)

`usuário: mor_2314`  •  `senha: 83r5^_`
