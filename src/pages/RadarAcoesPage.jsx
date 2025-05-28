"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { listarAtivosPorCategoria } from "@/api/adm/listarAtivosPorCategoria"
import { fetchRadarAcao } from "@/api/acoes/radar"

export default function RadarAcoes() {
  const [data, setData] = useState([])
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    async function fetchData() {
      try {
        const ativos = await listarAtivosPorCategoria("acoes")
        for (let i = 0; i < ativos.length; i++) {
          const ativo = ativos[i]
          const resultado = await fetchRadarAcao(ativo)
          console.log("Resultado recebido:", resultado)
          setData(prev => [...prev, resultado])  // Adiciona cada resultado progressivamente
          await new Promise(resolve => setTimeout(resolve, 10))  // Delay opcional para ver efeito
        }
      } catch (error) {
        console.error("Erro ao buscar dados do radar:", error)
      }
    }

    fetchData()
  }, [])

  const columns = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected() ? true : undefined}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          indeterminate={false}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    { accessorKey: "ticker", header: "Ativo", cell: ({ row }) => <div>{row.getValue("ticker")}</div> },
    { accessorKey: "cotacao", header: "Cotação", cell: ({ row }) => <div>{row.getValue("cotacao")?.toFixed(2)}</div> },
    { accessorKey: "teto_por_lucro", header: "Cotação/Lucro", cell: ({ row }) => <div>{row.getValue("teto_por_lucro")?.toFixed(2)}</div> },
    { accessorKey: "valor_teto_por_dy", header: "Valor Teto DY", cell: ({ row }) => <div>{row.getValue("valor_teto_por_dy")}%</div> },
    { accessorKey: "dy_estimado", header: "DY", cell: ({ row }) => <div>{row.getValue("dy_estimado")}%</div> },
    { accessorKey: "rendimento_real", header: "Rendimento Real", cell: ({ row }) => <div>{row.getValue("rendimento_real")}%</div> },
    { accessorKey: "potencial", header: "Potencial", cell: ({ row }) => <div>{row.getValue("potencial")}%</div> },
    { accessorKey: "earning_yield", header: "Earning Yield", cell: ({ row }) => <div>{row.getValue("earning_yield")}%</div> },
    { accessorKey: "nota_risco", header: "Nota Risco", cell: ({ row }) => <div>{row.getValue("nota_risco")}</div> },
    { accessorKey: "score", header: "Score", cell: ({ row }) => <div>{row.getValue("score")}</div> },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const ativo = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(ativo.ticker)}>
                Copiar ticker
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [])

  const table = useReactTable({
    data,
    columns,
    state: { 
      sorting, 
      columnFilters, 
      columnVisibility, 
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar Ativo"
          value={table.getColumn("ticker")?.getFilterValue() ?? ""}
          onChange={(e) => table.getColumn("ticker")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
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
        <Table key={data.length}>  {/* Força o React a re-renderizar quando o tamanho muda */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
