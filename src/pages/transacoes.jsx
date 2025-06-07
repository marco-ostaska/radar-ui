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
import { Pencil, Trash2, Plus } from "lucide-react";

export default function Transacoes() {
  const [transacoesAcoes, setTransacoesAcoes] = useState([]);
  const [transacoesFiis, setTransacoesFiis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransacao, setEditingTransacao] = useState(null);
  const [formData, setFormData] = useState({
    ticker: "",
    quantidade: "",
    preco: "",
    tipo: "COMPRA",
    data: format(new Date(), "dd/MM/yyyy"),
  });

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
    try {
      if (editingTransacao) {
        if (editingTransacao.tipo === "acao") {
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
        if (formData.tipo === "acao") {
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTransacao ? "Editar Transação" : "Nova Transação"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tipo de Ativo</label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => handleSelectChange("tipo", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acao">Ação</SelectItem>
                    <SelectItem value="fii">FII</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Ticker</label>
                <Input
                  name="ticker"
                  value={formData.ticker}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Data</label>
                <Input
                  name="data"
                  value={formData.data}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tipo de Transação</label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => handleSelectChange("tipo", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPRA">Compra</SelectItem>
                    <SelectItem value="VENDA">Venda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Preço</label>
                <Input
                  name="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Quantidade</label>
                <Input
                  name="quantidade"
                  type="number"
                  value={formData.quantidade}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
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
