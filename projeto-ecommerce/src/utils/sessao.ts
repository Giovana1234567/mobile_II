// ============================================================================
// utils/sessao.ts  →  armazenamento SEGURO do token de sessão.
// Usa expo-secure-store (Keychain no iOS / Keystore no Android = criptografado).
// É a resposta "de produção" para "armazenamento seguro de tokens" da matéria.
//
// Instale com:  npx expo install expo-secure-store
// ============================================================================

import * as SecureStore from "expo-secure-store";

const CHAVE_TOKEN = "token_sessao";

export async function salvarToken(token: string) {
  await SecureStore.setItemAsync(CHAVE_TOKEN, token);
}

export async function lerToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(CHAVE_TOKEN);
}

export async function limparToken() {
  await SecureStore.deleteItemAsync(CHAVE_TOKEN);
}
