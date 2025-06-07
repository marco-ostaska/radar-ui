import {
  ChevronRight,
  Radar,
  Wallet,
  Settings,
  List,
  BadgeDollarSign,
  History,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const groups = [
  {
    id: "radar",
    icon: Radar,
    title: "Radar",
    items: [
      { id: "fii", title: "FII", href: "/radar/fii" },
      { id: "acoes", title: "Ações", href: "/radar/acoes" },
    ],
  },
  {
    id: "compra",
    icon: BadgeDollarSign,
    title: "Compra",
    items: [
      { id: "acoes-dia", title: "Ações", href: "/radar/acoes/dia" },
      { id: "fiis-dia", title: "FIIs", href: "/radar/fii/dia" },
    ],
  },
  {
    id: "carteira",
    icon: Wallet,
    title: "Carteira",
    items: [
      { id: "minha-carteira", title: "Minha Carteira", href: "/carteira" },
      { id: "transacoes", title: "Transações", href: "/transacoes" },
    ],
  },
  {
    id: "Lista",
    icon: List,
    title: "Lista",
    items: [
      { id: "fiis", title: "fii", href: "lista/fiis" },
      { id: "acoes", title: "ações", href: "lista/acoes" },
    ],
  },
  {
    id: "admin",
    icon: Settings,
    title: "Admin",
    items: [
      { id: "add", title: "Adicionar Ativos", href: "/admin/add" },
      { id: "remove", title: "Remover Ativos", href: "/admin/remove" },
    ],
  },
];

export function AppSidebar() {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("");
  const navigate = useNavigate();

  const handleBuscar = () => {
    if (tipo === "fii") {
      navigate(`/busca/fii?busca=${encodeURIComponent(busca)}`);
    } else if (tipo === "acoes") {
      navigate(`/busca/acoes?busca=${encodeURIComponent(busca)}`);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="bg-slate-300 px-4 py-2 font-bold text-lg">
        <Link to="/">Radar Ativos</Link>
      </SidebarHeader>
      <SidebarContent className="h-screen bg-slate-200">
        {groups.map(({ id, icon: Icon, title, items }) => (
          <SidebarGroup key={id}>
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible defaultOpen={false} className="group" key={id}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <Icon />
                        {title}
                        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {items.map(({ id: itemId, title: itemTitle, href }) => (
                          <SidebarMenuSubItem key={itemId}>
                            <SidebarMenuButton asChild>
                              <Link to={href}>{itemTitle}</Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  to="/carteira"
                  icon={<Wallet className="h-4 w-4" />}
                  label="Carteira"
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-slate-300 px-4 py-4 text-sm">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Buscar Ativos"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tipo) {
                  handleBuscar();
                }
              }}
              className="flex-1 rounded-md border border-gray-400 px-2 py-1"
            />
            <Select onValueChange={(value) => setTipo(value)}>
              <SelectTrigger className="w-[150px] rounded-md border border-gray-400">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fii">FII</SelectItem>
                <SelectItem value="acoes">Ações</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            className="self-end w-full sm:w-auto"
            disabled={!tipo}
            onClick={handleBuscar}
          >
            Buscar
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
