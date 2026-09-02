# projeto-ecommerce

App de estudo para a **Prova 1 de Mobile II** — consumo da API pública
`https://fakestoreapi.com` (cenário de loja) com **Axios + TanStack Query + login**.
Construído nos moldes dos exercícios de aula (`aula-19-08`, `correcao-exercicio1`, `revisao-pre-ava1`).

## Rodar

```bash
npm install
npx expo install expo-secure-store
npx expo start
```
Tutorial completo (criar do zero, limpar, testar): `../Materiais da materia/Tutorial-Rodar-Projeto.md`

## Estrutura

```
src/
├── utils/
│   ├── api.ts                1º: instância Axios + interceptors (token, erro)
│   └── sessao.ts             token seguro (expo-secure-store)
├── types/produto.response.ts 2º: contrato dos dados da API
├── hooks/
│   ├── useProdutos.ts        3º: AXIOS  — carregar/carregarUm/criar/atualizar/deletar/categorias
│   ├── useProdutosFetch.ts       mesma interface com FETCH (para comparar)
│   └── useAuth.ts                login/logout (POST /auth/login + SecureStore)
├── ui/                       SÓ aparência (tema, Tela, Texto, Botao, Cartao, Etiqueta)
├── components/               apoio (Campo, EstadoTela, ProdutoCard, FiltroCategorias)
└── app/                      telas (expo-router, file-based routing)
    ├── _layout.tsx           QueryClientProvider + <Stack> + recarrega token no boot
    ├── login.tsx             fluxo de autenticação (useMutation)
    ├── index.tsx             lista + filtro por categoria + POST + DELETE + pull-to-refresh
    ├── produto/[id].tsx      detalhe (rota dinâmica) + PUT com ATUALIZAÇÃO OTIMISTA
    └── infinita.tsx          useInfiniteQuery (scroll infinito)
```

## Cobertura da matéria (Módulo 1)

| Tema | Onde |
|---|---|
| Axios: instância, `baseURL`, interceptors, timeout | `utils/api.ts` |
| `fetch` x Axios (limitações) | `hooks/useProdutosFetch.ts` |
| Tratamento de erro centralizado | interceptor de response em `api.ts` |
| `useQuery`: queryKey, queryFn, staleTime, gcTime, retry, `enabled` | `_layout.tsx`, `index.tsx`, `produto/[id].tsx` |
| Estados: isLoading / isFetching / error | `index.tsx`, `EstadoTela.tsx` |
| queryKey dinâmica / cache por filtro | `index.tsx` (categoria) |
| Mutations POST / PUT / DELETE | `index.tsx` (POST, DELETE), `produto/[id].tsx` (PUT) |
| `invalidateQueries` | todas as mutations |
| Atualização otimista + rollback | `produto/[id].tsx` (`onMutate`/`onError`/`onSettled`) |
| `useInfiniteQuery` (`fetchNextPage`, `onEndReached`) | `infinita.tsx` |
| Login + token no header via interceptor | `useAuth.ts` + `api.ts` |
| Armazenamento seguro do token | `utils/sessao.ts` (SecureStore) |
| Rota dinâmica (`useLocalSearchParams`) | `produto/[id].tsx` |
| pull-to-refresh (`RefreshControl` + `refetch`) | `index.tsx` |

## Credenciais de teste (fakestoreapi)

`usuário: mor_2314`  •  `senha: 83r5^_`
