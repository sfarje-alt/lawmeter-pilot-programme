import { Inbox, Building2, FileText, BarChart3, Calendar, Settings, Video, LogOut, Clock } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import lawmeterLogo from "@/assets/logo-legal-tech.png";
import lawmeterIcon from "@/assets/lawmeter-icon.png";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettingsOpen: () => void;
}

const menuItems = [
  { id: "sessions", title: "Sessions", icon: Video },
  { id: "inbox", title: "Inbox", icon: Inbox },
  { id: "clients", title: "Clients", icon: Building2 },
  { id: "reports", title: "Reports", icon: FileText },
  { id: "analytics", title: "Analytics", icon: BarChart3 },
  { id: "calendar", title: "Calendar", icon: Calendar },
];

export function AppSidebar({ activeTab, onTabChange, onSettingsOpen }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/auth");
  };

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
            <h1 className="text-sm font-bold text-foreground leading-tight">Regulatory Intelligence Hub</h1>
          </div>
        )}
      </SidebarHeader>

      <SidebarSeparator className="bg-white/10" />

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
          onClick={() => navigate('/settings')}
          tooltip="Settings"
          className="text-sidebar-foreground hover:bg-white/10"
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && <span>Settings</span>}
        </SidebarMenuButton>

        <SidebarMenuButton
          onClick={handleLogout}
          tooltip="Sign Out"
          className="text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Sign Out</span>}
        </SidebarMenuButton>

        {!isCollapsed && (
          <div className="px-2 py-2">
            <Badge variant="outline" className="bg-success/20 border-success/30 text-success-foreground text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Updated: Now
            </Badge>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
