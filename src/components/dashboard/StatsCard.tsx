import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  variant?: "default" | "success" | "warning" | "destructive" | "info";
  moreInfoTo?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  variant = "default",
}: StatsCardProps) {
  const variantClasses = {
    default: "border-l-4 border-l-primary",
    success: "border-l-4 border-l-green-500",
    warning: "border-l-4 border-l-yellow-500",
    destructive: "border-l-4 border-l-red-500",
    info: "border-l-4 border-l-blue-500",
  };

  return (
    <Card className={`${variantClasses[variant]} transition-all hover:shadow-md`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}