import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchIndices } from "@/api/indices/atualiza";

export default function Badges() {
  const [indices, setIndices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchIndices(forceUpdate)
      .then(setIndices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [forceUpdate]);

  if (loading) return <p>Carregando índices...</p>;
  if (error)
    return (
      <div className="text-red-600 p-4 text-center">
        Erro ao carregar índices: {error}
        <Button onClick={() => setForceUpdate((old) => !old)}>
          Tentar novamente
        </Button>
      </div>
    );
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
          Atualizar Índices
        </Button>
      </div>
    </header>
  );
}
