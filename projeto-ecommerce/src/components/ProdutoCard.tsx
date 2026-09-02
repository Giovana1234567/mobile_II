// ============================================================================
// components/ProdutoCard.tsx  →  visual de UM produto na lista.
// Recebe o produto por prop e um onExcluir opcional. Sem lógica de API aqui.
// Reaproveitável em qualquer FlatList de produtos.
// ============================================================================

import { Produto } from "@/types/produto.response";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  produto: Produto;
  onExcluir?: (id: number) => void;
};

export function ProdutoCard({ produto, onExcluir }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: produto.image }} style={styles.imagem} resizeMode="contain" />

      <View style={styles.info}>
        <Text style={styles.titulo} numberOfLines={2}>
          {produto.title}
        </Text>
        <Text style={styles.preco}>R$ {produto.price.toFixed(2)}</Text>
        <Text style={styles.categoria}>{produto.category}</Text>
      </View>

      {onExcluir && produto.id != null && (
        <Pressable onPress={() => onExcluir(produto.id!)} style={styles.botaoX}>
          <Text style={styles.x}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
  },
  imagem: { width: 56, height: 56 },
  info: { flex: 1 },
  titulo: { fontSize: 14, fontWeight: "600" },
  preco: { fontSize: 14, color: "#1a7f37", marginTop: 2 },
  categoria: { fontSize: 12, color: "#888", marginTop: 2 },
  botaoX: { padding: 6 },
  x: { color: "#c00", fontSize: 16 },
});
