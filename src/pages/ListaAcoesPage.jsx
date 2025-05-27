import { useEffect, useState } from "react";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
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

export default function ListaAcoesPage() {
  const [ativos, setAtivos] = useState([]);

  useEffect(() => {
    listarAtivosPorCategoria("acoes")
      .then((tickers) => {
        setAtivos(tickers);
      })
      .catch((err) => console.error("Erro ao buscar ativos:", err));
  }, []);

  return (
    <>
      <div className="flex justify-center p-8">
        <h1 className="text-2xl font-bold">Lista de Ações</h1>
      </div>
      <div className="flex justify-center items-center pb-8">
        <ListaTable ativos={ativos} />
      </div>
    </>
  );
}
