// ============================================================================
// app/produto/[id].tsx  →  DETALHE + EDIÇÃO de um produto.
// Rota dinâmica do expo-router: o arquivo [id].tsx responde a /produto/123.
//
// Demonstra:
//   - useLocalSearchParams -> pega o :id da URL
//   - useQuery com queryKey dependente do id: ["produto", id]
//   - useMutation PUT com ATUALIZAÇÃO OTIMISTA (onMutate / rollback / onSettled)
// ============================================================================

import { Carregando, Erro } from "@/components/EstadoTela";
import { useProdutos } from "@/hooks/useProdutos";
import { Produto } from "@/types/produto.response";
import { Botao } from "@/ui/Botao";
import { Tela } from "@/ui/Tela";
import { Preco, Subtitulo, Titulo } from "@/ui/Texto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Alert, Image, StyleSheet } from "react-native";

export default function DetalheProduto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const idNum = Number(id);
  const { carregarUm, atualizar } = useProdutos();
  const qc = useQueryClient();

  const chave = ["produto", idNum];

  const { data: produto, isLoading, error } = useQuery({
    queryKey: chave,
    queryFn: () => carregarUm(idNum),
    enabled: !Number.isNaN(idNum), // só busca se o id for válido
  });

  // PUT com atualização otimista: a UI muda ANTES da resposta do servidor.
  const aumentarPreco = useMutation({
    mutationFn: (p: Produto) => atualizar({ ...p, price: p.price + 10 }),

    onMutate: async (p) => {
      await qc.cancelQueries({ queryKey: chave }); // evita corrida
      const anterior = qc.getQueryData<Produto>(chave); // snapshot p/ rollback
      qc.setQueryData<Produto>(chave, { ...p, price: p.price + 10 }); // aplica já
      return { anterior };
    },
    onError: (_e, _p, ctx) => {
      qc.setQueryData(chave, ctx?.anterior); // deu ruim -> volta ao estado anterior
      Alert.alert("Erro ao atualizar", "Alteração desfeita.");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: chave }); // confirma com o servidor
      qc.invalidateQueries({ queryKey: ["produtos"] }); // e a lista
    },
  });

  if (isLoading) return <Carregando />;
  if (error || !produto) return <Erro texto={error?.message ?? "Produto não encontrado"} />;

  return (
    <Tela>
      <Image source={{ uri: produto.image }} style={styles.imagem} resizeMode="contain" />
      <Titulo>{produto.title}</Titulo>
      <Subtitulo>{produto.category}</Subtitulo>
      <Preco valor={produto.price} />
      <Subtitulo style={styles.desc}>{produto.description}</Subtitulo>

      <Botao
        titulo="Aumentar preço em R$ 10 (otimista)"
        onPress={() => aumentarPreco.mutate(produto)}
        carregando={aumentarPreco.isPending}
      />
    </Tela>
  );
}

const styles = StyleSheet.create({
  imagem: { width: "100%", height: 200, marginBottom: 12 },
  desc: { marginVertical: 12 },
});
