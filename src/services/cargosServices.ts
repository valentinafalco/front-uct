import { http } from "@/lib/http";

export type Cargo = {
  id: number;
  nombre: string;
};

export async function getCargos(): Promise<Cargo[]> {
  return http("/cargos", { method: "GET" });
}