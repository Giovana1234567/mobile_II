// ============================================================================
// components/FiltroCategorias.tsx  →  barra horizontal de categorias.
// Widget autossuficiente: faz a PRÓPRIA useQuery das categorias (dado que
// quase não muda -> staleTime alto). A tela só recebe qual está selecionada.
// ============================================================================

import { useProdutos } from "@/hooks/useProdutos";
import { Etiqueta } from "@/ui/Etiqueta";
import { useQuery } from "@tanstack/react-query";
import { ScrollView } from "react-native";

type Props = {
  selecionada: string | null;
  aoSelecionar: (categoria: string | null) => void;
};

export function FiltroCategorias({ selecionada, aoSelecionar }: Props) {
  const { carregarCategorias } = useProdutos();

  const { data: categorias } = useQuery({
    queryKey: ["categorias"],
    queryFn: carregarCategorias,
    staleTime: 1000 * 60 * 60, // 1h: categoria raramente muda
  });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 8 }}
    >
      <Etiqueta texto="Todas" ativa={!selecionada} onPress={() => aoSelecionar(null)} />
      {categorias?.map((c) => (
        <Etiqueta
          key={c}
          texto={c}
          ativa={selecionada === c}
          onPress={() => aoSelecionar(c)}
        />
      ))}
    </ScrollView>
  );
}
