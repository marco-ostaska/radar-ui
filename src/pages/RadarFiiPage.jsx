import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const data = [
  {
    ativo: "HGBS11",
    cotacao: 19.97,
    valorPatrimonial: 221.79,
    valorTeto: 70.07,
    dy: 38.46,
    rendimentoReal: 32.62,
    potencial: 250.89,
    notaRisco: 7.5,
    score: 9.1,
  },
  {
    ativo: "HSML11",
    cotacao: 84.77,
    valorPatrimonial: 108.68,
    valorTeto: 71.17,
    dy: 9.2,
    rendimentoReal: 3.36,
    potencial: -16.05,
    notaRisco: 6.7,
    score: 2.7,
  },
  // outros dados...
];

const columns = [
  {
    accessorKey: "ativo",
    header: "Ativo",
    cell: info => info.getValue(),
  },
  {
    accessorKey: "cotacao",
    header: "Cotação",
    cell: info => `R$ ${info.getValue().toFixed(2)}`,
  },
  {
    accessorKey: "valorPatrimonial",
    header: "Valor Patrimonial",
    cell: info => info.getValue().toFixed(2),
  },
  {
    accessorKey: "valorTeto",
    header: "Valor Teto por DY",
    cell: info => info.getValue().toFixed(2),
  },
  {
    accessorKey: "dy",
    header: "DY",
    cell: info => `${info.getValue().toFixed(2)}%`,
  },
  {
    accessorKey: "rendimentoReal",
    header: "Rendimento Real",
    cell: info => `${info.getValue().toFixed(2)}%`,
  },
  {
    accessorKey: "potencial",
    header: "Potencial",
    cell: info => `${info.getValue().toFixed(2)}%`,
  },
  {
    accessorKey: "notaRisco",
    header: "Nota Risco",
    cell: info => info.getValue().toFixed(1),
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: info => info.getValue().toFixed(1),
  },
];

function FiiRadarTable() {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  function getBgClass(columnId, value) {
    if (columnId === "notaRisco" || columnId === "score") {
      return value >= 6 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
    }
    return value >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  }

  return (
<table className="table-auto border-separate border-spacing-0 border border-gray-300 w-full text-center">
  <thead>
    {table.getHeaderGroups().map(headerGroup => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => (
          <th
            key={header.id}
            onClick={header.column.getToggleSortingHandler()}
            className="cursor-pointer border-b border-gray-300 p-2 select-none"
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {{
              asc: " 🔼",
              desc: " 🔽",
            }[header.column.getIsSorted()] ?? null}
          </th>
        ))}
      </tr>
    ))}
  </thead>

  <tbody>
    {table.getRowModel().rows.map(row => (
      <tr key={row.id} className="hover:bg-gray-100">
        {row.getVisibleCells().map(cell => {
          const bgClass = getBgClass(cell.column.id, cell.getValue());
          return (
            <td key={cell.id} className={`border-b border-gray-300 p-2 ${bgClass}`}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          );
        })}
      </tr>
    ))}
  </tbody>
</table>

  );
}

export default function FiiRadarPage() {
  return (
    <div className="max-w-8xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Radar de FIIs</h1>
      <h2 className="text-lg mb-2">Shopping</h2>
      <FiiRadarTable />
    </div>
  );
}
