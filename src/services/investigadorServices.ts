import { http } from "@/lib/http";

export interface InvestigadorPayload {
  nombre_apellido: string;
  horas_semanales: number;
  grupo_utn_id: number;
  tipo_dedicacion_id: number;   // 🔥 CORREGIDO
  categoria_utn_id?: number;
  programa_incentivos_id?: number;
  activo: boolean;
}

export function crearInvestigador(payload: InvestigadorPayload) {
  return http("/investigadores/?grupo_id=<id>", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function actualizarInvestigador(
  id: number,
  payload: any,
  rol: string
) {
  return http(`/personal/${rol}/${id}?grupo_id=<id>`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}


export function getInvestigadorById(id: number) {
  return http(`/investigadores/${id}?grupo_id=<id>`, {
    method: "GET",
  });
}

export function getInvestigadores() {
  return http("/investigadores/?grupo_id=<id>&activos=true", {
    method: "GET",
  });
}