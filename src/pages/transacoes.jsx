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
  agrupamentoFii,
  agrupamentoAcoes,
  desdobramentoAcoes,
  desdobramentoFii,
} from "@/api/transacoes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Pencil,
  Trash2,
  Plus,
  CalendarIcon,
  Layers,
  Divide,
  ArrowUpDown,
} from "lucide-react";
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

  // Estado de ordenação global
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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
    // Usar dia atual no formato dd/MM/yyyy
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();
    const dataAtual = `${dia}/${mes}/${ano}`;

    setFormData({
      tipoAtivo: "",
      ticker: "",
      quantidade: "",
      preco: "",
      tipoTransacao: "COMPRA",
      data: dataAtual,
    });
    setEditingTransacao(null);
  };

  // A API aceita a data no formato dd/MM/yyyy, não precisamos converter

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Dados enviados:", formData);
    console.log("Tipo de Ativo:", formData.tipoAtivo);
    try {
      const dataToSend = {
        ticker: formData.ticker,
        quantidade: formData.quantidade,
        preco: formData.preco,
        tipo: formData.tipoTransacao
          ? formData.tipoTransacao.toUpperCase()
          : undefined,
        carteiraId: 1, // sempre camelCase para as funções da API
        data: formData.data, // A API espera o formato dd/MM/yyyy
      };

      if (editingTransacao) {
        if (formData.tipoAtivo === "acao") {
          await atualizarTransacaoAcoes(editingTransacao.id, dataToSend);
        } else {
          await atualizarTransacaoFiis(editingTransacao.id, dataToSend);
        }
      } else {
        if (formData.tipoAtivo === "acao") {
          await adicionarTransacaoAcoes(dataToSend);
        } else {
          await adicionarTransacaoFiis(dataToSend);
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
    // Garantir que a data seja exibida no formato dd/MM/yyyy
    const dataFormatada = formatDate(transacao.data);
    setFormData({
      ticker: transacao.ticker,
      quantidade: transacao.quantidade.toString(),
      preco: transacao.preco.toString(),
      tipoTransacao: transacao.tipo,
      data: dataFormatada,
      tipoAtivo: tipo,
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
    if (!dateString) return "";

    // Se já estiver em dd/MM/yyyy, retorna direto
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }

    // Se vier como yyyy-MM-dd, converte manualmente
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [ano, mes, dia] = dateString.split("-");
      return `${dia}/${mes}/${ano}`;
    }

    // Se vier como string ISO (ex: 2025-06-20T00:00:00.000Z)
    if (/^\d{4}-\d{2}-\d{2}T/.test(dateString)) {
      return (
        dateString.substring(8, 10) +
        "/" +
        dateString.substring(5, 7) +
        "/" +
        dateString.substring(0, 4)
      );
    }

    // Outros formatos, retorna como está
    return dateString;
  };

  // Função para validar se a data está no formato dd/MM/yyyy e é uma data válida
  function parseDateString(dateStr) {
    if (!dateStr) return undefined;
    const [day, month, year] = dateStr.split("/").map(Number);
    if (
      !day ||
      !month ||
      !year ||
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      year < 1000
    ) {
      return undefined;
    }
    const date = new Date(year, month - 1, day);
    // Confirma se a data é realmente igual à informada (evita 32/01/2024 virar 01/02/2024)
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return undefined;
    }
    return date;
  }

  function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    // Se já estiver em dd/MM/yyyy, retorna direto
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
    // Se vier como yyyy-MM-dd, converte
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [ano, mes, dia] = dateStr.split("-");
      return `${dia}/${mes}/${ano}`;
    }
    return dateStr;
  }

  if (loading) return <div className="p-4">Carregando transações...</div>;
  if (error) return <div className="p-4 text-red-600">Erro: {error}</div>;

  const TabelaTransacoes = ({ transacoes, tipo }) => {
    const [search, setSearch] = useState("");
    // Ordenação e filtro
    const filteredTransacoes = [...transacoes]
      .filter((transacao) =>
        transacao.ticker.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        // Para data, converte para Date
        if (sortConfig.key === "data") {
          aValue = parseDateString(aValue)?.getTime() || 0;
          bValue = parseDateString(bValue)?.getTime() || 0;
        }
        // Para tipo, compara string
        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });

    const handleSort = (key) => {
      setSortConfig((prev) => {
        const direction =
          prev.key === key && prev.direction === "asc" ? "desc" : "asc";
        return { key, direction };
      });
    };

    return (
      <div>
        <div className="mb-2 flex justify-end">
          <Input
            placeholder="Buscar ativo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort("ticker")}
                    className="flex items-center gap-1"
                  >
                    Ticker
                    {sortConfig.key === "ticker" && (
                      <ArrowUpDown
                        className={`h-3 w-3 inline ${
                          sortConfig.direction === "asc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                    {sortConfig.key !== "ticker" && (
                      <ArrowUpDown className="h-3 w-3 inline opacity-30" />
                    )}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("data")}
                    className="flex items-center gap-1"
                  >
                    Data
                    {sortConfig.key === "data" && (
                      <ArrowUpDown
                        className={`h-3 w-3 inline ${
                          sortConfig.direction === "asc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                    {sortConfig.key !== "data" && (
                      <ArrowUpDown className="h-3 w-3 inline opacity-30" />
                    )}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("tipo")}
                    className="flex items-center gap-1"
                  >
                    Tipo
                    {sortConfig.key === "tipo" && (
                      <ArrowUpDown
                        className={`h-3 w-3 inline ${
                          sortConfig.direction === "asc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                    {sortConfig.key !== "tipo" && (
                      <ArrowUpDown className="h-3 w-3 inline opacity-30" />
                    )}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("preco")}
                    className="flex items-center gap-1"
                  >
                    Preço
                    {sortConfig.key === "preco" && (
                      <ArrowUpDown
                        className={`h-3 w-3 inline ${
                          sortConfig.direction === "asc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                    {sortConfig.key !== "preco" && (
                      <ArrowUpDown className="h-3 w-3 inline opacity-30" />
                    )}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("quantidade")}
                    className="flex items-center gap-1"
                  >
                    Quantidade
                    {sortConfig.key === "quantidade" && (
                      <ArrowUpDown
                        className={`h-3 w-3 inline ${
                          sortConfig.direction === "asc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                    {sortConfig.key !== "quantidade" && (
                      <ArrowUpDown className="h-3 w-3 inline opacity-30" />
                    )}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("valor_total")}
                    className="flex items-center gap-1"
                  >
                    Valor Total
                    {sortConfig.key === "valor_total" && (
                      <ArrowUpDown
                        className={`h-3 w-3 inline ${
                          sortConfig.direction === "asc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                    {sortConfig.key !== "valor_total" && (
                      <ArrowUpDown className="h-3 w-3 inline opacity-30" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransacoes.map((transacao) => (
                <TableRow key={transacao.id}>
                  <TableCell className="font-medium">
                    {transacao.ticker}
                  </TableCell>
                  <TableCell>{formatDate(transacao.data)}</TableCell>
                  <TableCell>{transacao.tipo}</TableCell>
                  <TableCell>{formatCurrency(transacao.preco)}</TableCell>
                  <TableCell>{transacao.quantidade}</TableCell>
                  <TableCell>{formatCurrency(transacao.valor_total)}</TableCell>
                  <TableCell className="text-right">
                    {!["desdobramento", "agrupamento"].includes(
                      transacao.tipo?.toLowerCase()
                    ) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(transacao, tipo)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
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
      </div>
    );
  };

  function AgrupamentoDesdobramentoDialog({ tipo, onSuccess }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
      tipoAtivo: "acao",
      ticker: "",
      data: format(new Date(), "yyyy-MM-dd"),
      proporcao_antes: 1,
      proporcao_depois: 1,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isAgrupamento = tipo === "agrupamento";

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
        const params = {
          ticker: form.ticker,
          proporcao_antes: form.proporcao_antes,
          proporcao_depois: form.proporcao_depois,
          carteira_id: 1,
          [isAgrupamento ? "data_agrupamento" : "data_desdobramento"]:
            formatDateToDDMMYYYY(form.data),
        };
        if (isAgrupamento) {
          if (form.tipoAtivo === "acao") {
            await agrupamentoAcoes(params);
          } else {
            await agrupamentoFii(params);
          }
        } else {
          if (form.tipoAtivo === "acao") {
            await desdobramentoAcoes(params);
          } else {
            await desdobramentoFii(params);
          }
        }
        setOpen(false);
        onSuccess && onSuccess();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <Button
          variant={isAgrupamento ? "secondary" : "outline"}
          className={
            isAgrupamento
              ? "flex items-center gap-2 bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
              : "flex items-center gap-2 bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
          }
          onClick={() => setOpen(true)}
        >
          {isAgrupamento ? (
            <Layers className="w-4 h-4" />
          ) : (
            <Divide className="w-4 h-4" />
          )}
          {isAgrupamento ? "Agrupamento" : "Desdobramento"}
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>
                {isAgrupamento ? "Agrupamento" : "Desdobramento"} de{" "}
                {form.tipoAtivo === "acao" ? "Ação" : "FII"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Tipo de Ativo
                </label>
                <Select
                  value={form.tipoAtivo}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, tipoAtivo: v }))
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
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Ticker
                </label>
                <Input
                  name="ticker"
                  value={form.ticker}
                  onChange={handleChange}
                  required
                  className="bg-white border-gray-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Data
                </label>
                <Input
                  name="data"
                  type="date"
                  value={form.data}
                  onChange={handleChange}
                  required
                  className="bg-white border-gray-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Proporção Antes
                </label>
                <Input
                  name="proporcao_antes"
                  type="number"
                  min={1}
                  value={form.proporcao_antes}
                  onChange={handleChange}
                  required
                  className="bg-white border-gray-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Proporção Depois
                </label>
                <Input
                  name="proporcao_depois"
                  type="number"
                  min={1}
                  value={form.proporcao_depois}
                  onChange={handleChange}
                  required
                  className="bg-white border-gray-300"
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="border-gray-300"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transações</h1>
        <div className="flex gap-2">
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
                      <div className="relative w-full">
                        <Input
                          name="data"
                          value={formData.data}
                          onChange={handleInputChange}
                          placeholder="dd/MM/yyyy"
                          className="bg-white border-gray-300 pr-10 w-full"
                          autoComplete="off"
                        />
                        <CalendarIcon
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                          onClick={() => setOpen((v) => !v)}
                          size={18}
                          tabIndex={0}
                          role="button"
                          aria-label="Abrir calendário"
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parseDateString(formData.data)}
                        onSelect={(date) => {
                          if (date) {
                            const userTimezoneDate = new Date(
                              date.getFullYear(),
                              date.getMonth(),
                              date.getDate()
                            );
                            const formattedDate = format(
                              userTimezoneDate,
                              "dd/MM/yyyy",
                              {
                                locale: ptBR,
                              }
                            );
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
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {editingTransacao ? "Salvar" : "Adicionar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <div className="flex gap-2 items-center">
            <AgrupamentoDesdobramentoDialog
              tipo="agrupamento"
              onSuccess={loadTransacoes}
            />
            <AgrupamentoDesdobramentoDialog
              tipo="desdobramento"
              onSuccess={loadTransacoes}
            />
          </div>
        </div>
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
