import { http } from "@/lib/http";

export type DirectivoInput = {
  nombre_apellido: string;
};

export type AsignacionInput = {
  id_directivo: number;
  id_grupo_utn: number;
  id_cargo: number;
  fecha_inicio: string;
};

export async function crearDirectivo(payload: DirectivoInput) {
  return http<any>("/directivos/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listarDirectivos(grupoId: number) {
  return http<any>(`/directivos/grupo/${grupoId}/actuales`, {
    method: "GET",
  });
}


export async function asignarDirectivo(payload: AsignacionInput) {
  return http("/directivos/asignar", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}