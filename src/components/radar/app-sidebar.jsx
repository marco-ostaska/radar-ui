import {
  ChevronRight,
  Radar,
  Wallet,
  Settings,
  List,
  BadgeDollarSign,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
import { Link } from "react-router-dom";
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
      </SidebarContent>
    </Sidebar>
  );
}
