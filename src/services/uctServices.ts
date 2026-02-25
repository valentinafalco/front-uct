import { http } from "@/lib/http";

export type Uct = {
  id: number;
  facultadRegional: string;
  nombreSigla: string;
  correo: string;
  objetivos: string;
};

const BASE = import.meta.env.VITE_API_URL;

export async function getUct() {
  if (!BASE) return null;

  try {
    const data = await http<any>("/grupo-utn/");

    return {
      id: data.id,
      facultadRegional: data.nombre_unidad_academica,
      nombreSigla: data.nombre_sigla_grupo,
      correo: data.mail,
      objetivos: data.objetivo_desarrollo,
    } as Uct;

  } catch {
    return null;
  }
}

export async function upsertUct(payload: Uct, exists: boolean) {
  if (!BASE) return;

  const body = {
    nombre_unidad_academica: payload.facultadRegional,
    nombre_sigla_grupo: payload.nombreSigla,
    mail: payload.correo,
    objetivo_desarrollo: payload.objetivos,
  };

  const method = exists ? "PUT" : "POST";

  return http("/grupo-utn/", { method, body: JSON.stringify(body) });
}

export async function deleteUct() {
  return http<void>("/grupo-utn/", {
    method: "DELETE",
  });
}