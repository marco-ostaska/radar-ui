import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { listarCategorias } from "@/api/adm/listarCategorias";

const schema = z
  .object({
    ativo: z.string().min(1, "Ativo é obrigatório"),
    categoria: z.string().min(1, "Categoria é obrigatória"),
  })
  .superRefine(({ ativo, categoria }, ctx) => {
    const ativoUpper = ativo.toUpperCase();

    if (categoria !== "acoes") {
      if (ativoUpper.length !== 6) {
        ctx.addIssue({
          path: ["ativo"],
          message: "Para FIIs o ativo deve ter exatamente 6 caracteres.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!ativoUpper.endsWith("11")) {
        ctx.addIssue({
          path: ["ativo"],
          message: 'Para FIIs o ativo deve terminar com "11".',
          code: z.ZodIssueCode.custom,
        });
      }
    } else {
      if (
        !(
          ativoUpper.length === 5 ||
          (ativoUpper.length === 6 && ativoUpper.endsWith("11"))
        )
      ) {
        ctx.addIssue({
          path: ["ativo"],
          message:
            'Para ações, o ativo deve ter 5 caracteres (ex: VALE3) ou 6 terminando com "11" (ex: SANB11).',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export default function AddAtivoPage() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    listarCategorias()
      .then((cats) => setCategorias(cats))
      .catch((err) => console.error(err));
  }, []);

  // Inicialize o useForm SEM depender do state, sempre o mesmo esquema
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ativo: "",
      categoria: "", // Inicial vazio, depois seta ao carregar categorias
    },
  });

  // Quando carregar categorias, seta valor default
  useEffect(() => {
    if (categorias.length > 0) {
      setValue("categoria", categorias[0]);
    }
  }, [categorias, setValue]);

  const mutation = useMutation({
    mutationFn: async ({ categoria, ativo }) => {
      const res = await fetch(
        `http://localhost:8000/indicadores/admin/adicionar?tipo=${categoria}&ticker=${ativo.toUpperCase()}`,
        { method: "POST" }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Erro ao adicionar ativo");
      }
      return res.json();
    },
    onSuccess: (data) => {
      alert(data.message);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  function onSubmit(data) {
    mutation.mutate(data);
  }

  if (categorias.length === 0) {
    return <p>Carregando categorias...</p>;
  }

  return (
    <div className="flex justify-center p-8">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Adicionar Novo Ativo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="ativo">Ativo</Label>
                <Input id="ativo" placeholder="Ticker" {...register("ativo")} />
                {errors.ativo && (
                  <p className="text-red-600 text-sm">{errors.ativo.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  onValueChange={(value) => setValue("categoria", value)}
                  defaultValue={categorias[0]}
                >
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-100">
                    {categorias.map((categoria) => (
                      <SelectItem value={categoria} key={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoria && (
                  <p className="text-red-600 text-sm">
                    {errors.categoria.message}
                  </p>
                )}
              </div>
            </div>
            <CardFooter className="flex justify-end mt-4">
              <Button type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading ? "Enviando..." : "Adicionar"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
