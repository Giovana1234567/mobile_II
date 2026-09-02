// ============================================================================
// app/infinita.tsx  →  BÔNUS: listagem infinita com useInfiniteQuery.
// É o padrão do "correcao-exercicio1" adaptado para a fakestoreapi.
//
// Observação: a fakestoreapi NÃO tem paginação real (só ?limit=, sem skip/total).
// Então buscamos a lista inteira 1x e "paginamos no cliente" fatiando o array.
// A mecânica do useInfiniteQuery (pageParam, getNextPageParam, fetchNextPage,
// onEndReached) é EXATAMENTE a mesma da aula.
// ============================================================================

import { Carregando, Erro } from "@/components/EstadoTela";
import { ProdutoCard } from "@/components/ProdutoCard";
import { useProdutos } from "@/hooks/useProdutos";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlatList, Text } from "react-native";

const TAMANHO_PAGINA = 6;

export default function Infinita() {
  const { carregar } = useProdutos();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteQuery({
      queryKey: ["produtos-infinito"],
      initialPageParam: 0, // começa na página 0
      queryFn: async ({ pageParam }) => {
        const todos = await carregar(); // lista completa
        const inicio = pageParam * TAMANHO_PAGINA;
        return {
          itens: todos.slice(inicio, inicio + TAMANHO_PAGINA),
          proxima: inicio + TAMANHO_PAGINA < todos.length ? pageParam + 1 : undefined,
        };
      },
      // decide qual é o próximo pageParam (undefined = acabou)
      getNextPageParam: (ultimaPagina) => ultimaPagina.proxima,
    });

  if (isLoading) return <Carregando />;
  if (error) return <Erro texto={error.message} />;

  // junta os itens de todas as páginas já carregadas
  const produtos = data?.pages.flatMap((p) => p.itens) ?? [];

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={produtos}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <ProdutoCard produto={item} />}
      onEndReachedThreshold={0.5}
      onEndReached={() => hasNextPage && fetchNextPage()}
      ListFooterComponent={
        isFetchingNextPage ? <Text>Carregando mais...</Text> : null
      }
    />
  );
}
