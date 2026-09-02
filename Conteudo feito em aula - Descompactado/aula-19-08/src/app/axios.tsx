import { Produto, useProdutosAxios } from "@/hooks/useProdutosAxios";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Index() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const { carregar, criar } = useProdutosAxios();

  const carregarProdutos = async () => {
    try {
      const resposta = await carregar();
      setProdutos(resposta.products);
    } catch (e) {
      console.error("Erro ao buscar produto", e);
    }
  };

  const salvarProduto = async () => {
    try {
      const novoProduto: Produto = {
        id: 0,
        price: 0,
        description: "",
        title: nome,
        category: categoria,
      };

      await criar(novoProduto);
      setNome("");
      setCategoria("");
      Alert.alert("Produto criado com sucesso!");
    } catch (e) {
      Alert.alert("Erro ao cadastrar produto!", (e as Error).message);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.campo}
        placeholder="Nome do produto"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.campo}
        placeholder="Categoria do produto"
        value={categoria}
        onChangeText={setCategoria}
      />
      <Button title="Salvar" onPress={salvarProduto} />
      <FlatList
        data={produtos}
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
