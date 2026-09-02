// ============================================================================
// app/index.tsx  →  tela principal: LISTA + CADASTRO + EXCLUSÃO de produtos.
// Concentra o que mais cai na prova:
//   - useQuery      -> ler a lista (com cache)
//   - useMutation   -> criar / excluir (ações)
//   - invalidateQueries -> recarregar a lista depois de mudar algo
//   - estados isLoading / error tratados ANTES do return principal
//
// Para testar a VERSÃO FETCH: troque a linha de import abaixo por
//   import { useProdutosFetch as useProdutos } from "@/hooks/useProdutosFetch";
// ============================================================================

import { Campo } from "@/components/Campo";
import { Carregando, Erro } from "@/components/EstadoTela";
import { ProdutoCard } from "@/components/ProdutoCard";
import { useProdutos } from "@/hooks/useProdutos";
import { Produto } from "@/types/produto.response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, Button, FlatList, StyleSheet, View } from "react-native";

const CHAVE_PRODUTOS = ["produtos"]; // queryKey reutilizada (buscar + invalidar)

export default function Index() {
  const { carregar, criar, deletar } = useProdutos();
  const queryClient = useQueryClient();

  const [titulo, setTitulo] = useState("");
  const [preco, setPreco] = useState("");

  // -------- LEITURA: useQuery --------
  const { data, isLoading, error } = useQuery({
    queryKey: CHAVE_PRODUTOS,
    queryFn: carregar, // Produto[] (array direto -> data já é a lista)
  });

  // -------- AÇÃO: criar produto --------
  const criarMutation = useMutation({
    mutationFn: (novo: Produto) => criar(novo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAVE_PRODUTOS }); // recarrega a lista
      setTitulo("");
      setPreco("");
      Alert.alert("Produto cadastrado!");
    },
    onError: (e) => Alert.alert("Erro ao cadastrar", e.message),
  });

  // -------- AÇÃO: excluir produto --------
  const excluirMutation = useMutation({
    mutationFn: (id: number) => deletar(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHAVE_PRODUTOS }),
    onError: (e) => Alert.alert("Erro ao excluir", e.message),
  });

  const salvar = () => {
    criarMutation.mutate({
      title: titulo,
      price: Number(preco),
      description: "",
      category: "",
      image: "https://i.pravatar.cc",
    });
  };

  // -------- estados tratados antes do conteúdo principal --------
  if (isLoading) return <Carregando texto="Carregando produtos..." />;
  if (error) return <Erro texto={error.message} />;

  // -------- conteúdo --------
  return (
    <View style={styles.container}>
      <Campo label="Título" value={titulo} onChangeText={setTitulo} />
      <Campo
        label="Preço"
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
      />
      <Button
        title={criarMutation.isPending ? "Salvando..." : "Salvar produto"}
        onPress={salvar}
        disabled={criarMutation.isPending}
      />

      <FlatList
        style={styles.lista}
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProdutoCard produto={item} onExcluir={(id) => excluirMutation.mutate(id)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  lista: { marginTop: 12 },
});
