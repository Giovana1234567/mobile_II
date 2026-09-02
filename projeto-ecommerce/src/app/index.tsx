// ============================================================================
// app/index.tsx  →  tela principal: LISTA + FILTRO + CADASTRO + EXCLUSÃO.
// Concentra o que mais cai na prova:
//   - useQuery com queryKey DINÂMICA (muda com a categoria) -> cache por filtro
//   - useMutation (POST e DELETE) + invalidateQueries
//   - pull-to-refresh (RefreshControl + refetch)
//   - navegação para a tela de detalhe (rota dinâmica /produto/[id])
//
// Versão FETCH: troque o import por
//   import { useProdutosFetch as useProdutos } from "@/hooks/useProdutosFetch";
// ============================================================================

import { Campo } from "@/components/Campo";
import { Carregando, Erro } from "@/components/EstadoTela";
import { FiltroCategorias } from "@/components/FiltroCategorias";
import { ProdutoCard } from "@/components/ProdutoCard";
import { useProdutos } from "@/hooks/useProdutos";
import { Produto } from "@/types/produto.response";
import { Botao } from "@/ui/Botao";
import { Tela } from "@/ui/Tela";
import { aviso, confirmar } from "@/utils/aviso";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, RefreshControl } from "react-native";

export default function Index() {
  const { carregar, carregarPorCategoria, criar, deletar } = useProdutos();
  const qc = useQueryClient();

  const [categoria, setCategoria] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [preco, setPreco] = useState("");

  // queryKey muda com a categoria -> cada filtro tem seu próprio cache
  const chave = categoria ? ["produtos", categoria] : ["produtos"];

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: chave,
    queryFn: () => (categoria ? carregarPorCategoria(categoria) : carregar()),
  });

  const criarMut = useMutation({
    mutationFn: (p: Produto) => criar(p),
    onSuccess: (resp, enviado) => {
      // A fakestoreapi NÃO persiste o POST: se a gente só invalidasse, o refetch
      // traria a lista sem o item novo. Então refletimos direto no cache (update
      // otimista) usando o id que a API devolveu.
      const novo: Produto = { ...enviado, id: (resp as any)?.id ?? Date.now() };
      qc.setQueryData<Produto[]>(chave, (antigos = []) => [novo, ...antigos]);
      setTitulo("");
      setPreco("");
      aviso("Produto cadastrado!", `"${novo.title}" foi adicionado à lista.`);
    },
    onError: (e) => aviso("Erro ao cadastrar", (e as Error).message),
  });

  const excluirMut = useMutation({
    mutationFn: (id: number) => deletar(id),
    onSuccess: (_resp, id) =>
      qc.setQueryData<Produto[]>(chave, (antigos = []) =>
        antigos.filter((p) => p.id !== id)
      ),
    onError: (e) => aviso("Erro ao excluir", (e as Error).message),
  });

  const salvar = async () => {
    const precoNum = Number(preco.replace(",", "."));
    if (!titulo.trim()) return aviso("Preencha o título");
    if (!preco.trim() || Number.isNaN(precoNum) || precoNum <= 0)
      return aviso("Preço inválido", "Informe um número maior que zero.");

    const ok = await confirmar(
      "Salvar produto?",
      `${titulo.trim()} — R$ ${precoNum.toFixed(2)}`
    );
    if (!ok) return;

    criarMut.mutate({
      title: titulo.trim(),
      price: precoNum,
      description: "",
      category: categoria ?? "electronics",
      image: "https://i.pravatar.cc",
    });
  };

  if (isLoading) return <Carregando texto="Carregando produtos..." />;
  if (error) return <Erro texto={error.message} />;

  return (
    <Tela>
      <Campo label="Título" value={titulo} onChangeText={setTitulo} />
      <Campo label="Preço" value={preco} onChangeText={setPreco} keyboardType="numeric" />
      <Botao titulo="Salvar produto" onPress={salvar} carregando={criarMut.isPending} />

      <FiltroCategorias selecionada={categoria} aoSelecionar={setCategoria} />

      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        renderItem={({ item }) => (
          <ProdutoCard
            produto={item}
            onPress={() => router.push(`/produto/${item.id}`)}
            onExcluir={(id) => excluirMut.mutate(id)}
          />
        )}
      />
    </Tela>
  );
}
