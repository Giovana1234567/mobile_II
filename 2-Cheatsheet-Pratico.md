# Arquivo 2 — Consulta Prática (Cheatsheet)

> Guia cronológico: **qual arquivo criar primeiro** e o que colar em cada um.
> Adaptável a qualquer cenário — troque "produto/products" pelo recurso da questão.
> API da prova: `https://fakestoreapi.com`.

---

## 0. Ordem de criação (SEMPRE nesta sequência)

```
1. src/utils/api.ts              → instância Axios + interceptors
2. src/types/<recurso>.response.ts→ interfaces do dado
3. src/hooks/use<Recurso>.ts      → funções carregar/criar/atualizar/deletar
4. src/app/_layout.tsx            → QueryClientProvider + <Stack>
5. src/components/*               → visual reutilizável (Campo, EstadoTela, Card)
6. src/app/index.tsx             → a tela: useQuery + useMutation
7. (se pedir login) src/hooks/useAuth.ts + src/app/login.tsx
8. (se pedir scroll infinito) useInfiniteQuery na tela
```

Regra mental: **de dentro para fora** — primeiro *como falar com a API*, por último *a tela*.

---

## 1. `src/utils/api.ts` — instância + interceptors

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://fakestoreapi.com",   // SEM barra no final
  timeout: 10000,
});

let token: string | null = null;
export const definirToken = (t: string | null) => { token = t; };

// REQUEST: anexa o token. SEMPRE retornar config.
api.interceptors.request.use((config) => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// RESPONSE: 1º cb = sucesso, 2º cb = erro. Padroniza a mensagem.
api.interceptors.response.use(
  (r) => r,
  (e) => Promise.reject(new Error(e.response?.data?.message ?? "Falha na requisição"))
);
```

---

## 2. `src/types/produto.response.ts` — o contrato

```ts
export interface Produto {
  id?: number;            // opcional: ao criar ainda não tem
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
// GET /products devolve Produto[]  (ARRAY DIRETO — não vem { products: [] })
```

---

## 3. `src/hooks/useProdutos.ts` — acesso à API (sem JSX!)

```ts
import { Produto } from "@/types/produto.response";
import { api } from "@/utils/api";

export function useProdutos() {
  const carregar   = async () => (await api.get<Produto[]>("/products")).data;
  const carregarUm = async (id: number) => (await api.get<Produto>(`/products/${id}`)).data;
  const criar      = async (p: Produto) => (await api.post("/products", p)).data;
  const atualizar  = async (p: Produto) => (await api.put(`/products/${p.id}`, p)).data;
  const deletar    = async (id: number) => (await api.delete(`/products/${id}`)).data;
  return { carregar, carregarUm, criar, atualizar, deletar };
}
```

### Versão `fetch` (mesma interface — trocar 1 import na tela)

```ts
const BASE = "https://fakestoreapi.com";
export function useProdutosFetch() {
  const carregar = async () => {
    const r = await fetch(`${BASE}/products`);
    if (!r.ok) throw new Error("Erro ao carregar!");   // checagem MANUAL
    return await r.json();                             // parse MANUAL
  };
  const criar = async (p: any) => {
    const r = await fetch(`${BASE}/products`, {
      method: "POST",
      body: JSON.stringify(p),                         // serialização MANUAL
      headers: { "Content-Type": "application/json" }, // header MANUAL
    });
    if (!r.ok) throw new Error("Erro ao cadastrar!");
    return await r.json();
  };
  return { carregar, criar };
}
```

---

## 4. `src/app/_layout.tsx` — provider + navegação

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Produtos" }} />
      </Stack>
    </QueryClientProvider>
  );
}
```
> Sem o `QueryClientProvider` → erro **"No QueryClient set, use QueryClientProvider"**.

---

## 5. Componentes reutilizáveis (colar 1x, usar em toda tela)

```tsx
// components/EstadoTela.tsx
export function Carregando({ texto = "Carregando..." }) {
  return <View style={c}><ActivityIndicator size="large" /><Text>{texto}</Text></View>;
}
export function Erro({ texto = "Ocorreu um erro." }) {
  return <View style={c}><Text style={{ color: "#c00" }}>{texto}</Text></View>;
}
const c = { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 } as const;
```

```tsx
// components/Campo.tsx  (TextInput + rótulo; repassa todas as props do TextInput)
export function Campo({ label, style, ...resto }: TextInputProps & { label: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 4, color: "#555" }}>{label}</Text>
      <TextInput style={[{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8 }, style]} {...resto} />
    </View>
  );
}
```

---

## 6. `src/app/index.tsx` — leitura + escrita (o núcleo da prova)

```tsx
const CHAVE = ["produtos"];

export default function Index() {
  const { carregar, criar, deletar } = useProdutos();
  const qc = useQueryClient();

  // LEITURA
  const { data, isLoading, error } = useQuery({ queryKey: CHAVE, queryFn: carregar });

  // ESCRITA
  const criarMut = useMutation({
    mutationFn: (p: Produto) => criar(p),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CHAVE }); Alert.alert("Criado!"); },
    onError: (e) => Alert.alert("Erro", e.message),
  });
  const excluirMut = useMutation({
    mutationFn: (id: number) => deletar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE }),
  });

  if (isLoading) return <Carregando />;
  if (error) return <Erro texto={error.message} />;

  return (
    <FlatList
      data={data}                                   // data JÁ é o array
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <ProdutoCard produto={item} onExcluir={(id) => excluirMut.mutate(id)} />
      )}
    />
  );
}
```

---

## 7. Login (se a questão pedir)

```tsx
// hooks/useAuth.ts
export function useAuth() {
  const login = async (cred: { username: string; password: string }) => {
    const { data } = await api.post<{ token: string }>("/auth/login", cred);
    definirToken(data.token);            // interceptor passa a enviar o token
    return data.token;
  };
  return { login };
}
```

```tsx
// app/login.tsx
const loginMut = useMutation({
  mutationFn: () => login({ username, password }),
  onSuccess: () => router.replace("/"),
  onError: (e) => Alert.alert("Falha no login", e.message),
});
// <Button title="Entrar" onPress={() => loginMut.mutate()} disabled={loginMut.isPending} />
```
> Usuário de teste fakestoreapi: **`mor_2314` / `83r5^_`**

---

## 8. Scroll infinito (se a questão pedir) — `useInfiniteQuery`

```tsx
const q = useInfiniteQuery({
  queryKey: ["produtos-infinito"],
  initialPageParam: 0,
  queryFn: async ({ pageParam }) => {
    const todos = await carregar();
    const ini = pageParam * 6;
    return { itens: todos.slice(ini, ini + 6), proxima: ini + 6 < todos.length ? pageParam + 1 : undefined };
  },
  getNextPageParam: (ultima) => ultima.proxima,   // undefined = acabou
});
const produtos = q.data?.pages.flatMap((p) => p.itens) ?? [];
// <FlatList ... onEndReached={() => q.hasNextPage && q.fetchNextPage()} onEndReachedThreshold={0.5} />
```
> fakestoreapi não tem `skip`/`total` reais → paginamos fatiando o array no cliente.
> Se a API tiver paginação real (ex: dummyjson): use `params: { skip: pageParam * limite, limit: limite }` e `getNextPageParam` com `Math.ceil(total / limite)`.

---

## 8b. Rota dinâmica + tela de detalhe (`app/produto/[id].tsx`)

```tsx
import { useLocalSearchParams } from "expo-router";

const { id } = useLocalSearchParams<{ id: string }>();      // pega o :id da URL
const idNum = Number(id);

const { data: produto } = useQuery({
  queryKey: ["produto", idNum],                              // key inclui o id
  queryFn: () => carregarUm(idNum),
  enabled: !Number.isNaN(idNum),                             // só busca se id válido
});
// navegar para cá:  router.push(`/produto/${item.id}`)
```
> `enabled: false` = a query **não roda** até virar `true` (queries dependentes: só buscar produto depois do login, só buscar detalhe com id válido).

## 8c. Atualização otimista (PUT/DELETE que reflete na hora)

```tsx
const editar = useMutation({
  mutationFn: (p: Produto) => atualizar(p),
  onMutate: async (p) => {
    await qc.cancelQueries({ queryKey: ["produto", p.id] });     // 1. evita corrida
    const anterior = qc.getQueryData(["produto", p.id]);         // 2. snapshot
    qc.setQueryData(["produto", p.id], p);                       // 3. aplica já na UI
    return { anterior };                                         // 4. passa p/ onError
  },
  onError: (_e, _p, ctx) => qc.setQueryData(["produto", _p.id], ctx?.anterior), // rollback
  onSettled: (_d, _e, p) => qc.invalidateQueries({ queryKey: ["produto", p.id] }), // confirma
});
```
> Invalidação (padrão) = simples, consistente, 1 request a mais. Otimista = UI instantânea, mais código (precisa do rollback). Escolha pela frequência da ação.

## 8d. queryKey dinâmica (cache por filtro) + pull-to-refresh

```tsx
const chave = categoria ? ["produtos", categoria] : ["produtos"];
const { data, refetch, isFetching } = useQuery({
  queryKey: chave,
  queryFn: () => (categoria ? carregarPorCategoria(categoria) : carregar()),
});
// <FlatList refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />} />
```
> Cada `categoria` vira uma entrada de cache separada — trocar o filtro e voltar não re-busca.

---

## 9. ⚠️ Erros mais comuns (onde as questões te derrubam)

| # | Erro | Sintoma | Correção |
|---|---|---|---|
| 1 | Esquecer `QueryClientProvider` no `_layout` | "No QueryClient set" | Envolver o `<Stack>` com `<QueryClientProvider client={queryClient}>` |
| 2 | `data.products` na fakestoreapi | `undefined` / lista vazia | É **array direto**: use `data` |
| 3 | `queryClient = new QueryClient()` **dentro** do componente | cache reseta a cada render | Criar **fora** do componente |
| 4 | Faltou `await` na função do hook | `Promise` no lugar do dado | `await api.get(...)` e `.data` |
| 5 | Interceptor de request sem `return config` | nenhuma requisição sai | Sempre `return config` |
| 6 | `baseURL` com `/` no fim + path com `/` → `//` | 404 | `baseURL` sem barra final |
| 7 | `queryKey` igual para listas diferentes | uma sobrescreve a outra | Keys distintas: `["produtos"]`, `["produto", id]` |
| 8 | Chamar `mutation()` em vez de `mutation.mutate()` | nada acontece / erro de tipo | `criarMut.mutate(payload)` |
| 9 | Não invalidar após POST/PUT/DELETE | lista não atualiza | `onSuccess: () => qc.invalidateQueries({ queryKey })` |
| 10 | Tratar `isLoading`/`error` **depois** de usar `data` | crash com `undefined` | `if (isLoading) return ...` / `if (error) return ...` **antes** |
| 11 | `keyExtractor` retornando número | warning do RN | `keyExtractor={(i) => String(i.id)}` |
| 12 | `fetch` sem checar `resposta.ok` | erro "engolido", 404 tratado como sucesso | `if (!r.ok) throw new Error(...)` |
| 13 | `price` vindo do `TextInput` como string | NaN / API recusa | `Number(preco)` antes de enviar |
| 14 | Import do alias errado | "cannot find module" | `@/hooks/...` (ver `paths` no `tsconfig`) |
| 15 | `onEndReached` disparando em loop | requisições infinitas | checar `hasNextPage` e ajustar `onEndReachedThreshold` |
| 16 | Update otimista sem `return { anterior }` no `onMutate` | rollback não funciona | retornar o snapshot; usar no `onError` via `ctx` |
| 17 | Update otimista sem `cancelQueries` | refetch em voo sobrescreve a UI | `await qc.cancelQueries({ queryKey })` no início do `onMutate` |
| 18 | `useLocalSearchParams` retorna `string` | `carregarUm("3")` quebra o tipo | `Number(id)` + `enabled: !Number.isNaN(idNum)` |
| 19 | Nome do arquivo de rota dinâmica errado | 404 na navegação | tem que ser `[id].tsx` e `router.push(\`/produto/${id}\`)` |
| 20 | Token só em memória | perde login ao fechar o app | `expo-secure-store` + reler no `_layout` (`useEffect`) |

---

## 10. Colinha de assinatura das APIs do TanStack Query

```
useQuery({ queryKey, queryFn, staleTime?, gcTime?, enabled?, retry? })
  → { data, isLoading, isFetching, isError, error, isSuccess, refetch }

useMutation({ mutationFn, onSuccess?, onError?, onSettled? })
  → { mutate, mutateAsync, isPending, isError, error, data }
  → dispara com:  mutation.mutate(payload)

useInfiniteQuery({ queryKey, queryFn, initialPageParam, getNextPageParam })
  → { data.pages, fetchNextPage, hasNextPage, isFetchingNextPage }

queryClient.invalidateQueries({ queryKey })   // marca como velho → refetch
queryClient.setQueryData(queryKey, novoValor) // update otimista (mexe no cache na mão)
```

## 11. Verbos HTTP × Axios × intenção

| Intenção | Verbo | Axios | TanStack |
|---|---|---|---|
| Listar / obter | GET | `api.get("/products")` | `useQuery` |
| Criar | POST | `api.post("/products", body)` | `useMutation` |
| Substituir | PUT | `api.put("/products/1", body)` | `useMutation` |
| Atualizar parcial | PATCH | `api.patch("/products/1", body)` | `useMutation` |
| Remover | DELETE | `api.delete("/products/1")` | `useMutation` |
| Login | POST | `api.post("/auth/login", cred)` | `useMutation` |
