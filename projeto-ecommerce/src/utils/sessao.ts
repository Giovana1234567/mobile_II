// ============================================================================
// utils/sessao.ts  →  armazenamento SEGURO do token de sessão.
// Nativo (iOS/Android): expo-secure-store (Keychain / Keystore = criptografado).
// É a resposta "de produção" para "armazenamento seguro de tokens" da matéria.
//
// Web: expo-secure-store não existe no navegador, então caímos para
// localStorage (só para o app rodar no `expo start --web` em desenvolvimento).
//
// Instale com:  npx expo install expo-secure-store
// ============================================================================

import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const CHAVE_TOKEN = "token_sessao";

const ehWeb = Platform.OS === "web";

export async function salvarToken(token: string) {
  if (ehWeb) {
    localStorage.setItem(CHAVE_TOKEN, token);
    return;
  }
  await SecureStore.setItemAsync(CHAVE_TOKEN, token);
}

export async function lerToken(): Promise<string | null> {
  if (ehWeb) {
    return localStorage.getItem(CHAVE_TOKEN);
  }
  return await SecureStore.getItemAsync(CHAVE_TOKEN);
}

export async function limparToken() {
  if (ehWeb) {
    localStorage.removeItem(CHAVE_TOKEN);
    return;
  }
  await SecureStore.deleteItemAsync(CHAVE_TOKEN);
}
