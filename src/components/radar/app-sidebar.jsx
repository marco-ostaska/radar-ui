import { ChevronRight, Radar, Wallet, Settings } from "lucide-react";
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
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

const groups = [
  {
    id: "radar",
    icon: Radar,
    title: "Radar",
    items: [
      { id: "fii", title: "FII", href: "/radar/fii" },
      { id: "acoes", title: "Ações", href: "#" },
    ],
  },
  {
    id: "carteira",
    icon: Wallet,
    title: "Carteira",
    items: [{ id: "tbd", title: "TBD", href: "#" }],
  },
  {
    id: "admin",
    icon: Settings,
    title: "Admin",
    items: [
      { id: "add", title: "Adicionar Ativos", href: "#" },
      { id: "remove", title: "Remover Ativos", href: "#" },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="bg-slate-300 px-4 py-2 font-bold text-lg">Radar Ativos </SidebarHeader>
      <SidebarContent className="h-screen bg-slate-200">
        {groups.map(({ id, icon: Icon, title, items }) => (
          <SidebarGroup key={id}>
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible defaultOpen={false}  className="group" key={id}>
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
                              <a href={href}>{itemTitle}</a>
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
