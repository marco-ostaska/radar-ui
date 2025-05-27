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

import { listarCategorias } from "@/api/adm/listarCategorias";
import { listarAtivosPorCategoria } from "@/api/adm/listarAtivosPorCategoria";
import { removerAtivo } from "@/api/adm/removeAtivo";

export default function RemoveAtivoPage() {
  const { handleSubmit, setValue, watch, register } = useForm({
    defaultValues: {
      categoria: "", // Inicial vazio até carregar
      ativo: "none",
    },
  });

  const categoriaSelecionada = watch("categoria");
  const ativoSelecionado = watch("ativo");

  const [categorias, setCategorias] = useState([]);
  const [ativos, setAtivos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar categorias
  useEffect(() => {
    listarCategorias()
      .then((cats) => {
        setCategorias(cats);
        if (cats.length > 0) setValue("categoria", cats[0]);
      })
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, [setValue]);

  // Carregar ativos ao mudar categoria
  useEffect(() => {
    if (!categoriaSelecionada) return;

    listarAtivosPorCategoria(categoriaSelecionada)
      .then((tickers) => {
        setAtivos(tickers);
        setValue("ativo", "none");
        setSearchTerm("");
      })
      .catch((err) => console.error("Erro ao buscar ativos:", err));
  }, [categoriaSelecionada, setValue]);

  const filteredAtivos = ativos.filter((ativo) =>
    ativo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mutação para remover ativo usando a função removerAtivo
  const mutation = useMutation({
    mutationFn: ({ categoria, ativo }) => removerAtivo(categoria, ativo),
    onSuccess: (data) => {
      alert(data.message || "Ativo removido com sucesso");
      // Recarregue a lista de ativos após remoção
      listarAtivosPorCategoria(categoriaSelecionada).then((tickers) => {
        setAtivos(tickers);
        setValue("ativo", "none");
        setSearchTerm("");
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  function onSubmit(data) {
    mutation.mutate({
      categoria: data.categoria,
      ativo: data.ativo.toUpperCase(),
    });
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
                defaultValue=""
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
                    {filteredAtivos.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Nenhum ativo disponível
                      </SelectItem>
                    ) : (
                      filteredAtivos.map((ativo) => (
                        <SelectItem value={ativo} key={ativo}>
                          {ativo}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <CardFooter className="flex justify-end mt-4">
              <Button
                type="submit"
                disabled={
                  ativoSelecionado === "none" ||
                  mutation.isLoading ||
                  !categoriaSelecionada
                }
              >
                {mutation.isLoading ? "Removendo..." : "Remover"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
