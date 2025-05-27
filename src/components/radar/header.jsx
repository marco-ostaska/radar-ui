import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Badges() {
  const [indices, setIndices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(false);

  function fetchIndices(force = false) {
    setLoading(true);
    fetch(`http://localhost:8000/indices/atualiza?force=${force}`)
      .then((res) => res.json())
      .then((data) => {
        setIndices({
          Selic: `${data.selic_atual ?? data.selic}%`,
          "Selic 5 Anos": `${data.selic ?? "N/A"}%`,
          IPCA: `${data.ipca_atual ?? data.ipca}%`,
          "IPCA 5 Anos": `${data.ipca_media5 ?? "N/A"}%`,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar índices:", err);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchIndices(forceUpdate);
  }, [forceUpdate]);

  if (loading) return <p>Carregando índices...</p>;
  if (!indices) return <p>Não foi possível carregar os índices.</p>;

  return (
    <header className="w-full max-w-8xl mx-auto p-4 text-slate-800">
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

      <div className="flex justify-center items-center space-x-8">
        {Object.entries(indices).map(([key, value]) => (
          <Badge key={key} variant="outline">
            {key}: {value}
          </Badge>
        ))}

        <Button variant="outline" onClick={() => setForceUpdate((old) => !old)}>
          Atualizar Indices
        </Button>
      </div>
    </header>
  );
}
