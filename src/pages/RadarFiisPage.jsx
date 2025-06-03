"use client";

import React, { useState, useEffect } from "react";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { listarCategorias } from "@/api/adm/listarCategorias";
import { listarAtivosPorCategoria } from "@/api/adm/listarAtivosPorCategoria";
import { fetchRadaFii } from "@/api/fii/radar";
import { fetchIndices } from "@/api/indices/atualiza";
import {
  flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function setTextColor(atributo, valor) {
  if (atributo === undefined || valor === undefined || atributo === null || valor === null) {
    return "";
  }
  const numAtributo = Number(atributo);
  const numValor = Number(valor);
  if (isNaN(numAtributo) || isNaN(numValor)) {
    return "";
  }
  if (numAtributo > numValor) {
    return "text-green-700"; // Bom
  } else if (numAtributo === numValor) {
    return "text-yellow-600"; // Neutro
  } else {
    return "text-red-700"; // Ruim
  }
}

function TabelaCategoria({ data, totalAtivos, indiceBase }) {
  const columns = React.useMemo(() => [
    {
      accessorKey: "ticker",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Ativo <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.getValue("ticker")
    },
    {
      accessorKey: "cotacao",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Cotação <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => `R$ ${row.getValue("cotacao")?.toFixed(2)}`
    },
    {
      accessorKey: "vpa",
      header: "Valor Patrimonial",
      cell: ({ row }) => (
        <div className={setTextColor(row.getValue("vpa"), row.getValue("cotacao"))}>
          R$ {row.getValue("vpa")?.toFixed(2)}
        </div>
      )
    },
    {
      accessorKey: "teto_div",
      header: "Valor Teto por DY",
      cell: ({ row }) => (
        <div className={setTextColor(row.getValue("teto_div"), row.getValue("cotacao"))}>
          R$ {row.getValue("teto_div")?.toFixed(2)}
        </div>
      )
    },
    {
      accessorKey: "dy_estimado",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          DY <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className={setTextColor(row.getValue("dy_estimado"), indiceBase)}>
          {row.getValue("dy_estimado")}%</div>
      )
    },
    {
      accessorKey: "rendimento_real",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Rendimento Real <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className={setTextColor(row.getValue("rendimento_real"), indiceBase)}>
          {row.getValue("rendimento_real")}%</div>
      )
    },
    {
      accessorKey: "potencial",
      header: "Potencial",
      cell: ({ row }) => (
        <div className={setTextColor(row.getValue("potencial"), 0)}>
          {row.getValue("potencial")}%</div>
      )
    },
    {
      accessorKey: "nota_risco",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nota Risco <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className={setTextColor(row.getValue("nota_risco"), 5)}>
          {row.getValue("nota_risco")}
        </div>
      )
    },
    {
      accessorKey: "score",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Score <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className={setTextColor(row.getValue("score"), 5)}>
          {row.getValue("score")}
        </div>
      )
    },
    {
      accessorKey: "comprar",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Comprar <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const comprar = row.getValue("comprar");
        return <span className={comprar ? "text-green-600" : "text-red-500"}>{comprar ? "Sim" : "-"}</span>;
      },
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) ? 1 : 0;
        const b = rowB.getValue(columnId) ? 1 : 0;
        return a - b;
      }
}

  ], [indiceBase]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="flex items-center justify-between py-2">
        <div>
          Ativos Carregados: {data.length} de {totalAtivos}
          <Progress value={(data.length / (totalAtivos || 1)) * 100} />
        </div>
      </div>
      <div className="rounded-md border">
        {totalAtivos && totalAtivos > 0 && data.length === 0 ? (
          <div className="p-4 text-center">Carregando dados...</div>
        ) : data.length === 0 ? (
          <div className="p-4 text-center">Nenhum dado carregado.</div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="text-center align-middle">
                  {hg.headers.map((h) => (
                    <TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center align-middle">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}

export default function RadarFiisPage() {
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [ativosPorCategoria, setAtivosPorCategoria] = useState({});
  const [dataPorCategoria, setDataPorCategoria] = useState({});
  const [totalAtivos, setTotalAtivos] = useState({});
  const [indiceBase, setIndiceBase] = useState(0);

  useEffect(() => {
    listarCategorias()
      .then((cats) => {
        const filtered = cats.filter((cat) => cat !== "acoes");
        setCategorias(filtered);
        setSelectedCategory(filtered[0] || null);
      })
      .catch((err) => console.error("Erro ao buscar categorias:", err));

    fetchIndices()
      .then((indices) => {
        setIndiceBase(indices.spread_indices ?? 0);
      })
      .catch((err) => console.error("Erro ao buscar índices:", err));
  }, []);

  useEffect(() => {
    if (!selectedCategory || ativosPorCategoria[selectedCategory]) return;

    listarAtivosPorCategoria(selectedCategory)
      .then(async (ativos) => {
        setAtivosPorCategoria((prev) => ({ ...prev, [selectedCategory]: ativos }));
        setTotalAtivos((prev) => ({ ...prev, [selectedCategory]: ativos.length }));

        for (const ticker of ativos) {
          try {
            const result = await fetchRadaFii(ticker);
            setDataPorCategoria((prev) => ({
              ...prev,
              [selectedCategory]: [...(prev[selectedCategory] || []), result],
            }));
          } catch (err) {
            console.error(`Erro ao buscar radar para ${ticker}:`, err);
          }
        }
      })
      .catch((err) => console.error("Erro ao buscar ativos da categoria:", err));
  }, [selectedCategory, ativosPorCategoria]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-center my-4">Radar FIIs</h1>
      {categorias.length === 0 ? (
        <p>Carregando categorias...</p>
      ) : (
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="p-4">
          <TabsList className="space-x-4">
            {categorias.map((cat) => (
              <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
            ))}
          </TabsList>
          {categorias.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <TabelaCategoria
                data={dataPorCategoria[cat] || []}
                totalAtivos={totalAtivos[cat]}
                indiceBase={indiceBase}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
