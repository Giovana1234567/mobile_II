import { Produto, useProdutosAxios } from "@/hooks/useProdutosAxios";
import { useProdutoFetch } from "@/hooks/useProdutosFetch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert, Button, FlatList, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { carregar, criar } = useProdutosAxios();
  const { carregar: carregarFetch } = useProdutoFetch();

  const { data, isLoading, isPending, status, error } = useQuery({
    queryKey: ["listagem-produtos"],
    queryFn: carregar,
    enabled: true,
    gcTime: 100,
    staleTime: 3600,
    retry: 3,
    retryDelay: 1000,
  });

  const cadastroProdutoMutation = useMutation({
    mutationFn: async ({ nome, preco }: { nome: string; preco: number }) => {
      const produto: Produto = {
        category: "",
        description: "",
        id: 0,
        price: preco,
        title: nome,
      };
      return await criar(produto);
    },
    onSuccess: () => Alert.alert("Deu boa!"),
    onError: (e) => Alert.alert("Deu ruim!", e.message),
    onSettled: () => console.log("OI"),
  });

  if (isLoading) {
    return (
      <View>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Ops, deu erro!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title="Cadastrar"
        onPress={() =>
          cadastroProdutoMutation.mutate({
            nome: "Doritos",
            preco: 10.5,
          })
        }
      />
      <FlatList
        data={data?.products}
        renderItem={({ item }) => (
          <View>
            <Text>
              {item.id} - {item.price}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  campo: {
    borderWidth: 1,
    borderColor: "grey",
    margin: 5,
  },
});
