import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Users,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  ClipboardList,
  BarChart3,
  Settings,
  User,
  History,
  CreditCard,
} from "lucide-react";

interface SidebarProps {
  userRole: "admin" | "teacher";
  activeItem: string;
  onItemClick: (item: string) => void;
}

export function Sidebar({ userRole, activeItem, onItemClick }: SidebarProps) {
  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "teachers", label: "Data Guru", icon: Users, badge: "74" },
    { id: "schedules", label: "Jadwal", icon: Calendar, badge: "156" },
    { id: "positions", label: "Jabatan", icon: Briefcase, badge: "8" },
    { id: "locations", label: "Lokasi", icon: MapPin, badge: "5" },
    { id: "years", label: "Tahun Ajaran", icon: GraduationCap },
    { id: "attendance", label: "Data Absensi", icon: ClipboardList },
    { id: "reports", label: "Laporan", icon: BarChart3 },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ];

  const teacherMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "profile", label: "Profil", icon: User },
    { id: "history", label: "Riwayat Absensi", icon: History },
    { id: "idcard", label: "ID Card", icon: CreditCard },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : teacherMenuItems;

  return (
    <aside className="w-64 border-r bg-card/50 backdrop-blur">
      <div className="flex h-full flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">SA</span>
            </div>
            <span className="text-lg font-semibold">Menu</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            const badge = 'badge' in item ? item.badge as string : undefined;

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-primary text-primary-foreground"
                )}
                onClick={() => onItemClick(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {badge && (
                  <Badge variant={isActive ? "secondary" : "outline"} className="ml-auto">
                    {badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>

        <div className="border-t p-3 text-center">
          <p className="text-xs text-muted-foreground">
            Sistem Absensi v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}