import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  fetchTransacoesAcoes,
  fetchTransacoesFiis,
  adicionarTransacaoAcoes,
  adicionarTransacaoFiis,
  atualizarTransacaoAcoes,
  atualizarTransacaoFiis,
  deletarTransacaoAcoes,
  deletarTransacaoFiis,
} from "@/api/transacoes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pencil, Trash2, Plus, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Transacoes() {
  const [transacoesAcoes, setTransacoesAcoes] = useState([]);
  const [transacoesFiis, setTransacoesFiis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransacao, setEditingTransacao] = useState(null);
  const [formData, setFormData] = useState({
    tipoAtivo: "",
    ticker: "",
    data: "",
    tipoTransacao: "",
    preco: "",
    quantidade: "",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadTransacoes();
  }, []);

  const loadTransacoes = async () => {
    try {
      setLoading(true);
      const [acoes, fiis] = await Promise.all([
        fetchTransacoesAcoes(),
        fetchTransacoesFiis(),
      ]);
      setTransacoesAcoes(acoes);
      setTransacoesFiis(fiis);
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
    });
    setEditingTransacao(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Dados enviados:", formData);
    console.log("Tipo de Ativo:", formData.tipoAtivo);
    try {
      if (editingTransacao) {
        if (formData.tipoAtivo === "acao") {
          await atualizarTransacaoAcoes(editingTransacao.id, {
            ...formData,
            carteiraId: 1,
          });
        } else {
          await atualizarTransacaoFiis(editingTransacao.id, {
            ...formData,
            carteiraId: 1,
          });
        }
      } else {
        if (formData.tipoAtivo === "acao") {
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
      }
      setIsDialogOpen(false);
      resetForm();
      loadTransacoes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (transacao, tipo) => {
    setEditingTransacao({ ...transacao, tipo });
    setFormData({
      ticker: transacao.ticker,
      quantidade: transacao.quantidade.toString(),
      preco: transacao.preco.toString(),
      tipo: transacao.tipo,
      data: format(new Date(transacao.data), "dd/MM/yyyy"),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id, tipo) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        if (tipo === "acao") {
          await deletarTransacaoAcoes(id);
        } else {
          await deletarTransacaoFiis(id);
        }
        loadTransacoes();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  if (loading) return <div className="p-4">Carregando transações...</div>;
  if (error) return <div className="p-4 text-red-600">Erro: {error}</div>;

  const TabelaTransacoes = ({ transacoes, tipo }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transacoes.map((transacao) => (
            <TableRow key={transacao.id}>
              <TableCell className="font-medium">{transacao.ticker}</TableCell>
              <TableCell>{formatDate(transacao.data)}</TableCell>
              <TableCell>{transacao.tipo}</TableCell>
              <TableCell>{formatCurrency(transacao.preco)}</TableCell>
              <TableCell>{transacao.quantidade}</TableCell>
              <TableCell>{formatCurrency(transacao.valor_total)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(transacao, tipo)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(transacao.id, tipo)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transações</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>
                {editingTransacao ? "Editar Transação" : "Nova Transação"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white">
              <div className="bg-white">
                <label className="text-sm font-medium text-gray-700">
                  Tipo de Ativo
                </label>
                <Select
                  value={formData.tipoAtivo}
                  onValueChange={(value) =>
                    handleSelectChange("tipoAtivo", value)
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
                <Popover open={open} onOpenChange={setOpen}>
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
                          const formattedDate = format(date, "dd/MM/yyyy", {
                            locale: ptBR,
                          });
                          setFormData((prev) => ({
                            ...prev,
                            data: formattedDate,
                          }));
                          setOpen(false);
                        }
                      }}
                      className="rounded-md border bg-white"
                      classNames={{
                        day_selected:
                          "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white",
                        day_today: "bg-gray-100 text-gray-900",
                        day: "hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900",
                        head_cell: "text-gray-500 font-normal",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        nav_button: "hover:bg-gray-100 hover:text-gray-900",
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
                  value={formData.tipoTransacao}
                  onValueChange={(value) =>
                    handleSelectChange("tipoTransacao", value)
                  }
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
                  {editingTransacao ? "Salvar" : "Adicionar"}
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
          <TabelaTransacoes transacoes={transacoesAcoes} tipo="acao" />
        </TabsContent>
        <TabsContent value="fiis">
          <TabelaTransacoes transacoes={transacoesFiis} tipo="fii" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
