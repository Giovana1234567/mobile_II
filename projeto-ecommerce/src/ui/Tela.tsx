// ui/Tela.tsx  →  container padrão de tela (fundo + padding + safe area).
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, espaco } from "./tema";

export function Tela({ children }: { children: ReactNode }) {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View style={[styles.tela, { paddingTop: top + espaco.md, paddingBottom: bottom }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, paddingHorizontal: espaco.lg },
});
