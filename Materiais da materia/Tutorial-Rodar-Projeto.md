# Tutorial rápido — criar, limpar, rodar e testar o projeto

> Resumão para a prova. Cenário: app de loja com `https://fakestoreapi.com`.
> Stack: Expo (SDK 57) + expo-router + Axios + TanStack Query.

---

## 1. Pré-requisitos

- Node LTS instalado (`node -v`).
- Celular com **Expo Go** OU emulador Android/iOS OU só o navegador (`w`).
- Nada de conta paga: `expo start` é local.

---

## 2. Criar um projeto do zero (se a prova exigir começar limpo)

```bash
npx create-expo-app@latest meu-app
cd meu-app
```

### Limpar os arquivos padrão (deixar só o essencial)

**Opção A — comando pronto:**
```bash
npm run reset-project     # move o exemplo p/ app-example e cria app/ vazio
```

**Opção B — manual (é o layout que usamos em aula):**
1. Apague a pasta `app/` inteira (e `components/`, `constants/`, `hooks/`, `scripts/` se vierem).
2. Crie a estrutura:
   ```
   src/
   ├── app/
   │   ├── _layout.tsx
   │   └── index.tsx
   ├── components/
   ├── hooks/
   ├── types/
   ├── ui/
   └── utils/
   ```
3. No `tsconfig.json`, garanta o alias:
   ```json
   { "compilerOptions": { "strict": true, "paths": { "@/*": ["./src/*"] } } }
   ```
4. `app/_layout.tsx` mínimo:
   ```tsx
   import { Stack } from "expo-router";
   export default function RootLayout() { return <Stack />; }
   ```
5. `app/index.tsx` mínimo:
   ```tsx
   import { Text, View } from "react-native";
   export default function Index() {
     return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><Text>OK</Text></View>;
   }
   ```
6. `expo-router` acha `src/app` sozinho (o `main` no `package.json` é `expo-router/entry`).

---

## 3. Rodar ESTE projeto (`projeto-ecommerce`)

```bash
cd projeto-ecommerce
npm install
npx expo install expo-secure-store   # dependência nativa: deixa o Expo escolher a versão
npx expo start
```

No terminal do Expo:
- `w` → abre no navegador (mais rápido para testar lógica de API)
- `a` → emulador Android · `i` → simulador iOS
- ou leia o QR Code com o **Expo Go**

> Erros de "Cannot find module 'react'" no editor **somem depois do `npm install`**.

---

## 4. Roteiro de teste (o que clicar para validar tudo)

| Passo | O que fazer | O que provar |
|---|---|---|
| 1 | Abrir `/login`, tocar **Entrar** (`mor_2314` / `83r5^_`) | fluxo de login + `useMutation` + token no interceptor |
| 2 | Ver a lista carregar | `useQuery` + estado `isLoading` |
| 3 | Puxar a lista para baixo | pull-to-refresh (`RefreshControl` + `refetch`) |
| 4 | Tocar numa categoria (chip) | `queryKey` dinâmica → cache por filtro |
| 5 | Preencher Título/Preço → **Salvar produto** | mutation **POST** + `invalidateQueries` + `Alert` |
| 6 | Tocar no **✕** de um card | mutation **DELETE** + `invalidateQueries` |
| 7 | Tocar num card → tela de detalhe | rota dinâmica `/produto/[id]` + query `["produto", id]` |
| 8 | Na detalhe, **Aumentar preço (otimista)** | mutation **PUT** + **atualização otimista** + rollback no erro |
| 9 | Abrir `/infinita`, rolar até o fim | `useInfiniteQuery` + `fetchNextPage` + `onEndReached` |
| 10 | Fechar e reabrir o app | token lido do `SecureStore` no `_layout` |

> Lembrete: POST/PUT/DELETE da fakestoreapi são **simulados** (respondem 200 mas não salvam). Depois do `invalidate` a lista volta ao original — a mecânica é o que conta.

---

## 5. Checklist relâmpago antes de entregar

- [ ] `_layout.tsx` tem `QueryClientProvider` envolvendo o `<Stack>`
- [ ] `api.ts`: `baseURL` **sem** barra final + interceptor de request com `return config`
- [ ] hook: `await` + `.data` em toda função; **sem** `useQuery` dentro do hook
- [ ] tela: `if (isLoading)` e `if (error)` **antes** de usar `data`
- [ ] fakestoreapi: `data` é **array direto** (não `data.products`)
- [ ] toda mutation de escrita tem `onSuccess: () => invalidateQueries(...)`
- [ ] `keyExtractor={(item) => String(item.id)}`
- [ ] preço do `TextInput` convertido com `Number(...)` antes de enviar
