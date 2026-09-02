// ============================================================================
// app/_layout.tsx  →  raiz do app (expo-router).
//   1) cria o QueryClient e envolve tudo no QueryClientProvider
//      (SEM isso: erro "No QueryClient set, use QueryClientProvider");
//   2) na inicialização, recarrega o token salvo (SecureStore) -> "lembra" o login;
//   3) define a navegação (<Stack>).
// ============================================================================

import { definirToken } from "@/utils/api";
import { lerToken } from "@/utils/sessao";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";

// Fora do componente: 1 instância para todo o ciclo de vida do app.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60, retry: 2 },
  },
});

export default function RootLayout() {
  // Recupera o token guardado e devolve para o interceptor do Axios.
  useEffect(() => {
    lerToken().then((token) => {
      if (token) definirToken(token);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="login" options={{ title: "Entrar" }} />
        <Stack.Screen name="index" options={{ title: "Produtos" }} />
        <Stack.Screen name="produto/[id]" options={{ title: "Detalhe" }} />
        <Stack.Screen name="infinita" options={{ title: "Lista infinita" }} />
      </Stack>
    </QueryClientProvider>
  );
}
