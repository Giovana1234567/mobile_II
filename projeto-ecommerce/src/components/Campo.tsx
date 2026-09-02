// ============================================================================
// components/Campo.tsx  →  TextInput reutilizável (rótulo + input estilizado).
// Evita repetir <TextInput style={...}> em toda tela (login, formulário, etc).
// ============================================================================

import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

// Aproveita todas as props do TextInput e adiciona "label".
type Props = TextInputProps & {
  label: string;
};

export function Campo({ label, style, ...resto }: Props) {
  return (
    <View style={styles.grupo}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, style]} {...resto} />
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: { marginBottom: 12 },
  label: { fontSize: 13, marginBottom: 4, color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
