import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { UserCog } from "lucide-react";

export const RoleSwitcher = () => {
  const { user, switchRole } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center space-x-3 p-4 bg-card border rounded-lg">
      <UserCog className="h-5 w-5 text-muted-foreground" />
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Role:</span>
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
          {user.role === "admin" ? "Administrator" : "Guru"}
        </Badge>
      </div>
      <Select value={user.role} onValueChange={(value: "admin" | "teacher") => switchRole(value)}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="teacher">Guru</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};