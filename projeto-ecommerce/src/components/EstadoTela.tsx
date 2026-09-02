// ============================================================================
// components/EstadoTela.tsx  →  telas de "Carregando..." e "Erro" reutilizáveis.
// Toda tela que usa useQuery precisa tratar isLoading e error; em vez de
// repetir o JSX, centralizamos aqui. (Na aula isso era copiado/colado.)
// ============================================================================

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function Carregando({ texto = "Carregando..." }: { texto?: string }) {
  return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" />
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}

export function Erro({ texto = "Ocorreu um erro ao carregar." }: { texto?: string }) {
  return (
    <View style={styles.centro}>
      <Text style={[styles.texto, { color: "#c00" }]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  texto: { fontSize: 15, color: "#555" },
});
