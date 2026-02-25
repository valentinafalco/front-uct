import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";

export type Directivo = {
  id_directivo: number;
  nombre_apellido: string;
  cargo: string;
  fecha_inicio: string;
};

export function useDirectivos(grupoId?: number) {
  return useQuery({
    queryKey: ["directivos", grupoId],
    queryFn: () =>
      http<Directivo[]>(`/directivos/grupo/${grupoId}/actuales`, {
        method: "GET",
      }),
    enabled: !!grupoId,
  });
}