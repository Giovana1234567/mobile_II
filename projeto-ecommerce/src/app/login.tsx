// ============================================================================
// app/login.tsx  →  fluxo de autenticação básico.
// Formulário -> useMutation(login) -> guarda token -> navega para a lista.
// Usa useMutation (e não useQuery) porque login é uma AÇÃO, não uma leitura.
// ============================================================================

import { Campo } from "@/components/Campo";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("mor_2314"); // já preenchido p/ testar
  const [password, setPassword] = useState("83r5^_");

  const loginMutation = useMutation({
    mutationFn: () => login({ username, password }),
    onSuccess: () => router.replace("/"), // vai para app/index.tsx
    onError: (e) => Alert.alert("Falha no login", e.message),
  });

  return (
    <View style={styles.container}>
      <Campo label="Usuário" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <Campo
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loginMutation.isPending ? "Entrando..." : "Entrar"}
        onPress={() => loginMutation.mutate()}
        disabled={loginMutation.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
});
