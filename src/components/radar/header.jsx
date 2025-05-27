import { Badge } from "@/components/ui/badge";

export default function Badges() {
  const indices = {
    Selic: "14.65%",
    "Selic 5 Anos": "14.65%",
    "Juros Real": "14.65%",
    IPCA: "14.65%",
    "IPCA 5 Anos": "14.65%",
  };

  return (
    <header className="w-full max-w-8xl mx-auto p-4 text-slate-800">
      {/* Linha de busca */}
      <div className="flex justify-end items-center mb-2 space-x-5">
        <input
          type="text"
          placeholder="Buscar..."
          className="p-2 rounded bg-slate-200 text-slate-500 border-none"
        />
        <select className="p-2 rounded bg-slate-200 text-slate-500 border-none">
          <option>FII</option>
          <option>Ação</option>
        </select>
      </div>

      {/* Linha de badges centralizada */}
      <div className="flex justify-center items-center space-x-8">
        {Object.entries(indices).map(([key, value]) => (
          <Badge key={key} variant="outline">
            {key}: {value}
          </Badge>
        ))}
      </div>
    </header>
  );
}
