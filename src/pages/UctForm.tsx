import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { useUct } from "@/hooks/useUct";
import type { Uct } from "@/services/uctServices";
import {
  crearDirectivo,
  asignarDirectivo,
} from "@/services/directivosServices";
import { getCargos, type Cargo } from "@/services/cargosServices";
import { useQuery } from "@tanstack/react-query";

type UctPayload = Omit<Uct, "id">;

export default function UctForm() {
  const { uct, save, saving } = useUct();
  const navigate = useNavigate();
  const isEdit = !!uct;

  const [data, setData] = useState<UctPayload>({
    facultadRegional: "",
    nombreSigla: "",
    correo: "",
    objetivos: "",
  });

  const [directivos, setDirectivos] = useState([
    {
      nombre_apellido: "",
      id_cargo: 1, // Director
      fecha_inicio: "",
    },
    {
      nombre_apellido: "",
      id_cargo: 2, // Vicedirector
      fecha_inicio: "",
    },
  ]);

  const { data: cargos = [] } = useQuery<Cargo[]>({
    queryKey: ["cargos"],
    queryFn: getCargos,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (uct) {
      setData({
        facultadRegional: uct.facultadRegional ?? "",
        nombreSigla: uct.nombreSigla ?? "",
        correo: uct.correo ?? "",
        objetivos: uct.objetivos ?? "",
      });
    }
  }, [uct]);

  const clearError = (field: string) => {
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const change =
    (k: keyof UctPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setData((d) => ({ ...d, [k]: value }));
      if (value.trim()) clearError(k);
    };

  const changeDirectivo =
  (index: number, field: string) =>
  (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value: any = e.target.value;

    // 👇 Convertimos a número si es el cargo
    if (field === "id_cargo") {
      value = Number(value);
    }

    setDirectivos((prev) =>
      prev.map((d, i) =>
        i === index ? { ...d, [field]: value } : d
      )
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.facultadRegional.trim())
      newErrors.facultadRegional = "Debe ingresar la facultad regional";

    if (!data.nombreSigla.trim())
      newErrors.nombreSigla = "Debe ingresar nombre y sigla";

    if (!data.correo.trim())
      newErrors.correo = "Debe ingresar correo electrónico";
    else if (!/^\S+@\S+\.\S+$/.test(data.correo))
      newErrors.correo = "Formato de correo inválido";

    if (!data.objetivos.trim())
      newErrors.objetivos = "Debe ingresar objetivos";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const grupo = (await save({
  ...data,
  facultadRegional: data.facultadRegional.trim(),
  nombreSigla: data.nombreSigla.trim(),
  correo: data.correo.trim(),
  objetivos: data.objetivos.trim(),
})) as Uct | undefined;

    const grupoId = grupo?.id ?? uct?.id;

    // 2️⃣ Crear y asignar directivos
    for (const d of directivos) {
      if (!d.nombre_apellido.trim()) continue;

      const nuevo = await crearDirectivo({
        nombre_apellido: d.nombre_apellido.trim(),
      });

      await asignarDirectivo({
        id_directivo: nuevo.id,
        id_grupo_utn: grupoId!,
        id_cargo: Number(d.id_cargo),
        fecha_inicio: d.fecha_inicio,
      });
    }

    navigate("/", {
      state: {
        successMessage: isEdit
          ? "UCT actualizada con éxito!"
          : "UCT creada con éxito!",
      },
    });
  };

  const inputClass = (field: string) =>
    `input ${
      errors[field] ? "!border-red-500 !ring-2 !ring-red-500" : ""
    }`;

  return (
    <section>
      <h2 className="text-3xl font-semibold mb-6">
        Configuración de la UCT
      </h2>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm space-y-6"
      >
        <Field label="Facultad Regional">
          <input
            className={inputClass("facultadRegional")}
            value={data.facultadRegional}
            onChange={change("facultadRegional")}
          />
          {errors.facultadRegional && (
            <ErrorText>{errors.facultadRegional}</ErrorText>
          )}
        </Field>

        <Field label="Nombre y Sigla del Grupo">
          <input
            className={inputClass("nombreSigla")}
            value={data.nombreSigla}
            onChange={change("nombreSigla")}
          />
          {errors.nombreSigla && (
            <ErrorText>{errors.nombreSigla}</ErrorText>
          )}
        </Field>

        <Field label="Correo electrónico">
          <input
            type="email"
            className={inputClass("correo")}
            value={data.correo}
            onChange={change("correo")}
          />
          {errors.correo && (
            <ErrorText>{errors.correo}</ErrorText>
          )}
        </Field>

        <Field label="Objetivos y desarrollo">
          <textarea
            rows={6}
            className={`${inputClass("objetivos")} resize-y`}
            value={data.objetivos}
            onChange={change("objetivos")}
          />
          {errors.objetivos && (
            <ErrorText>{errors.objetivos}</ErrorText>
          )}
        </Field>

        {/* 🔹 DIRECTIVOS */}
        <hr className="my-6" />
        <h3 className="text-lg font-semibold">
          Directivos
        </h3>

        {directivos.map((d, index) => (
          <div
            key={index}
            className="grid md:grid-cols-3 gap-4 border p-4 rounded-xl bg-slate-50"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre y Apellido
              </label>
              <input
                className="input"
                value={d.nombre_apellido}
                onChange={changeDirectivo(index, "nombre_apellido")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Cargo
              </label>
              <select
  className="input"
  value={d.id_cargo ?? ""}
  onChange={(e) =>
    setDirectivos((prev) =>
      prev.map((dir, i) =>
        i === index
          ? { ...dir, id_cargo: Number(e.target.value) }
          : dir
      )
    )
  }
>
  <option value="">Seleccionar cargo</option>
  {cargos.map((c) => (
    <option key={c.id} value={c.id}>
      {c.nombre}
    </option>
  ))}
</select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha inicio
              </label>
              <input
                type="date"
                className="input"
                value={d.fecha_inicio}
                onChange={changeDirectivo(index, "fecha_inicio")}
              />
            </div>
          </div>
        ))}

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>

          <Button type="submit" disabled={saving} size="sm">
            {saving ? "Guardando…" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-red-500 text-sm mt-1">
      {children}
    </p>
  );
}