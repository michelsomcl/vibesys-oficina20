
import { useState } from "react"
import { 
  Home, 
  Users, 
  UserCheck, 
  Truck, 
  Package, 
  Wrench, 
  FileText, 
  Settings, 
  DollarSign, 
  Heart,
  Calendar,
  PlusCircle,
  List
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  {
    title: "Cadastros",
    items: [
      { title: "Clientes", url: "/clientes", icon: Users },
      { title: "Funcionários", url: "/funcionarios", icon: UserCheck },
      { title: "Fornecedores", url: "/fornecedores", icon: Truck },
      { title: "Peças", url: "/pecas", icon: Package },
      { title: "Serviços", url: "/servicos", icon: Wrench },
    ]
  },
  { title: "Orçamentos", url: "/orcamentos", icon: FileText },
  { title: "Oficina", url: "/oficina", icon: Settings },
  { title: "Financeiro", url: "/financeiro", icon: DollarSign },
  { title: "Relacionamento", url: "/relacionamento", icon: Heart },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isCollapsed = state === "collapsed"
  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-secondary text-secondary-foreground font-medium" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"

  return (
    <Sidebar
      className={isCollapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5 text-secondary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">VibeSys</h1>
              <p className="text-xs text-sidebar-foreground/70">Oficina</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((item, index) => (
          <SidebarGroup key={index}>
            {item.items ? (
              <>
                <SidebarGroupLabel className="text-sidebar-foreground/70">
                  {!isCollapsed && item.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton asChild>
                          <NavLink to={subItem.url} className={getNavCls}>
                            <subItem.icon className="w-4 h-4" />
                            {!isCollapsed && <span>{subItem.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </>
            ) : (
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="w-4 h-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
