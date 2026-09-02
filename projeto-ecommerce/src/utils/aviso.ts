// ============================================================================
// utils/aviso.ts  →  feedback multiplataforma.
// Alert do react-native só funciona em iOS/Android. No navegador é ignorado,
// então aqui caímos para window.alert / window.confirm quando Platform.OS === "web".
// ============================================================================

import { Alert, Platform } from "react-native";

const ehWeb = Platform.OS === "web";

/** Mensagem simples ("ok"). */
export function aviso(titulo: string, mensagem?: string) {
  if (ehWeb) {
    window.alert(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
    return;
  }
  Alert.alert(titulo, mensagem);
}

/** Confirmação (OK / Cancelar). Resolve true se o usuário confirmar. */
export function confirmar(titulo: string, mensagem?: string): Promise<boolean> {
  if (ehWeb) {
    return Promise.resolve(
      window.confirm(mensagem ? `${titulo}\n\n${mensagem}` : titulo)
    );
  }
  return new Promise((resolve) => {
    Alert.alert(titulo, mensagem, [
      { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
      { text: "Confirmar", onPress: () => resolve(true) },
    ]);
  });
}
