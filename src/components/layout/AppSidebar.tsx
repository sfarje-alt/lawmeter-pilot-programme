import { Inbox, Building2, FileText, BarChart3, Calendar, Settings, Video, LogOut, Clock, Eye, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useClientUser } from "@/hooks/useClientUser";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import lawmeterLogo from "@/assets/logo-legal-tech.png";
import lawmeterIcon from "@/assets/lawmeter-icon.png";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettingsOpen: () => void;
}

// Operational menu items (single user type — internal compliance team)
const adminMenuItems = [
  { id: "inbox", title: "Alertas", icon: Inbox },
  { id: "sessions", title: "Sesiones", icon: Video },
  { id: "clients", title: "Perfiles", icon: Building2 },
  { id: "reports", title: "Reportes", icon: FileText },
  { id: "analytics", title: "Analíticas", icon: BarChart3 },
  { id: "calendar", title: "Calendario", icon: Calendar },
];

// Client (view-only) menu items
const clientMenuItems = [
  { id: "client-inbox", title: "Alertas", icon: Inbox },
  { id: "client-profile", title: "Mi Perfil", icon: User },
  { id: "client-reports", title: "Reportes", icon: FileText },
  { id: "client-analytics", title: "Analíticas", icon: BarChart3 },
  { id: "client-calendar", title: "Calendario", icon: Calendar },
];

export function AppSidebar({ activeTab, onTabChange, onSettingsOpen }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { signOut } = useAuth();
  const { isClientUser, isAdmin, clientName } = useClientUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
    navigate("/auth");
  };

  // Choose menu items based on user type
  const menuItems = isClientUser ? clientMenuItems : adminMenuItems;

  return (
    <Sidebar collapsible="icon" className="border-r border-white/10 bg-gradient-to-b from-[hsl(220,40%,10%)] to-[hsl(220,45%,8%)]">
      <SidebarHeader className="p-3 pb-2">
        {isCollapsed ? (
          <div className="flex justify-center">
            <img 
              src={lawmeterIcon} 
              alt="LawMeter" 
              className="w-12 h-12 object-contain" 
            />
          </div>
        ) : (
          <div className="space-y-2">
            <img 
              src={lawmeterLogo} 
              alt="LawMeter" 
              className="w-full h-auto object-contain max-h-32" 
            />
            <h1 className="text-sm font-bold text-foreground leading-tight">
              Centro de Inteligencia Regulatoria
            </h1>
            {isClientUser && clientName && (
              <Badge variant="outline" className="w-full justify-center bg-primary/10 border-primary/30 text-primary text-xs">
                {clientName}
              </Badge>
            )}
          </div>
        )}
      </SidebarHeader>

      <SidebarSeparator className="bg-white/10" />

      {/* View-only badge for client users */}
      {isClientUser && !isCollapsed && (
        <div className="px-3 py-2">
          <Badge variant="outline" className="w-full justify-center bg-green-500/10 border-green-500/30 text-green-500 text-xs gap-1">
            <Eye className="h-3 w-3" />
            Solo Lectura
          </Badge>
        </div>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    tooltip={item.title}
                    className="text-sidebar-foreground hover:bg-white/10 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="bg-white/10" />

      <div className="p-2 space-y-1">
        <SidebarMenuButton
          onClick={() => isClientUser ? onTabChange('client-settings') : navigate('/settings')}
          tooltip="Configuración"
          className="text-sidebar-foreground hover:bg-white/10"
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && <span>Configuración</span>}
        </SidebarMenuButton>

        <SidebarMenuButton
          onClick={handleLogout}
          tooltip="Cerrar Sesión"
          className="text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </SidebarMenuButton>

        {!isCollapsed && (
          <div className="px-2 py-2">
            <Badge variant="outline" className="bg-success/20 border-success/30 text-success-foreground text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Actualizado: Ahora
            </Badge>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
