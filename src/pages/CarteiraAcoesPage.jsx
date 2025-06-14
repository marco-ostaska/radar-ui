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
import { fetchCarteira } from "@/api/carteira";
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
import { adicionarTransacaoAcoes } from "@/api/transacoes";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CarteiraAcoesPage() {
  const [carteiraAcoes, setCarteiraAcoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    ticker: "",
    quantidade: "",
    preco: "",
    tipo: "COMPRA",
    data: format(new Date(), "dd/MM/yyyy"),
    ativoTipo: "acao",
  });

  useEffect(() => {
    loadCarteira();
  }, []);

  const loadCarteira = async () => {
    try {
      setLoading(true);
      const acoes = await fetchCarteira();
      setCarteiraAcoes(acoes);
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
      ativoTipo: "acao",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adicionarTransacaoAcoes({
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

  if (loading) return <div className="p-4">Carregando carteira de ações...</div>;
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Carteira de Ações</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Ação
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
              <TableHead>Ticker</TableHead>
              <TableHead>Qtd</TableHead>
              <TableHead>Preço Médio</TableHead>
              <TableHead>Preço Atual</TableHead>
              <TableHead>Variação</TableHead>
              <TableHead>Valor Investido</TableHead>
              <TableHead>Saldo</TableHead>
              <TableHead>Lucro Latente</TableHead>
              <TableHead>Excesso P/L</TableHead>
              <TableHead>Excesso DY</TableHead>
              <TableHead>Recomendação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carteiraAcoes.map((acao) => (
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
    </div>
  );
}
