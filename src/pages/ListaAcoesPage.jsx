  import { useEffect, useState } from "react";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import {
    Table,
    TableBody,
    TableRow,
    TableCell,
  } from "@/components/ui/table";

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

  export default function ListaAcoesPage() {
    const [categorias, setCategorias] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [ativos, setAtivos] = useState([]);

    useEffect(() => {
      if (!selectedCategory) return;

      fetch(`http://localhost:8000/indicadores/admin/listar?tipo=acoes`)
        .then((res) => res.json())
        .then((data) => {
          setAtivos(data.tickers || []);
        })
        .catch((err) => console.error("Erro ao buscar ativos:", err));
    }, [selectedCategory]);

    if (categorias.length === 0) return <p>Carregando categorias...</p>;

    return (
      <>
        <div className="flex justify-center p-8">
          <h1 className="text-2xl font-bold">Lista de Ações</h1>
        </div>
        <div className="flex justify-center items-center pb-8">
                <ListaTable ativos={ativos} />
            ))
        </div>
      </>
    );
  }
