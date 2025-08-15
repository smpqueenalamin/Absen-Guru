import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MapPin, 
  Briefcase, 
  ClipboardCheck,
  FileText,
  Settings,
  GraduationCap,
  Camera,
  IdCard
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  userRole: "admin" | "teacher";
  activeItem: string;
  onItemClick: (item: string) => void;
}

const adminMenuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "teachers", label: "Data Guru", icon: Users },
  { id: "schedules", label: "Jadwal", icon: Calendar },
  { id: "positions", label: "Jabatan", icon: Briefcase },
  { id: "locations", label: "Lokasi", icon: MapPin },
  { id: "years", label: "Tahun Ajaran", icon: GraduationCap },
  { id: "attendance", label: "Data Absensi", icon: ClipboardCheck },
  { id: "reports", label: "Laporan", icon: FileText },
  { id: "settings", label: "Pengaturan", icon: Settings },
];

const teacherMenuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "attendance", label: "Absensi", icon: Camera },
  { id: "history", label: "Riwayat Absensi", icon: ClipboardCheck },
  { id: "profile", label: "Profil", icon: Users },
  { id: "idcard", label: "ID Card", icon: IdCard },
];

export const Sidebar = ({ userRole, activeItem, onItemClick }: SidebarProps) => {
  const menuItems = userRole === "admin" ? adminMenuItems : teacherMenuItems;
  
  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold">SA</span>
          </div>
          <div>
            <h2 className="font-semibold">Sistem Absensi</h2>
            <p className="text-xs text-sidebar-foreground/70 capitalize">{userRole}</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeItem === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-left",
                  activeItem === item.id 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => onItemClick(item.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};