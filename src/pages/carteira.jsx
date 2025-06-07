import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fetchCarteira, fetchCarteiraFiis } from "@/api/carteira";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Carteira() {
  const [carteiraAcoes, setCarteiraAcoes] = useState([]);
  const [carteiraFiis, setCarteiraFiis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    const loadCarteira = async () => {
      try {
        const [acoes, fiis] = await Promise.all([
          fetchCarteira(),
          fetchCarteiraFiis(),
        ]);
        setCarteiraAcoes(acoes);
        setCarteiraFiis(fiis);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCarteira();
  }, []);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === "recomendacao") {
        const recomendacaoOrder = {
          "COMPRAR ou APORTAR": 0,
          "MANTER com cautela": 1,
          VENDER: 2,
        };
        return sortConfig.direction === "ascending"
          ? recomendacaoOrder[aValue] - recomendacaoOrder[bValue]
          : recomendacaoOrder[bValue] - recomendacaoOrder[aValue];
      }

      if (typeof aValue === "string") {
        return sortConfig.direction === "ascending"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === "ascending"
        ? aValue - bValue
        : bValue - aValue;
    });
  };

  if (loading) return <div className="p-4">Carregando carteira...</div>;
  if (error) return <div className="p-4 text-red-600">Erro: {error}</div>;

  const getRecomendacaoColor = (recomendacao) => {
    switch (recomendacao) {
      case "COMPRAR ou APORTAR":
        return "bg-green-100 text-green-800";
      case "MANTER com cautela":
        return "bg-yellow-100 text-yellow-800";
      case "VENDER":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercent = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  const SortButton = ({ columnKey, children }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(columnKey)}
      className="h-8 px-2 lg:px-3"
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  const TabelaAcoes = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortButton columnKey="ticker">Ticker</SortButton>
            </TableHead>
            <TableHead>
              <SortButton columnKey="quantidade">Qtd</SortButton>
            </TableHead>
            <TableHead>Preço Médio</TableHead>
            <TableHead>Preço Atual</TableHead>
            <TableHead>
              <SortButton columnKey="variacao">Variação</SortButton>
            </TableHead>
            <TableHead>Valor Investido</TableHead>
            <TableHead>Saldo</TableHead>
            <TableHead>Lucro Latente</TableHead>
            <TableHead>Excesso P/L</TableHead>
            <TableHead>Excesso DY</TableHead>
            <TableHead>
              <SortButton columnKey="recomendacao">Recomendação</SortButton>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortData(carteiraAcoes).map((acao) => (
            <TableRow key={acao.ticker}>
              <TableCell className="font-medium">{acao.ticker}</TableCell>
              <TableCell>{acao.quantidade}</TableCell>
              <TableCell>{formatCurrency(acao.preco_medio)}</TableCell>
              <TableCell>{formatCurrency(acao.preco_atual)}</TableCell>
              <TableCell
                className={
                  acao.variacao >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {formatPercent(acao.variacao)}
              </TableCell>
              <TableCell>{formatCurrency(acao.valor_investido)}</TableCell>
              <TableCell>{formatCurrency(acao.saldo)}</TableCell>
              <TableCell
                className={
                  acao.lucro_latente >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {formatPercent(acao.lucro_latente)}
              </TableCell>
              <TableCell
                className={
                  acao.excesso_pl >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {formatPercent(acao.excesso_pl)}
              </TableCell>
              <TableCell
                className={
                  acao.excesso_dy >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {formatPercent(acao.excesso_dy)}
              </TableCell>
              <TableCell>
                <Badge className={getRecomendacaoColor(acao.recomendacao)}>
                  {acao.recomendacao}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const TabelaFiis = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortButton columnKey="ticker">Ticker</SortButton>
            </TableHead>
            <TableHead>
              <SortButton columnKey="quantidade">Qtd</SortButton>
            </TableHead>
            <TableHead>Preço Médio</TableHead>
            <TableHead>Preço Atual</TableHead>
            <TableHead>
              <SortButton columnKey="variacao">Variação</SortButton>
            </TableHead>
            <TableHead>Valor Investido</TableHead>
            <TableHead>Saldo</TableHead>
            <TableHead>Rendimento Mensal</TableHead>
            <TableHead>DY</TableHead>
            <TableHead>P/VP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortData(carteiraFiis).map((fii) => (
            <TableRow key={fii.ticker}>
              <TableCell className="font-medium">{fii.ticker}</TableCell>
              <TableCell>{fii.quantidade}</TableCell>
              <TableCell>{formatCurrency(fii.preco_medio)}</TableCell>
              <TableCell>{formatCurrency(fii.preco_atual)}</TableCell>
              <TableCell
                className={
                  fii.variacao >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {formatPercent(fii.variacao)}
              </TableCell>
              <TableCell>{formatCurrency(fii.valor_investido)}</TableCell>
              <TableCell>{formatCurrency(fii.saldo)}</TableCell>
              <TableCell>
                {formatCurrency(fii.rendimento_mensal_estimado)}
              </TableCell>
              <TableCell>{formatPercent(fii.dy)}</TableCell>
              <TableCell>{fii.pvp.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minha Carteira</h1>
      <Tabs defaultValue="acoes" className="w-full">
        <TabsList>
          <TabsTrigger value="acoes">Ações</TabsTrigger>
          <TabsTrigger value="fiis">FIIs</TabsTrigger>
        </TabsList>
        <TabsContent value="acoes">
          <TabelaAcoes />
        </TabsContent>
        <TabsContent value="fiis">
          <TabelaFiis />
        </TabsContent>
      </Tabs>
    </div>
  );
}
