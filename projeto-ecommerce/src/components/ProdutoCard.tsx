// ============================================================================
// components/ProdutoCard.tsx  →  visual de UM produto na lista.
// Recebe o produto por prop; onPress (abrir detalhe) e onExcluir são opcionais.
// Sem lógica de API aqui. Reaproveitável em qualquer FlatList de produtos.
// ============================================================================

import { Produto } from "@/types/produto.response";
import { Cartao } from "@/ui/Cartao";
import { Preco, Subtitulo } from "@/ui/Texto";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  produto: Produto;
  onPress?: () => void;
  onExcluir?: (id: number) => void;
};

export function ProdutoCard({ produto, onPress, onExcluir }: Props) {
  return (
    <Cartao onPress={onPress}>
      <View style={styles.linha}>
        <Image source={{ uri: produto.image }} style={styles.imagem} resizeMode="contain" />

        <View style={styles.info}>
          <Text style={styles.titulo} numberOfLines={2}>
            {produto.title}
          </Text>
          <Preco valor={produto.price} />
          <Subtitulo>{produto.category}</Subtitulo>
        </View>

        {onExcluir && produto.id != null && (
          <Pressable onPress={() => onExcluir(produto.id!)} hitSlop={8} style={styles.botaoX}>
            <Text style={styles.x}>✕</Text>
          </Pressable>
        )}
      </View>
    </Cartao>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: "row", gap: 10, alignItems: "center" },
  imagem: { width: 56, height: 56 },
  info: { flex: 1 },
  titulo: { fontSize: 14, fontWeight: "600" },
  botaoX: { padding: 6 },
  x: { color: "#dc2626", fontSize: 16 },
});
