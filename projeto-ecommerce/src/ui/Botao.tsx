// ui/Botao.tsx  →  botão estilizado com variantes e estado de carregando.
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
} from "react-native";
import { cores, espaco, raio } from "./tema";

type Props = PressableProps & {
  titulo: string;
  variante?: "primaria" | "perigo" | "contorno";
  carregando?: boolean;
};

export function Botao({ titulo, variante = "primaria", carregando, disabled, ...resto }: Props) {
  const contorno = variante === "contorno";
  return (
    <Pressable
      {...resto}
      disabled={disabled || carregando}
      style={({ pressed }) => [
        styles.base,
        variante === "primaria" && { backgroundColor: cores.primaria },
        variante === "perigo" && { backgroundColor: cores.perigo },
        contorno && { borderWidth: 1, borderColor: cores.primaria },
        (pressed || disabled || carregando) && { opacity: 0.6 },
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={contorno ? cores.primaria : cores.primariaTexto} />
      ) : (
        <Text style={[styles.texto, contorno && { color: cores.primaria }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: raio.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: espaco.lg,
  },
  texto: { color: cores.primariaTexto, fontWeight: "600", fontSize: 15 },
});
