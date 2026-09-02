# Kit de componentes básicos estilizados (prontos para colar)

> Ficam em `projeto-ecommerce/src/ui/`. São **só aparência** — nenhuma lógica de API.
> Objetivo: não perder tempo com `StyleSheet` na prova. Importe e use.

---

## `ui/tema.ts` — tokens (mude aqui e muda o app todo)

```ts
export const cores = {
  primaria: "#2563eb", primariaTexto: "#fff",
  texto: "#1f2937", textoFraco: "#6b7280",
  borda: "#e5e7eb", fundo: "#f9fafb", cartao: "#fff",
  sucesso: "#16a34a", perigo: "#dc2626",
};
export const espaco = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const raio = { sm: 6, md: 10, lg: 16 };
```

---

## Catálogo

| Componente | Import | Uso |
|---|---|---|
| `Tela` | `@/ui/Tela` | `<Tela>...</Tela>` — fundo + padding + safe area |
| `Titulo` / `Subtitulo` | `@/ui/Texto` | `<Titulo>Produtos</Titulo>` |
| `Preco` | `@/ui/Texto` | `<Preco valor={produto.price} />` → `R$ 10.00` |
| `Botao` | `@/ui/Botao` | `<Botao titulo="Salvar" onPress={fn} carregando={mut.isPending} />` |
| `Cartao` | `@/ui/Cartao` | `<Cartao onPress={abrir}>...</Cartao>` — caixa branca c/ borda |
| `Etiqueta` | `@/ui/Etiqueta` | `<Etiqueta texto="electronics" ativa onPress={fn} />` — chip/filtro |

### `Botao` — variantes

```tsx
<Botao titulo="Salvar" onPress={salvar} />                        {/* primária */}
<Botao titulo="Excluir" variante="perigo" onPress={excluir} />
<Botao titulo="Cancelar" variante="contorno" onPress={voltar} />
<Botao titulo="Entrar" carregando={mut.isPending} onPress={ir} /> {/* spinner + disabled */}
```

### Exemplo montando uma tela inteira só com o kit

```tsx
import { Tela } from "@/ui/Tela";
import { Titulo, Preco } from "@/ui/Texto";
import { Cartao } from "@/ui/Cartao";
import { Botao } from "@/ui/Botao";

<Tela>
  <Titulo>Carrinho</Titulo>
  <Cartao>
    <Titulo>Camiseta</Titulo>
    <Preco valor={79.9} />
  </Cartao>
  <Botao titulo="Finalizar compra" onPress={pagar} />
</Tela>
```

---

## Componentes de apoio (em `src/components/`, esses têm um pouco de lógica)

| Componente | Papel |
|---|---|
| `Campo` (`@/components/Campo`) | `TextInput` + rótulo. Repassa todas as props do `TextInput`. |
| `Carregando` / `Erro` (`@/components/EstadoTela`) | telas de estado para `if (isLoading)` / `if (error)`. |
| `ProdutoCard` (`@/components/ProdutoCard`) | card de 1 produto (imagem, título, preço, categoria, ✕). |
| `FiltroCategorias` (`@/components/FiltroCategorias`) | barra horizontal de chips; faz a própria `useQuery` de categorias. |

```tsx
<Campo label="Preço" value={preco} onChangeText={setPreco} keyboardType="numeric" />

{isLoading && <Carregando texto="Carregando produtos..." />}
{error && <Erro texto={error.message} />}

<ProdutoCard produto={item} onPress={abrir} onExcluir={(id) => excluirMut.mutate(id)} />

<FiltroCategorias selecionada={categoria} aoSelecionar={setCategoria} />
```
