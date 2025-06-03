"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { listarCategorias } from "@/api/adm/listarCategorias";
import { listarAtivosPorCategoria } from "@/api/adm/listarAtivosPorCategoria";
import { fetchRadaFii } from "@/api/fii/radar";
import { fetchIndices } from "@/api/indices/atualiza";

function setTextColor(atributo, valor) {
  if (atributo === undefined || valor === undefined || atributo === null || valor === null) return "";
  const numAtributo = Number(atributo);
  const numValor = Number(valor);
  if (isNaN(numAtributo) || isNaN(numValor)) return "";
  if (numAtributo > numValor) return "text-green-700";
  if (numAtributo === numValor) return "text-yellow-600";
  return "text-red-700";
}

export default function RadarFIIsDia() {
  const [data, setData] = useState([]);
  const [indices, setIndices] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [totalAtivos, setTotalAtivos] = useState(0);
  const [processados, setProcessados] = useState(0); // 👈 Contador de processados
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const hasFetched = useRef(false);

  useEffect(() => {
    fetchIndices()
      .then(setIndices)
      .catch((err) => console.error("Erro ao buscar índices:", err));

    listarCategorias()
      .then(cats => {
        const filtered = cats.filter(cat => cat !== "acoes");
        setCategorias(filtered);
      })
      .catch(err => console.error("Erro ao buscar categorias:", err));
  }, []);

  const indiceBase = indices.spread_indices ?? 0;

  useEffect(() => {
    if (hasFetched.current || categorias.length === 0) return;
    hasFetched.current = true;

    async function fetchData() {
      try {
        let ativos = [];
        for (const cat of categorias) {
          const ativosCat = await listarAtivosPorCategoria(cat);
          ativos.push(...ativosCat.map(ticker => ({ ticker, cat })));
        }
        setTotalAtivos(ativos.length);
        for (const { ticker, cat } of ativos) {
          const resultado = await fetchRadaFii(ticker);
          setProcessados((prev) => prev + 1); // 👈 Incrementa processados
          if (resultado.comprar) {
            setData((prev) => [...prev, resultado]);
          }
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      } catch (error) {
        console.error("Erro ao buscar dados do radar:", error);
      }
    }

    fetchData();
  }, [categorias]);

  const columns = useMemo(() => [
    { accessorKey: "ticker", header: ({ column }) => (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Ativo <ArrowUpDown className="ml-2 h-4 w-4" /></Button>), cell: ({ row }) => row.getValue("ticker") },
    { accessorKey: "cotacao", header: "Cotação", cell: ({ row }) => `R$ ${row.getValue("cotacao")?.toFixed(2)}` },
    { accessorKey: "vpa", header: "Valor Patrimonial", cell: ({ row }) => <div className={setTextColor(row.getValue("vpa"), row.getValue("cotacao"))}>R$ {row.getValue("vpa")?.toFixed(2)}</div> },
    { accessorKey: "teto_div", header: "Valor Teto por DY", cell: ({ row }) => <div className={setTextColor(row.getValue("teto_div"), row.getValue("cotacao"))}>R$ {row.getValue("teto_div")?.toFixed(2)}</div> },
    { accessorKey: "dy_estimado", header: ({ column }) => (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>DY <ArrowUpDown className="ml-2 h-4 w-4" /></Button>), cell: ({ row }) => <div className={setTextColor(row.getValue("dy_estimado"), indiceBase)}>{row.getValue("dy_estimado")}%</div> },
    { accessorKey: "rendimento_real", header: ({ column }) => (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Rendimento Real <ArrowUpDown className="ml-2 h-4 w-4" /></Button>), cell: ({ row }) => <div className={setTextColor(row.getValue("rendimento_real"), indiceBase)}>{row.getValue("rendimento_real")}%</div> },
    { accessorKey: "potencial", header: "Potencial", cell: ({ row }) => <div className={setTextColor(row.getValue("potencial"), 0)}>{row.getValue("potencial")}%</div> },
    { accessorKey: "nota_risco", header: ({ column }) => (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Nota Risco <ArrowUpDown className="ml-2 h-4 w-4" /></Button>), cell: ({ row }) => <div className={setTextColor(row.getValue("nota_risco"), 5)}>{row.getValue("nota_risco")}</div> },
    { accessorKey: "score", header: ({ column }) => (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Score <ArrowUpDown className="ml-2 h-4 w-4" /></Button>), cell: ({ row }) => <div className={setTextColor(row.getValue("score"), 5)}>{row.getValue("score")}</div> },
    { accessorKey: "comprar", header: "Comprar", cell: ({ row }) => { const comprar = row.getValue("comprar"); return <span className={comprar ? "text-green-600" : "text-red-500"}>{comprar ? "Sim" : "-"}</span>; } } 
  ], [indiceBase]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-center my-4">Radar FIIs - Apenas Comprar</h1>
      <div className="flex items-center justify-between py-4">
        {processados < totalAtivos && (
        <div>
            Procurando Fiis para Compra: {(processados / totalAtivos * 100).toFixed(2)}% ...... [{processados}/{totalAtivos}]
            <Progress value={(processados / totalAtivos) * 100} />
        </div>
        )}

        
        <Input placeholder="Filtrar Ativo" value={table.getColumn("ticker")?.getFilterValue() ?? ""} onChange={e => table.getColumn("ticker")?.setFilterValue(e.target.value)} className="max-w-sm" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="outline">Colunas <ChevronDown /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().filter(c => c.getCanHide()).map(c => (
              <DropdownMenuCheckboxItem key={c.id} checked={c.getIsVisible()} onCheckedChange={val => c.toggleVisibility(!!val)}>{c.id}</DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        {data.length === 0 ? (
          <div className="text-center p-4">Nenhum FII recomendado no momento.</div>
        ) : (
          <Table>
            <TableHeader>{table.getHeaderGroups().map(hg => <TableRow key={hg.id}>{hg.headers.map(h => <TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>)}</TableRow>)}</TableHeader>
            <TableBody>{table.getRowModel().rows.map(row => <TableRow key={row.id}>{row.getVisibleCells().map(cell => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}</TableRow>)}</TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
