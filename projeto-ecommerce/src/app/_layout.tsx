// ============================================================================
// app/_layout.tsx  →  raiz do app (expo-router).
// 2 responsabilidades:
//   1) criar o QueryClient e envolver tudo no QueryClientProvider
//      (SEM isso, nenhum useQuery/useMutation funciona -> erro "No QueryClient set");
//   2) definir a navegação (<Stack>).
// (Idêntico a "revisao-pre-ava1/src/app/_layout.tsx", + a tela de login.)
// ============================================================================

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

// Criado FORA do componente: 1 instância para todo o ciclo de vida do app.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 min "fresco" antes de refazer a busca
      retry: 2, // tenta 2x antes de considerar erro
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="login" options={{ title: "Entrar" }} />
        <Stack.Screen name="index" options={{ title: "Produtos" }} />
        <Stack.Screen name="infinita" options={{ title: "Lista infinita" }} />
      </Stack>
    </QueryClientProvider>
  );
}
