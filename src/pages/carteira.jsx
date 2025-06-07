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
import {
  adicionarTransacaoAcoes,
  adicionarTransacaoFiis,
} from "@/api/transacoes";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Carteira() {
  const [carteiraAcoes, setCarteiraAcoes] = useState([]);
  const [carteiraFiis, setCarteiraFiis] = useState([]);
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
      if (formData.ativoTipo === "acao") {
        await adicionarTransacaoAcoes({
          ...formData,
          carteiraId: 1,
        });
      } else {
        await adicionarTransacaoFiis({
          ...formData,
          carteiraId: 1,
        });
      }
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Minha Carteira</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Ativo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white">
              <div className="bg-white">
                <label className="text-sm font-medium text-gray-700">
                  Tipo de Ativo
                </label>
                <Select
                  value={formData.ativoTipo}
                  onValueChange={(value) =>
                    handleSelectChange("ativoTipo", value)
                  }
                >
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acao">Ação</SelectItem>
                    <SelectItem value="fii">FII</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
