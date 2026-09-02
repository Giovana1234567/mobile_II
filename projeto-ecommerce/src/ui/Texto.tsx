// ui/Texto.tsx  →  Titulo, Subtitulo e Preco prontos.
import { StyleSheet, Text, TextProps } from "react-native";
import { cores } from "./tema";

export function Titulo(p: TextProps) {
  return <Text {...p} style={[styles.titulo, p.style]} />;
}
export function Subtitulo(p: TextProps) {
  return <Text {...p} style={[styles.subtitulo, p.style]} />;
}
export function Preco({ valor }: { valor: number }) {
  return <Text style={styles.preco}>R$ {valor.toFixed(2)}</Text>;
}

const styles = StyleSheet.create({
  titulo: { fontSize: 20, fontWeight: "700", color: cores.texto },
  subtitulo: { fontSize: 13, color: cores.textoFraco },
  preco: { fontSize: 16, fontWeight: "700", color: cores.sucesso },
});
