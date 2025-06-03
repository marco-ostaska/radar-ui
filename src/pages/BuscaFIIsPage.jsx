import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchRadaFii } from "@/api/fii/radar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function setTextColor(atributo, valor) {
  const numAtributo = Number(atributo);
  const numValor = Number(valor);
  if (isNaN(numAtributo) || isNaN(numValor)) return "text-gray-500";
  if (numAtributo === numValor) return "text-yellow-600";
  if (numAtributo > numValor) return "text-green-700";
  return "text-red-700";
}

function formatarValor(campo, valor) {
  if (valor === undefined || valor === null) return "N/A";
  const camposReais = ["cotacao", "vpa", "teto_div"];
  const camposPercentuais = ["dy_estimado", "rendimento_real", "potencial"];
  if (camposReais.includes(campo)) return `R$ ${valor}`;
  if (camposPercentuais.includes(campo)) return `${valor}%`;
  return String(valor);
}

export default function BuscaFIIsPage() {
  const [searchParams] = useSearchParams();
  const ticker = searchParams.get("busca");
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const indiceBase = 0; // Use um valor padrão ou ajuste com índices reais se necessário

  useEffect(() => {
    if (!ticker) {
      setErro("Ticker não fornecido");
      setDados(null);
      return;
    }

    setLoading(true);
    setErro(null);
    setDados(null);

    fetchRadaFii(ticker) // Ajuste o segundo argumento conforme necessário
      .then((data) => {
        setDados(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
        setErro(error.message || "Falha ao buscar dados do FII");
        setLoading(false);
      });
  }, [ticker]);

  if (loading) return <p>Carregando dados...</p>;

  if (erro) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{erro}</AlertDescription>
      </Alert>
    );
  }

  if (!dados) return null;

  const campos = [
    {chave: "comprar", titulo: "Comprar", base: 0},
    { chave: "nota_risco", titulo: "Nota de Risco", base: 5 },
    { chave: "score", titulo: "Score", base: 5 },
    { chave: "cotacao", titulo: "Cotação", base: dados?.teto_div ?? 0 },
    { chave: "vpa", titulo: "Valor Patrimonial", base: dados?.cotacao ?? 0 },
    { chave: "teto_div", titulo: "Teto por DY", base: dados?.cotacao ?? 0 },
    { chave: "dy_estimado", titulo: "DY Estimado", base: indiceBase ?? 0 },
    { chave: "rendimento_real", titulo: "Rendimento Real", base: indiceBase ?? 0 },
    { chave: "potencial", titulo: "Potencial", base: 0 },
    { chave: "tipo", titulo: "Tipo" },
  ];

  return (
    <>
      <h1 className="flex justify-center text-2xl font-bold mb-4">{dados.ticker}</h1>
      <div className="p-4 bg-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campos.map(({ chave, titulo, base }) => {
          const valor = dados[chave];
          const corTexto =
            chave === "comprar"
              ? valor
                ? "text-green-600"
                : "text-red-500"
              : setTextColor(valor, base);
          return (
            <div
              key={chave}
              className="flex flex-col items-center justify-center p-4 border rounded-md shadow-sm bg-white"
            >
              <span className="text-sm font-semibold text-gray-600">{titulo}</span>
              <Badge className={`text-base mt-2 ${corTexto}`}>
                {formatarValor(chave, valor)}
              </Badge>
            </div>
          );
        })}
      </div>
    </>
  );
}
