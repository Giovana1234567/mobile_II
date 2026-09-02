# Arquivo 1 — Consulta Teórica e Decisões Técnicas

> Foco: responder as **3 questões discursivas** de decisões técnicas.
> Cenário: app de loja consumindo `https://fakestoreapi.com`.
> Escopo da prova: **Axios + TanStack Query + fluxo de autenticação básico**.

---

## 1. Tipos de API — como escolher (e justificar)

| Tipo | Como funciona | Quando escolher | Quando evitar |
|---|---|---|---|
| **REST** | Recursos (`/products`, `/users`) + verbos HTTP. Retorna JSON. | Padrão do mercado, cacheável, simples, a maioria das APIs públicas (fakestoreapi é REST). | Quando o app precisa de muitos recursos aninhados numa tela só (vira "N requisições"). |
| **GraphQL** | 1 endpoint, o cliente descreve **exatamente** os campos que quer. | Telas com dados de muitas fontes; evitar *over-fetching* / *under-fetching*; app com rede lenta. | API simples; time sem experiência; precisa de cache HTTP tradicional. |
| **SOAP** | XML + contrato rígido (WSDL). | Sistemas legados, bancos, governo. | Mobile moderno (verboso, pesado). |
| **WebSocket** | Canal aberto, servidor empurra dados (*push*). | Chat, cotações, rastreio ao vivo. | Dados que mudam pouco (desperdício de conexão). |

**Como decidir (roteiro para a discursiva):**
1. **O dado muda em tempo real?** Sim → WebSocket. Não → REST/GraphQL.
2. **A tela junta dados de muitos recursos e a rede é crítica?** Sim → GraphQL.
3. **É CRUD simples sobre recursos e quero cache fácil?** → **REST** (nosso caso).
4. Considere também: maturidade do time, documentação, e se a API **já existe** (fakestoreapi só oferece REST → a decisão está tomada).

**REST na prática (fakestoreapi):**
- `GET /products` → lista • `GET /products/{id}` → um
- `POST /products` → cria • `PUT /products/{id}` → substitui • `PATCH` → atualiza parcial • `DELETE /products/{id}` → remove
- Verbos **idempotentes** (mesmo resultado se repetir): `GET`, `PUT`, `DELETE`. **Não idempotente**: `POST` (cada chamada cria outro).
- Status: `2xx` sucesso, `400` dados inválidos, `401` sem token, `403` sem permissão, `404` não existe, `5xx` erro do servidor.

---

## 2. `fetch` vs **Axios** — qual usar e por quê

### Limitações do `fetch` (o que a matéria cobra)
- **Não lança erro em status 4xx/5xx** — só rejeita se a rede cair. É obrigatório checar `if (!resposta.ok) throw ...` na mão.
- **Não converte JSON sozinho** — sempre `await resposta.json()`.
- **Não tem `baseURL`** — repete `https://...` em toda chamada.
- **Não tem interceptors** — para mandar o token em toda request, você repete o header em todo lugar.
- **Não tem timeout nativo** — precisa de `AbortController` manualmente.
- Serialização manual do corpo: `body: JSON.stringify(...)` + `headers: {'Content-Type': 'application/json'}`.

### O que o **Axios** entrega
- `axios.create({ baseURL })` → **instância** única; chama só `/products`.
- **Transforma JSON automaticamente** (`resposta.data` já é objeto).
- **Rejeita a promise em 4xx/5xx** → cai direto no `catch` / `onError`.
- **Interceptors** de request e response → 1 lugar para token e para tratamento de erro.
- `timeout`, cancelamento e `params` (query string) embutidos.

### Decisão (para a discursiva)
> "Uso **`fetch`** para uma chamada isolada, sem autenticação, num protótipo — zero dependência.
> Uso **Axios** no app real porque preciso de **instância com `baseURL`**, **interceptor para anexar o token** em toda requisição e **tratamento de erro centralizado**. Isso reduz repetição e deixa a regra de autenticação num único arquivo (`utils/api.ts`)."

### Por que "instância + interceptor" (padrão de arquitetura)
- **Separação de responsabilidades:** `utils/api.ts` sabe *como* falar com o servidor (URL, token, erro); os `hooks` sabem *quais* endpoints existem; as `telas` sabem *quando* chamar e *o que* mostrar.
- Trocar a URL base (dev → produção) ou a forma de autenticar mexe em **1 arquivo**.
- **Interceptor de request:** injeta `Authorization: Bearer <token>`. Regra de ouro: **sempre `return config`**, senão a requisição não sai.
- **Interceptor de response:** padroniza a mensagem de erro (`error.response.data.message`) e poderia, por ex., deslogar o usuário em `401`.

---

## 3. TanStack Query (React Query) — o que resolve

### O problema do `useState` + `useEffect` "na mão"
Para cada tela você reescreve: estados de `loading`/`erro`/`dados`, `useEffect` para buscar, re-busca ao voltar pra tela, evitar chamada duplicada, cache... É repetitivo e cheio de bugs (ex: *race condition*, atualizar estado em componente desmontado).

### O que o TanStack Query dá de graça
- **Cache automático por `queryKey`** — duas telas com a mesma key compartilham o dado, sem buscar de novo.
- **Estados prontos:** `isLoading`, `isFetching`, `isError`/`error`, `isSuccess`, `data`.
- **Re-fetch inteligente:** ao focar a janela, ao reconectar, ao remontar.
- **`retry`** automático em falha.
- **Deduplicação:** 3 componentes pedindo a mesma query = 1 request.
- **Paginação infinita** (`useInfiniteQuery`) com `fetchNextPage`.

### `staleTime` vs `gcTime` (cai na discursiva)
- **`staleTime`** — por quanto tempo o dado é considerado **"fresco"**. Enquanto fresco, o Query **não vai buscar de novo**. Default `0` (fica velho na hora).
  → aumente para dados que mudam pouco (catálogo de produtos: `staleTime: 60_000`).
- **`gcTime`** (antigo `cacheTime`) — quanto tempo o dado fica **na memória depois que ninguém está usando** (nenhum componente montado com aquela query). Default 5 min. Passado esse prazo, é descartado (*garbage collected*).
- Resumo: `staleTime` controla **quando re-buscar**; `gcTime` controla **quando esquecer**.

### `queryKey` — a "identidade" do dado
- É um array: `["produtos"]`, `["produto", id]`, `["produtos", { categoria }]`.
- Mudou a key → é outra query → busca de novo. É por ela que se faz **cache** e **invalidação**.
- Erro comum: usar a **mesma key** para listas diferentes → uma sobrescreve a outra.

### `useQuery` vs `useMutation`
- **`useQuery`** = **leitura** (GET). Roda sozinho ao montar.
- **`useMutation`** = **ação/escrita** (POST/PUT/DELETE) e também **login**. Só roda quando você chama `.mutate()`. Tem `onSuccess`, `onError`, `onSettled`, `isPending`.

---

## 4. Depois de um POST/PUT/DELETE, como atualizar a lista?

Duas estratégias (saber explicar as duas):

### a) Invalidação — `queryClient.invalidateQueries({ queryKey: ["produtos"] })`
- Marca a query como "velha" → o Query **re-busca** do servidor.
- **Prós:** simples, os dados na tela ficam **iguais aos do servidor** (fonte da verdade).
- **Contras:** faz **uma requisição a mais**; há um pequeno atraso até a lista atualizar.
- **Use quando:** o normal. É o padrão da aula (`onSuccess: () => invalidateQueries(...)`).

### b) Atualização otimista (*optimistic update*)
- Antes da resposta chegar, você **já altera o cache** com `queryClient.setQueryData(...)` assumindo que vai dar certo.
- No `onError`, **desfaz** (rollback) para o valor anterior.
- **Prós:** UI **instantânea**, sensação de app rápido.
- **Contras:** mais código; precisa tratar o rollback; risco de mostrar algo que o servidor recusou.
- **Use quando:** ações muito frequentes onde a latência incomoda (curtir, marcar tarefa como feita).

> Frase para a prova: "Uso **invalidação** por padrão (consistência com o servidor a baixo custo de código). Uso **update otimista** só quando a resposta rápida da UI é essencial, aceitando o custo do rollback."

**Obs. fakestoreapi:** o `POST/PUT/DELETE` é **simulado** — responde `200` com o objeto, mas **não persiste**. Depois de invalidar, a lista volta sem o item novo. Isso é esperado; o que importa é a mecânica.

---

## 5. Fluxo de autenticação básico

### Passo a passo
1. Usuário digita `username` / `password` na tela de login.
2. `POST /auth/login` com `{ username, password }` (via `useMutation`).
3. Resposta: `{ "token": "..." }` (JWT).
4. **Guardar o token.**
5. **Interceptor de request** anexa `Authorization: Bearer <token>` em toda chamada seguinte.
6. `onSuccess` → navegar para a área logada (`router.replace("/")`).
7. Logout = apagar o token.

### Onde guardar o token? (decisão técnica)
| Opção | Segurança | Persiste ao fechar o app? | Quando usar |
|---|---|---|---|
| Variável em memória (módulo) | — some ao recarregar | Não | Protótipo / prova (é o que fazemos aqui) |
| `AsyncStorage` | Texto puro, sem criptografia | Sim | Preferências, dados não sensíveis |
| **`expo-secure-store`** | **Criptografado** (Keychain/Keystore do SO) | Sim | **Token de sessão em produção** |

> Para a discursiva: "Na prova mantenho em memória para simplificar. Em produção usaria **`expo-secure-store`**, porque token é credencial e `AsyncStorage` guarda em texto puro. Nunca colocar token em código-fonte nem em log."

### Boas práticas
- `HTTPS` sempre (a fakestoreapi já é https).
- Token curto + *refresh token* (fora do escopo da prova, mas bom citar).
- Em `401` no interceptor de response: limpar token e mandar para a tela de login.
- Não logar o token no `console`.

---

## 6. Respostas-modelo enxutas (decore a ideia, não o texto)

**"Por que Axios em vez de fetch neste projeto?"**
> Porque o app tem autenticação e várias telas. Com Axios eu crio **uma instância com `baseURL`**, uso **interceptor** para mandar o token automaticamente e **centralizo o tratamento de erro**; o Axios ainda rejeita a promise em status 4xx/5xx e já entrega o JSON pronto. Com `fetch` eu repetiria header, checagem de `resposta.ok` e `JSON.stringify` em cada chamada.

**"Qual o papel do TanStack Query e por que não só `useEffect`?"**
> Ele gerencia o **estado do servidor**: cache por `queryKey`, estados de carregamento/erro prontos, deduplicação de requisições, re-fetch automático e `retry`. Com `useEffect` eu reimplementaria tudo isso à mão em cada tela, com risco de *race conditions* e código duplicado. `useQuery` para leitura, `useMutation` para escrita, e `invalidateQueries` para manter a lista sincronizada após uma alteração.

**"Como você estruturou o consumo da API e por quê?"**
> Em camadas: `utils/api.ts` (instância Axios + interceptors) → `hooks/` (funções por endpoint, sem JSX) → `components/` (visual reutilizável) → `app/` (telas que chamam `useQuery`/`useMutation`). Assim cada mudança fica isolada: trocar a URL base ou a autenticação mexe em um arquivo só, e as telas não sabem *como* a requisição é feita.
