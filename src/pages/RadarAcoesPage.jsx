"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listarAtivosPorCategoria } from "@/api/adm/listarAtivosPorCategoria";
import { fetchRadarAcao } from "@/api/acoes/radar";
import { fetchIndices } from "@/api/indices/atualiza";

function setTextColor(atributo, valor) {
  const numAtributo = Number(atributo);
  const numValor = Number(valor);
  if (isNaN(numAtributo) || isNaN(numValor)) return "text-gray-500";
  if (numAtributo === numValor) return "text-yellow-600";
  if (numAtributo > numValor) return "text-green-700";
  return "text-red-700";
}

export default function RadarAcoes() {
  const [data, setData] = useState([]);
  const [indices, setIndices] = useState({});
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [totalAtivos, setTotalAtivos] = useState(0);
  const hasFetched = useRef(false);

  // Carregar os índices ao iniciar
  useEffect(() => {
    fetchIndices()
      .then(setIndices)
      .catch((err) => console.error("Erro ao buscar índices:", err));
  }, []);

  // Pega juros reais ou 0 se não carregado
  const jurosReais = indices.juros_reais ?? 0;

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchData() {
      try {
        const ativos = await listarAtivosPorCategoria("acoes");
        setTotalAtivos(ativos.length);
        for (let i = 0; i < ativos.length; i++) {
          const ativo = ativos[i];
          const resultado = await fetchRadarAcao(ativo);
          setData((prev) => [...prev, resultado]);
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      } catch (error) {
        console.error("Erro ao buscar dados do radar:", error);
      }
    }

    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "ticker",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ativo <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("ticker")}</div>,
      },
      {
        accessorKey: "cotacao",
        header: "Cotação",
        cell: ({ row }) => (
          <div className="justify-center flex">
            R$ {row.getValue("cotacao")?.toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: "teto_por_lucro",
        header: "Cotação/Lucro",
        cell: ({ row }) => {
          const cotacao = row.getValue("cotacao");
          const teto = row.getValue("teto_por_lucro");
          return (
            <div className={`${setTextColor(teto, cotacao)}`}>
              R$ {teto?.toFixed(2)}
            </div>
          );
        },
      },
      {
        accessorKey: "valor_teto_por_dy",
        header: "Valor Teto DY",
        cell: ({ row }) => {
          const dy = row.getValue("dy_estimado");
          const tetoDY = row.getValue("valor_teto_por_dy");
          return (
            <div className={`${setTextColor(tetoDY, dy)}`}>R$ {tetoDY}</div>
          );
        },
      },
      {
        accessorKey: "dy_estimado",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            DY <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div
            className={`${setTextColor(
              row.getValue("dy_estimado"),
              jurosReais
            )}`}
          >
            {row.getValue("dy_estimado")}%
          </div>
        ),
      },
      {
        accessorKey: "rendimento_real",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rendimento Real <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div
            className={`${setTextColor(row.getValue("rendimento_real"), 0)}`}
          >
            {row.getValue("rendimento_real")}%
          </div>
        ),
      },
      {
        accessorKey: "potencial",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Potencial <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className={`${setTextColor(row.getValue("potencial"), 0)}`}>
            {row.getValue("potencial")}%
          </div>
        ),
      },
      {
        accessorKey: "earning_yield",
        header: "Earning Yield",
        cell: ({ row }) => (
          <div
            className={`${setTextColor(
              row.getValue("earning_yield"),
              jurosReais
            )}`}
          >
            {row.getValue("earning_yield")}%
          </div>
        ),
      },
      {
        accessorKey: "nota_risco",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nota Risco <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const nota = row.getValue("nota_risco");
          return <div className={`${setTextColor(nota, 5)}`}>{nota}</div>;
        },
      },
      {
        accessorKey: "score",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Score <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const score = row.getValue("score");
          return <div className={`${setTextColor(score, 5)}`}>{score}</div>;
        },
      },
      {
        accessorKey: "comprar",
        header: "Comprar",
        cell: ({ row }) => {
          const comprar = row.getValue("comprar");
          return (
            <div className={comprar ? "text-green-600" : "text-red-500"}>
              {comprar ? "Sim" : "-"}
            </div>
          );
        },
      },
    ],
    [jurosReais]
  );

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
      <div className="flex items-center justify-between py-4">
        <div>
          Carregados {data.length} de {totalAtivos} ativos.
        </div>
        <Input
          placeholder="Filtrar Ativo"
          value={table.getColumn("ticker")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("ticker")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="capitalize"
                  checked={col.getIsVisible()}
                  onCheckedChange={(val) => col.toggleVisibility(!!val)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        {data.length === 0 ? (
          <div className="text-center p-4">Carregando dados...</div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-center align-middle"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-center align-middle"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
