import { useProdutoFetch } from "@/hooks/useProdutosFetch";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [produtos, setProdutos] = useState([])
  const { carregar } = useProdutoFetch()

  const carregarProdutos = async () => {
    try {
      const resposta = await carregar();
      setProdutos(resposta.products)
    } catch (e) {
      console.error('Erro ao buscar produto', e)
    }
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={produtos}
        renderItem={({item}: {item: any}) => (
          <View>
            <Text>{item.id} - {item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
