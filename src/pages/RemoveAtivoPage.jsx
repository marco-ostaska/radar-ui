import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const categorias = [
  "acoes",
  "fiagro",
  "hibrido",
  "infra",
  "logistica",
  "papel",
  "shopping",
];

export default function RemoveAtivoPage() {
  const { handleSubmit, setValue, watch, register } = useForm({
    defaultValues: {
      categoria: categorias[0],
      ativo: "none",
    },
  });

  const categoriaSelecionada = watch("categoria");
  const ativoSelecionado = watch("ativo");
  const [ativos, setAtivos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!categoriaSelecionada) return;

    fetch(
      `http://localhost:8000/indicadores/admin/listar?tipo=${categoriaSelecionada}`
    )
      .then((res) => res.json())
      .then((data) => {
        setAtivos(data.tickers || []);
        setValue("ativo", "none");
        setSearchTerm("");
      })
      .catch((err) => console.error("Erro ao buscar ativos:", err));
  }, [categoriaSelecionada, setValue]);

  const filteredAtivos = ativos.filter((ativo) =>
    ativo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mutation = useMutation({
    mutationFn: ({ categoria, ativo }) =>
      fetch(
        `http://localhost:8000/indicadores/admin/remover?tipo=${categoria}&ticker=${ativo.toUpperCase()}`,
        { method: "DELETE" }
      ).then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || "Erro ao remover ativo");
        return json;
      }),
    onSuccess: (data) => {
      alert(data.message || "Ativo removido com sucesso");
      // aqui pode chamar uma função para refazer fetch e atualizar a lista, se desejar
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  function onSubmit(data) {
    mutation.mutate(data);
  }

  return (
    <div className="flex justify-center p-8">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Remover Ativo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Categoria */}
            <div className="flex flex-col space-y-1.5 mb-4">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                {...register("categoria")}
                onValueChange={(value) => {
                  setValue("categoria", value);
                  setSearchTerm("");
                }}
                defaultValue={categorias[0]}
              >
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="bg-slate-100">
                  {categorias.map((cat) => (
                    <SelectItem value={cat} key={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ativo com filtro ao lado */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="ativo">Ativo</Label>
              <div className="flex space-x-2 items-center">
                <input
                  type="text"
                  placeholder="Filtrar ativo"
                  className="p-2 rounded border border-gray-300 w-24"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select
                  {...register("ativo")}
                  value={ativoSelecionado}
                  onValueChange={(value) => setValue("ativo", value)}
                  className="flex-grow"
                >
                  <SelectTrigger id="ativo" className="w-48">
                    <SelectValue placeholder="Selecione o ativo" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-100">
                    {filteredAtivos.length === 0 && (
                      <SelectItem value="none" disabled>
                        Nenhum ativo disponível
                      </SelectItem>
                    )}
                    {filteredAtivos.map((ativo) => (
                      <SelectItem value={ativo} key={ativo}>
                        {ativo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <CardFooter className="flex justify-end mt-4">
              <Button type="submit" disabled={ativoSelecionado === "none" || mutation.isLoading}>
                {mutation.isLoading ? "Removendo..." : "Remover"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
