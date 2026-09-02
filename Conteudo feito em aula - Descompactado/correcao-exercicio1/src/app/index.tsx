import { useTodos } from "@/hooks/useTodos";
import { Pagina } from "@/types/todo.response";
import { useInfiniteQuery } from "@tanstack/react-query";
import { memo } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const LIMITE = 10

export default function Index() {
  const { carregarTodos } = useTodos();
  const { bottom } = useSafeAreaInsets()

  const {
    data,
    fetchNextPage,
    isLoading,
    error,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['todos'],
    initialPageParam: 1,
    getNextPageParam: (lastPage: Pagina, allPages) => {
      const totalPages = Math.ceil(lastPage.total / LIMITE);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    queryFn: async ({ pageParam }) => {
      const resposta = await carregarTodos(pageParam, LIMITE);
      return resposta;
    }
  })

  const todos = data?.pages.flatMap(page => page.todos) || [];

  if (isLoading) {
    return (
      <View style={[styles.container, { marginBottom: bottom, backgroundColor: '#e0e0e0', padding: 10, borderRadius: 5, alignItems: 'center', gap: 5 }]}>
        <Text>Carregando...</Text>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { marginBottom: bottom, backgroundColor: '#ffcccc', padding: 10, borderRadius: 5 }]}>
        <Text>Ocorreu um erro ao carregar os dados.</Text>
      </View>
    );
  }

  const TodoItem = memo(({ item, index }: { item: any, index: number }) => (
    <View style={styles.containerCard} key={index}>
      <View style={[styles.indicator, item.completed && styles.indicatorCompleted]} />

      <Text style={[styles.text, item.completed && styles.textCompleted]}>
        {item.todo}
      </Text>
    </View>
  ));

  return (
    <View style={[styles.container, { marginBottom: bottom }]}>
      <FlatList
        data={todos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => <TodoItem item={item} index={index} />}
        onEndReachedThreshold={1}
        onEndReached={() => fetchNextPage()}
        ListFooterComponent={() => {
          return (
            <>
              {isFetchingNextPage && <Text>Carregando mais...</Text>}
            </>
          );
        }}

        initialNumToRender={8}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },

  containerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  indicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D1D6', // Cinza para tarefas pendentes
    marginRight: 12,
  },
  indicatorCompleted: {
    backgroundColor: '#34C759', // Verde para indicar conclusão
    borderColor: '#34C759',
  },
  text: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  textCompleted: {
    color: '#999999',
    textDecorationLine: 'line-through',
  },
});
