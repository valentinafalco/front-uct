import { http } from "@/lib/http";

export type PersonalType =
  | "PTAA"
  | "PROFESIONAL"
  | "BECARIO"
  | "INVESTIGADOR";

export interface PersonalItem {
  id: number;
  nombre_apellido: string;
  horas_semanales: number;
  tipo: "PTAA" | "PROFESIONAL" | "BECARIO" | "INVESTIGADOR";
  activo: boolean;
  rol: string;
}


export interface PersonalPayload {
  nombre_apellido: string;
  horas_semanales: number;
  grupo_utn_id: number;
  tipo_personal_id: number;
  activo: boolean;
}

// 👉 GET listado general
export function getPersonal(tipo?: PersonalType) {
  if (tipo) {
    return http<PersonalItem[]>(`/personal-all/?tipo=${tipo}&grupo_id=<id>`);
  }
  return http<PersonalItem[]>("/personal-all/?grupo_id=<id>");
}


// 👉 POST / PUT PTAA + Profesional
export function upsertPersonal(payload: PersonalPayload) {
  return http("/personal/?grupo_id=<id>", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function actualizarPersonal(id: number, payload: any, rol: string) {
  return http(`/personal/${rol}/${id}?grupo_id=<id>`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function eliminarPersonal(id: number, rol: string) {
  return http(`/personal/${rol}/${id}?grupo_id=<id>`, {
    method: "DELETE",
  });
}

