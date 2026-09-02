// ui/Cartao.tsx  →  "caixa" branca com sombra. Base para itens de lista.
import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { cores, espaco, raio } from "./tema";

type Props = { children: ReactNode; onPress?: () => void };

export function Cartao({ children, onPress }: Props) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.cartao, pressed && { opacity: 0.7 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={styles.cartao}>{children}</View>;
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: cores.cartao,
    borderRadius: raio.md,
    padding: espaco.md,
    marginBottom: espaco.sm,
    borderWidth: 1,
    borderColor: cores.borda,
  },
});
