// ui/Etiqueta.tsx  →  "chip"/badge. Serve para categoria, status, filtro selecionável.
import { Pressable, StyleSheet, Text } from "react-native";
import { cores, espaco, raio } from "./tema";

type Props = {
  texto: string;
  ativa?: boolean;
  onPress?: () => void;
};

export function Etiqueta({ texto, ativa, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.chip, ativa ? styles.ativa : styles.inativa]}
    >
      <Text style={[styles.texto, ativa && { color: cores.primariaTexto }]}>{texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: espaco.xs,
    paddingHorizontal: espaco.md,
    borderRadius: raio.lg,
    marginRight: espaco.sm,
  },
  ativa: { backgroundColor: cores.primaria },
  inativa: { backgroundColor: "#eef2ff" },
  texto: { fontSize: 13, color: cores.texto },
});
