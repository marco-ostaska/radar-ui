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
import { fetchCarteiraFiis } from "@/api/carteira";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus } from "lucide-react";
import { adicionarTransacaoFiis } from "@/api/transacoes";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CarteiraFiisPage() {
  const [notaDialog, setNotaDialog] = useState({ open: false, ticker: null, nota: 0 });
  const [totals, setTotals] = useState({
    totalInvestido: 0,
    totalSaldo: 0,
    totalVariacao: 0,
    totalQuantidade: 0,
    totalVariacaoPercent: 0,
    totalRendimentosMensais: 0,
  });
  const [carteiraFiis, setCarteiraFiis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    ticker: "",
    quantidade: "",
    preco: "",
    tipo: "COMPRA",
    data: format(new Date(), "dd/MM/yyyy"),
    ativoTipo: "fii",
  });

  useEffect(() => {
    loadCarteira();
  }, []);

  useEffect(() => {
    setCarteiraFiis((prev) => sortData(prev, sortConfig.key, sortConfig.direction));
  }, [sortConfig]);

  const sortData = (data, key, direction) => {
    if (!key) return data;
    return [...data].sort((a, b) => {
      const aValue = key === "variacao" ? a[key] || 0 : a[key];
      const bValue = key === "variacao" ? b[key] || 0 : b[key];
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const loadCarteira = async () => {
    try {
      setLoading(true);
      const fiis = await fetchCarteiraFiis();
      setCarteiraFiis(sortData(fiis, sortConfig.key, sortConfig.direction));
      // Calculate totals
      const totalInvestido = fiis.reduce((sum, fii) => sum + fii.valor_investido, 0);
      const totalSaldo = fiis.reduce((sum, fii) => sum + fii.saldo, 0);
      const totalVariacao = totalSaldo - totalInvestido;
      const totalQuantidade = fiis.length; // Count of unique assets
      const totalVariacaoPercent = totalInvestido > 0 ? (totalVariacao / totalInvestido) * 100 : 0;
      const totalRendimentosMensais = fiis.reduce((sum, fii) => {
        const rendimento = parseFloat(fii?.rendimento_mensal_estimado || 0);
        return sum + (isNaN(rendimento) ? 0 : rendimento);
      }, 0);

      const dyOnCost = totalInvestido > 0 ? (totalRendimentosMensais / totalInvestido) * 100 : 0;

      setTotals({
        totalInvestido,
        totalSaldo,
        totalVariacao,
        totalQuantidade,
        totalVariacaoPercent,
        totalRendimentosMensais,
        dyOnCost,
      });

      setTotals({
        totalInvestido,
        totalSaldo,
        totalVariacao,
        totalQuantidade,
        totalVariacaoPercent,
        totalRendimentosMensais,
        dyOnCost,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      ticker: "",
      quantidade: "",
      preco: "",
      tipo: "COMPRA",
      data: format(new Date(), "dd/MM/yyyy"),
      ativoTipo: "fii",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adicionarTransacaoFiis({
        ...formData,
        carteiraId: 1,
      });
      setIsDialogOpen(false);
      resetForm();
      loadCarteira();
    } catch (err) {
      setError(err.message);
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

  if (loading) return <div className="p-4">Carregando carteira de FIIs...</div>;
  if (error) return <div className="p-4 text-red-600">Erro: {error}</div>;

  const getRecomendacaoColor = (recomendacao) => {
    switch (recomendacao) {
      case "COMPRAR ou APORTAR":
        return "bg-green-100 text-green-800";
      case "MANTER com cautela":
        return "bg-yellow-100 text-yellow-800";
      case "VENDER":
      case "VENDER ou realizar parcial":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Resumo da Carteira</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Investido</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(totals.totalInvestido)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Investido</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(totals.totalInvestido)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Saldo Total</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(totals.totalSaldo)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Variação Total</span>
            <span className={totals.totalVariacao >= 0 ? "text-lg font-bold text-green-600" : "text-lg font-bold text-red-600"}>
              {formatCurrency(totals.totalVariacao)} ({formatPercent(totals.totalVariacaoPercent)})
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">DY on Cost</span>
            <span className="text-lg font-bold text-gray-900">{formatPercent(totals.dyOnCost)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Rendimentos Mensais Estimados</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(totals.totalRendimentosMensais)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Quantidade de Ativos</span>
            <span className="text-lg font-bold text-gray-900">{totals.totalQuantidade}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Carteira de FIIs</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar FII
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white">
              <div className="bg-white">
                <label className="text-sm font-medium text-gray-700">
                  Ticker
                </label>
                <Input
                  name="ticker"
                  value={formData.ticker}
                  onChange={handleInputChange}
                  required
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="bg-white">
                <label className="text-sm font-medium text-gray-700">
                  Data
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white border-gray-300",
                        !formData.data && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.data ? (
                        format(
                          new Date(
                            formData.data.split("/").reverse().join("-")
                          ),
                          "dd/MM/yyyy",
                          {
                            locale: ptBR,
                          }
                        )
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        formData.data
                          ? new Date(
                              formData.data.split("/").reverse().join("-")
                            )
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          setFormData((prev) => ({
                            ...prev,
                            data: format(date, "dd/MM/yyyy", { locale: ptBR }),
                          }));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="bg-white">
                <label className="text-sm font-medium text-gray-700">
                  Tipo de Transação
                </label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => handleSelectChange("tipo", value)}
                >
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPRA">Compra</SelectItem>
                    <SelectItem value="VENDA">Venda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-white">
                <label className="text-sm font-medium text-gray-700">
                  Preço
                </label>
                <Input
                  name="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={handleInputChange}
                  required
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="bg-white">
                <label className="text-sm font-medium text-gray-700">
                  Quantidade
                </label>
                <Input
                  name="quantidade"
                  type="number"
                  value={formData.quantidade}
                  onChange={handleInputChange}
                  required
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="flex justify-end space-x-2 bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-gray-300"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Adicionar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  onClick={() =>
                    setSortConfig((prev) => ({
                      key: "ticker",
                      direction: prev.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  Ticker <ArrowUpDown className="h-4 w-4 inline" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() =>
                    setSortConfig((prev) => ({
                      key: "quantidade",
                      direction: prev.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  Qtd <ArrowUpDown className="h-4 w-4 inline" />
                </button>
              </TableHead>
              <TableHead>Preço Médio</TableHead>
              <TableHead>Preço Atual</TableHead>
              <TableHead>
                <button
                  onClick={() =>
                    setSortConfig((prev) => ({
                      key: "variacao",
                      direction: prev.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  Variação <ArrowUpDown className="h-4 w-4 inline" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() =>
                    setSortConfig((prev) => ({
                      key: "valor_investido",
                      direction: prev.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  Valor Investido <ArrowUpDown className="h-4 w-4 inline" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() =>
                    setSortConfig((prev) => ({
                      key: "saldo",
                      direction: prev.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  Saldo <ArrowUpDown className="h-4 w-4 inline" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() =>
                    setSortConfig((prev) => ({
                      key: "rendimento_mensal_estimado",
                      direction: prev.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  Rendimento Mensal <ArrowUpDown className="h-4 w-4 inline" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() =>
                    setSortConfig((prev) => ({
                      key: "dy",
                      direction: prev.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  DY <ArrowUpDown className="h-4 w-4 inline" />
                </button>
              </TableHead>
              <TableHead>P/VP</TableHead>
              <TableHead>
                <button
                  onClick={() =>
                    setSortConfig((prev) => ({
                      key: "nota",
                      direction: prev.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  Nota <ArrowUpDown className="h-4 w-4 inline" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() =>
                    setSortConfig((prev) => ({
                      key: "porcentagem_carteira",
                      direction: prev.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  % Carteira <ArrowUpDown className="h-4 w-4 inline" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() =>
                    setSortConfig((prev) => ({
                      key: "porcentagem_ideal",
                      direction: prev.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  % Ideal <ArrowUpDown className="h-4 w-4 inline" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() =>
                    setSortConfig((prev) => ({
                      key: "valor_aportar",
                      direction: prev.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  Valor Aportar <ArrowUpDown className="h-4 w-4 inline" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() =>
                    setSortConfig((prev) => ({
                      key: "aportar",
                      direction: prev.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  Aportar <ArrowUpDown className="h-4 w-4 inline" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() =>
                    setSortConfig((prev) => ({
                      key: "recomendacao",
                      direction: prev.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  Recomendação <ArrowUpDown className="h-4 w-4 inline" />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carteiraFiis.map((fii) => (
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
                <TableCell>
                  {(() => {
                    // Debug: veja o valor real de fii.dy
                    // Remova o console.log depois de depurar
                    console.log("DY do FII", fii.ticker, fii.dy);
                    return formatPercent(fii.dy);
                  })()}
                </TableCell>
                <TableCell>{fii.pvp.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-base font-normal cursor-pointer bg-transparent shadow-none hover:bg-gray-100 focus:ring-2 focus:ring-blue-300"
                    onClick={() => {
                      setNotaDialog({
                        open: true,
                        ticker: fii.ticker,
                        nota: fii.nota != null ? fii.nota : 0,
                      });
                    }}
                  >
                    {fii.nota != null ? fii.nota : 0}
                  </Button>
                </TableCell>
                <TableCell>{fii.porcentagem_carteira != null ? `${fii.porcentagem_carteira.toFixed(2)}%` : "0.00%"}</TableCell>
                <TableCell>{fii.porcentagem_ideal != null ? `${fii.porcentagem_ideal.toFixed(2)}%` : "0.00%"}</TableCell>
                <TableCell
                  className={
                    fii.valor_aportar > 0
                      ? "text-green-600 font-semibold"
                      : fii.valor_aportar < 0
                      ? "text-red-600 font-semibold"
                      : ""
                  }
                >
                  {fii.valor_aportar != null ? formatCurrency(fii.valor_aportar) : formatCurrency(0)}
                </TableCell>
                <TableCell
                  className={
                    fii.aportar
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {fii.aportar ? "Sim" : "Não"}
                </TableCell>
                <TableCell>
                  <Badge className={getRecomendacaoColor(fii.recomendacao)}>
                    {fii.recomendacao}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Dialog para editar nota */}
      <Dialog open={notaDialog?.open} onOpenChange={(open) => setNotaDialog((prev) => ({ ...prev, open }))}>
        <DialogContent className="bg-white rounded-xl shadow-2xl p-8 max-w-sm mx-auto flex flex-col items-center gap-6">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold mb-2">Editar Nota</DialogTitle>
          </DialogHeader>
          <div className="w-full flex flex-col items-center gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nota (0 a 100)</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={notaDialog.nota}
              className="w-32 text-center text-lg border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              onChange={(e) =>
                setNotaDialog((prev) => ({
                  ...prev,
                  nota: Math.max(0, Math.min(100, Number(e.target.value))),
                }))
              }
            />
            <Button
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 shadow"
              onClick={async () => {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
                await fetch(
                  `${API_URL}/carteira/fii/nota?carteira_id=1&ticker=${encodeURIComponent(
                    notaDialog.ticker
                  )}&nota=${notaDialog.nota}`,
                  { method: "POST" }
                );
                setNotaDialog({ open: false, ticker: null, nota: 0 });
                loadCarteira();
              }}
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
