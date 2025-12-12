import { FileText, BarChart3, Star, Users, Calendar, Settings, BookOpen, Clock, MessageSquare } from "lucide-react";
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
import lawmeterLogo from "@/assets/logo-legal-tech.png";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettingsOpen: () => void;
}

const menuItems = [
  { id: "starred", title: "Starred", icon: Star },
  { id: "legislation", title: "Legislation", icon: FileText },
  { id: "media", title: "Legislative Session Monitor", icon: FileText },
  { id: "social", title: "Social Listening", icon: Users },
  { id: "calendar", title: "Calendar", icon: Calendar },
  { id: "analytics", title: "Analytics", icon: BarChart3 },
  { id: "contact", title: "Contact", icon: MessageSquare },
];

export function AppSidebar({ activeTab, onTabChange, onSettingsOpen }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-white/10 bg-gradient-to-b from-[hsl(220,40%,10%)] to-[hsl(220,45%,8%)]">
      <SidebarHeader className="p-3 pb-2">
        {!isCollapsed && (
          <div className="space-y-2">
            <img 
              src={lawmeterLogo} 
              alt="LawMeter" 
              className="w-full h-auto object-contain max-h-32" 
            />
            <h1 className="text-sm font-bold text-foreground leading-tight">Regulatory and Political Intelligence Hub</h1>
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
          onClick={() => window.open("/documentation", "_self")}
          tooltip="Documentation"
          className="text-sidebar-foreground hover:bg-white/10"
        >
          <BookOpen className="h-4 w-4" />
          {!isCollapsed && <span>Documentation</span>}
        </SidebarMenuButton>
        
        <SidebarMenuButton
          onClick={onSettingsOpen}
          tooltip="Alert Settings"
          className="text-sidebar-foreground hover:bg-white/10"
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && <span>Alert Settings</span>}
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