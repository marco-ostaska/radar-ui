import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";

import { listarCategorias } from "@/api/adm/listarCategorias";
import { listarAtivosPorCategoria } from "@/api/adm/listarAtivosPorCategoria";

function ListaTable({ ativos }) {
  return (
    <Table className="w-full max-w-5xl mx-auto p-8">
      <TableBody>
        {ativos.map((ativo) => (
          <TableRow key={ativo}>
            <TableCell>{ativo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function ListaFiisPage() {
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [ativos, setAtivos] = useState([]);

  useEffect(() => {
    listarCategorias()
      .then((cats) => {
        const filtered = cats.filter((cat) => cat !== "acoes");
        setCategorias(filtered);
        setSelectedCategory(filtered[0] || null);
      })
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;

    listarAtivosPorCategoria(selectedCategory)
      .then((tickers) => {
        setAtivos(tickers);
      })
      .catch((err) => console.error("Erro ao buscar ativos:", err));
  }, [selectedCategory]);

  if (categorias.length === 0) return <p>Carregando categorias...</p>;

  return (
    <>
      <div className="flex justify-center p-8">
        <h1 className="text-2xl font-bold">Lista de FIIs</h1>
      </div>
      <div className="flex justify-center items-center pb-8">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="space-x-16">
            {categorias.map((categoria) => (
              <TabsTrigger value={categoria} key={categoria}>
                {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categorias.map((categoria) => (
            <TabsContent value={categoria} key={categoria} className="p-8">
              <ListaTable ativos={ativos} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}
